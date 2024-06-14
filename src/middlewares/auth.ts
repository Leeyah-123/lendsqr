import type { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res
      .status(401)
      .json({ success: false, message: 'No authentication token provided' });

  const token = authHeader.split(' ')[1];

  verify(token, process.env.AUTH_TOKEN_SECRET!, (err, decoded) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: 'Malformed/Expired authentication token provided',
      });

    req.user.id = (decoded as UserIDJwtPayload).userId;
    next();
  });
};
