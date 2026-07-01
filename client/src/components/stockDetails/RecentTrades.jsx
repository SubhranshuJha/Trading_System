import { useEffect, useState } from 'react';
import api from '../../app/api';

const RecentTrades = ({ symbol }) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/user/trades');
        const filtered = (data.trades || []).filter(
          (trade) => !symbol || trade.symbol === symbol
        );
        setTrades(filtered.slice(0, 10));
      } catch {
        setTrades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [symbol]);

  return (
    <div className="mt-5 rounded-2xl border border-slate-800 bg-[#081225]">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-base font-semibold">Recent Trades</h2>
      </div>

      {loading ? (
        <p className="px-5 py-4 text-sm text-slate-500">Loading trades...</p>
      ) : null}

      {!loading && trades.length === 0 ? (
        <p className="px-5 py-4 text-sm text-slate-500">No trades yet</p>
      ) : null}

      <div className="divide-y divide-slate-800">
        {trades.map((trade) => (
          <div
            key={trade._id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-cyan-300">
                {trade.symbol}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(trade.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">₹{trade.price}</p>
              <p className="mt-1 text-xs text-slate-500">
                Qty: {trade.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;
