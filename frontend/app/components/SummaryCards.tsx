

interface SummaryCardsProps {
  monthlyTotal: number;
  monthlyCount: number;
  allTimeTotal: number;
}

export default function SummaryCards({ monthlyTotal, monthlyCount, allTimeTotal }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500 uppercase">This Month's Spend</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">₹{monthlyTotal.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500 uppercase">This Month's Transactions</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{monthlyCount} <span className="text-lg text-gray-400 font-normal">expenses</span></p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
        <h3 className="text-sm font-medium text-gray-500 uppercase">All-Time Spend</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">₹{allTimeTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
