import { compare, hash } from 'bcrypt';

export const hashPassword = (password: string) => hash(password, 10);
export const comparePassword = (password: string, hash: string) =>
  compare(password, hash);
