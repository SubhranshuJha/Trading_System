const IpoApplyPanel = ({
  lots,
  onLotsChange,
  estimatedAmount,
  submitting,
  onApply,
  message,
}) => {
  return (
    <div className="lg:col-span-4">
      <div className="rounded-3xl border border-slate-800 bg-[#081225] p-6">
        <label className="mb-2 block text-sm text-slate-400">
          Number of Lots
        </label>
        <input
          type="number"
          min={1}
          value={lots}
          onChange={(event) =>
            onLotsChange(Number(event.target.value))
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <p className="mt-4 text-sm text-slate-400">
          Estimated Amount
        </p>
        <h3 className="mt-1 text-xl font-semibold text-cyan-300">
          Rs {estimatedAmount.toLocaleString()}
        </h3>
        <button
          onClick={onApply}
          disabled={submitting}
          className="mt-5 w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          {submitting ? 'Applying...' : 'Apply for IPO'}
        </button>
        {message ? (
          <p className="mt-3 text-sm text-cyan-300">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default IpoApplyPanel;
