import { Transaction } from 'knex/types/tables';
import TransactionDao from '../../dao/transaction';
import { ServiceResponse } from '../core/types';

export default class TransactionsService {
  private readonly transactionDao: TransactionDao;

  constructor() {
    this.transactionDao = new TransactionDao();
  }

  async getTransactionHistory(
    userId: string
  ): Promise<ServiceResponse<Transaction[]>> {
    return {
      message: 'Transaction history fetched successfully',
      data: await this.transactionDao.findByUserId(userId),
    };
  }
}
