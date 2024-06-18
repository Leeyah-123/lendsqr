import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import BaseController from '../core/base.controller';
import AuthService from './auth.service';
import {
  loginValidationSchema,
  registerValidationSchema,
} from './auth.validation';

export default class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();

    this.authService = new AuthService();

    this.profile = this.profile.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceResponse = await this.authService.getProfile(req.user.id);
      return res.status(serviceResponse.status || StatusCodes.OK).json({
        message: serviceResponse.message,
        data: serviceResponse.data,
      });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = registerValidationSchema.safeParse(req.body);
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

      const serviceResponse = await this.authService.register(
        req.body,
        req.logger
      );

      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
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

        return this.getControllerValidationErrorResponse(
          res,
          validationResult.error
        );
      }

      const serviceResponse = await this.authService.login(
        req.body,
        req.logger
      );
      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['x-refresh-token'];

      // Check if token is a string
      if (typeof token !== 'string')
        return this.getControllerResponse({
          res,
          status: StatusCodes.BAD_REQUEST,
          message: 'Invalid/Missing refresh token',
        });

      const serviceResponse = await this.authService.refreshToken(token);
      return this.getControllerResponse({ res, ...serviceResponse });
    } catch (err) {
      next(err);
    }
  }
}
