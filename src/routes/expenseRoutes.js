import express from 'express';
import { addExpense, getExpenses } from '../controllers/expenseController.js';
import { createExpenseValidator } from '../validators/expenseValidators.js';
import { validate, validateExpense } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses
 * @access  Public
 */
router.get('/', getExpenses);

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

export default router;
