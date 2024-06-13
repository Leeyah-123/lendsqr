import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import { StatusCodes } from 'http-status-codes';
import {
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  loginValidationSchema,
  registerValidationSchema,
} from './auth.validation';
import { BaseController } from '../../core/base.controller';

export default class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();

    this.authService = new AuthService();

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = registerValidationSchema.safeParse(req.body);
      if (!validationResult.success) {
        req.logError(
          'Validation Error',
          validationResult.error.flatten().fieldErrors
        );

        return this.getValidationErrorResponse(res, validationResult.error);
      }

      const response = await this.authService.register(req.body, req.logger);

      return res.status(response.status || StatusCodes.OK).json({
        message: response.message,
      });
    } catch (err) {
      req.logError((err as Error).message, err);
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = loginValidationSchema.safeParse(req.body);
      if (!validationResult.success) {
        req.logError(
          'Validation Error',
          validationResult.error.flatten().fieldErrors
        );

        return this.getValidationErrorResponse(res, validationResult.error);
      }

      const response = await this.authService.login(req.body, req.logger);
      return res.status(response.status || StatusCodes.OK).json({
        message: response.message,
        data: response.data,
      });
    } catch (err) {
      req.logError((err as Error).message, err);
      next(err);
    }
  }
}
