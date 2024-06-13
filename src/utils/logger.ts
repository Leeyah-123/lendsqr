import pino from "pino";

export function logError(
  logger: pino.Logger,
  message: string,
  error?: unknown
) {
  error ||= new Error(message);
  const errorLogData: Record<string, unknown> = { msg: message };

  if (error instanceof Error) {
    errorLogData.stack = error.stack;
    errorLogData.errorMsg = error.message;
  } else {
    const newError = new Error(); // for the stack (relevant to see the code path that led to this error log)
    errorLogData.stack = newError.stack;
    errorLogData.data = error;
  }

  logger.error({ ...errorLogData });
}
