import type { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import UserDao from '../dao/user';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No authentication token provided' });

  const token = authHeader.split(' ')[1];

  verify(token, process.env.ACCESS_TOKEN_SECRET!, async (err, decoded) => {
    if (err)
      return res.status(403).json({
        error: 'Invalid authentication token provided',
      });

    // Verify user id
    const userDao = new UserDao();
    try {
      const user = await userDao.findById((decoded as UserIDJwtPayload).userId);
      if (!user)
        return res.status(403).json({
          error: 'Invalid authentication token provided',
        });

      req.user = { id: (decoded as UserIDJwtPayload).userId };
    } catch (err) {
      console.log('Error', err);
      return res.status(500).json({
        error:
          'Unable to authenticate user at this time. Please try again later.',
      });
    }

    next();
  });
};
