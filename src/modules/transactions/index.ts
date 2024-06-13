import { Router } from 'express';
import TransactionsController from './transactions.controller';

const router = Router();
const Controller = new TransactionsController();

export default router;
