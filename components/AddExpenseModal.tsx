'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Expense } from '@/types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (money: number, reason: string, date: string) => void;
  selectedDate: string;
  expenses: Expense[];
  loading?: boolean;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAdd,
  selectedDate,
  expenses,
  loading = false,
}: AddExpenseModalProps) {
  const [newMoney, setNewMoney] = useState('');
  const [newReason, setNewReason] = useState('');
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen) {
      setNewMoney('');
      setNewReason('');
      setDate(selectedDate);
    }
  }, [isOpen, selectedDate]);

  const dateExpenses = expenses.filter((exp) => exp.date === date);
  const totalForDate = dateExpenses.reduce((sum, exp) => sum + exp.money, 0);

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const moneyValue = parseFloat(newMoney);
    if (!Number.isNaN(moneyValue) && moneyValue >= 0) {
      onAdd(moneyValue, newReason, date);
      setNewMoney('');
      setNewReason('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Add Expense</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Expenses for this date (Total: ₹{totalForDate.toFixed(2)})
          </h3>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {dateExpenses.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses yet — add below.</p>
            ) : (
              dateExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <p className="font-medium text-gray-900">
                    ₹{expense.money.toFixed(2)}
                  </p>
                  {expense.reason ? (
                    <p className="text-sm text-gray-600">{expense.reason}</p>
                  ) : null}
                  <p className="text-xs text-gray-500">
                    {format(new Date(expense.updatedTime), 'hh:mm a')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Add new expense
          </h3>
          <form onSubmit={handleAddNew} className="space-y-3" onClick={(e) => e.stopPropagation()}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <input
                type="number"
                value={newMoney}
                onChange={(e) => setNewMoney(e.target.value)}
                placeholder="0 or more"
                step="0.01"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reason (optional)
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Enter reason"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
