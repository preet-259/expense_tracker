export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number | string;
  expense_date: string;
  payment_method: string;
  category: Category;
  notes?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
