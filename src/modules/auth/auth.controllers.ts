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

  async profile(req: Request, res: Response, _next: NextFunction) {
    const serviceResponse = await this.authService.getProfile(req.user.id);
    return res.status(serviceResponse.status || StatusCodes.OK).json({
      message: serviceResponse.message,
      data: serviceResponse.data,
    });
  }

  async register(req: Request, res: Response, _next: NextFunction) {
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

    return res.status(serviceResponse.status || StatusCodes.CREATED).json({
      message: serviceResponse.message,
    });
  }

  async login(req: Request, res: Response, _next: NextFunction) {
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

    const serviceResponse = await this.authService.login(req.body, req.logger);
    return res.status(serviceResponse.status || StatusCodes.OK).json({
      message: serviceResponse.message,
      data: serviceResponse.data,
    });
  }

  async refreshToken(req: Request, res: Response, _next: NextFunction) {
    const token = req.headers['x-refresh-token'];
    if (!token)
      return this.getControllerErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'Please provide token'
      );
    if (Array.isArray(token))
      return this.getControllerErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'Invalid refresh token'
      );

    const serviceResponse = await this.authService.refreshToken(token);
    return res.status(serviceResponse.status || StatusCodes.OK).json({
      message: serviceResponse.message,
      data: serviceResponse.data,
    });
  }
}
