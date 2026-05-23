import { Search } from 'lucide-react';

const FILTERS = [
  'ALL',
  'OPEN',
  'UPCOMING',
  'CLOSED',
];

const IpoFiltersBar = ({
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
}) => {
  return (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => onFilterChange(item)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeFilter === item
                ? 'bg-cyan-400 text-slate-950'
                : 'border border-slate-800 bg-[#081225] text-slate-400 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="relative w-full lg:w-[320px]">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search IPO..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          className="w-full rounded-xl border border-slate-800 bg-[#081225] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-400"
        />
      </div>
    </div>
  );
};

export default IpoFiltersBar;
