import GoogleSheetsService from '../services/googleSheetsService.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';
import { ApiError } from '../middleware/errorHandler.js';
import { buildDebtSummary, monthlyRateFromAnnualEffective, interestForMonth, nextDateForDayOfMonth } from '../utils/finance.js';

const sheetsService = new GoogleSheetsService();

/**
 * Get all debts
 */
export const getDebts = async (req, res, next) => {
  try {
    logger.info('GET /api/debts - Fetching all debts');
    const debts = await sheetsService.getDebts();
    const rows = Array.isArray(debts) ? debts.slice(1) : [];
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    logger.error('Error in getDebts controller', { error: error.message });
    next(error);
  }
};

/**
 * Add new debt
 */
export const addDebt = async (req, res, next) => {
  try {
    const { id, name, issuer, creditLimit, balance, dueDay, cutOffDay, active, maskPan, interesEfectivo, brand } = req.body;

    logger.info('POST /api/debts - Adding new debt', { name, issuer });

    if (!name) {
      throw new ApiError(400, 'Missing required field: name');
    }

    const debtId = id || uuidv4();

    const debt = {
      id: String(debtId),
      name: name.trim(),
      issuer: issuer ? String(issuer).trim() : '',
      creditLimit: creditLimit !== undefined && creditLimit !== null ? parseFloat(creditLimit) : undefined,
      balance: balance !== undefined && balance !== null ? parseFloat(balance) : undefined,
      dueDay: dueDay !== undefined && dueDay !== null ? parseInt(dueDay, 10) : undefined,
      cutOffDay: cutOffDay !== undefined && cutOffDay !== null ? parseInt(cutOffDay, 10) : undefined,
      active: active !== undefined ? Boolean(active) : true,
      maskPan: maskPan !== undefined && maskPan !== null ? String(maskPan).trim() : undefined,
      interesEfectivo: interesEfectivo !== undefined && interesEfectivo !== null ? parseFloat(interesEfectivo) : undefined,
      brand: brand !== undefined && brand !== null ? String(brand).trim() : undefined
    };

    const result = await sheetsService.addDebt(debt);

    logger.info('Debt added successfully', { debtId: debt.id });

    res.status(201).json({
      success: true,
      message: 'Debt added successfully',
      data: debt,
      result
    });
  } catch (error) {
    logger.error('Error in addDebt controller', { body: req.body, error: error.message });
    next(error);
  }
};

/**
 * Update debt
 */
export const updateDebt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, issuer, creditLimit, balance, dueDay, cutOffDay, active, maskPan, interesEfectivo, brand } = req.body;

    logger.info('PUT /api/debts - Updating debt', { id, name });

    if (!id) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const debt = {
      id: String(id),
      name: name !== undefined ? String(name).trim() : undefined,
      issuer: issuer !== undefined ? String(issuer).trim() : undefined,
      creditLimit: creditLimit !== undefined ? parseFloat(creditLimit) : undefined,
      balance: balance !== undefined ? parseFloat(balance) : undefined,
      dueDay: dueDay !== undefined ? parseInt(dueDay, 10) : undefined,
      cutOffDay: cutOffDay !== undefined ? parseInt(cutOffDay, 10) : undefined,
      active: active !== undefined ? Boolean(active) : undefined,
      maskPan: maskPan !== undefined ? String(maskPan).trim() : undefined,
      interesEfectivo: interesEfectivo !== undefined ? parseFloat(interesEfectivo) : undefined,
      brand: brand !== undefined ? String(brand).trim() : undefined
    };

    const result = await sheetsService.updateDebt(debt);

    logger.info('Debt updated successfully', { debtId: debt.id });

    res.json({
      success: true,
      message: 'Debt updated successfully',
      data: debt,
      result
    });
  } catch (error) {
    logger.error('Error in updateDebt controller', { body: req.body, error: error.message });
    next(error);
  }
};

/**
 * Delete debt
 */
export const deleteDebt = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('DELETE /api/debts - Deleting debt', { id });

    if (!id) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const result = await sheetsService.deleteDebt(String(id));

    res.json({
      success: true,
      message: 'Debt deleted successfully',
      id,
      result
    });
  } catch (error) {
    logger.error('Error in deleteDebt controller', { params: req.params, error: error.message });
    next(error);
  }
};

/**
 * Get summary for a single debt by id
 */
export const getDebtSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('GET /api/debts/:id/summary - Building debt summary', { id });

    if (!id) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const rows = await sheetsService.getDebts();
    const header = rows[0] || [];
    const idx = {
      id: 0, name: 1, issuer: 2, creditLimit: 3, balance: 4, dueDay: 5, cutOffDay: 6, maskPan: 7, interesEfectivo: 8, brand: 9, active: 10
    };
    const row = rows.slice(1).find(r => String(r[idx.id]) === String(id));
    if (!row) {
      throw new ApiError(404, 'Debt not found');
    }
    const debt = {
      id: row[idx.id],
      name: row[idx.name],
      issuer: row[idx.issuer],
      creditLimit: row[idx.creditLimit] ? parseFloat(row[idx.creditLimit]) : undefined,
      balance: row[idx.balance] ? parseFloat(row[idx.balance]) : undefined,
      dueDay: row[idx.dueDay] ? parseInt(row[idx.dueDay], 10) : undefined,
      cutOffDay: row[idx.cutOffDay] ? parseInt(row[idx.cutOffDay], 10) : undefined,
      maskPan: row[idx.maskPan] || undefined,
      interesEfectivo: row[idx.interesEfectivo] ? parseFloat(row[idx.interesEfectivo]) : undefined,
      brand: row[idx.brand] || undefined,
      active: row[idx.active] === 'TRUE'
    };

    const summary = buildDebtSummary(debt);
    res.json({ success: true, data: { debt, summary } });
  } catch (error) {
    logger.error('Error in getDebtSummary controller', { params: req.params, error: error.message });
    next(error);
  }
};

