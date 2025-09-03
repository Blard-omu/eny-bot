import { Request, Response, NextFunction } from "express";


export class BaseHttpError extends Error {
    status: number;
    stack?: string;
  
    constructor(status: number, message: string, stack?: string) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      this.stack = stack;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class BadRequestError extends BaseHttpError {
    constructor(message: string | any[], stack?: string) {
      const formattedMessage = Array.isArray(message)
        ? JSON.stringify(message)
        : message;
      super(400, formattedMessage, stack);
    }
  }
  
  export class NotFoundError extends BaseHttpError {
    constructor(message: string, stack?: string) {
      super(404, message, stack);
    }
  }
  
  export class UnauthorizedError extends BaseHttpError {
    constructor(message: string, stack?: string) {
      super(401, message, stack);
    }
  }
  
  export class ForbiddenError extends BaseHttpError {
    constructor(message: string, stack?: string) {
      super(403, message, stack);
    }
  }
  
  export class MethodNotAllowedError extends BaseHttpError {
    constructor(message: string, stack?: string) {
      super(405, message, stack);
    }
  }
  
  export class ConflictError extends BaseHttpError {
    constructor(message: string, stack?: string) {
      super(409, message, stack);
    }
  }
  
  export class InternalServerError extends BaseHttpError {
    constructor(message: string = 'Internal server error', stack?: any) {
      super(500, message, stack);
    }
  }
    
  export  class AppError extends BaseHttpError {
    constructor(message: string, status = 500, stack?: string) {
      super(status, message, stack);
    }
  }
  export const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => {
    next(new MethodNotAllowedError(`Method ${req.method} not allowed on ${req.originalUrl}`));
  };
  

  export class ValidationError extends Error {
    public status: number;
    public errors: any[];
    public stack?: string;
  
    constructor(errors: any[], stack?: string) {
      super("Validation failed");
      this.name = "ValidationError";
      this.status = 422;
      this.errors = errors;
      this.stack = stack;
      Error.captureStackTrace(this, this.constructor);
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }
  
  
  
  