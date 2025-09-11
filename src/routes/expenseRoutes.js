import express from 'express';
import { addExpense, addExpensesBulk, getExpenses, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { createExpenseValidator, createExpensesBulkValidator, updateExpenseValidator, deleteExpenseValidator } from '../validators/expenseValidators.js';
import { validate, validateExpense } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses
 * @access  Public
 */
router.get('/', getExpenses);

/**
 * @route   POST /api/expenses/batch
 * @desc    Add multiple expenses
 * @access  Public
 */
router.post('/batch', 
  createExpensesBulkValidator,
  validate,
  addExpensesBulk
);

/**
 * @route   POST /api/expenses
 * @desc    Add new expense
 * @access  Public
 */
router.post('/', 
  createExpenseValidator,
  validateExpense,
  validate,
  addExpense
);

/**
 * @route   PUT /api/expenses
 * @desc    Update expense
 * @access  Public
 */
router.put('/:id', 
  updateExpenseValidator,
  validateExpense,
  validate,
  updateExpense
);

/**
 * @route   DELETE /api/expenses
 * @desc    Delete expense
 * @access  Public
 */
router.delete('/:id', 
  deleteExpenseValidator,
  validate,
  deleteExpense
);

export default router;
