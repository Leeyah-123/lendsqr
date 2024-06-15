import { StatusCodes } from 'http-status-codes';
import { Wallet } from 'knex/types/tables';
import WalletDao from '../../dao/wallet';
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
  }: FundUserWalletDto): Promise<ServiceResponse> {
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

    const updatedWallet = await this.walletDao.update(wallet.id, {
      balance: wallet.balance + amount,
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
  }: TransferFundsDto): Promise<ServiceResponse> {
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

    const updatedWallet = await this.walletDao.update(wallet.id, {
      balance: wallet.balance - amount,
    });
    await this.walletDao.update(recipient.id, {
      balance: recipient.balance + amount,
    });

    return {
      message: 'Funds transferred successfully',
      data: updatedWallet,
    };
  }

  async withdrawFunds({
    userId,
    amount,
  }: WithdrawFundsDto): Promise<ServiceResponse> {
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

    const updatedWallet = await this.walletDao.update(wallet.id, {
      balance: wallet.balance - amount,
    });
    await this.financesService.transfer(wallet.acctNumber, amount);

    return {
      message: 'Funds withdrawn successfully',
      data: updatedWallet,
    };
  }
}
