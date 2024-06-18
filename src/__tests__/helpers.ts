import { User, Wallet } from 'knex';

export interface TestUser {
  user: User;
  wallet: Wallet;
  accessToken: string;
  refreshToken: string;
}

export interface WalletBalance {
  userId: string;
  balance: number;
}

export interface ErrorResponse {
  error: string;
}
