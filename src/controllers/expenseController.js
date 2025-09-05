import GoogleSheetsService from '../services/googleSheetsService.js';
import logger from '../config/logger.js';
import { ApiError } from '../middleware/errorHandler.js';

const sheetsService = new GoogleSheetsService();

/**
 * Get all expenses
 */
export const getExpenses = async (req, res, next) => {
  try {
    logger.info('GET /api/expenses - Fetching all expenses');
    
    const expenses = await sheetsService.getExpenses();
    
    res.json({
      success: true,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    logger.error('Error in getExpenses controller', { error: error.message });
    next(error);
  }
};

/**
 * Add new expense
 */
export const addExpense = async (req, res, next) => {
  try {
    const { id, date, description, amount, categoryId, isFixed } = req.body;
    
    logger.info('POST /api/expenses - Adding new expense', { 
      description, 
      amount, 
      categoryId 
    });

    // Validate required fields
    if (!date || !description || !amount || !categoryId) {
      throw new ApiError(400, 'Missing required fields: date, description, amount, categoryId');
    }

    // Generate ID if not provided
    const expenseId = id || Date.now() + Math.random().toString(36).substr(2, 9);
    
    const expense = {
      id: expenseId,
      date,
      description: description.trim(),
      amount: parseFloat(amount),
      categoryId: parseInt(categoryId),
      isFixed: Boolean(isFixed)
    };

    const result = await sheetsService.addExpense(expense);
    
    logger.info('Expense added successfully', { expenseId: expense.id });
    
    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
      result
    });
  } catch (error) {
    logger.error('Error in addExpense controller', { 
      body: req.body, 
      error: error.message 
    });
    next(error);
  }
};

/**
 * Update expense
 */
export const updateExpense = async (req, res, next) => {
  try {
    const { id: idParam } = req.params;
    const { date, description, amount, categoryId, isFixed } = req.body;

    logger.info('PUT /api/expenses - Updating expense', {
      id: idParam,
      description
    });

    if (!idParam) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const expense = {
      id: idParam,
      date,
      description: description ? description.trim() : undefined,
      amount: amount !== undefined ? parseFloat(amount) : undefined,
      categoryId: categoryId !== undefined ? parseInt(categoryId) : undefined,
      isFixed: isFixed !== undefined ? Boolean(isFixed) : undefined
    };

    const result = await sheetsService.updateExpense(expense);

    logger.info('Expense updated successfully', { expenseId: expense.id });

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
      result
    });
  } catch (error) {
    logger.error('Error in updateExpense controller', {
      body: req.body,
      error: error.message
    });
    next(error);
  }
};

/**
 * Delete expense
 */
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('DELETE /api/expenses - Deleting expense', { id });

    if (!id) {
      throw new ApiError(400, 'Missing required field: id');
    }

    const result = await sheetsService.deleteExpense(id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      id,
      result
    });
  } catch (error) {
    logger.error('Error in deleteExpense controller', {
      body: req.body,
      error: error.message
    });
    next(error);
  }
};
