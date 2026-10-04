'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { Expense, Category, User } from '../types';
import SummaryCards from '../components/SummaryCards';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function DashboardPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [expensesRes, categoriesRes, userRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/categories'),
          api.get('/auth/me')
        ]);
        
        setExpenses(expensesRes.data);
        setCategories(categoriesRes.data);
        setUser(userRes.data);
        
        if (categoriesRes.data.length > 0) {
          setCategoryId(categoriesRes.data[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setExpenseDate('');
    setNotes('');
    setEditingId(null);
    setFormError('');
    setIsCreatingCategory(false);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 

    const isDuplicate = expenses.some(exp => 
      exp.id !== editingId && // Ignore the current item if we are editing it
      exp.title.toLowerCase().trim() === title.toLowerCase().trim() &&
      Number(exp.amount) === parseFloat(amount) &&
      exp.expense_date === expenseDate &&
      exp.payment_method === paymentMethod &&
      exp.category.id === parseInt(categoryId)
    );

    if (isDuplicate) {
      const confirmSave = window.confirm(
        'An exact matching expense already exists. Do you still want to save this duplicate?'
      );
      if (!confirmSave) {
        return; 
      }
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        amount: parseFloat(amount),
        expense_date: expenseDate,
        payment_method: paymentMethod,
        category_id: parseInt(categoryId),
        notes,
      };

      if (editingId) {
        const response = await api.patch(`/expenses/${editingId}`, payload);
        setExpenses(expenses.map(exp => exp.id === editingId ? response.data : exp));
      } else {
        const response = await api.post('/expenses', payload);
        setExpenses([response.data, ...expenses]);
      }
      resetForm();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setFormError('');
    setIsSavingCategory(true);
    try {
      const response = await api.post('/categories', { name: newCategoryName });
      setCategories([...categories, response.data]);
      setCategoryId(response.data.id.toString());
      setNewCategoryName('');
      setIsCreatingCategory(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSavingCategory(false); 
    }
  };

  const handleEditClick = (expense: Expense) => {
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setExpenseDate(expense.expense_date);
    setPaymentMethod(expense.payment_method);
    setCategoryId(expense.category.id.toString());
    setNotes(expense.notes || '');
    setEditingId(expense.id);
    setFormError('');
    setIsCreatingCategory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      alert('Failed to delete expense. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterMethod('');
    setStartDate('');
    setEndDate('');
    setSortBy('date_desc');
  };

  // Analytics & Summary Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.expense_date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthlyTotal = currentMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const monthlyCount = currentMonthExpenses.length;
  const allTimeTotal = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Filter & Sort 
  let processedExpenses = [...expenses];
  if (searchTerm) processedExpenses = processedExpenses.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
  if (filterCategory) processedExpenses = processedExpenses.filter(e => e.category.id.toString() === filterCategory);
  if (filterMethod) processedExpenses = processedExpenses.filter(e => e.payment_method === filterMethod);
  if (startDate) processedExpenses = processedExpenses.filter(e => e.expense_date >= startDate);
  if (endDate) processedExpenses = processedExpenses.filter(e => e.expense_date <= endDate);

  processedExpenses.sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime();
    if (sortBy === 'date_asc') return new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime();
    if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
    if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
    if (sortBy === 'created_desc') return b.id - a.id;
    if (sortBy === 'created_asc') return a.id - b.id;
    return 0;
  });

  const top5Recent = [...expenses]
    .sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Expense Dashboard</h1>
          
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <div className="hidden sm:block text-left text-gray-800">
                <p className="text-sm font-semibold">{user?.name}</p>
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link href="/categories" className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-medium transition border-b border-gray-100">
                  Manage Categories
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <SummaryCards 
          monthlyTotal={monthlyTotal} 
          monthlyCount={monthlyCount} 
          allTimeTotal={allTimeTotal} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
          {/* Left Column: Form & Recent 5 */}
          <div className="space-y-6">
            <ExpenseForm
              title={title} setTitle={setTitle}
              amount={amount} setAmount={setAmount}
              expenseDate={expenseDate} setExpenseDate={setExpenseDate}
              paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
              categoryId={categoryId} setCategoryId={setCategoryId}
              notes={notes} setNotes={setNotes}
              categories={categories}
              isCreatingCategory={isCreatingCategory} setIsCreatingCategory={setIsCreatingCategory}
              newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName}
              handleQuickCreateCategory={handleQuickCreateCategory}
              isSavingCategory={isSavingCategory}
              isSubmitting={isSubmitting}
              handleSaveExpense={handleSaveExpense}
              editingId={editingId}
              formError={formError}
              resetForm={resetForm}
            />

            <div className="bg-white p-6 rounded-lg shadow-md hidden lg:block">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">5 Most Recent</h2>
              {top5Recent.length === 0 ? (
                <p className="text-sm text-gray-500">No expenses yet.</p>
              ) : (
                <ul className="space-y-3">
                  {top5Recent.map(exp => (
                    <li key={exp.id} className="flex justify-between text-sm border-b pb-2">
                      <span className="truncate w-3/5 text-gray-700">{exp.title}</span>
                      <span className="font-bold text-gray-900">₹{Number(exp.amount).toFixed(0)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <ExpenseList
            processedExpenses={processedExpenses}
            categories={categories}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            filterCategory={filterCategory} setFilterCategory={setFilterCategory}
            filterMethod={filterMethod} setFilterMethod={setFilterMethod}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            sortBy={sortBy} setSortBy={setSortBy}
            clearFilters={clearFilters}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
