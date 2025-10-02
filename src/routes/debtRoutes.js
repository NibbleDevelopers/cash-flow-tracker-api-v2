import express from 'express';
import { getDebts, addDebt, updateDebt, deleteDebt, getDebtSummary, getDebtsSummary, getDebtInstallments, accrueDebt, getDebtStatementPreview } from '../controllers/debtController.js';
import { createDebtValidator, updateDebtValidator, deleteDebtValidator, getDebtInstallmentsValidator, accrueDebtValidator, accrueDebtPreviewValidator } from '../validators/debtValidators.js';
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

/**
 * @route   GET /api/debts/:id/installments?months=12&start=YYYY-MM-DD
 * @desc    Get installments plan for a debt
 * @access  Public
 */
router.get('/:id/installments',
  getDebtInstallmentsValidator,
  validate,
  getDebtInstallments
);

/**
* @route   POST /api/debts/:id/accrue?period=YYYY-MM|date=YYYY-MM-DD&dryRun=true|false&recompute=true|false
* @desc    Accrue interest for a debt for a period and add to balance
* @access  Public
*/
router.post('/:id/accrue',
  accrueDebtValidator,
  validate,
  accrueDebt
);

/**
 * @route   POST /api/debts/:id/statements?period=YYYY-MM|date=YYYY-MM-DD&dryRun=true|false&recompute=true|false
 * @desc    Generate (and optionally persist) a credit statement for the given period
 * @access  Public
 * @notes   Alias for /accrue; preferred naming. Keeps backward compatibility.
 */
router.post('/:id/statements',
  accrueDebtValidator,
  validate,
  accrueDebt
);

/**
 * @route   GET /api/debts/:id/statement-preview?period=YYYY-MM|date=YYYY-MM-DD
 * @desc    Preview a statement calculation without persisting
 * @access  Public
 */
router.get('/:id/statement-preview',
  accrueDebtPreviewValidator,
  validate,
  getDebtStatementPreview
);

export default router;


