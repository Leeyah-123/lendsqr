import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { ServiceResponse } from './types';

export default class BaseController {
  protected getControllerSuccessResponse(
    res: Response,
    serviceResponse: ServiceResponse
  ) {
    return res.status(serviceResponse.status || StatusCodes.OK).json({
      ...(serviceResponse.message && { message: serviceResponse.message }),
      ...(serviceResponse.data && { data: serviceResponse.data }),
    });
  }
  protected getControllerErrorResponse(
    res: Response,
    status: StatusCodes,
    message: string
  ) {
    return res.status(status).json({
      error: message,
    });
  }
  protected getControllerValidationErrorResponse(
    res: Response,
    error: ZodError
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'The request body contains invalid data.',
      details: error.flatten().fieldErrors,
    });
  }
}
