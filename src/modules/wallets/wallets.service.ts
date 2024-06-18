import { StatusCodes } from 'http-status-codes';
import { Wallet } from 'knex';
import WalletDao from '../../dao/wallet';
import db from '../../database/database';
import { TransactionType } from '../../utils/enums';
import { ServiceResponse } from '../core/types';
import FinancesService from '../finances/finances.service';
import {
  FundUserWalletDto,
  TransferFundsDto,
  WithdrawFundsDto,
} from './wallets.validation';

export default class WalletsService {
  private readonly walletDao: WalletDao;
  private readonly financesService: FinancesService;

  constructor() {
    this.walletDao = new WalletDao();
    this.financesService = new FinancesService();
  }

  async getUserWallet(userId: string): Promise<ServiceResponse<Wallet>> {
    return {
      message: 'Wallet information fetched successfully',
      data: await this.walletDao.findByUserId(userId),
    };
  }

  async fundUserWallet({
    userId,
    transactionId,
    amount,
  }: FundUserWalletDto): Promise<ServiceResponse<Wallet>> {
    const wallet = await this.walletDao.findByUserId(userId);
    if (!wallet) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'Wallet not found',
      };
    }

    if (!this.financesService.verifyTransaction(transactionId, amount)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Invalid transaction',
      };
    }

    const updatedWallet = await db.transaction(async (trx) => {
      await trx('wallets')
        .where('id', wallet.id)
        .update({
          balance: wallet.balance + amount,
        });

      const updatedWallet = await trx('wallets')
        .where('id', wallet.id)
        .select('*')
        .first();
      await trx('transactions').insert({
        amount,
        userId,
        type: TransactionType.DEPOSIT,
      });

      return updatedWallet;
    });

    return {
      message: 'Wallet funded successfully',
      data: updatedWallet,
    };
  }

  async transferFunds({
    userId,
    amount,
    acctNumber,
  }: TransferFundsDto): Promise<ServiceResponse<Wallet>> {
    const wallet = await this.walletDao.findByUserId(userId);
    if (!wallet) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'Wallet not found',
      };
    }

    const recipient = await this.walletDao.findByAcctNumber(acctNumber);
    if (!recipient) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'Recipient not found',
      };
    }

    if (wallet.acctNumber === recipient.acctNumber) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'You cannot transfer funds to yourself',
      };
    }

    if (wallet.balance < amount) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Insufficient funds',
      };
    }

    const updatedWallet = await db.transaction(async (trx) => {
      await trx('wallets')
        .where('id', wallet.id)
        .update({
          balance: wallet.balance - amount,
        });

      const updatedWallet = (await trx('wallets')
        .select('*')
        .where('id', wallet.id)
        .first()) as Wallet;
      await trx('wallets')
        .where('id', recipient.id)
        .update({
          balance: recipient.balance + amount,
        });
      await trx('transactions').insert({
        amount,
        userId,
        recipientId: recipient.id,
        type: TransactionType.TRANSFER,
      });

      return updatedWallet;
    });

    return {
      message: 'Funds transferred successfully',
      data: updatedWallet,
    };
  }

  async withdrawFunds({
    userId,
    amount,
    bankDetails,
  }: WithdrawFundsDto): Promise<ServiceResponse<Wallet>> {
    const wallet = await this.walletDao.findByUserId(userId);
    if (!wallet) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: 'Wallet not found',
      };
    }

    if (wallet.balance < amount) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: 'Insufficient funds',
      };
    }

    // TODO: Validate provided bank details

    const updatedWallet = await db.transaction(async (trx) => {
      await trx('wallets')
        .where('id', wallet.id)
        .update({
          balance: wallet.balance - amount,
        });

      const updatedWallet = (await trx('wallets')
        .select('*')
        .where('id', wallet.id)
        .first()) as Wallet;
      await trx('transactions').insert({
        amount,
        userId,
        type: TransactionType.WITHDRAWAL,
      });
      await this.financesService.transfer(bankDetails, amount);

      return updatedWallet;
    });

    return {
      message: 'Funds withdrawn successfully',
      data: updatedWallet,
    };
  }
}
