// Canonical type schema per sheet for API responses
// Allowed types: 'string' | 'number' | 'boolean' | 'date'

const Categories = {
  id: 'string',
  name: 'string',
  type: 'string',
  parentId: 'string'
};

const Expenses = {
  id: 'string',
  date: 'date',
  description: 'string',
  amount: 'number',
  categoryId: 'number',
  isFixed: 'boolean',
  fixedExpenseId: 'string',
  debtId: 'string',
  entryType: 'string',
  status: 'string'
};

const FixedExpenses = {
  id: 'string',
  name: 'string',
  amount: 'number',
  categoryId: 'number',
  dayOfMonth: 'number',
  active: 'boolean',
  debtId: 'string'
};

const Budget = {
  month: 'date', // YYYY-MM
  amount: 'number'
};

const Debts = {
  id: 'string',
  name: 'string',
  issuer: 'string',
  creditLimit: 'number',
  balance: 'number',
  dueDay: 'number',
  cutOffDay: 'number',
  maskPan: 'string',
  interesEfectivo: 'number',
  brand: 'string',
  active: 'boolean'
};

export default {
  Categories,
  Expenses,
  FixedExpenses,
  Budget,
  Debts,
  CreditHistory: {
    debtId: 'string',
    statementDate: 'date',
    dueDate: 'date',
    previousBalance: 'number',
    charges: 'number',
    interests: 'number',
    payments: 'number',
    statementBalance: 'number',
    bonifiableInterest: 'number',
    installmentBalance: 'number',
    annualEffectiveRate: 'number',
    termMonths: 'number',
    periodDays: 'number',
    paymentMade: 'number'
  }
};


