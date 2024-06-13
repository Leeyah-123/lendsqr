import { StatusCodes } from 'http-status-codes';

export type ServiceResponse<T = any> = {
  status?: StatusCodes;
  message?: string;
  data?: T;
};
