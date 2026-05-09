import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

import {
  ArrowRight,
  CandlestickChart,
  Wallet,
  ShieldCheck,
  Building2,
  TrendingUp,
  Activity,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <NavBar />

      {/* BACKGROUND LIGHTS */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* HERO */}
      <section className="relative border-b border-slate-900">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 py-24 lg:grid-cols-2 lg:items-center">
          
          {/* LEFT */}
          <div>
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <Activity size={15} className="text-cyan-400" />
              Real-Time Trading Infrastructure
            </div>

            {/* HEADING */}
            <h1 className="mt-8 text-5xl font-bold leading-[1.05] md:text-7xl">
              Trade Stocks.
              <br />

              Launch IPOs.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Build Wealth.
              </span>
            </h1>

            {/* DESC */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
              QuantEdge is a modern stock trading and IPO platform
              built for traders, investors, and companies. Execute
              trades, track portfolios, launch IPOs, and manage
              investments through a powerful financial ecosystem.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              
              <Link
                to="/register"
                state={{ role: 'user' }}
                className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Start Trading
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                state={{ role: 'company' }}
                className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Register Company
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-16 flex flex-wrap gap-12">
              
              <div>
                <h2 className="text-3xl font-bold">10K+</h2>

                <p className="mt-1 text-slate-500">
                  Active Traders
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">500+</h2>

                <p className="mt-1 text-slate-500">
                  Listed Companies
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">₹120Cr+</h2>

                <p className="mt-1 text-slate-500">
                  Monthly Volume
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            
            {/* MAIN DASHBOARD */}
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">
              
              {/* TOP BAR */}
              <div className="flex items-center justify-between">
                
                <div>
                  <p className="text-sm text-slate-500">
                    Portfolio Value
                  </p>

                  <h2 className="mt-2 text-4xl font-bold">
                    ₹8,42,120
                  </h2>

                  <p className="mt-2 text-sm font-medium text-green-400">
                    +12.8% this month
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                  <Wallet
                    size={28}
                    className="text-cyan-300"
                  />
                </div>
              </div>

              {/* MINI CHART */}
              <div className="mt-10 h-40 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-800/40 to-slate-900 p-4">
                
                <div className="flex h-full items-end gap-3">
                  
                  <div className="h-[35%] w-full rounded-t bg-cyan-400/60"></div>
                  <div className="h-[55%] w-full rounded-t bg-cyan-400/70"></div>
                  <div className="h-[45%] w-full rounded-t bg-cyan-400/50"></div>
                  <div className="h-[70%] w-full rounded-t bg-cyan-400"></div>
                  <div className="h-[60%] w-full rounded-t bg-cyan-400/80"></div>
                  <div className="h-[82%] w-full rounded-t bg-cyan-300"></div>
                  <div className="h-[75%] w-full rounded-t bg-cyan-400"></div>
                  <div className="h-[95%] w-full rounded-t bg-cyan-300"></div>
                </div>
              </div>

              {/* MARKET SECTION */}
              <div className="mt-8 grid gap-4">
                
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-green-500/10 p-2">
                      <TrendingUp
                        size={18}
                        className="text-green-400"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        RELIANCE
                      </h3>

                      <p className="text-sm text-slate-500">
                        Reliance Industries
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹2,943
                    </p>

                    <p className="text-sm font-medium text-green-400">
                      +2.14%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-500/10 p-2">
                      <TrendingUp
                        size={18}
                        className="rotate-180 text-red-400"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        INFY
                      </h3>

                      <p className="text-sm text-slate-500">
                        Infosys
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹1,812
                    </p>

                    <p className="text-sm font-medium text-red-400">
                      -1.08%
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM GRID */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-500">
                    Open IPO
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">
                    ABC Holdings
                  </h3>

                  <p className="mt-1 text-sm text-cyan-300">
                    ₹90 - ₹110
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-500">
                    Daily Trades
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">
                    24.5K
                  </h3>

                  <p className="mt-1 text-sm text-green-400">
                    +18% today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Platform Features
          </p>

          <h2 className="mt-5 text-4xl font-bold">
            Built for Modern Trading
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Powerful infrastructure for trading, IPO management,
            portfolio tracking, and financial operations.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-slate-700">
            <div className="w-fit rounded-2xl border border-slate-700 bg-slate-800 p-3">
              <CandlestickChart
                size={26}
                className="text-cyan-300"
              />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Trading Engine
            </h3>

            <p className="mt-3 text-slate-400">
              Execute buy and sell orders with efficient order
              matching infrastructure.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-slate-700">
            <div className="w-fit rounded-2xl border border-slate-700 bg-slate-800 p-3">
              <Wallet
                size={26}
                className="text-cyan-300"
              />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Smart Portfolio
            </h3>

            <p className="mt-3 text-slate-400">
              Track holdings, balances, executed trades, and
              portfolio growth.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-slate-700">
            <div className="w-fit rounded-2xl border border-slate-700 bg-slate-800 p-3">
              <Building2
                size={26}
                className="text-cyan-300"
              />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              IPO Platform
            </h3>

            <p className="mt-3 text-slate-400">
              Launch and manage IPOs while connecting directly
              with investors.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-slate-700">
            <div className="w-fit rounded-2xl border border-slate-700 bg-slate-800 p-3">
              <ShieldCheck
                size={26}
                className="text-cyan-300"
              />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Secure System
            </h3>

            <p className="mt-3 text-slate-400">
              JWT authentication, protected financial flows, and
              secure infrastructure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;