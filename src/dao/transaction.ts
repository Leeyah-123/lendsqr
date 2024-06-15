import { Transaction } from 'knex/types/tables';
import db from '../database/database';
import { convertCamelToSnake } from '../utils/misc';

export default class TransactionDao {
  public async findById(id: string) {
    return db('transactions').select('*').where('id', id).first();
  }

  public async findByUserId(userId: string) {
    return db('transactions').select('*').where('user_id', userId);
  }

  public async create(
    dto: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return db('transactions').insert(convertCamelToSnake(dto)).returning('*');
  }

  public async update(
    id: string,
    dto: Exclude<Partial<Transaction>, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return db('transactions')
      .where('id', id)
      .update(convertCamelToSnake(dto))
      .returning('*');
  }

  public async delete(id: string) {
    await db('transactions').where('id', id).del();
  }
}
