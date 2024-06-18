import * as dotenv from 'dotenv';
import { knexSnakeCaseMappers } from 'objection';

dotenv.config({ path: __dirname + '/../../.env' });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
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
    client: 'mysql',
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
    client: 'mysql',
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
