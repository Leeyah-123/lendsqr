import { Router } from 'express';
import AuthController from './auth.controllers';

const router = Router();
const Controller = new AuthController();

router.post('/register', Controller.register);
router.post('/login', Controller.login);

export default router;
