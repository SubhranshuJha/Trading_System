const StockTabs = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="overflow-x-auto border-b border-slate-800">

      <div className="flex min-w-max items-center gap-3">

        {[
          'overview',
          'financials',
          'trades',
          'news',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-t-lg px-3 pb-3 pt-2 text-sm capitalize transition ${
              activeTab === tab
                ? 'bg-slate-900 font-medium text-white'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockTabs;