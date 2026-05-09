const MarketStats = () => {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Market Index
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          NIFTY 50
        </h2>

        <p className="mt-2 text-sm font-medium text-green-400">
          +1.24%
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Top Gainer
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          RELIANCE
        </h2>

        <p className="mt-2 text-sm font-medium text-green-400">
          +5.12%
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Top Loser
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          INFY
        </h2>

        <p className="mt-2 text-sm font-medium text-red-400">
          -2.08%
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Daily Volume
        </p>

        <h2 className="mt-3 text-2xl font-bold">
          ₹120Cr
        </h2>

        <p className="mt-2 text-sm font-medium text-cyan-300">
          Active Market
        </p>
      </div>
    </div>
  );
};

export default MarketStats;