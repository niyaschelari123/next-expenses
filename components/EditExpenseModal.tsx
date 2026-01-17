'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Expense } from '@/types';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  expenses: Expense[];
  onAddExpense: (money: number, reason: string, date: string) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, money: number, reason: string) => void;
  addingLoading?: boolean;
  deletingExpenseId?: string | null;
  updatingExpenseId?: string | null;
}

export default function EditExpenseModal({
  isOpen,
  onClose,
  date,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
  addingLoading = false,
  deletingExpenseId = null,
  updatingExpenseId = null,
}: EditExpenseModalProps) {
  const [newMoney, setNewMoney] = useState('');
  const [newReason, setNewReason] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMoney, setEditMoney] = useState('');
  const [editReason, setEditReason] = useState('');

  const dateExpenses = expenses.filter((exp) => exp.date === date);

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const moneyValue = parseFloat(newMoney);
    if (moneyValue > 0) {
      onAddExpense(moneyValue, newReason, date);
      setNewMoney('');
      setNewReason('');
    }
  };

  const handleStartEdit = (expense: Expense) => {
    setEditingId(expense.id!);
    setEditMoney(expense.money.toString());
    setEditReason(expense.reason || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditMoney('');
    setEditReason('');
  };

  const handleSaveEdit = (id: string) => {
    const moneyValue = parseFloat(editMoney);
    if (moneyValue > 0) {
      onUpdateExpense(id, moneyValue, editReason);
      setEditingId(null);
      setEditMoney('');
      setEditReason('');
    }
  };

  const totalForDate = dateExpenses.reduce((sum, exp) => sum + exp.money, 0);

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
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Expenses - {format(new Date(date), 'MMM dd, yyyy')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Existing Expenses */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Existing Expenses (Total: ₹{totalForDate.toFixed(2)})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dateExpenses.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses for this date</p>
            ) : (
              dateExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  {editingId === expense.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={editMoney}
                          onChange={(e) => setEditMoney(e.target.value)}
                          step="0.01"
                          min="0.01"
                          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Reason (Optional)
                        </label>
                        <input
                          type="text"
                          value={editReason}
                          onChange={(e) => setEditReason(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(expense.id!)}
                          disabled={updatingExpenseId === expense.id}
                          className="flex-1 rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          {updatingExpenseId === expense.id ? (
                            <>
                              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              Saving...
                            </>
                          ) : (
                            'Save'
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={updatingExpenseId === expense.id}
                          className="flex-1 rounded-lg bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          ₹{expense.money.toFixed(2)}
                        </p>
                        {expense.reason && (
                          <p className="text-sm text-gray-600">{expense.reason}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {format(new Date(expense.updatedTime), 'hh:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={() => handleStartEdit(expense)}
                          disabled={deletingExpenseId === expense.id || updatingExpenseId === expense.id}
                          className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id!)}
                          disabled={deletingExpenseId === expense.id || updatingExpenseId === expense.id}
                          className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {deletingExpenseId === expense.id ? (
                            <>
                              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></span>
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Expense */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Add New Expense
          </h3>
          <form onSubmit={handleAddNew} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={newMoney}
                onChange={(e) => setNewMoney(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0.01"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
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
                disabled={addingLoading}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={addingLoading}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
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
