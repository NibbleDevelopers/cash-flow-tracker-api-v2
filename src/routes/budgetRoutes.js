import express from 'express';
import { getBudget, updateBudget } from '../controllers/budgetController.js';
import { budgetValidator } from '../validators/budgetValidators.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/budget
 * @desc    Get budget
 * @access  Public
 */
router.get('/', getBudget);

/**
 * @route   PUT /api/budget
 * @desc    Update budget
 * @access  Public
 */
router.put('/', 
  budgetValidator,
  validate,
  updateBudget
);

export default router;
