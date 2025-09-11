import { body, param } from 'express-validator';

/**
 * Validation rules for creating/updating expenses
 */
export const createExpenseValidator = [
  body('id')
    .optional()
    .isString()
    .withMessage('ID must be a string'),
    
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
    
  body('description')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Description must be between 1 and 255 characters'),
    
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
    
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
    
  body('isFixed')
    .optional()
    .isBoolean()
    .withMessage('isFixed must be a boolean'),
    
  body('fixedExpenseId')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      return typeof value === 'string';
    })
    .withMessage('fixedExpenseId must be a string, null, or empty')
];

/**
 * Validation rules for updating expenses
 */
export const updateExpenseValidator = [
  param('id')
    .isString()
    .withMessage('ID param is required and must be a string'),
    
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Description must be between 1 and 255 characters'),
    
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
    
  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
    
  body('isFixed')
    .optional()
    .isBoolean()
    .withMessage('isFixed must be a boolean'),
    
  body('fixedExpenseId')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      return typeof value === 'string';
    })
    .withMessage('fixedExpenseId must be a string, null, or empty')
];

/**
 * Validation rules for bulk creating expenses
 */
export const createExpensesBulkValidator = [
  body('expenses')
    .isArray({ min: 1 })
    .withMessage('expenses must be a non-empty array'),
    
  body('expenses.*.id')
    .optional()
    .isString()
    .withMessage('Each expense ID must be a string'),
    
  body('expenses.*.date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Each expense date must be in YYYY-MM-DD format'),
    
  body('expenses.*.description')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Each expense description must be between 1 and 255 characters'),
    
  body('expenses.*.amount')
    .isFloat({ min: 0.01 })
    .withMessage('Each expense amount must be a positive number greater than 0'),
    
  body('expenses.*.categoryId')
    .isInt({ min: 1 })
    .withMessage('Each expense category ID must be a positive integer'),
    
  body('expenses.*.isFixed')
    .optional()
    .isBoolean()
    .withMessage('Each expense isFixed must be a boolean'),
    
  body('expenses.*.fixedExpenseId')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true; // Allow null, undefined, or empty string
      }
      return typeof value === 'string';
    })
    .withMessage('Each expense fixedExpenseId must be a string, null, or empty')
];

/**
 * Validation rules for deleting expenses
 */
export const deleteExpenseValidator = [
  param('id')
    .isString()
    .withMessage('ID param is required and must be a string')
];
