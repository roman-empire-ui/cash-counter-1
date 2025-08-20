import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Loader2 } from 'lucide-react';
import { getInitialCount } from '../services/cashCounter';

const InitialCash = () => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCash = async () => {
      setLoading(true);
      const initialCash = await getInitialCount();
      
      console.log(initialCash);
      if (initialCash) setInitial(initialCash?.data?.initialCash);
      setLoading(false);
    };
    fetchCash();
  }, []);

  return (
    <div className="px-4 py-6 sm:px- bg-purple-500 lg:px-8 max-w-2xl mx-auto ">
      <div className="bg-purple-400 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {`Initial Cash for Today (${initial?.date.split('T')[0] })` }
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-purple-500" size={24} />
          </div>
        ) : initial ? (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-white">Notes:</h3>
                {initial.notes.map((note) => (
                  <div key={note.denomination} className="flex justify-between text-sm text-white border-b py-1">
                    <span>₹{note.denomination} × {note.count}</span>
                    <span>= ₹{note.total}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-lg text-white">Coins:</h3>
                {initial.coins.map((coin) => (
                  <div key={coin.denomination} className="flex justify-between text-sm text-white border-b py-1">
                    <span>₹{coin.denomination} × {coin.count}</span>
                    <span>= ₹{coin.total}</span>
                  </div>
                ))}
              </div>

              <div className="text-right font-bold text-green-700 text-lg mt-4">
                Total: ₹{initial.totalInitialCash}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No initial cash found for today.
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/cash-counter')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition duration-200"
          >
            Back to Cash Counter
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialCash;
