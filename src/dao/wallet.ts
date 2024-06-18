import { Wallet } from 'knex';
import db from '../database/database';

export default class WalletDao {
  public async findById(id: string) {
    return db('wallets').select('*').where('id', id).first();
  }

  public async findByUserId(userId: string) {
    return db('wallets').select('*').where('userId', userId).first();
  }

  public async findByAcctNumber(acctNumber: number) {
    return db('wallets').select('*').where('acctNumber', acctNumber).first();
  }

  public async create(dto: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>) {
    const [insertedData] = await db('wallets')
      .insert(dto)
      .then(async () => {
        return await db('wallets').where(dto).select('*');
      });

    return insertedData;
  }

  public async update(
    id: string,
    dto: Exclude<Partial<Wallet>, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const [updatedData] = await db('wallets')
      .where('id', id)
      .update(dto)
      .then(async () => {
        return await db('wallets').where('id', id).select('*');
      });

    return updatedData;
  }

  public async delete(id: string) {
    await db('wallets').where('id', id).del();
  }
}
