'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { collection, addDoc, query, getDocs, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Expense } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import ExpenseTable from '@/components/ExpenseTable';
import StatusMessage from '@/components/StatusMessage';
import Login from '@/components/Login';

export default function Home() {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [targetExpense, setTargetExpense] = useState(400);
  const [loading, setLoading] = useState(true);
  const [addingExpense, setAddingExpense] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [updatingExpenseId, setUpdatingExpenseId] = useState<string | null>(null);
  const [deletingDate, setDeletingDate] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);

  // Load target expense from localStorage
  useEffect(() => {
    const savedTarget = localStorage.getItem('targetExpense');
    if (savedTarget) {
      setTargetExpense(parseFloat(savedTarget));
    }
  }, []);

  // Load expenses from Firebase
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const expensesRef = collection(db, 'expenses');
      const q = query(expensesRef, orderBy('updatedTime', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const loadedExpenses: Expense[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedExpenses.push({
          id: doc.id,
          money: data.money,
          updatedTime: data.updatedTime.toDate(),
          reason: data.reason || '',
          date: data.date,
        });
      });
      
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (money: number, reason: string, date: string) => {
    try {
      // Check if expense already exists for this date
      const existingExpense = expenses.find((exp) => exp.date === date);
      if (existingExpense) {
        alert(`An expense already exists for ${format(new Date(date), 'MMM dd, yyyy')}. Please use Edit to add more expenses for this date.`);
        return;
      }
      setAddingExpense(true);
      const now = new Date();
      const expenseData = {
        money,
        reason: reason || '',
        updatedTime: now,
        date,
      };

      const docRef = await addDoc(collection(db, 'expenses'), expenseData);
      
      const newExpense: Expense = {
        id: docRef.id,
        money,
        reason: reason || '',
        updatedTime: now,
        date,
      };

      setExpenses([newExpense, ...expenses]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setAddingExpense(false);
    }
  };

  const handleAddExpenseInEdit = async (money: number, reason: string, date: string) => {
    try {
      setAddingExpense(true);
      const now = new Date();
      const expenseData = {
        money,
        reason: reason || '',
        updatedTime: now,
        date,
      };

      const docRef = await addDoc(collection(db, 'expenses'), expenseData);
      
      const newExpense: Expense = {
        id: docRef.id,
        money,
        reason: reason || '',
        updatedTime: now,
        date,
      };

      setExpenses([newExpense, ...expenses]);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setDeletingExpenseId(id);
      await deleteDoc(doc(db, 'expenses', id));
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleUpdateExpense = async (id: string, money: number, reason: string) => {
    try {
      setUpdatingExpenseId(id);
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, {
        money,
        reason: reason || '',
        updatedTime: new Date(),
      });
      
      setExpenses(expenses.map((exp) => 
        exp.id === id 
          ? { ...exp, money, reason: reason || '', updatedTime: new Date() }
          : exp
      ));
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    } finally {
      setUpdatingExpenseId(null);
    }
  };

  const handleDeleteDate = async (date: string) => {
    if (confirm(`Are you sure you want to delete all expenses for ${format(new Date(date), 'MMM dd, yyyy')}?`)) {
      try {
        setDeletingDate(date);
        const expensesToDelete = expenses.filter((exp) => exp.date === date);
        await Promise.all(
          expensesToDelete.map((exp) => deleteDoc(doc(db, 'expenses', exp.id!)))
        );
        setExpenses(expenses.filter((exp) => exp.date !== date));
      } catch (error) {
        console.error('Error deleting expenses:', error);
        alert('Failed to delete expenses. Please try again.');
      } finally {
        setDeletingDate(null);
      }
    }
  };

  const handleEditDate = (date: string) => {
    setEditDate(date);
    setIsEditModalOpen(true);
  };

  const handleClearAllData = async () => {
    if (expenses.length === 0) {
      alert('No expenses to clear.');
      return;
    }

    if (confirm('Are you sure you want to clear ALL expenses? This action cannot be undone.')) {
      try {
        setClearingAll(true);
        // Delete all expenses from Firebase
        await Promise.all(
          expenses.map((exp) => deleteDoc(doc(db, 'expenses', exp.id!)))
        );
        // Clear the expenses state
        setExpenses([]);
        alert('All expenses have been cleared successfully!');
      } catch (error) {
        console.error('Error clearing expenses:', error);
        alert('Failed to clear expenses. Please try again.');
      } finally {
        setClearingAll(false);
      }
    }
  };

  const handleTargetChange = async (value: number) => {
    setTargetExpense(value);
    localStorage.setItem('targetExpense', value.toString());
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.money, 0);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="mx-auto max-w-4xl px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Daily Money Manager</h1>
          <p className="text-sm text-gray-600">Track your daily expenses and savings</p>
        </div>

        {/* Add Expense Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
              setIsModalOpen(true);
            }}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            + Add Expense
          </button>
        </div>

        {/* Expense Table */}
        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500">
            Loading expenses...
          </div>
        ) : (
          <>
            <ExpenseTable
              expenses={expenses}
              totalExpense={totalExpense}
              targetExpense={targetExpense}
              onEdit={handleEditDate}
              onDelete={handleDeleteDate}
              deletingDate={deletingDate}
            />

            {/* Status Message */}
            <StatusMessage
              expenses={expenses}
              targetExpense={targetExpense}
            />

            {/* Clear All Data Button */}
            {expenses.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleClearAllData}
                  disabled={clearingAll}
                  className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {clearingAll ? (
                    <>
                      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Clearing...
                    </>
                  ) : (
                    <>
                      🗑️ Clear All Data (Start New Month)
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Daily Target Expense Section */}
            <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Daily Target Expense (₹)
                </label>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span>✏️</span> Click to edit
                </span>
              </div>
              <input
                type="number"
                value={targetExpense}
                onChange={(e) => handleTargetChange(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full rounded-lg border-2 border-blue-200 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50"
                placeholder="Enter target amount"
              />
            </div>

            {/* User Info and Logout */}
            <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Logged in as</p>
                  <span className="text-sm font-medium text-gray-800 truncate block max-w-[250px] sm:max-w-none" title={currentUser.email || undefined}>
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="w-full sm:w-auto rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add Expense Modal */}
        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddExpense}
          selectedDate={selectedDate}
          loading={addingExpense}
        />

        {/* Edit Expense Modal */}
        <EditExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          date={editDate}
          expenses={expenses}
          onAddExpense={handleAddExpenseInEdit}
          onDeleteExpense={handleDeleteExpense}
          onUpdateExpense={handleUpdateExpense}
          addingLoading={addingExpense}
          deletingExpenseId={deletingExpenseId}
          updatingExpenseId={updatingExpenseId}
        />
      </div>
    </div>
  );
}
