import { Search } from 'lucide-react';

const MarketHeader = () => {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          QuantEdge Exchange
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Market Overview
        </h1>

        <p className="mt-3 text-slate-400">
          Track market movements, stock prices, and
          trading activity in real time.
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 lg:w-[350px]">
        <Search
          size={18}
          className="text-slate-500"
        />

        <input
          type="text"
          placeholder="Search stocks..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </div>
    </div>
  );
};

export default MarketHeader;