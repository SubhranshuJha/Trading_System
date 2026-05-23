const RecentTrades = () => {
  const trades = [
    {
      type: 'BUY',
      price: 2943,
      qty: 12,
      time: '09:32 AM',
    },
    {
      type: 'SELL',
      price: 2938,
      qty: 5,
      time: '09:30 AM',
    },
    {
      type: 'BUY',
      price: 2940,
      qty: 8,
      time: '09:28 AM',
    },
  ];

  return (
    <div className="mt-5 rounded-2xl border border-slate-800 bg-[#081225]">

      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-base font-semibold">
          Recent Trades
        </h2>
      </div>

      <div className="divide-y divide-slate-800">

        {trades.map((trade, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-5 py-4"
          >

            <div>
              <p
                className={`text-sm font-semibold ${
                  trade.type === 'BUY'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {trade.type}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {trade.time}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">
                ₹{trade.price}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Qty: {trade.qty}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;