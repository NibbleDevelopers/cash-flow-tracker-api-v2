import express from 'express';

import { validate } from '../middleware/validation.js';
import { createFixedExpenseValidator, updateFixedExpenseValidator } from '../validators/fixedExpenseValidators.js';
import { addFixedExpense, getFixedExpenses, updateFixedExpense } from '../controllers/fixedExpenseController.js';

const router = express.Router();

/**
 * @route   GET /api/fixed-expenses
 * @desc    Get all fixed expenses
 * @access  Public
 */
router.get('/', getFixedExpenses);

/**
 * @route   POST /api/fixed-expenses
 * @desc    Add new fixed expense
 * @access  Public
 */
router.post('/',
  createFixedExpenseValidator,
  validate,
  addFixedExpense
);

/**
 * @route   PUT /api/fixed-expenses
 * @desc    Update fixed expense
 * @access  Public
 */
router.put('/',
  updateFixedExpenseValidator,
  validate,
  updateFixedExpense
);

export default router;
