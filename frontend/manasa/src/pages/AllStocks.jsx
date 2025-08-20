import React, { useEffect, useState } from 'react';
import { getStocks } from '../services/stockEntry';
import { toast } from 'react-toastify';

const AllStocks = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await getStocks();
      if (res.success) {
        setAllStocks(res.data);
        setFilteredStocks(res.data);
      } else {
        toast.error(res.message || 'Failed to load stocks');
      }
    };

    fetchStocks();
  }, []);

  // Filter when search changes
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredStocks(allStocks);
    } else {
      const filtered = allStocks.filter(stock =>
        stock.distributors.some(d =>
          d.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredStocks(filtered);
    }
  }, [search, allStocks]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center mb-4">Stock History</h1>

      <input
        type="text"
        placeholder="Search by Distributor Name..."
        className="w-full p-2 mb-4 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-purple-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Distributors</th>
            <th className="border p-2">Amounts (₹)</th>
            <th className="border p-2">Total Expense</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">No matching records found.</td>
            </tr>
          ) : (
            filteredStocks.map((entry, i) => (
              <tr key={i} className="text-center border-t">
                <td className="border p-2">{entry.date?.split('T')[0]}</td>
                <td className="border p-2">
                  {entry.distributors.map(d => d.name).join(', ')}
                </td>
                <td className="border p-2">
                  {entry.distributors.map(d => `₹${d.totalPaid}`).join(', ')}
                </td>
                <td className="border p-2 text-red-600 font-semibold">₹{entry.totalStockExpenses}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllStocks;
