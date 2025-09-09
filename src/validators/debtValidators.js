import { body, param } from 'express-validator';

/**
 * Validation rules for creating debts
 */
export const createDebtValidator = [
  body('id')
    .optional()
    .isString()
    .withMessage('ID must be a string'),

  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),

  body('issuer')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Issuer must be at most 255 characters'),

  body('creditLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('creditLimit must be a non-negative number'),

  body('balance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('balance must be a non-negative number'),

  body('dueDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('dueDay must be between 1 and 31'),

  body('cutOffDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('cutOffDay must be between 1 and 31'),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('active must be a boolean'),

  body('maskPan')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9*\s-]{0,64}$/)
    .withMessage('maskPan must be up to 64 chars (digits/letters/*/-/space)'),

  body('interesEfectivo')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('interesEfectivo must be a percentage between 0 and 100'),

  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('brand must be 1-50 characters')
];

/**
 * Validation rules for updating debts
 */
export const updateDebtValidator = [
  param('id')
    .isString()
    .withMessage('ID must be a string'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),

  body('issuer')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Issuer must be at most 255 characters'),

  body('creditLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('creditLimit must be a non-negative number'),

  body('balance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('balance must be a non-negative number'),

  body('dueDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('dueDay must be between 1 and 31'),

  body('cutOffDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('cutOffDay must be between 1 and 31'),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('active must be a boolean'),

  body('maskPan')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9*\s-]{0,64}$/)
    .withMessage('maskPan must be up to 64 chars (digits/letters/*/-/space)'),

  body('interesEfectivo')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('interesEfectivo must be a percentage between 0 and 100'),

  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('brand must be 1-50 characters')
];

/**
 * Validation rules for deleting debts
 */
export const deleteDebtValidator = [
  param('id')
    .isString()
    .withMessage('ID must be a string')
];


