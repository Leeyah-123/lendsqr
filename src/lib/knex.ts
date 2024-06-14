import knex from 'knex';

const knexClient = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export default knexClient;
