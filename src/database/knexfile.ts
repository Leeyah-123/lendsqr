import { convertCamelToSnake, convertSnakeToCamel } from '../utils/misc';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DEV_DB_HOST,
      port: Number(process.env.DEV_DB_PORT),
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_NAME,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    // camelCase -> snake_case converter
    wrapIdentifier: (value: any, origImpl: any, _queryContext: any) =>
      origImpl(convertCamelToSnake(value)),
    // snake_case -> camelCase converter
    postProcessResponse: (
      result: any[] | { [key: string]: any },
      _queryContext: any
    ) => {
      return convertSnakeToCamel(result);
    },
  },

  staging: {
    client: 'mysql',
    connection: {
      host: process.env.STAGING_DB_HOST,
      port: Number(process.env.STAGING_DB_PORT),
      user: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASSWORD,
      database: process.env.STAGING_DB_NAME,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    // camelCase -> snake_case converter
    wrapIdentifier: (value: any, origImpl: any, _queryContext: any) =>
      origImpl(convertCamelToSnake(value)),
    // snake_case -> camelCase converter
    postProcessResponse: (
      result: any[] | { [key: string]: any },
      _queryContext: any
    ) => {
      return convertSnakeToCamel(result);
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.PROD_DB_HOST,
      port: Number(process.env.PROD_DB_PORT),
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME,
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    // camelCase -> snake_case converter
    wrapIdentifier: (value: any, origImpl: any, _queryContext: any) =>
      origImpl(convertCamelToSnake(value)),
    // snake_case -> camelCase converter
    postProcessResponse: (
      result: any[] | { [key: string]: any },
      _queryContext: any
    ) => {
      return convertSnakeToCamel(result);
    },
  },
};
