import { body } from 'express-validator';

/**
 * Validation rules for budget operations
 */
export const budgetValidator = [
  body('month')
    .isString()
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format'),
    
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number')
];

/**
 * Validation rules for month parameter
 */
export const monthValidator = [
  body('month')
    .isString()
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format')
];
