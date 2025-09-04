"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.methodNotAllowed = exports.AppError = exports.InternalServerError = exports.ConflictError = exports.MethodNotAllowedError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.BaseHttpError = void 0;
class BaseHttpError extends Error {
    status;
    stack;
    constructor(status, message, stack) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.stack = stack;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseHttpError = BaseHttpError;
class BadRequestError extends BaseHttpError {
    constructor(message, stack) {
        const formattedMessage = Array.isArray(message)
            ? JSON.stringify(message)
            : message;
        super(400, formattedMessage, stack);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends BaseHttpError {
    constructor(message, stack) {
        super(404, message, stack);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends BaseHttpError {
    constructor(message, stack) {
        super(401, message, stack);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends BaseHttpError {
    constructor(message, stack) {
        super(403, message, stack);
    }
}
exports.ForbiddenError = ForbiddenError;
class MethodNotAllowedError extends BaseHttpError {
    constructor(message, stack) {
        super(405, message, stack);
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class ConflictError extends BaseHttpError {
    constructor(message, stack) {
        super(409, message, stack);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends BaseHttpError {
    constructor(message = 'Internal server error', stack) {
        super(500, message, stack);
    }
}
exports.InternalServerError = InternalServerError;
class AppError extends BaseHttpError {
    constructor(message, status = 500, stack) {
        super(status, message, stack);
    }
}
exports.AppError = AppError;
const methodNotAllowed = (req, res, next) => {
    next(new MethodNotAllowedError(`Method ${req.method} not allowed on ${req.originalUrl}`));
};
exports.methodNotAllowed = methodNotAllowed;
class ValidationError extends Error {
    status;
    errors;
    stack;
    constructor(errors, stack) {
        super("Validation failed");
        this.name = "ValidationError";
        this.status = 422;
        this.errors = errors;
        this.stack = stack;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
