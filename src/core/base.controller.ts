import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

export class BaseController {
  protected getValidationErrorResponse(res: Response, error: ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'The request body contains invalid data.',
      details: error.flatten().fieldErrors,
    });
  }
}
