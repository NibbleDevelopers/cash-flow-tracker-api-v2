import express from 'express';
import { getDebts, addDebt, updateDebt, deleteDebt, getDebtSummary, getDebtsSummary } from '../controllers/debtController.js';
import { createDebtValidator, updateDebtValidator, deleteDebtValidator } from '../validators/debtValidators.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/debts
 * @desc    Get all debts
 * @access  Public
 */
router.get('/', getDebts);

/**
 * @route   POST /api/debts
 * @desc    Add new debt
 * @access  Public
 */
router.post('/',
  createDebtValidator,
  validate,
  addDebt
);

/**
 * @route   PUT /api/debts/:id
 * @desc    Update debt
 * @access  Public
 */
router.put('/:id',
  updateDebtValidator,
  validate,
  updateDebt
);

/**
 * @route   DELETE /api/debts/:id
 * @desc    Delete debt
 * @access  Public
 */
router.delete('/:id',
  deleteDebtValidator,
  validate,
  deleteDebt
);

/**
 * @route   GET /api/debts/:id/summary
 * @desc    Get summary for one debt
 * @access  Public
 */
router.get('/:id/summary', getDebtSummary);

/**
 * @route   GET /api/debts/summary
 * @desc    Get summary for all debts
 * @access  Public
 */
router.get('/summary', getDebtsSummary);

export default router;


