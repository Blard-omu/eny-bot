import { body } from "express-validator";

export const chatValidator = [
  body("query")
    .notEmpty()
    .withMessage("Query is required")
    .isString()
    .withMessage("Query must be a string"),
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
