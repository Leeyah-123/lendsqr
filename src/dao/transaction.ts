import { Transaction } from 'knex';
import db from '../database/database';

export default class TransactionDao {
  public async findById(id: string) {
    return db('transactions').select('*').where('id', id).first();
  }

  public async findByUserId(userId: string) {
    return db('transactions').select('*').where('userId', userId);
  }

  public async create(
    dto: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const [insertedData] = await db('transactions')
      .insert(dto)
      .then(async () => {
        return await db('transactions').where(dto).select('*');
      });

    return insertedData;
  }

  public async update(
    id: string,
    dto: Exclude<Partial<Transaction>, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const [updatedData] = await db('transactions')
      .where('id', id)
      .update(dto)
      .then(async () => {
        return await db('transactions').where('id', id).select('*');
      });

    return updatedData;
  }

  public async delete(id: string) {
    await db('transactions').where('id', id).del();
  }
}
