import { Bell } from 'lucide-react';

const MarketAlerts = () => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-yellow-500/10 p-2">
          <Bell
            size={18}
            className="text-yellow-400"
          />
        </div>

        <h2 className="text-lg font-semibold">
          Market Alerts
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-sm font-medium text-green-400">
            RELIANCE gained 5.1%
          </p>

          <p className="mt-1 text-xs text-slate-500">
            High buying activity detected
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-sm font-medium text-red-400">
            INFY dropped below ₹1800
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Market volatility increased
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-sm font-medium text-cyan-300">
            ABC IPO opens tomorrow
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Expected strong investor demand
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketAlerts;