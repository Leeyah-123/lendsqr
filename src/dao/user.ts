import { User, Wallet } from 'knex';
import db from '../database/database';
import { generateRandomNum } from '../utils/misc';

export default class UserDao {
  public async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    return db('users')
      .select('id', 'email', 'name', 'username', 'createdAt', 'updatedAt')
      .offset(offset)
      .limit(limit);
  }

  public async findByEmail(email: string) {
    return db('users').select('*').where('email', email).first();
  }

  public async findByUsername(username: string) {
    return db('users').select('*').where('username', username).first();
  }

  public async findById(id: string) {
    return db('users').select('*').where('id', id).first();
  }

  public async create(dto: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const [insertedData] = await db('users')
      .insert(dto)
      .then(async () => {
        return await db('users').where(dto).select('*');
      });

    return insertedData;
  }

  public async createWithWallet(
    dto: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return db.transaction(async (trx) => {
      await trx('users').insert(dto);

      const user = (await trx('users').select('*').where(dto).first()) as User;

      await trx('wallets').insert({
        userId: user.id,
        acctNumber: generateRandomNum(11),
      });

      const wallet = (await trx('wallets')
        .select('*')
        .where('userId', user.id)
        .first()) as Wallet;

      return { user, wallet };
    });
  }

  public async update(
    id: string,
    dto: Exclude<Partial<User>, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const [updatedData] = await db('users')
      .where('id', id)
      .update(dto)
      .then(async () => {
        return await db('users').where('id', id).select('*');
      });

    return updatedData;
  }

  public async delete(id: string) {
    await db('users').where('id', id).del();
  }
}
