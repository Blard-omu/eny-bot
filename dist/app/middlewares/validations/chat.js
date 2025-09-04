"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadValidator = exports.escalateValidator = exports.saveChatHistoryValidator = exports.chatValidator = void 0;
const express_validator_1 = require("express-validator");
exports.chatValidator = [
    (0, express_validator_1.body)("message")
        .notEmpty()
        .withMessage("Message is required")
        .isString()
        .withMessage("Message must be a string"),
    (0, express_validator_1.body)("chat_history")
        .optional()
        .isArray()
        .withMessage("Chat history must be an array"),
    (0, express_validator_1.body)("chat_history.*.content")
        .optional()
        .isString()
        .withMessage("Each chat history entry must have string content"),
    (0, express_validator_1.body)("chat_history.*.role")
        .optional()
        .isIn(["user", "assistant"])
        .withMessage("Each chat history role must be either 'user' or 'assistant'"),
];
exports.saveChatHistoryValidator = [
    (0, express_validator_1.body)("query")
        .notEmpty()
        .withMessage("Query is required")
        .isString()
        .withMessage("Query must be a string"),
    (0, express_validator_1.body)("response")
        .notEmpty()
        .withMessage("Response is required")
        .isString()
        .withMessage("Response must be a string"),
    (0, express_validator_1.body)("confidence")
        .notEmpty()
        .withMessage("Confidence is required")
        .isFloat({ min: 0, max: 1 })
        .withMessage("Confidence must be a number between 0 and 1"),
];
exports.escalateValidator = [
    (0, express_validator_1.body)("query")
        .notEmpty()
        .withMessage("Query is required")
        .isString()
        .withMessage("Query must be a string"),
    (0, express_validator_1.body)("userEmail")
        .notEmpty()
        .withMessage("User email is required")
        .isEmail()
        .withMessage("User email must be a valid email"),
];
exports.leadValidator = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email"),
    (0, express_validator_1.body)("query")
        .notEmpty()
        .withMessage("Query is required")
        .isString()
        .withMessage("Query must be a string"),
];
