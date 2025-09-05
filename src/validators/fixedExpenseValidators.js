import { body, param } from 'express-validator';

/**
 * Validation rules for creating fixed expenses
 */
export const createFixedExpenseValidator = [
  body('id')
    .optional()
    .custom(value => typeof value === 'string' || typeof value === 'number')
    .withMessage('ID must be a string or number'),
    
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
    
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
    
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
    
  body('dayOfMonth')
    .isInt({ min: 1, max: 31 })
    .withMessage('Day of month must be between 1 and 31'),
    
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean')
];

/**
 * Validation rules for updating fixed expenses
 */
export const updateFixedExpenseValidator = [
  param('id')
    .isString()
    .withMessage('ID param is required and must be a string'),
    
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
    
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
    
  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
    
  body('dayOfMonth')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('Day of month must be between 1 and 31'),
    
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean')
];

/**
 * Validation rules for deleting fixed expenses
 */
export const deleteFixedExpenseValidator = [
  param('id')
    .isString()
    .withMessage('ID param is required and must be a string')
];
