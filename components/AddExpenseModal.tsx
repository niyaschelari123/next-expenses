'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (money: number, reason: string, date: string) => void;
  selectedDate: string;
  loading?: boolean;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAdd,
  selectedDate,
  loading = false,
}: AddExpenseModalProps) {
  const [money, setMoney] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(selectedDate);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setMoney('');
      setReason('');
      setDate(selectedDate);
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const moneyValue = parseFloat(money);
    if (moneyValue > 0) {
      onAdd(moneyValue, reason, date);
      // Don't reset or close here - let the parent handle it after successful addition
      // Form will reset when modal reopens
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Add Expense
        </h2>
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
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
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
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
  );
}
