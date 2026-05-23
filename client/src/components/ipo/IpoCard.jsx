import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const IpoCard = ({ ipo }) => {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-[#081225] p-5 transition hover:border-cyan-400/30 hover:bg-[#0b162d]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
            <Building2
              size={26}
              className="text-cyan-300"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {ipo.stockId?.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {ipo.stockId?.symbol}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">
          {ipo.status}
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Price Band
          </span>
          <span className="text-sm font-semibold">
            Rs {ipo.priceRange?.min} - Rs{' '}
            {ipo.priceRange?.max}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Lot Size
          </span>
          <span className="text-sm font-semibold">
            {ipo.lotSize}
          </span>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link
          to={`/ipo/${ipo._id}`}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 text-center text-sm font-medium transition hover:bg-slate-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default IpoCard;