/**
 * Get summaries for all debts
 */
export const getDebtsSummary = async (req, res, next) => {
  try {
    logger.info('GET /api/debts/summary - Building debts summaries');
    const rows = await sheetsService.getDebts();
    const idx = { id: 0, name: 1, issuer: 2, creditLimit: 3, balance: 4, dueDay: 5, cutOffDay: 6, maskPan: 7, interesEfectivo: 8, brand: 9, active: 10 };
    const items = rows.slice(1).map(r => {
      const debt = {
        id: r[idx.id],
        name: r[idx.name],
        issuer: r[idx.issuer],
        creditLimit: r[idx.creditLimit] ? parseFloat(r[idx.creditLimit]) : undefined,
        balance: r[idx.balance] ? parseFloat(r[idx.balance]) : undefined,
        dueDay: r[idx.dueDay] ? parseInt(r[idx.dueDay], 10) : undefined,
        cutOffDay: r[idx.cutOffDay] ? parseInt(r[idx.cutOffDay], 10) : undefined,
        maskPan: r[idx.maskPan] || undefined,
        interesEfectivo: r[idx.interesEfectivo] ? parseFloat(r[idx.interesEfectivo]) : undefined,
        brand: r[idx.brand] || undefined,
        active: r[idx.active] === 'TRUE'
      };
      return { debt, summary: buildDebtSummary(debt) };
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    logger.error('Error in getDebtsSummary controller', { error: error.message });
    next(error);
  }
};

/**
 * Get installments plan for a debt (id) over N months
 * Query: months (1-120), start (YYYY-MM-DD optional; defaults to next due date or today)
 */
export const getDebtInstallments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const months = parseInt(req.query.months, 10);
    const startStr = req.query.start;

    logger.info('GET /api/debts/:id/installments - Calculating installments', { id, months, startStr });

    if (!id || !Number.isFinite(months) || months <= 0) {
      throw new ApiError(400, 'Invalid parameters');
    }

    // Load debt rows and find the specific debt
    const rows = await sheetsService.getDebts();
    const idx = { id: 0, name: 1, issuer: 2, creditLimit: 3, balance: 4, dueDay: 5, cutOffDay: 6, maskPan: 7, interesEfectivo: 8, brand: 9, active: 10 };
    const row = rows.slice(1).find(r => String(r[idx.id]) === String(id));
    if (!row) {
      throw new ApiError(404, 'Debt not found');
    }
    const debt = {
      id: row[idx.id],
      name: row[idx.name],
      issuer: row[idx.issuer],
      creditLimit: row[idx.creditLimit] ? parseFloat(row[idx.creditLimit]) : 0,
      balance: row[idx.balance] ? parseFloat(row[idx.balance]) : 0,
      dueDay: row[idx.dueDay] ? parseInt(row[idx.dueDay], 10) : null,
      cutOffDay: row[idx.cutOffDay] ? parseInt(row[idx.cutOffDay], 10) : null,
      interesEfectivo: row[idx.interesEfectivo] ? parseFloat(row[idx.interesEfectivo]) : null,
      brand: row[idx.brand] || undefined,
      active: row[idx.active] === 'TRUE'
    };

    const monthlyRate = debt.interesEfectivo !== null ? monthlyRateFromAnnualEffective(debt.interesEfectivo) : 0;
    const startDate = startStr ? new Date(startStr) : (debt.dueDay ? nextDateForDayOfMonth(debt.dueDay, new Date()) : new Date());

    // Amortization: equal payments over N months (if rate>0 uses standard annuity formula)
    const principal = Math.max(0, debt.balance);
    let payment;
    if (monthlyRate > 0) {
      const r = monthlyRate;
      const n = months;
      payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      payment = months > 0 ? (principal / months) : principal;
    }

    const schedule = [];
    let remaining = principal;
    const baseYear = startDate.getFullYear();
    const baseMonth = startDate.getMonth();
    const targetDay = startDate.getDate();
    for (let i = 0; i < months; i++) {
      const y = baseYear;
      const m = baseMonth + i;
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const day = Math.min(targetDay, daysInMonth);
      const date = new Date(y, m, day);
      const interest = interestForMonth(remaining, monthlyRate);
      let principalPart = payment - interest;
      if (principalPart < 0) principalPart = 0;
      if (principalPart > remaining) {
        principalPart = remaining;
      }
      remaining = Math.max(0, remaining - principalPart);
      schedule.push({
        period: i + 1,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`,
        payment: Number(payment.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        principal: Number(principalPart.toFixed(2)),
        remainingBalance: Number(remaining.toFixed(2))
      });
      if (remaining <= 0) break;
    }

    const totals = schedule.reduce((acc, s) => {
      acc.totalPaid += s.payment;
      acc.totalInterest += s.interest;
      acc.totalPrincipal += s.principal;
      return acc;
    }, { totalPaid: 0, totalInterest: 0, totalPrincipal: 0 });

    res.json({
      success: true,
      data: {
        debt: { id: debt.id, name: debt.name, issuer: debt.issuer, balance: principal, interesEfectivo: debt.interesEfectivo },
        monthlyRate,
        payment: Number(payment.toFixed(2)),
        months: schedule.length,
        schedule,
        totals: {
          totalPaid: Number(totals.totalPaid.toFixed(2)),
          totalInterest: Number(totals.totalInterest.toFixed(2)),
          totalPrincipal: Number(totals.totalPrincipal.toFixed(2))
        }
      }
    });
  } catch (error) {
    logger.error('Error in getDebtInstallments controller', { params: req.params, query: req.query, error: error.message });
    next(error);
  }
};

export default {};


