import knex, { Knex } from 'knex';
import knexfile from './knexfile';

const ENVIRONS = ['development', 'staging', 'production'] as const;
type Environment = (typeof ENVIRONS)[number];

let env: Environment = process.env.NODE_ENV as Environment;
if (!env || !ENVIRONS.includes(env)) env = 'development';

const knexConfig: Knex.Config = knexfile[env];

const db: Knex = knex(knexConfig);

export default db;
