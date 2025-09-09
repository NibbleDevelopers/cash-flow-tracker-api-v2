import GoogleSheetsService from '../services/googleSheetsService.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';
import { ApiError } from '../middleware/errorHandler.js';
import { buildDebtSummary } from '../utils/finance.js';

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

export default {};


