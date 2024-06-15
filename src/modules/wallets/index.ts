import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import WalletsController from './wallets.controller';

const router = Router();
const Controller = new WalletsController();

router.get('/', authMiddleware, Controller.getWallet);
router.post('/fund', authMiddleware, Controller.fundWallet);
router.post('/transfer', authMiddleware, Controller.transferFunds);
router.post('/withdraw', authMiddleware, Controller.withdrawFunds);

export default router;
