import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import TransactionsController from './transactions.controller';

const router = Router();
const Controller = new TransactionsController();

router.get('/', authMiddleware, Controller.getTransactionHistory);

export default router;
