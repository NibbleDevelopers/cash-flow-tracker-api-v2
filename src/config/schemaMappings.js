// Schema mappings to normalize API keys per sheet
// Keys on the left are normalized header variants (lowercase, no spaces/accents),
// values on the right are canonical API keys (camelCase, stable contract)

const categories = {
  id: 'id',
  identifier: 'id',
  categoriaid: 'id',
  name: 'name',
  nombre: 'name',
  type: 'type',
  tipo: 'type',
  parentid: 'parentId',
  padreid: 'parentId',
  parent: 'parentId'
};

const expenses = {
  id: 'id',
  fecha: 'date',
  date: 'date',
  descripcion: 'description',
  description: 'description',
  monto: 'amount',
  valor: 'amount',
  amount: 'amount',
  categoria: 'categoryId',
  categoriaid: 'categoryId',
  category: 'categoryId',
  categoryid: 'categoryId',
  fijo: 'isFixed',
  esfijo: 'isFixed',
  isfijo: 'isFixed',
  isfixed: 'isFixed',
  fixed: 'isFixed',
  gastofijoid: 'fixedExpenseId',
  fixedexpenseid: 'fixedExpenseId'
};

const fixedExpenses = {
  id: 'id',
  nombre: 'name',
  name: 'name',
  monto: 'amount',
  valor: 'amount',
  amount: 'amount',
  categoria: 'categoryId',
  categoriaid: 'categoryId',
  categoryid: 'categoryId',
  dayofmonth: 'dayOfMonth',
  diadelmes: 'dayOfMonth',
  active: 'active',
  activo: 'active',
  habilitado: 'active'
};

const budget = {
  mes: 'month',
  month: 'month',
  monto: 'amount',
  amount: 'amount'
};

const debts = {
  id: 'id',
  nombre: 'name',
  name: 'name',
  emisor: 'issuer',
  issuer: 'issuer',
  limitecredito: 'creditLimit',
  creditlimit: 'creditLimit',
  saldo: 'balance',
  balance: 'balance',
  diapago: 'dueDay',
  dueday: 'dueDay',
  diacorte: 'cutOffDay',
  cutoffday: 'cutOffDay',
  ultimosdigitos: 'maskPan',
  maskpan: 'maskPan',
  interesefectivo: 'interesEfectivo',
  annualeffectiverate: 'interesEfectivo',
  brand: 'brand',
  marca: 'brand',
  active: 'active',
  activo: 'active'
};

export default {
  Categories: categories,
  Expenses: expenses,
  FixedExpenses: fixedExpenses,
  Budget: budget,
  Debts: debts
};


