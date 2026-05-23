const TradeForm = ({
  quantity,
  setQuantity,
  orderType,
  setOrderType,
  limitPrice,
  setLimitPrice,
}) => {
  return (
    <div className="mt-5 space-y-4">

      <div>
        <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-slate-500">
          Quantity
        </label>

        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          placeholder="0"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none transition focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-slate-500">
          Order Type
        </label>

        <select
          value={orderType}
          onChange={(e) =>
            setOrderType(e.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none transition focus:border-cyan-400"
        >
          <option>Market</option>
          <option>Limit</option>
        </select>
      </div>

      {orderType === 'Limit' && (
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-slate-500">
            Limit Price
          </label>

          <input
            type="number"
            value={limitPrice}
            onChange={(e) =>
              setLimitPrice(Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none transition focus:border-cyan-400"
          />
        </div>
      )}
    </div>
  );
};

export default TradeForm;