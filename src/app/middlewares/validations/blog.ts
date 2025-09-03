import { body, param } from 'express-validator';

export const validateCreateBlog = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters long'),

  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters long'),

  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array of strings'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings')
];

export const validateUpdateBlog = [
  body('title')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters long'),

  body('content')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters long'),

  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array of strings'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings')
];

export const validateBlogIdParam = [
  param('blogId')
    .isMongoId()
    .withMessage('Invalid blog ID')
];