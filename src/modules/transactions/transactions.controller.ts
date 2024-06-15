import { NextFunction, Request, Response } from 'express';
import BaseController from '../core/base.controller';
import TransactionsService from './transactions.service';

export default class TransactionsController extends BaseController {
  private transactionsService: TransactionsService;

  constructor() {
    super();

    this.transactionsService = new TransactionsService();

    this.getTransactionHistory = this.getTransactionHistory.bind(this);
  }

  async getTransactionHistory(req: Request, res: Response, next: NextFunction) {
    const serviceResponse =
      await this.transactionsService.getTransactionHistory(req.user.id);

    return this.getControllerSuccessResponse(res, serviceResponse);
  }
}
