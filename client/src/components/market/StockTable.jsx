import StockRow from './StockRow';

const StockTable = ({
  stocks = [],
  loading = false,
  error = '',
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
      
      {/* HEADER */}
      <div className="grid grid-cols-5 border-b border-slate-800 px-6 py-5 text-sm text-slate-500">
        <p>Company</p>

        <p className="text-center">
          Price
        </p>

        <p className="text-center">
          Change
        </p>

        <p className="text-center">
          Volume
        </p>

        <p className="text-right">
          Action
        </p>
      </div>

      {/* ROWS */}
      {loading ? (
        <p className="px-6 py-10 text-center text-slate-400">
          Loading stocks...
        </p>
      ) : null}
      {!loading && error ? (
        <p className="px-6 py-10 text-center text-red-400">
          {error}
        </p>
      ) : null}
      {!loading && !error && stocks.length === 0 ? (
        <p className="px-6 py-10 text-center text-slate-400">
          No stocks found
        </p>
      ) : null}
      {!loading && !error
        ? stocks.map((stock) => (
            <StockRow
              key={stock._id}
              stock={stock}
            />
          ))
        : null}
    </div>
  );
};

export default StockTable;
