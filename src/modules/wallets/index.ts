import { Router } from 'express';
import WalletsController from './wallets.controller';

const router = Router();
const Controller = new WalletsController();

export default router;
