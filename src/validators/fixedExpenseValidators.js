import { body } from 'express-validator';

/**
 * Validation rules for creating fixed expenses
 */
export const createFixedExpenseValidator = [
  body('id')
    .optional()
    .isString()
    .withMessage('ID must be a string'),
    
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
  body('id')
    .isString()
    .withMessage('ID is required and must be a string'),
    
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
