import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
  errors?: any[]; // For validation-specific error array
}

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.status || 500;

  const response: ErrorResponse = {
    status: statusCode,
    message: err.message || "Internal Server Error",
  };

  // Include validation details if ValidationError
  if (err.name === "ValidationError" && err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
