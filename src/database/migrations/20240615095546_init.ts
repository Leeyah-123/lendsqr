import { Knex } from 'knex';
import { TransactionType } from '../../utils/enums';

export async function up(knex: Knex): Promise<void> {
  knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.string('name').notNullable();
        table.string('username').unique();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.timestamps(true, true);
      });
    }
  });
  knex.schema.hasTable('wallets').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('wallets', (table) => {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table
          .string('user_id')
          .unique()
          .notNullable()
          .references('id')
          .inTable('users');
        table.bigInteger('acct_number').unique().notNullable();
        table.double('balance').notNullable().defaultTo(0);
        table.timestamps(true, true);
      });
    }
  });
  knex.schema.hasTable('transactions').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('transactions', (table) => {
        table.uuid('id').defaultTo(knex.fn.uuid()).primary();
        table.string('user_id').notNullable().references('id').inTable('users');
        table.string('recipient_id').references('id').inTable('users');
        table.enu('type', Object.values(TransactionType)).notNullable();
        table.double('amount').notNullable().defaultTo(0);
        table.timestamps(true, true);
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('wallets')
    .dropTableIfExists('transactions');
}
