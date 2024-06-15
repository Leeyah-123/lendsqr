import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof Error) {
    err.statusCode = (err as Error).statusCode || 500;
    err.message = err.message || 'Something went wrong';
    err.data = err.data || null;

    const { statusCode, message, data } = err;

    req.logger.error({
      statusCode,
      message,
      data,
      originalUrl: req.originalUrl,
      method: req.method,
    });

    if (err.timeout) {
      return res.status(408).send({
        success: false,
        data: null,
        message: 'Request timeout',
      });
    }

    if (statusCode === 404) {
      return res.status(statusCode).json({
        success: false,
        data: null,
        message: message ?? 'resource not found',
      });
    }

    return res.status(statusCode).json({
      success: false,
      data: data,
      message: message,
    });
  }

  return res.status(500).json({
    success: false,
    error: err,
  });
};
