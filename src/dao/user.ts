import { User } from 'knex/types/tables';
import db from '../database/database';
import { convertCamelToSnake } from '../utils/misc';

export default class UserDao {
  public async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    return db
      .from('users')
      .select('id', 'email', 'name', 'username', 'createdAt', 'updatedAt')
      .offset(offset)
      .limit(limit);
  }

  public async findByEmail(email: string) {
    return db('users')
      .select('id', 'email', 'name', 'username', 'createdAt', 'updatedAt')
      .where('email', email)
      .first();
  }

  public async findByUsername(username: string) {
    return db('users')
      .select('id', 'email', 'name', 'username', 'createdAt', 'updatedAt')
      .where('username', username)
      .first();
  }

  public async findById(id: string) {
    return db('users').select('*').where('id', id).first();
  }

  public async create(dto: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return db('users').returning([
      'id',
      'email',
      'name',
      'username',
      'createdAt',
      'updatedAt',
    ]);
  }

  public async update(
    id: string,
    dto: Exclude<Partial<User>, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return db('users')
      .where('id', id)
      .update(convertCamelToSnake(dto))
      .returning(['id', 'email', 'name', 'username', 'createdAt', 'updatedAt']);
  }

  public async delete(id: string) {
    await db('users').where('id', id).del();
  }
}
