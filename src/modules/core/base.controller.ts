import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

export default class BaseController {
  protected getControllerResponse({
    res,
    status = StatusCodes.OK,
    message,
    data,
  }: {
    res: Response;
    status?: StatusCodes;
    message?: string;
    data?: any;
  }) {
    const isSuccessStatus = status >= 200 && status < 300;

    return res.status(status).json({
      ...(isSuccessStatus
        ? message && { message }
        : message && { error: message }),
      ...(data && { data }),
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
