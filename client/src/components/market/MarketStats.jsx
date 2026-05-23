const MarketStats = ({ stocks = [] }) => {
  const listedStocks = stocks.filter(
    (stock) => stock.isActive
  );

  const topGainer = [...listedStocks].sort(
    (firstStock, secondStock) =>
      (secondStock.currentPrice || 0) -
      (firstStock.currentPrice || 0)
  )[0];

  const topLoser = [...listedStocks].sort(
    (firstStock, secondStock) =>
      (firstStock.currentPrice || 0) -
      (secondStock.currentPrice || 0)
  )[0];

  const totalVolume = listedStocks.reduce(
    (total, stock) =>
      total + (stock.issuedShares || 0),
    0
  );

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Market Index
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {listedStocks.length} Stocks
        </h2>
        <p className="mt-2 text-sm font-medium text-green-400">
          Live Market
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Top Gainer
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {topGainer?.symbol || '--'}
        </h2>
        <p className="mt-2 text-sm font-medium text-green-400">
          Rs {topGainer?.currentPrice ?? 0}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Top Loser
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {topLoser?.symbol || '--'}
        </h2>
        <p className="mt-2 text-sm font-medium text-red-400">
          Rs {topLoser?.currentPrice ?? 0}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-500">
          Daily Volume
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {totalVolume.toLocaleString()}
        </h2>
        <p className="mt-2 text-sm font-medium text-cyan-300">
          Shares Issued
        </p>
      </div>
    </div>
  );
};

export default MarketStats;
