import React, { useState } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Notification from '../Components/Notification';
import { cashCount } from '../services/cashCounter';
import {useNavigate} from 'react-router-dom'

const denominations = {
  notes: [10, 20, 50, 100, 200, 500],
  coins: [1, 2, 5, 10],
};

const CashCounter = () => {
  const [notes, setNotes] = useState(denominations.notes.map(d => ({ denomination: d, count: 0 })));
  const [coins, setCoins] = useState(denominations.coins.map(d => ({ denomination: d, count: 0 })));
  const [loading, setLoading] = useState(false);
  const location = useNavigate()

  const handleChange = (type, index, value) => {
    const updater = type === 'notes' ? setNotes : setCoins;
    const list = type === 'notes' ? [...notes] : [...coins];
    list[index].count = Number(value);
    updater(list);
  };

  const total = [...notes, ...coins].reduce(
    (sum, item) => sum + item.denomination * item.count,
    0
  );

  const handleSubmit = async () => {   
    setLoading(true);
    const countCash = await cashCount(notes , coins) 
    if(countCash.success) toast.success(countCash.message)
      else toast.error(countCash.message)
    setLoading(false)
}

  const renderRows = (type, list) =>
    list.map((item, index) => (
      <div key={item.denomination} className="flex items-center mt-3 gap-3">
        <span className="w-14 font-medium text-sm">{item.denomination}₹</span>
        <input
          type="number"
          min="0"  
          value={item.count}
          onChange={(e) => handleChange(type, index, e.target.value)}
          className="w-24 px-2 py-1 border rounded-md text-right"
        />
        <span className="text-white text-sm">= {item.denomination * item.count}₹</span>
      </div>
    ));

  return (
    <div className="max-w-xl mx-auto bg-purple-500 text-white shadow-xl p-6 rounded-xl mt-5">
      <h1 className="text-2xl font-semibold mb-4 text-center">Initial Cash Entry</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2 text-lg">Notes</h2>
          {renderRows('notes', notes, setNotes)}
        </div>
        <div>
          <h2 className="font-semibold mb-2 text-lg">Coins</h2>
          {renderRows('coins', coins, setCoins)}
        </div>
      </div>

      <div className="mt-6 text-right text-lg font-semibold">
        Total: ₹{total}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
        {loading ? 'Saving...' : 'Save Initial Cash'}
      </button>

      <button 
      onClick={()=> location('/initial-cash')}
      className='mt-3 w-full bg-white/50 text-blue-500 py-2 rounded-full hover:bg-blue-600 hover:text-white flex justify-center items-center gap-2'>
              Initial Cash Check
      </button>
      <Notification/>
    </div>
  );
};

export default CashCounter;
