import { NextFunction, Request, Response } from "express";
import pino from "pino";
import { logError } from "../utils/logger";

export async function logger(req: Request, res: Response, next: NextFunction) {
  req.logger = pino().child({
    path: req.path,
  });
  req.logError = (message: string, error?: unknown) =>
    logError(req.logger, message, error);

  next();
}
