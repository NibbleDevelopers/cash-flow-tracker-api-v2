import express from 'express';

import { validate } from '../middleware/validation.js';
import { createFixedExpenseValidator, updateFixedExpenseValidator, deleteFixedExpenseValidator } from '../validators/fixedExpenseValidators.js';
import { addFixedExpense, getFixedExpenses, updateFixedExpense, deleteFixedExpense } from '../controllers/fixedExpenseController.js';

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
router.put('/:id',
  updateFixedExpenseValidator,
  validate,
  updateFixedExpense
);

/**
 * @route   DELETE /api/fixed-expenses
 * @desc    Delete fixed expense
 * @access  Public
 */
router.delete('/:id',
  deleteFixedExpenseValidator,
  validate,
  deleteFixedExpense
);

export default router;
