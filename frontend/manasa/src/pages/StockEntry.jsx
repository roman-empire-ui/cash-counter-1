import React, { useEffect, useState, useRef } from 'react';
import {
  getStocks,
  stockEntry,
  deleteStock,
  updateStock,
  calRem,
  getRemAmt,
} from '../services/stockEntry';
import { toast } from 'react-toastify';
import Notification from '../Components/Notification';
import { Trash2, PlusCircle, FilePlus2, Pencil } from 'lucide-react';
import debounce from 'lodash.debounce'

const StockEntry = () => {
  const [date, setDate] = useState('');
  const [distributors, setDistributors] = useState([{ name: '', totalPaid: '' }]);
  const [total, setTotal] = useState(0);
  const [stockList, setStockList] = useState([]);
  const [amountHave, setAmountHave] = useState('');
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const summaryRef = useRef(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    const res = await getStocks();
    if (res.success) {
      const todayEntry = res.data[0];
      if (todayEntry) {
        setStockList([todayEntry]);
        const dayTotal = todayEntry.distributors.reduce(
          (sum, d) => sum + Number(d.totalPaid),
          0
        );
        setTotal(dayTotal);
        const rem = await getRemAmt(todayEntry._id);
        if (rem.success && rem.data) {
          setRemainingAmount(rem.data.remainingAmount);
          setAmountHave(rem.data.amountHave);
        }
      } else {
        setStockList([]);
        setTotal(0);
      }
    } else {
      toast.error('Failed to load stock data');
    }
    setLoading(false);
  };

  const handleDistributorChange = (index, field, value) => {
    const updated = [...distributors];
    updated[index][field] = value;
    setDistributors(updated);
    calculateTotalExpense(updated);
  };

  const addDistributor = () => {
    setDistributors([...distributors, { name: '', totalPaid: '' }]);
  };

  const removeDistributor = (index) => {
    const updated = [...distributors];
    updated.splice(index, 1);
    setDistributors(updated);
    calculateTotalExpense(updated);
  };

  const calculateTotalExpense = (list) => {
    const total = list.reduce((sum, d) => sum + (Number(d.totalPaid) || 0), 0);
    setTotal(total);
  };

  const submitStockEntry = async () => {
    const valid = distributors.filter(d => d.name.trim() && d.totalPaid !== '');
    if (valid.length === 0) {
      toast.error('Add at least one valid supplier.');
      return;
    }

    const response = await stockEntry({ date, distributors: valid });
    if (response.success) {
      toast.success(response.message);
      await fetchStocks();
      setDate('');
      setDistributors([{ name: '', totalPaid: '' }]);
      setTotal(0);
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      toast.error(response.message || 'Error adding stock entry');
    }
  };

  useEffect(() => {
    const debouncedCalc = debounce(async () => {
      const stockEntry = stockList[0];
      const amount = Number(amountHave);
      if (!stockEntry || amountHave === '' || isNaN(amount)) return;

      const expense = stockEntry.totalStockExpenses || 0;
      const rem = amount - expense;
      setRemainingAmount(rem);

      const payload = {
        date: stockEntry.date,
        amountHave: amount,
        stockEntryId: stockEntry._id,
      };

      const res = await calRem(payload);
      if (!res.success) {
        toast.error(res.message || 'Failed to update remaining amount');
      }
    }, 500); // 500ms delay

    debouncedCalc();

    return () => debouncedCalc.cancel(); // cleanup
  }, [amountHave, stockList]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-400">
            📦 Daily Stock Entry
          </h1>
          <span className="text-sm text-gray-400">Track suppliers & expenses with ease</span>
        </header>

        {/* Stock Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 p-3 rounded-md bg-black/30 border border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Total Expense</label>
              <input
                readOnly
                value={`₹${total}`}
                className="w-full mt-1 p-3 rounded-md bg-black/30 border border-gray-700 text-yellow-400 font-bold"
              />
            </div>
          </div>

          {distributors.map((d, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <input
                type="text"
                placeholder={`Supplier ${i + 1}`}
                value={d.name}
                onChange={(e) => handleDistributorChange(i, 'name', e.target.value)}
                className="col-span-5 p-3 rounded-md bg-black/30 border border-gray-700 text-white"
              />
              <input
                type="number"
                placeholder="Amount ₹"
                value={d.totalPaid}
                onChange={(e) => handleDistributorChange(i, 'totalPaid', e.target.value)}
                className="col-span-5 p-3 rounded-md bg-black/30 border border-gray-700 text-white"
              />
              <button
                onClick={() => removeDistributor(i)}
                className="w-10 h-10 bg-gray-600 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={addDistributor}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white"
            >
              <PlusCircle className="w-5 h-5" />
              Add Supplier
            </button>
            <button
              onClick={submitStockEntry}
              className="flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-white text-lg"
            >
              <FilePlus2 className="w-6 h-6" />
              Submit Entry
            </button>
          </div>
        </div>

        {/* Stock Summary */}
        <div ref={summaryRef} className="bg-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">📊 Stock Summary</h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto font-inter">
              <table className="w-full text-sm md:text-base border-collapse text-white">
                <thead>
                  <tr className="bg-purple-800">
                    <th className="p-3 border border-gray-600">Date</th>
                    <th className="p-3 border border-gray-600">Suppliers</th>
                    <th className="p-3 border border-gray-600 text-right">Amount (₹)</th>


                  </tr>
                </thead>
                <tbody>
                  {stockList.map((entry, index) => (
                    <React.Fragment key={index}>
                      {entry.distributors.map((d, i) => (
                        <tr key={i} className="odd:bg-white/5 even:bg-white/10 border-b border-gray-600">
                          {/* Show date only for first distributor row */}
                          {i === 0 ? (
                            <td
                              rowSpan={entry.distributors.length + 1}
                              className="p-3 border border-gray-600 align-top text-sm text-center font-medium"
                            >
                              {entry.date?.split('T')[0]}
                            </td>
                          ) : null}

                          {/* Supplier Name */}
                          <td className="p-3 border-t border-b border-l border-gray-600">
                            <div className="flex justify-between items-center group">
                              <span>{d.name}</span>
                              <div className="hidden group-hover:flex gap-2">
                                <button
                                  onClick={async () => {
                                    const newName = prompt("Edit name:", d.name);
                                    const newAmount = prompt("Edit amount:", d.totalPaid);
                                    if (newName && newAmount !== null) {
                                      const res = await updateStock({
                                        stockId: entry._id,
                                        distributorId: d._id,
                                        name: newName,
                                        totalPaid: Number(newAmount),
                                      });
                                      if (res?.success) {
                                        toast.success("Updated!");
                                        const updatedList = stockList.map((s) =>
                                          s._id === entry._id ? res.stockEntry : s
                                        );
                                        setStockList(updatedList);
                                      } else toast.error("Update failed");
                                    }
                                  }}
                                  className="bg-blue-600 hover:bg-blue-800 w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm("Are you sure to delete?")) {
                                      const res = await deleteStock({
                                        stockId: entry._id,
                                        distributorId: d._id,
                                      });
                                      if (res?.success) {
                                        toast.success("Deleted!");
                                        const updatedList = [...stockList];
                                        updatedList[index] = res.stockEntry;
                                        setStockList(updatedList);
                                      } else {
                                        toast.error("Delete failed");
                                      }
                                    }
                                  }}
                                  className="bg-red-600 hover:bg-red-800 w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-3 border-t border-b border-r border-gray-600 text-right">
                            ₹{d.totalPaid}
                          </td>
                        </tr>
                      ))}

                      {/* Total row per day */}
                      <tr className="bg-black/30">
                        <td className="p-3 border-t border-l border-b border-gray-600 font-semibold text-yellow-300">
                          Total
                        </td>
                        <td className="p-3 border-t border-r border-b border-gray-600 text-right font-semibold text-yellow-300">
                          ₹{entry.totalStockExpenses}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>


              </table>
            </div>
          )}

          {/* Remaining Amount */}
          {stockList.length > 0 && (
            <div className="bg-white/10 mt-6 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-cyan-400">💰 Remaining Amount</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Cash you have"
                  value={amountHave}
                  onChange={(e) => setAmountHave(e.target.value)}
                  className="p-3 rounded-md bg-black/30 border border-gray-700 text-white"
                />
                <input
                  readOnly
                  value={`₹${stockList[0]?.totalStockExpenses || 0}`}
                  className="p-3 rounded-md bg-black/30 border border-gray-700 text-yellow-400 font-bold"
                />
              </div>
              {remainingAmount !== null && (
                <div className="text-green-400 font-bold text-lg">
                  Remaining: ₹{remainingAmount}
                </div>
              )}
            </div>
          )}
        </div>

        <Notification />
      </div>
    </div>
  );
};

export default StockEntry;
