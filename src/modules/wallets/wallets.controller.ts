import { NextFunction, Request, Response } from 'express';
import BaseController from '../core/base.controller';
import WalletsService from './wallets.service';
import {
  fundUserWalletValidationSchema,
  transferFundsValidationSchema,
  withdrawFundsValidationSchema,
} from './wallets.validation';

export default class WalletsController extends BaseController {
  private readonly walletsService: WalletsService;

  constructor() {
    super();

    this.walletsService = new WalletsService();

    this.getWallet = this.getWallet.bind(this);
    this.fundWallet = this.fundWallet.bind(this);
    this.transferFunds = this.transferFunds.bind(this);
    this.withdrawFunds = this.withdrawFunds.bind(this);
  }

  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceResponse = await this.walletsService.getUserWallet(
        req.user.id
      );
      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
      next(err);
    }
  }

  async fundWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = fundUserWalletValidationSchema.safeParse({
        userId: req.user.id,
        ...req.body,
      });
      if (!validationResult.success) {
        req.logError(
          'Validation Error',
          validationResult.error.flatten().fieldErrors
        );

        return this.getControllerValidationErrorResponse(
          res,
          validationResult.error
        );
      }

      const serviceResponse = await this.walletsService.fundUserWallet(
        validationResult.data
      );
      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
      next(err);
    }
  }

  async transferFunds(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = transferFundsValidationSchema.safeParse({
        userId: req.user.id,
        ...req.body,
      });
      if (!validationResult.success) {
        req.logError(
          'Validation Error',
          validationResult.error.flatten().fieldErrors
        );

        return this.getControllerValidationErrorResponse(
          res,
          validationResult.error
        );
      }

      const serviceResponse = await this.walletsService.transferFunds(
        validationResult.data
      );
      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
      next(err);
    }
  }

  async withdrawFunds(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = withdrawFundsValidationSchema.safeParse({
        userId: req.user.id,
        ...req.body,
      });
      if (!validationResult.success) {
        req.logError(
          'Validation Error',
          validationResult.error.flatten().fieldErrors
        );

        return this.getControllerValidationErrorResponse(
          res,
          validationResult.error
        );
      }

      const serviceResponse = await this.walletsService.withdrawFunds(
        validationResult.data
      );
      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
      next(err);
    }
  }
}
