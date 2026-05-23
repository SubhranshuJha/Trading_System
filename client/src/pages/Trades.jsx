import { useEffect, useState } from 'react';
import api from '../app/api';
import NavBar from '../components/NavBar';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/user/trades');
        setTrades(data.trades || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load trades'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">Trades</h1>
        {loading ? <p className="mt-6 text-slate-400">Loading...</p> : null}
        {!loading && error ? <p className="mt-6 text-red-400">{error}</p> : null}
        <div className="mt-6 space-y-3">
          {trades.map((trade) => (
            <div key={trade._id} className="rounded-xl border border-slate-800 bg-[#081225] p-4">
              <p className="font-semibold">{trade.symbol}</p>
              <p className="text-sm text-slate-400">Qty: {trade.quantity} | Price: ₹{trade.price} | Amount: ₹{trade.totalAmount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trades;
