import express from 'express';
import { getExpenseStatuses, getExpenseEntryTypes } from '../controllers/metaController.js';

const router = express.Router();

/**
 * @route   GET /api/meta/expenses/statuses
 * @desc    Get allowed expense statuses
 * @access  Public
 */
router.get('/expenses/statuses', getExpenseStatuses);

/**
 * @route   GET /api/meta/expenses/entry-types
 * @desc    Get allowed expense entry types
 * @access  Public
 */
router.get('/expenses/entry-types', getExpenseEntryTypes);

export default router;



