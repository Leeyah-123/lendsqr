import { Knex } from 'knex';
import { TransactionType } from 'knex/types/tables';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').defaultTo(knex.fn.uuid()).primary();
      table.string('name').notNullable();
      table.string('username').unique();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true);
    })
    .createTable('wallets', (table) => {
      table.uuid('id').defaultTo(knex.fn.uuid()).primary();
      table
        .string('user_id')
        .unique()
        .notNullable()
        .references('id')
        .inTable('users');
      table.integer('acct_number').unique().notNullable();
      table.double('balance').notNullable().defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('transactions', (table) => {
      table.uuid('id').defaultTo(knex.fn.uuid()).primary();
      table
        .string('user_id')
        .unique()
        .notNullable()
        .references('id')
        .inTable('users');
      table
        .enu('type', [TransactionType.DEPOSIT, TransactionType.WITHDRAWAL])
        .notNullable();
      table.double('amount').notNullable().defaultTo(0);
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('users')
    .dropTable('wallets')
    .dropTable('transactions');
}
