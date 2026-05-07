const Home = () => {

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-black/70">
        <h1 className="text-2xl font-bold tracking-wide">
          Quant<span className="text-indigo-500">Edge</span>
        </h1>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#markets" className="hover:text-white transition">
            Markets
          </a>
          <a href="#about" className="hover:text-white transition">
            About
          </a>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl transition shadow-lg shadow-indigo-500/20">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 md:px-20 py-24 flex flex-col lg:flex-row items-center justify-between gap-14">
        <div className="max-w-2xl z-10">
          <p className="uppercase tracking-[0.3em] text-indigo-400 text-sm mb-5">
            Smart Trading Platform
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Trade Smarter with <br />
            <span className="text-indigo-500">QuantEdge</span>
          </h1>

          <p className="text-gray-400 text-lg mt-8 leading-relaxed max-w-xl">
            A modern MERN-based trading platform with portfolio tracking,
            watchlists, real-time market dashboards, and intelligent trading
            insights.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <button className="bg-indigo-600 hover:bg-indigo-500 px-7 py-3 rounded-2xl text-lg font-semibold transition shadow-xl shadow-indigo-500/30">
              Start Trading
            </button>

            <button className="border border-white/20 hover:border-white/50 px-7 py-3 rounded-2xl text-lg transition">
              Explore Demo
            </button>
          </div>

          <div className="flex gap-10 mt-14 text-sm text-gray-400">
            <div>
              <h2 className="text-3xl font-bold text-white">10K+</h2>
              <p>Transactions</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">500+</h2>
              <p>Active Traders</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">99.9%</h2>
              <p>Secure Platform</p>
            </div>
          </div>
        </div>

        {/* Trading Card */}
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-400 text-sm">Portfolio Balance</p>
                <h2 className="text-4xl font-bold mt-2">₹2,45,320</h2>
              </div>

              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm">
                +12.4%
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="font-semibold">AAPL</h3>
                  <p className="text-gray-400 text-sm">Apple Inc.</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹18,320</p>
                  <p className="text-green-400 text-sm">+5.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="font-semibold">TSLA</h3>
                  <p className="text-gray-400 text-sm">Tesla</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹9,850</p>
                  <p className="text-red-400 text-sm">-1.3%</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <h3 className="font-semibold">NVDA</h3>
                  <p className="text-gray-400 text-sm">NVIDIA</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹27,150</p>
                  <p className="text-green-400 text-sm">+8.7%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-8 md:px-20 py-24 bg-white/[0.02] border-y border-white/5"
      >
        <div className="text-center mb-16">
          <p className="text-indigo-400 uppercase tracking-[0.3em] text-sm">
            Features
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-5">
            Everything You Need to Trade
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:scale-105 transition duration-300">
            <div className="text-5xl mb-5">📈</div>
            <h3 className="text-2xl font-bold mb-4">Live Market Tracking</h3>
            <p className="text-gray-400 leading-relaxed">
              Monitor stocks, trends, and market movements with real-time styled
              dashboards.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:scale-105 transition duration-300">
            <div className="text-5xl mb-5">💼</div>
            <h3 className="text-2xl font-bold mb-4">Portfolio Management</h3>
            <p className="text-gray-400 leading-relaxed">
              Track investments, profits, holdings, and trading history in one
              place.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:scale-105 transition duration-300">
            <div className="text-5xl mb-5">🤖</div>
            <h3 className="text-2xl font-bold mb-4">Smart Insights</h3>
            <p className="text-gray-400 leading-relaxed">
              Analyze trends and trading performance using intelligent insights
              and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-20 py-28 text-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full top-0 left-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            The Future of Trading Starts Here.
          </h2>

          <p className="text-gray-400 text-lg mt-8 leading-relaxed">
            Build your portfolio, monitor markets, and experience a powerful
            modern trading ecosystem with QuantEdge.
          </p>

          <button className="mt-10 bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl text-lg font-semibold transition shadow-2xl shadow-indigo-500/30">
            Launch App
          </button>
        </div>
      </section>
    </div>
  );
}


export default Home