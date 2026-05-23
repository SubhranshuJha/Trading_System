import {
  Activity,
  BarChart3,
} from 'lucide-react';

const StockStats = ({ stock }) => {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-xl border border-slate-800 bg-[#081225] p-4">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-slate-800 p-2">
            <BarChart3
              size={16}
              className="text-cyan-300"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-500">
              Market Cap
            </p>

            <h3 className="mt-1 text-sm font-semibold">
              {stock.marketCap}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#081225] p-4">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-slate-800 p-2">
            <Activity
              size={16}
              className="text-cyan-300"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-500">
              Volume
            </p>

            <h3 className="mt-1 text-sm font-semibold">
              {stock.volume}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#081225] p-4">

        <p className="text-[10px] uppercase text-slate-500">
          Sector
        </p>

        <h3 className="mt-2 text-sm font-semibold">
          {stock.sector}
        </h3>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#081225] p-4">

        <p className="text-[10px] uppercase text-slate-500">
          Day Range
        </p>

        <h3 className="mt-2 text-sm font-semibold">
          ₹{stock.low} - ₹{stock.high}
        </h3>
      </div>
    </div>
  );
};

export default StockStats;