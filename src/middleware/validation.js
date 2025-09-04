import { validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    throw new ApiError(400, 'Validation failed', true, JSON.stringify(errorMessages));
  }
  
  next();
};

/**
 * Sanitize and validate expense data
 */
export const validateExpense = [
  (req, res, next) => {
    // Ensure amount is a number
    if (req.body.amount) {
      req.body.amount = parseFloat(req.body.amount);
    }
    
    // Ensure categoryId is a number
    if (req.body.categoryId) {
      req.body.categoryId = parseInt(req.body.categoryId);
    }
    
    // Ensure isFixed is a boolean
    if (req.body.isFixed !== undefined) {
      req.body.isFixed = Boolean(req.body.isFixed);
    }
    
    next();
  }
];

/**
 * Sanitize and validate budget data
 */
export const validateBudget = [
  (req, res, next) => {
    // Ensure amount is a number
    if (req.body.amount) {
      req.body.amount = parseFloat(req.body.amount);
    }
    
    next();
  }
];

/**
 * Sanitize and validate fixed expense data
 */
export const validateFixedExpense = [
  (req, res, next) => {
    // Ensure amount is a number
    if (req.body.amount) {
      req.body.amount = parseFloat(req.body.amount);
    }
    
    // Ensure categoryId is a number
    if (req.body.categoryId) {
      req.body.categoryId = parseInt(req.body.categoryId);
    }
    
    // Ensure dayOfMonth is a number
    if (req.body.dayOfMonth) {
      req.body.dayOfMonth = parseInt(req.body.dayOfMonth);
    }
    
    // Ensure active is a boolean
    if (req.body.active !== undefined) {
      req.body.active = Boolean(req.body.active);
    }
    
    next();
  }
];
