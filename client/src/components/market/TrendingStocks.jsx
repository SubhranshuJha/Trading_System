import { Flame } from 'lucide-react';

const TrendingStocks = () => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-orange-500/10 p-2">
          <Flame
            size={18}
            className="text-orange-400"
          />
        </div>

        <h2 className="text-lg font-semibold">
          Trending Stocks
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div>
            <h3 className="font-semibold">
              TCS
            </h3>

            <p className="text-xs text-slate-500">
              Tata Consultancy
            </p>
          </div>

          <p className="text-sm font-medium text-green-400">
            +2.8%
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div>
            <h3 className="font-semibold">
              HDFC
            </h3>

            <p className="text-xs text-slate-500">
              HDFC Bank
            </p>
          </div>

          <p className="text-sm font-medium text-green-400">
            +1.2%
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div>
            <h3 className="font-semibold">
              SBI
            </h3>

            <p className="text-xs text-slate-500">
              State Bank
            </p>
          </div>

          <p className="text-sm font-medium text-red-400">
            -0.6%
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingStocks;