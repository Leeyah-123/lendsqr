import pino from 'pino';
import jwt from 'jsonwebtoken';

declare global {
  interface Error {
    data?: any;
    timeout?: number;
    statusCode: number;
  }

  namespace Express {
    interface Request {
      user: { id: string };
      logger: pino.Logger;
      logError: (message: string, error?: unknown) => void;
    }
  }

  interface UserIDJwtPayload extends jwt.UserIDJwtPayload {}
}
