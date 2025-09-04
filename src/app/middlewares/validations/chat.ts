import { body } from "express-validator";

export const chatValidator = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isString()
    .withMessage("Message must be a string"),

  body("chat_history")
    .optional()
    .isArray()
    .withMessage("Chat history must be an array"),
  body("chat_history.*.content")
    .optional()
    .isString()
    .withMessage("Each chat history entry must have string content"),
  body("chat_history.*.role")
    .optional()
    .isIn(["user", "assistant"])
    .withMessage("Each chat history role must be either 'user' or 'assistant'"),
];

export const saveChatHistoryValidator = [
  body("query")
    .notEmpty()
    .withMessage("Query is required")
    .isString()
    .withMessage("Query must be a string"),

  body("response")
    .notEmpty()
    .withMessage("Response is required")
    .isString()
    .withMessage("Response must be a string"),

  body("confidence")
    .notEmpty()
    .withMessage("Confidence is required")
    .isFloat({ min: 0, max: 1 })
    .withMessage("Confidence must be a number between 0 and 1"),
];

export const escalateValidator = [
  body("query")
    .notEmpty()
    .withMessage("Query is required")
    .isString()
    .withMessage("Query must be a string"),

  body("userEmail")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email must be a valid email"),
];

export const leadValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),

  body("query")
    .notEmpty()
    .withMessage("Query is required")
    .isString()
    .withMessage("Query must be a string"),
];
