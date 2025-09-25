import { EXPENSE_STATUSES, EXPENSE_ENTRY_TYPES } from '../config/constants.js';

export const getExpenseStatuses = async (_req, res) => {
  res.json({ success: true, data: EXPENSE_STATUSES });
};

export const getExpenseEntryTypes = async (_req, res) => {
  res.json({ success: true, data: EXPENSE_ENTRY_TYPES });
};

export default {};



