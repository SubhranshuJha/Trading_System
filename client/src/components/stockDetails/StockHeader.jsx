import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const StockHeader = ({ stock }) => {
  return (
    <div className="flex flex-col gap-8 border-b border-slate-800 pb-6 lg:flex-row lg:items-start lg:justify-between">

      <div>

        <div className="flex items-center gap-3">

          <h1 className="text-4xl font-bold tracking-tight">
            {stock.symbol}
          </h1>

          <div className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400">
            NSE
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-400">
          {stock.companyName}
        </p>

        <div className="mt-6 flex flex-wrap gap-8">

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Open
            </p>

            <p className="mt-1 font-semibold">
              ₹{stock.open}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              High
            </p>

            <p className="mt-1 font-semibold text-green-400">
              ₹{stock.high}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Low
            </p>

            <p className="mt-1 font-semibold text-red-400">
              ₹{stock.low}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Volume
            </p>

            <p className="mt-1 font-semibold">
              {stock.volume}
            </p>
          </div>
        </div>
      </div>

      <div className="text-left lg:text-right">

        <h2 className="text-5xl font-bold">
          ₹{stock.price}
        </h2>

        <div className="mt-3 flex items-center gap-2 lg:justify-end">

          {stock.change > 0 ? (
            <TrendingUp
              size={18}
              className="text-green-400"
            />
          ) : (
            <TrendingDown
              size={18}
              className="text-red-400"
            />
          )}

          <span
            className={`text-base font-semibold ${
              stock.change > 0
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            +{stock.change}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;