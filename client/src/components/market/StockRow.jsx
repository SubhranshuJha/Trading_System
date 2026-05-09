import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const StockRow = ({ stock }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/market/${stock.symbol}`);
  };

  return (
    <div className="grid grid-cols-5 items-center border-b border-slate-800/60 px-6 py-5 transition hover:bg-slate-800/40">
      
      {/* COMPANY */}
      <div>
        <h3 className="font-semibold">
          {stock.symbol}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {stock.companyName}
        </p>
      </div>

      {/* PRICE */}
      <p className="text-center font-medium">
        ₹{stock.price}
      </p>

      {/* CHANGE */}
      <div className="flex items-center justify-center gap-1">
        
        {stock.change > 0 ? (
          <TrendingUp
            size={16}
            className="text-green-400"
          />
        ) : (
          <TrendingDown
            size={16}
            className="text-red-400"
          />
        )}

        <span
          className={`font-medium ${
            stock.change > 0
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {stock.change > 0 ? '+' : ''}
          {stock.change}%
        </span>
      </div>

      {/* VOLUME */}
      <p className="text-center text-slate-400">
        {stock.volume}
      </p>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-700"
        >
          View Details

          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StockRow;