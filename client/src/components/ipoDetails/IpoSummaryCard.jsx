const IpoSummaryCard = ({ ipo }) => {
  return (
    <div className="space-y-5 lg:col-span-8">
      <div className="rounded-3xl border border-slate-800 bg-[#081225] p-6">
        <h1 className="text-3xl font-bold">
          {ipo.stockId?.name}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {ipo.stockId?.symbol} | {ipo.status}
        </p>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-[#081225] p-6">
        <p className="text-sm text-slate-400">
          Price Band
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          Rs {ipo.priceRange?.min} - Rs{' '}
          {ipo.priceRange?.max}
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          Total Shares: {ipo.totalShares}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Lot Size: {ipo.lotSize}
        </p>
      </div>
    </div>
  );
};

export default IpoSummaryCard;
