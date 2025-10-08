/**
 * Convert annual effective interest rate (percentage 0-100) to monthly effective rate (0-1)
 */
export const monthlyRateFromAnnualEffective = (annualEffectivePercent) => {
  const annual = Number.isFinite(annualEffectivePercent) ? annualEffectivePercent : 0;
  const annualAsUnit = annual / 100;
  if (annualAsUnit <= 0) return 0;
  return Math.pow(1 + annualAsUnit, 1 / 12) - 1;
};

/**
 * Compute suggested minimum payment (simple rule: percentage of balance, default 5%)
 */
export const suggestedMinimumPayment = (balance, percent = 0.05, floor = 0) => {
  const b = Number.isFinite(balance) ? balance : 0;
  const p = Number.isFinite(percent) ? percent : 0.05;
  const f = Number.isFinite(floor) ? floor : 0;
  return Math.max(b * p, f);
};

/**
 * Interest for one period (month) given balance and monthly rate
 */
export const interestForMonth = (balance, monthlyRate) => {
  const b = Number.isFinite(balance) ? balance : 0;
  const r = Number.isFinite(monthlyRate) ? monthlyRate : 0;
  return b * r;
};

/**
 * Redondea un número a dos decimales para presentación (sin alterar precisión interna)
 */
export const toTwoDecimals = (value, asString = true) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return asString ? '0.00' : 0;
  const fixed = n.toFixed(2);
  return asString ? fixed : Number(fixed);
};

/**
 * Aplica toTwoDecimals a un conjunto de claves numéricas en un objeto de respuesta
 */
export const formatResponseTwoDecimals = (obj, keys, asString = true) => {
  if (!obj || !Array.isArray(keys)) return obj;
  const out = { ...obj };
  for (const k of keys) {
    if (k in out) out[k] = toTwoDecimals(out[k], asString);
  }
  return out;
};

/**
 * Clamp day of month to the last valid day for a given year-month
 */
const clampDay = (year, monthIndexZeroBased, day) => {
  const lastDay = new Date(year, monthIndexZeroBased + 1, 0).getDate();
  return Math.min(Math.max(1, day), lastDay);
};

/**
 * Next date (>= today) for a target day of month
 */
export const nextDateForDayOfMonth = (targetDay, baseDate = new Date()) => {
  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  if (!Number.isFinite(targetDay)) return null;
  const thisMonthDay = clampDay(today.getFullYear(), today.getMonth(), targetDay);
  let candidate = new Date(today.getFullYear(), today.getMonth(), thisMonthDay);
  if (candidate < today) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextDay = clampDay(nextMonth.getFullYear(), nextMonth.getMonth(), targetDay);
    candidate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextDay);
  }
  return candidate;
};

/**
 * Days between two dates (whole days, date-only)
 */
export const daysBetweenDates = (fromDate, toDate) => {
  if (!fromDate || !toDate) return null;
  const a = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const b = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Build a computed summary for a single debt object
 * debt: { creditLimit, balance, dueDay, cutOffDay, interesEfectivo }
 */
export const buildDebtSummary = (debt, now = new Date()) => {
  const creditLimit = Number.isFinite(debt?.creditLimit) ? debt.creditLimit : 0;
  const balance = Number.isFinite(debt?.balance) ? debt.balance : 0;
  const dueDay = Number.isFinite(debt?.dueDay) ? debt.dueDay : null;
  const cutOffDay = Number.isFinite(debt?.cutOffDay) ? debt.cutOffDay : null;
  const interesEfectivo = Number.isFinite(debt?.interesEfectivo) ? debt.interesEfectivo : null;

  const monthlyRate = interesEfectivo !== null ? monthlyRateFromAnnualEffective(interesEfectivo) : 0;
  const interestThisMonth = interestForMonth(balance, monthlyRate);
  const minPayment = suggestedMinimumPayment(balance, 0.05, 0);
  const utilizationPercent = creditLimit > 0 ? (balance / creditLimit) * 100 : null;

  const nextDueDate = dueDay ? nextDateForDayOfMonth(dueDay, now) : null;
  const nextCutOffDate = cutOffDay ? nextDateForDayOfMonth(cutOffDay, now) : null;
  const daysToDue = nextDueDate ? daysBetweenDates(now, nextDueDate) : null;

  return {
    monthlyRate,
    interestThisMonth,
    suggestedMinimumPayment: minPayment,
    utilizationPercent,
    nextDueDate: nextDueDate ? nextDueDate.toISOString().slice(0, 10) : null,
    daysToDue,
    nextCutOffDate: nextCutOffDate ? nextCutOffDate.toISOString().slice(0, 10) : null
  };
};





