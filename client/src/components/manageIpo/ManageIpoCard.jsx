const ManageIpoCard = ({
  ipo,
  onCloseIpo,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#081225] p-5">
      <h2 className="text-xl font-semibold">
        {ipo.stockId?.name} ({ipo.stockId?.symbol})
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Status: {ipo.status}
      </p>
      <p className="text-sm text-slate-400">
        Price: Rs {ipo.priceRange?.min} - Rs{' '}
        {ipo.priceRange?.max}
      </p>
      <button
        onClick={() => onCloseIpo(ipo._id)}
        disabled={ipo.status === 'CLOSED'}
        className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        Close IPO
      </button>
    </div>
  );
};

export default ManageIpoCard;
