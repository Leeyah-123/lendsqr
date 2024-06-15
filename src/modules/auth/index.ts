import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import AuthController from './auth.controllers';

const router = Router();
const Controller = new AuthController();

router.get('/profile', authMiddleware, Controller.profile);
router.post('/register', Controller.register);
router.post('/login', Controller.login);
router.post('/refresh', Controller.refreshToken);

export default router;
