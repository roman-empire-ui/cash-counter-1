import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { saveRemCash, getRemCash } from "../services/actualCash";
import Notification from "../Components/Notification";

const defaultNotes = [500, 200, 100, 50, 20, 10].map((denom) => ({
  denomination: denom,
  count: 0,
}));

const defaultCoins = [10, 5, 2, 1].map((denom) => ({
  denomination: denom,
  count: 0,
}));

const RemainingCash = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(defaultNotes);
  const [coins, setCoins] = useState(defaultCoins);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const result = await getRemCash();
      if (Array.isArray(result) && result.length > 0) {
        const latest = result[0];
        setDate(new Date(latest.date).toISOString().split("T")[0]);
        setNotes(latest.notes);
        setCoins(latest.coins);
        setRemarks(latest.remarks || "");
      }
    } catch (err) {
      toast.error(err.message || "Failed to load latest remaining cash");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!date) return;
    try {
      setLoading(true);
      const result = await getRemCash(date);
      if (result.data) {
        setNotes(result.data.notes);
        setCoins(result.data.coins);
        setRemarks(result.data.remarks || "");
      } else {
        toast.info("No record found for this date");
      }
    } catch (err) {
      toast.error(err.message || "Error searching remaining cash");
    } finally {
      setLoading(false);
    }
  };

  const handleCountChange = (type, index, value) => {
    const updated = [...(type === "notes" ? notes : coins)];
    updated[index].count = parseInt(value) || 0;
    type === "notes" ? setNotes(updated) : setCoins(updated);
  };

  const calculateTotal = () => {
    return [...notes, ...coins].reduce(
      (sum, item) => sum + item.denomination * item.count,
      0
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { date, notes, coins, remarks };
      const res = await saveRemCash(payload);
      toast.success(res.message);
      fetchLatest();
    } catch (err) {
      toast.error(err.message || "Error saving remaining cash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-white/20 text-center">
        <h2 className="text-2xl font-bold">Remaining Cash (Taken Home)</h2>
      </header>

      {/* Scrollable Body */}
      <main className="flex-1 overflow-y-auto scroll-thin-black px-6 py-4 space-y-6">
        {/* Date + Search */}
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow"
          >
            <Search size={18} /> Search
          </button>
          <button
            onClick={fetchLatest}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white shadow"
          >
            <RefreshCw size={18} /> Latest
          </button>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-3">Notes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {notes.map((note, idx) => (
              <div
                key={note.denomination}
                className="flex flex-col bg-white/10 rounded-lg p-3 items-center text-white"
              >
                <span className="font-medium mb-2">₹{note.denomination}</span>
                <input
                  type="number"
                  value={note.count}
                  onChange={(e) => handleCountChange("notes", idx, e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/20 text-white outline-none border border-white/30 text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coins */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-3">Coins</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coins.map((coin, idx) => (
              <div
                key={coin.denomination}
                className="flex flex-col bg-white/10 rounded-lg p-3 items-center text-white"
              >
                <span className="font-medium mb-2">₹{coin.denomination}</span>
                <input
                  type="number"
                  value={coin.count}
                  onChange={(e) => handleCountChange("coins", idx, e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/20 text-white outline-none border border-white/30 text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm text-indigo-200 mb-2 font-poppins">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3 rounded bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-indigo-400"
            rows={3}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/20 flex items-center justify-between">
        <div className="text-green-400 text-xl font-bold font-mono">
          Total: ₹{calculateTotal()}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-full shadow-lg flex items-center gap-2 font-serif"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </footer>

      <Notification />
    </div>
  );
};

export default RemainingCash;
