'use client';

import { Expense } from '@/types';

interface StatusMessageProps {
  expenses: Expense[];
  targetExpense: number;
}

export default function StatusMessage({
  expenses,
  targetExpense,
}: StatusMessageProps) {
  // Group expenses by date
  const expensesByDate = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Calculate savings and extra for each day
  let totalSavings = 0;
  let totalExtra = 0;

  Object.values(expensesByDate).forEach((dayExpenses) => {
    const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.money, 0);
    const daySavings = targetExpense - dayTotal;
    
    if (daySavings > 0) {
      totalSavings += daySavings;
    } else if (daySavings < 0) {
      totalExtra += Math.abs(daySavings);
    }
  });

  // Calculate net result
  const netSavings = totalSavings - totalExtra;
  const netExtra = totalExtra - totalSavings;

  if (netSavings > 0) {
    return (
      <div className="mt-6 rounded-lg bg-green-50 p-4 text-center shadow-sm">
        <p className="text-lg font-semibold text-green-800">
          🎉 Congratulations! You saved ₹{netSavings.toFixed(2)}
        </p>
      </div>
    );
  } else if (netExtra > 0) {
    return (
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-center shadow-sm">
        <p className="text-lg font-semibold text-red-800">
          ⚠️ You spent extra ₹{netExtra.toFixed(2)}
        </p>
      </div>
    );
  } else {
    return (
      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center shadow-sm">
        <p className="text-lg font-semibold text-blue-800">
          ✅ You spent exactly your target amount!
        </p>
      </div>
    );
  }
}
