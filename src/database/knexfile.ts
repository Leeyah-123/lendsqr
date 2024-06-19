import * as dotenv from 'dotenv';
import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

dotenv.config({ path: __dirname + '/../../.env' });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: process.env.DEV_DB_CONNECTION_STRING,
    ...knexSnakeCaseMappers(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'mysql2',
    connection: process.env.STAGING_DB_CONNECTION_STRING,
    ...knexSnakeCaseMappers,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: process.env.PROD_DB_CONNECTION_STRING,
    ...knexSnakeCaseMappers,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

export default config;
