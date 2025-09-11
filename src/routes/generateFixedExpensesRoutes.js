import express from 'express';

import { generateFixedExpenses } from '../controllers/fixedExpenseController.js';

const router = express.Router();

/**
 * @route   POST /api/generate-fixed-expenses
 * @desc    Generate fixed expenses for a month (YYYY-MM)
 * @access  Public
 */
router.post('/', generateFixedExpenses);

export default router;


