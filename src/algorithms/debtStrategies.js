const AppError = require('../errors/AppError');
const { addMonths, formatISODate, clampToZero } = require('../utils/date');

function normalizeDebts(debts) {
  if (!Array.isArray(debts) || debts.length === 0) {
    throw new AppError(400, 'At least one debt is required for simulation.');
  }
  return debts.map((debt) => {
    const balance = Number(debt.balance);
    const apr = Number(debt.apr);
    const minimumPayment = Number(debt.minimumPayment);
    if (Number.isNaN(balance) || balance <= 0) {
      throw new AppError(400, `Debt ${debt.name || debt.id} must have a positive balance.`);
    }
    if (Number.isNaN(apr) || apr < 0) {
      throw new AppError(400, `Debt ${debt.name || debt.id} must have a valid APR.`);
    }
    if (Number.isNaN(minimumPayment) || minimumPayment <= 0) {
      throw new AppError(400, `Debt ${debt.name || debt.id} must have a positive minimum payment.`);
    }
    return {
      id: debt.id,
      name: debt.name,
      balance: Number(balance.toFixed(2)),
      apr,
      minimumPayment,
      type: debt.type,
      dueDate: debt.dueDate,
    };
  });
}

function orderDebts(debts, strategy) {
  const cloned = debts.map((debt) => ({ ...debt }));
  if (strategy === 'snowball') {
    cloned.sort((a, b) => a.balance - b.balance || a.apr - b.apr);
  } else if (strategy === 'avalanche') {
    cloned.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
  }
  return cloned;
}

function simulateStrategy(debtsInput, options) {
  const debts = normalizeDebts(debtsInput);
  const { strategy = 'snowball', monthlyBudget, startDate = new Date() } = options;
  if (strategy !== 'snowball' && strategy !== 'avalanche') {
    throw new AppError(400, 'Strategy must be either snowball or avalanche.');
  }
  const budget = Number(monthlyBudget);
  if (!budget || budget <= 0) {
    throw new AppError(400, 'Monthly budget must be a positive number.');
  }
  const activeDebts = debts.map((debt) => ({ ...debt }));
  const debtSummaries = new Map();
  let monthIndex = 0;
  const schedule = [];
  let totalInterest = 0;
  let totalPaid = 0;
  const start = new Date(startDate);

  const minimumRequired = activeDebts.reduce((sum, debt) => sum + Math.min(debt.minimumPayment, debt.balance), 0);
  if (budget + 0.0001 < minimumRequired) {
    throw new AppError(
      400,
      `Monthly budget ${budget.toFixed(2)} is insufficient. Minimum required is ${minimumRequired.toFixed(2)}.`
    );
  }

  activeDebts.forEach((debt) => {
    debtSummaries.set(debt.id, {
      debtId: debt.id,
      debtName: debt.name,
      totalInterest: 0,
      totalPaid: 0,
      monthsToPayoff: null,
      payoffDate: null,
      startingBalance: debt.balance,
    });
  });

  const MAX_MONTHS = 600;
  while (activeDebts.some((debt) => debt.balance > 0.01)) {
    if (monthIndex >= MAX_MONTHS) {
      throw new AppError(400, 'Simulation exceeded maximum supported duration (50 years).');
    }
    monthIndex += 1;
    const currentDate = addMonths(start, monthIndex - 1);
    const ordered = orderDebts(activeDebts, strategy);
    const interestMap = new Map();

    let monthInterest = 0;
    activeDebts.forEach((debt) => {
      const monthlyRate = debt.apr / 100 / 12;
      const interest = clampToZero(debt.balance * monthlyRate);
      debt.balance = clampToZero(debt.balance + interest);
      monthInterest += interest;
      interestMap.set(debt.id, interest);
      const summary = debtSummaries.get(debt.id);
      summary.totalInterest += interest;
    });

    let remainingBudget = budget;
    const payments = [];

    for (const debt of activeDebts) {
      const minimumPayment = Math.min(debt.minimumPayment, debt.balance);
      const payment = Math.min(minimumPayment, remainingBudget);
      debt.balance = clampToZero(debt.balance - payment);
      remainingBudget = clampToZero(remainingBudget - payment);
      const summary = debtSummaries.get(debt.id);
      summary.totalPaid += payment;
      payments.push({
        debtId: debt.id,
        debtName: debt.name,
        payment: clampToZero(payment),
        interestAccrued: clampToZero(interestMap.get(debt.id) || 0),
        balanceRemaining: debt.balance,
      });
    }

    for (const debt of ordered) {
      if (remainingBudget <= 0) {
        break;
      }
      if (debt.balance <= 0) {
        continue;
      }
      const extraPayment = Math.min(debt.balance, remainingBudget);
      debt.balance = clampToZero(debt.balance - extraPayment);
      remainingBudget = clampToZero(remainingBudget - extraPayment);
      const summary = debtSummaries.get(debt.id);
      summary.totalPaid += extraPayment;
      const paymentRecord = payments.find((record) => record.debtId === debt.id);
      if (paymentRecord) {
        paymentRecord.payment = clampToZero(paymentRecord.payment + extraPayment);
        paymentRecord.balanceRemaining = debt.balance;
      } else {
        payments.push({
          debtId: debt.id,
          debtName: debt.name,
          payment: clampToZero(extraPayment),
          interestAccrued: clampToZero(interestMap.get(debt.id) || 0),
          balanceRemaining: debt.balance,
        });
      }
    }

    const monthPaid = payments.reduce((sum, item) => sum + item.payment, 0);
    totalPaid += monthPaid;
    totalInterest += monthInterest;

    activeDebts.forEach((debt) => {
      const summary = debtSummaries.get(debt.id);
      if (debt.balance <= 0.01 && summary.monthsToPayoff === null) {
        summary.monthsToPayoff = monthIndex;
        summary.payoffDate = formatISODate(currentDate);
        debt.balance = 0;
      }
    });

    const remainingBalance = activeDebts.reduce((sum, debt) => sum + debt.balance, 0);
    schedule.push({
      monthIndex,
      date: formatISODate(currentDate),
      totalInterest: clampToZero(monthInterest),
      totalPaid: clampToZero(monthPaid),
      remainingBalance: clampToZero(remainingBalance),
      payments: payments.map((payment) => ({
        ...payment,
        payment: clampToZero(payment.payment),
        interestAccrued: clampToZero(payment.interestAccrued),
        balanceRemaining: clampToZero(payment.balanceRemaining),
      })),
    });
  }

  return {
    strategy,
    months: monthIndex,
    totalInterest: clampToZero(totalInterest),
    totalPaid: clampToZero(totalPaid),
    payoffDate: schedule.length > 0 ? schedule[schedule.length - 1].date : formatISODate(start),
    schedule,
    debtSummaries: Array.from(debtSummaries.values()).map((summary) => ({
      debtId: summary.debtId,
      debtName: summary.debtName,
      totalInterest: clampToZero(summary.totalInterest),
      totalPaid: clampToZero(summary.totalPaid),
      monthsToPayoff: summary.monthsToPayoff,
      payoffDate: summary.payoffDate,
      startingBalance: clampToZero(summary.startingBalance),
    })),
  };
}

module.exports = {
  simulateStrategy,
};
