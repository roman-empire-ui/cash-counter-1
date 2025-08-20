import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { saveRemCash } from '../services/actualCash';
import Notification from '../Components/Notification';

const defaultNotes = [500, 200, 100, 50, 20, 10].map(denom => ({
  denomination: denom,
  count: 0,
}));

const defaultCoins = [10, 5, 2, 1].map(denom => ({
  denomination: denom,
  count: 0,
}));

const RemainingCash = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(defaultNotes);
  const [coins, setCoins] = useState(defaultCoins);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCountChange = (type, index, value) => {
    const updated = [...(type === 'notes' ? notes : coins)];
    updated[index].count = parseInt(value) || 0;
    type === 'notes' ? setNotes(updated) : setCoins(updated);
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
      const payload = {
        date,
        notes,
        coins,
        remarks,
      };

      const res = await saveRemCash(payload);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || 'Error saving remaining cash');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4 text-center">Remaining Cash (Taken Home)</h2>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white outline-none border border-white/30"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-white mb-2">Notes:</h3>
        {notes.map((note, idx) => (
          <div key={note.denomination} className="flex justify-between items-center mb-1 text-sm">
            <span>₹{note.denomination}</span>
            <input
              type="number"
              value={note.count}
              onChange={(e) => handleCountChange('notes', idx, e.target.value)}
              className="w-24 px-2 py-1 rounded bg-white/20 text-white outline-none border border-white/30"
            />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-white mb-2">Coins:</h3>
        {coins.map((coin, idx) => (
          <div key={coin.denomination} className="flex justify-between items-center mb-1 text-sm">
            <span>₹{coin.denomination}</span>
            <input
              type="number"
              value={coin.count}
              onChange={(e) => handleCountChange('coins', idx, e.target.value)}
              className="w-24 px-2 py-1 rounded bg-white/20 text-white outline-none border border-white/30"
            />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Remarks:</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white outline-none border border-white/30"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-green-400 text-lg font-bold">
          Total: ₹{calculateTotal()}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 transition duration-200 text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
      <Notification/>
    </div>
  );
};

export default RemainingCash;
