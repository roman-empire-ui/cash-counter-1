import React, { useEffect, useState } from 'react';
import { getStocks, updateStock } from '../services/stockEntry'; // ✅ make sure updateStock is exported here
import { toast } from 'react-toastify';

const AllStocks = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  const [editingDistributor, setEditingDistributor] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', totalPaid: '' });

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

  const handleSave = async (distributor) => {
    const res = await updateStock({
      stockId: selectedStock._id,
      distributorId: distributor._id,
      name: editValues.name,
      totalPaid: editValues.totalPaid,
    });

    if (res.success) {
      toast.success('Distributor updated!');

      // Update state without refetching
      const updatedDistributors = selectedStock.distributors.map(d =>
        d._id === distributor._id ? { ...d, ...editValues } : d
      );
      setSelectedStock({ ...selectedStock, distributors: updatedDistributors });

      // also update list
      const updatedAllStocks = allStocks.map(stock =>
        stock._id === selectedStock._id
          ? { ...stock, distributors: updatedDistributors }
          : stock
      );
      setAllStocks(updatedAllStocks);
      setFilteredStocks(updatedAllStocks);

      setEditingDistributor(null);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="p-6 min-h-screen font-inter bg-black text-white">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-400 tracking-wide drop-shadow-lg">
        📊 Stock History
      </h1>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by Distributor Name..."
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                     border border-white/20 shadow-inner
                     focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stock Cards */}
      {filteredStocks.length === 0 ? (
        <p className="text-center text-gray-400">No matching records found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredStocks.map((entry, i) => (
            <div
              key={i}
              onClick={() => setSelectedStock(entry)}
              className="cursor-pointer p-6 rounded-3xl
                         bg-gradient-to-br from-purple-900/50 to-purple-700/30
                         border border-purple-500/30 shadow-lg 
                         hover:shadow-purple-500/40 hover:scale-[1.03]
                         transition-all duration-300 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                {entry.date?.split('T')[0]}
              </h2>
              <p className="text-gray-300">
                <span className="font-medium">Distributors:</span>{' '}
                {entry.distributors.map((d) => d.name).join(', ')}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Amounts:</span>{' '}
                {entry.distributors.map((d) => `₹${d.totalPaid}`).join(', ')}
              </p>
              <p className="text-red-400 font-bold mt-3 text-lg">
                Total: ₹{entry.totalStockExpenses}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedStock(null)}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-2xl mx-4 
                       bg-gradient-to-br from-gray-900/90 to-gray-800/90 
                       backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/30
                       p-8 transform transition-all duration-300 scale-95 animate-fadeIn"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStock(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white 
                         transition-colors duration-200 text-2xl"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold text-purple-300 mb-6 drop-shadow">
              📦 Stock Details
            </h2>

            {/* Stock Info */}
            <p className="text-gray-300 mb-4 text-lg">
              <span className="font-semibold">Date:</span>{' '}
              {selectedStock.date?.split('T')[0]}
            </p>

            {/* Distributor List */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scroll">
              {selectedStock.distributors.map((d, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl 
                             bg-gradient-to-r from-purple-700/30 to-purple-500/20
                             border border-purple-400/20 shadow-md 
                             hover:shadow-purple-400/30 transition-all duration-300"
                >
                  {editingDistributor === d._id ? (
                    <>
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues({ ...editValues, name: e.target.value })
                        }
                        className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
                      />
                      <input
                        type="number"
                        value={editValues.totalPaid}
                        onChange={(e) =>
                          setEditValues({ ...editValues, totalPaid: e.target.value })
                        }
                        className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(d)}
                          className="px-3 py-1 bg-green-600 rounded-lg text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDistributor(null)}
                          className="px-3 py-1 bg-gray-500 rounded-lg text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-white">{d.name}</p>
                      <p className="text-gray-300 mt-1">
                        <span className="font-medium">Paid:</span> ₹{d.totalPaid}
                      </p>
                      <button
                        onClick={() => {
                          setEditingDistributor(d._id);
                          setEditValues({ name: d.name, totalPaid: d.totalPaid });
                        }}
                        className="mt-2 px-3 py-1 bg-blue-600 rounded-lg text-white"
                      >
                        ✏️ Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-purple-500/30 pt-4 text-right">
              <p className="text-2xl font-bold text-red-400 drop-shadow">
                Total Expense: ₹{selectedStock.totalStockExpenses}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStocks;
