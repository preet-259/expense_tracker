import { Expense, Category } from '../types';

interface ExpenseListProps {
  processedExpenses: Expense[];
  categories: Category[];
  searchTerm: string; setSearchTerm: (v: string) => void;
  filterCategory: string; setFilterCategory: (v: string) => void;
  filterMethod: string; setFilterMethod: (v: string) => void;
  startDate: string; setStartDate: (v: string) => void;
  endDate: string; setEndDate: (v: string) => void;
  sortBy: string; setSortBy: (v: string) => void;
  clearFilters: () => void;
  handleEditClick: (expense: Expense) => void;
  handleDelete: (id: number) => void;
}

export default function ExpenseList(props: ExpenseListProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Filter & Sort */}
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Search & Filter</h2>
          <button onClick={props.clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Search by title..." value={props.searchTerm} onChange={(e) => props.setSearchTerm(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
          <select value={props.filterCategory} onChange={(e) => props.setFilterCategory(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
            <option value="">All Categories</option>
            {props.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={props.filterMethod} onChange={(e) => props.setFilterMethod(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm">
            <option value="">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex space-x-2 col-span-1 md:col-span-2 lg:col-span-2">
            <div className="w-1/2">
              <label className="block text-xs text-gray-500 mb-1">From Date</label>
              <input type="date" value={props.startDate} onChange={(e) => props.setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <div className="w-1/2">
              <label className="block text-xs text-gray-500 mb-1">To Date</label>
              <input type="date" value={props.endDate} onChange={(e) => props.setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sort By</label>
            <select value={props.sortBy} onChange={(e) => props.setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50">
              <option value="date_desc">Expense Date (Newest)</option>
              <option value="date_asc">Expense Date (Oldest)</option>
              <option value="amount_desc">Amount (Highest)</option>
              <option value="amount_asc">Amount (Lowest)</option>
              <option value="created_desc">Recently Created</option>
              <option value="created_asc">Oldest Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* List Output */}
      <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Expense List</h2>
          <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            Showing {props.processedExpenses.length} result(s)
          </span>
        </div>
        
        {props.processedExpenses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 italic">No expenses found matching your criteria.</p>
            <button onClick={props.clearFilters} className="mt-4 text-blue-500 hover:underline">Reset Filters</button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {props.processedExpenses.map((expense) => (
              <div key={expense.id} className="border-b pb-4 flex justify-between items-center hover:bg-gray-50 p-2 rounded transition group">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{expense.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {expense.expense_date} • <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">{expense.category?.name}</span> • {expense.payment_method}
                  </p>
                  {expense.notes && <p className="text-sm text-gray-400 mt-1 italic">"{expense.notes}"</p>}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-gray-900">₹{Number(expense.amount).toFixed(2)}</div>
                  <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => props.handleEditClick(expense)} className="text-blue-500 hover:text-blue-700 text-sm font-medium text-right">Edit</button>
                    <button onClick={() => props.handleDelete(expense.id)} className="text-red-500 hover:text-red-700 text-sm font-medium text-right">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
