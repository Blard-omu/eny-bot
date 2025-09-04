"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.status || 500;
    const response = {
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
exports.default = errorHandler;
