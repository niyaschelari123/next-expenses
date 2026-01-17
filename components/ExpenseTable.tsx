'use client';

import { format } from 'date-fns';
import { Expense } from '@/types';

interface ExpenseTableProps {
  expenses: Expense[];
  totalExpense: number;
  targetExpense: number;
  onEdit: (date: string) => void;
  onDelete: (date: string) => void;
  deletingDate?: string | null;
}

export default function ExpenseTable({
  expenses,
  totalExpense,
  targetExpense,
  onEdit,
  onDelete,
  deletingDate = null,
}: ExpenseTableProps) {
  // If no expenses, savings and extra should be 0
  const savings = expenses.length === 0 ? 0 : (targetExpense - totalExpense > 0 ? targetExpense - totalExpense : 0);
  const extra = expenses.length === 0 ? 0 : (totalExpense - targetExpense > 0 ? totalExpense - targetExpense : 0);

  // Group expenses by date
  const expensesByDate = expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Convert to array and calculate totals per date
  const dateRows = Object.entries(expensesByDate).map(([date, dateExpenses]) => {
    const total = dateExpenses.reduce((sum, exp) => sum + exp.money, 0);
    const daySavings = targetExpense - total;
    const dayExtra = total - targetExpense;
    return {
      date,
      expenses: dateExpenses,
      total,
      savings: daySavings > 0 ? daySavings : 0,
      extra: dayExtra > 0 ? dayExtra : 0,
    };
  });

  // Sort by date (newest first)
  dateRows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-gray-600">Total Expense</p>
            <p className="text-lg font-bold text-blue-700">
              ₹{totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-xs text-gray-600">Savings</p>
            <p className="text-lg font-bold text-green-700">
              ₹{savings > 0 ? savings.toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-xs text-gray-600">Extra</p>
            <p className="text-lg font-bold text-red-700">
              ₹{extra > 0 ? extra.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Actions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Savings
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Extra
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dateRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No expenses added yet
                  </td>
                </tr>
              ) : (
                dateRows.map((row) => (
                  <tr key={row.date} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {format(new Date(row.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{row.total.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(row.date)}
                          disabled={deletingDate === row.date}
                          className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => onDelete(row.date)}
                          disabled={deletingDate === row.date}
                          className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          title="Delete"
                        >
                          {deletingDate === row.date ? (
                            <>
                              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></span>
                              Deleting...
                            </>
                          ) : (
                            <>
                              🗑️ Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-green-700">
                      ₹{row.savings.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-red-700">
                      ₹{row.extra.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
