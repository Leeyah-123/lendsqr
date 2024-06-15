import { Wallet } from 'knex/types/tables';
import db from '../database/database';
import { convertCamelToSnake } from '../utils/misc';

export default class WalletDao {
  public async findById(id: string) {
    return db('wallets').select('*').where('id', id).first();
  }

  public async findByUserId(userId: string) {
    return db('wallets').select('*').where('user_id', userId).first();
  }

  public async findByAcctNumber(acctNumber: number) {
    return db('wallets').select('*').where('acct_number', acctNumber).first();
  }

  public async create(dto: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>) {
    return db('wallets').insert(convertCamelToSnake(dto)).returning('*');
  }

  public async update(
    id: string,
    dto: Exclude<Partial<Wallet>, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return db('wallets')
      .where('id', id)
      .update(convertCamelToSnake(dto))
      .returning('*');
  }

  public async delete(id: string) {
    await db('wallets').where('id', id).del();
  }
}
