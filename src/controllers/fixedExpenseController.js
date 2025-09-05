import GoogleSheetsService from '../services/googleSheetsService.js';
import logger from '../config/logger.js';
import { ApiError } from '../middleware/errorHandler.js';

const sheetsService = new GoogleSheetsService();

/**
 * Get all fixed expenses
 */
export const getFixedExpenses = async (req, res, next) => {
  try {
    logger.info('GET /api/fixed-expenses - Fetching all fixed expenses');
    
    const fixedExpenses = await sheetsService.getFixedExpenses();
    
    res.json({
      success: true,
      data: fixedExpenses,
      count: fixedExpenses.length
    });
  } catch (error) {
    logger.error('Error in getFixedExpenses controller', { error: error.message });
    next(error);
  }
};

/**
 * Add new fixed expense
 */
export const addFixedExpense = async (req, res, next) => {
  try {
    const { id, name, amount, categoryId, dayOfMonth, active } = req.body;
    
    logger.info('POST /api/fixed-expenses - Adding new fixed expense', { 
      name, 
      amount, 
      categoryId 
    });

    // Validate required fields
    if (!name || !amount || !categoryId || !dayOfMonth) {
      throw new ApiError(400, 'Missing required fields: name, amount, categoryId, dayOfMonth');
    }

    // Generate ID if not provided
    const fixedExpenseId = id || Date.now() + Math.random().toString(36).substr(2, 9);
    
    const fixedExpense = {
      id: fixedExpenseId,
      name: name.trim(),
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      dayOfMonth: parseInt(dayOfMonth),
      active: Boolean(active)
    };

    const result = await sheetsService.addFixedExpense(fixedExpense);
    
    logger.info('Fixed expense added successfully', { fixedExpenseId: fixedExpense.id });
    
    res.status(201).json({
      success: true,
      message: 'Fixed expense added successfully',
      data: fixedExpense,
      result
    });
  } catch (error) {
    logger.error('Error in addFixedExpense controller', { 
      body: req.body, 
      error: error.message 
    });
    next(error);
  }
};

/**
 * Update fixed expense
 */
export const updateFixedExpense = async (req, res, next) => {
  try {
    const { id: idParam } = req.params;
    const { name, amount, categoryId, dayOfMonth, active } = req.body;
    
    logger.info('PUT /api/fixed-expenses - Updating fixed expense', { 
      id: idParam, 
      name 
    });

    // Validate required fields
    if (!idParam) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const fixedExpense = {
      id: idParam,
      name: name ? name.trim() : undefined,
      amount: amount ? parseFloat(amount) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
      active: active !== undefined ? Boolean(active) : undefined
    };

    const result = await sheetsService.updateFixedExpense(fixedExpense);
    
    logger.info('Fixed expense updated successfully', { fixedExpenseId: fixedExpense.id });
    
    res.json({
      success: true,
      message: 'Fixed expense updated successfully',
      data: fixedExpense,
      result
    });
  } catch (error) {
    logger.error('Error in updateFixedExpense controller', { 
      body: req.body, 
      error: error.message 
    });
    next(error);
  }
};

/**
 * Delete fixed expense
 */
export const deleteFixedExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('DELETE /api/fixed-expenses - Deleting fixed expense', { id });

    if (!id) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const result = await sheetsService.deleteFixedExpense(id);

    res.json({
      success: true,
      message: 'Fixed expense deleted successfully',
      id,
      result
    });
  } catch (error) {
    logger.error('Error in deleteFixedExpense controller', {
      body: req.body,
      error: error.message
    });
    next(error);
  }
};
