import { Knex } from 'knex';

declare module 'knex/types/tables' {
  enum TransactionType {
    WITHDRAWAL = 'withdrawal',
    DEPOSIT = 'deposit',
  }

  type User = {
    id: string;
    name: string;
    username?: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };

  type Wallet = {
    id: string;
    userId: string;
    balance: number;
    acctNumber: number;
    createdAt: Date;
    updatedAt: Date;
  };

  type Transaction = {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  };

  interface Tables {
    users: User;
    users_composite: Knex.CompositeTableType<
      Omit<User, 'password'>,
      Pick<User, 'name' | 'email' | 'password'>,
      Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
    >;
    transactions: Transaction;
    transactions_composite: Knex.CompositeTableType<
      Transaction,
      Pick<Transaction, 'userId' | 'type' | 'amount'>,
      Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>
    >;
    wallets: Wallet;
    wallets_composite: Knex.CompositeTableType<
      Wallet,
      Pick<Wallet, 'userId' | 'acctNumber'>,
      Partial<Omit<Wallet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
    >;
  }
}
