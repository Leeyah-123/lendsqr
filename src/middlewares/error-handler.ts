import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.log('Error', err);

  if (err instanceof Error) {
    err.statusCode = (err as Error).statusCode || 500;
    err.message = err.message || 'Something went wrong';
    err.data = err.data || null;

    const { statusCode, message, data } = err;

    // Log out the error for debugging purposes
    req.logger.error({
      statusCode,
      message,
      data,
      originalUrl: req.originalUrl,
      method: req.method,
    });

    if (statusCode === 404) {
      return res.status(statusCode).json({
        error: message ?? 'resource not found',
        data: null,
      });
    }

    return res.status(statusCode).json({
      error:
        'Unable to process your request at this time. Please try again later.',
      data: data,
    });
  }

  return res.status(500).json({
    error:
      'Unable to process your request at this time. Please try again later.',
  });
};
