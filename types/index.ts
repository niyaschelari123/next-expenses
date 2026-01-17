export interface Expense {
  id?: string;
  money: number;
  updatedTime: Date;
  reason?: string;
  date: string; // YYYY-MM-DD format
}

export interface DailyExpense {
  date: string;
  expenses: Expense[];
  totalExpense: number;
  targetExpense: number;
}
