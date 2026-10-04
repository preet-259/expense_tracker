import Link from 'next/link';
import { Category } from '../types';

interface ExpenseFormProps {
  title: string; setTitle: (v: string) => void;
  amount: string; setAmount: (v: string) => void;
  expenseDate: string; setExpenseDate: (v: string) => void;
  paymentMethod: string; setPaymentMethod: (v: string) => void;
  categoryId: string; setCategoryId: (v: string) => void;
  notes: string; setNotes: (v: string) => void;
  categories: Category[];
  isCreatingCategory: boolean; setIsCreatingCategory: (v: boolean) => void;
  newCategoryName: string; setNewCategoryName: (v: string) => void;
  handleQuickCreateCategory: () => void;
  isSavingCategory: boolean;
  isSubmitting: boolean;
  handleSaveExpense: (e: React.FormEvent) => void;
  editingId: number | null;
  formError: string;
  resetForm: () => void;
}

export default function ExpenseForm(props: ExpenseFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {props.editingId ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      {props.formError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{props.formError}</div>}

      <form onSubmit={props.handleSaveExpense} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" required value={props.title} onChange={(e) => props.setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Groceries" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
          <input type="number" step="0.01" required min="0.01" value={props.amount} onChange={(e) => props.setAmount(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="0.00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" required value={props.expenseDate} onChange={(e) => props.setExpenseDate(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Link href="/categories" className="text-xs font-medium text-blue-600 hover:underline">
              Manage Categories
            </Link>
          </div>
          
          {props.isCreatingCategory ? (
            <div className="flex space-x-2">
              <input type="text" value={props.newCategoryName} onChange={(e) => props.setNewCategoryName(e.target.value)} className="flex-1 px-3 py-2 border rounded-md text-sm" placeholder="New category" autoFocus />
              <button type="button" onClick={props.handleQuickCreateCategory} disabled={props.isSavingCategory} className="bg-green-600 text-white px-3 rounded hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                {props.isSavingCategory ? '...' : 'Add'}
              </button>
              <button type="button" onClick={() => props.setIsCreatingCategory(false)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Cancel</button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select required value={props.categoryId} onChange={(e) => props.setCategoryId(e.target.value)} className="flex-1 px-3 py-2 border rounded-md">
                {props.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button type="button" onClick={() => props.setIsCreatingCategory(true)} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200">+ New</button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select required value={props.paymentMethod} onChange={(e) => props.setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded-md">
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea value={props.notes} onChange={(e) => props.setNotes(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={2} />
        </div>

        <div className="flex space-x-3 pt-2">
          <button type="submit" disabled={props.isSubmitting} className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200">
            {props.isSubmitting ? 'Saving...' : (props.editingId ? 'Update Expense' : 'Add Expense')}
          </button>

          {props.editingId && (
            <button type="button" onClick={props.resetForm} disabled={props.isSubmitting} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
