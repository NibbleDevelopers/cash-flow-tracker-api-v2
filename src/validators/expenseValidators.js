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
    .isInt({ min: 0 })
    .withMessage('Category ID must be an integer greater than or equal to 0'),
    
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
    .withMessage('fixedExpenseId must be a string, null, or empty'),

  // New fields
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled', 'skipped', 'overdue'])
    .withMessage('status must be one of: pending, paid, cancelled, skipped, overdue'),

  body('entryType')
    .optional()
    .isIn(['charge', 'payment'])
    .withMessage('entryType must be one of: charge, payment'),

  body('debtId')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return typeof value === 'string';
    })
    .withMessage('debtId must be a string, null, or empty'),

  // Conditional requirements for credit category (7)
  body('entryType').custom((value, { req }) => {
    const isCreditCategory = Number.parseInt(req.body.categoryId, 10) === 7;
    if (isCreditCategory && !value) {
      throw new Error('entryType is required when categoryId is 7');
    }
    return true;
  }),
  body('debtId').custom((value, { req }) => {
    const isCreditCategory = Number.parseInt(req.body.categoryId, 10) === 7;
    if (isCreditCategory && !value) {
      throw new Error('debtId is required when categoryId is 7');
    }
    return true;
  })
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
    .isInt({ min: 0 })
    .withMessage('Category ID must be an integer greater than or equal to 0'),
    
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
    .withMessage('fixedExpenseId must be a string, null, or empty'),

  // New optional fields
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled', 'skipped', 'overdue'])
    .withMessage('status must be one of: pending, paid, cancelled, skipped, overdue'),
  body('entryType')
    .optional()
    .isIn(['charge', 'payment'])
    .withMessage('entryType must be one of: charge, payment'),
  body('debtId')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return typeof value === 'string';
    })
    .withMessage('debtId must be a string, null, or empty'),

  // Conditional check if categoryId (current or updated) is 7
  body('debtId').custom((value, { req }) => {
    const categoryId = req.body.categoryId !== undefined ? Number.parseInt(req.body.categoryId, 10) : undefined;
    const isCreditCategory = categoryId === 7;
    if (isCreditCategory && !value) {
      throw new Error('debtId is required when categoryId is 7');
    }
    return true;
  }),
  body('entryType').custom((value, { req }) => {
    const categoryId = req.body.categoryId !== undefined ? Number.parseInt(req.body.categoryId, 10) : undefined;
    const isCreditCategory = categoryId === 7;
    if (isCreditCategory && !value) {
      throw new Error('entryType is required when categoryId is 7');
    }
    return true;
  })
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
    .isInt({ min: 0 })
    .withMessage('Each expense category ID must be an integer greater than or equal to 0'),
    
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
    .withMessage('Each expense fixedExpenseId must be a string, null, or empty'),

  // New optional fields per expense
  body('expenses.*.status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled', 'skipped', 'overdue'])
    .withMessage('Each status must be one of: pending, paid, cancelled, skipped, overdue'),
  body('expenses.*.entryType')
    .optional()
    .isIn(['charge', 'payment'])
    .withMessage('Each entryType must be one of: charge, payment'),
  body('expenses.*.debtId')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return typeof value === 'string';
    })
    .withMessage('Each debtId must be a string, null, or empty'),

  // Conditional per item
  body('expenses')
    .custom((expenses) => {
      if (!Array.isArray(expenses)) return true;
      for (let i = 0; i < expenses.length; i++) {
        const item = expenses[i];
        const isCreditCategory = Number.parseInt(item.categoryId, 10) === 7;
        if (isCreditCategory) {
          if (!item.debtId) {
            throw new Error(`debtId is required when categoryId is 7 at index ${i}`);
          }
          if (!item.entryType) {
            throw new Error(`entryType is required when categoryId is 7 at index ${i}`);
          }
          if (!['charge', 'payment'].includes(item.entryType)) {
            throw new Error(`entryType must be charge or payment at index ${i}`);
          }
        }
      }
      return true;
    })
];

/**
 * Validation rules for deleting expenses
 */
export const deleteExpenseValidator = [
  param('id')
    .isString()
    .withMessage('ID param is required and must be a string')
];
