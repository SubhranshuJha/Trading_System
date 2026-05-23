const PriceChart = () => {
  return (
    <div className="mt-5 rounded-2xl border border-slate-800 bg-[#081225] p-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Price Movement
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Simulated market activity
          </p>
        </div>

        {/* TIME */}
        <div className="flex items-center gap-2">

          {['1D', '1W', '1M', '1Y'].map(
            (time, index) => (
              <button
                key={time}
                className={`rounded-md px-3 py-1 text-xs transition ${
                  index === 0
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {time}
              </button>
            )
          )}
        </div>
      </div>

      {/* CHART */}
      <div className="mt-5 h-[160px]">

        <svg
          viewBox="0 0 1000 160"
          className="h-full w-full"
        >
          {[40, 80, 120].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="1000"
              y2={y}
              stroke="#1e293b"
            />
          ))}

          <path
            d="
              M0 135
              L100 125
              L200 100
              L300 80
              L400 88
              L500 50
              L600 55
              L700 28
              L800 22
              L900 12
              L1000 5
              L1000 160
              L0 160
              Z
            "
            fill="rgba(34,211,238,0.08)"
          />

          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
            points="
              0,135
              100,125
              200,100
              300,80
              400,88
              500,50
              600,55
              700,28
              800,22
              900,12
              1000,5
            "
          />
        </svg>
      </div>
    </div>
  );
};

export default PriceChart;