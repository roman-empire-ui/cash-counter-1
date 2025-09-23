import React, { useState } from "react";
import { Loader2, PlusCircle, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import Notification from "../Components/Notification";
import { cashCount } from "../services/cashCounter";
import { useNavigate } from "react-router-dom";

const denominations = {
  notes: [10, 20, 50, 100, 200, 500],
  coins: [1, 2, 5, 10],
};

const CashCounter = () => {
  const [notes, setNotes] = useState(
    denominations.notes.map((d) => ({ denomination: d, count: 0 }))
  );
  const [coins, setCoins] = useState(
    denominations.coins.map((d) => ({ denomination: d, count: 0 }))
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (type, index, value) => {
    const updater = type === "notes" ? setNotes : setCoins;
    const list = type === "notes" ? [...notes] : [...coins];
    list[index].count = Number(value);
    updater(list);
  };

  const total = [...notes, ...coins].reduce(
    (sum, item) => sum + item.denomination * item.count,
    0
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const countCash = await cashCount(notes, coins);
      if (countCash?.success) toast.success(countCash.message);
      else toast.error(countCash?.message || "Something went wrong");
    } catch (err) {
      toast.error("Failed to save initial cash");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderRows = (type, list) =>
    list.map((item, index) => (
      <div
        key={item.denomination}
        className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
      >
        <span className="font-medium text-gray-200">{item.denomination}₹</span>
        <input
          type="number"
          min="0"
          value={item.count}
          onChange={(e) => handleChange(type, index, e.target.value)}
          className="w-24 px-3 py-2 rounded-md text-right bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <span className="text-sm font-semibold text-purple-400">
          {item.denomination * item.count}₹
        </span>
      </div>
    ));

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-black">
      <div className="w-full max-w-3xl bg-gray-900 shadow-xl rounded-2xl p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wallet size={28} className="text-purple-400" />
          <h1 className="text-3xl font-extrabold text-white">
            Opening Balance
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-3 text-lg text-purple-300">Notes</h2>
            <div className="space-y-3">{renderRows("notes", notes)}</div>
          </div>
          <div>
            <h2 className="font-semibold mb-3 text-lg text-purple-300">Coins</h2>
            <div className="space-y-3">{renderRows("coins", coins)}</div>
          </div>
        </div>

        {/* Sticky Total Bar */}
        <div className="sticky bottom-0 mt-10 bg-gray-800 text-white font-bold rounded-xl shadow-lg px-6 py-4 flex justify-between items-center">
          <span className="text-lg">Total</span>
          <span className="text-2xl">₹{total}</span>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex justify-center items-center gap-2 transition-all hover:shadow-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <PlusCircle size={20} />
            )}
            {loading ? "Saving..." : "Save Initial Cash"}
          </button>

          <button
            onClick={() => navigate("/cash-summary")}
            className="w-full py-3 rounded-xl border border-purple-400 text-purple-300 hover:bg-purple-600/20 font-semibold transition-all"
          >
            View Cash Summary
          </button>
        </div>

        <Notification />
      </div>
    </div>
  );
};

export default CashCounter;
