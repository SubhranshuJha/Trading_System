import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  ChartNoAxesColumn,
  Landmark,
  TrendingUp,
  Users,
} from 'lucide-react';

export const CompanyHero = ({
  company,
}) => (
  <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#081225] to-[#0f172a] p-6 sm:p-8">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-500/10 ring-4 ring-cyan-500/10">
          <Building2 size={42} className="text-cyan-300" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">Listed Company</div>
          </div>
          <p className="mt-2 text-sm text-slate-400">{company.symbol} • {company.sector}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:w-[420px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-500">Market Cap</p>
          <h2 className="mt-2 text-2xl font-bold">{company.marketCap}</h2>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-500">Growth</p>
          <h2 className="mt-2 text-2xl font-bold text-green-400">{company.growth}</h2>
        </div>
      </div>
    </div>
  </div>
);

export const CompanyTabs = ({
  activeTab,
  setActiveTab,
}) => (
  <div className="mt-6 flex flex-wrap gap-3">
    {['overview', 'trades', 'analytics', 'ipo'].map((tab) => (
      <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-5 py-3 text-sm font-medium capitalize transition ${activeTab === tab ? 'bg-cyan-400 text-slate-950' : 'border border-slate-800 bg-[#081225] text-slate-400 hover:text-white'}`}>
        {tab}
      </button>
    ))}
  </div>
);

export const CompanyTradesSection = ({ trades }) => (
  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-[#081225]"><div className="border-b border-slate-800 px-6 py-5"><h2 className="text-2xl font-bold">Recent Trades</h2></div><div className="divide-y divide-slate-800">{trades.map((trade, index) => (<div key={index} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-3"><div className={`rounded-full px-3 py-1 text-xs font-medium ${trade.type === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{trade.type}</div><h3 className="font-semibold">{trade.quantity} Shares</h3></div><p className="mt-2 text-sm text-slate-500">{trade.time}</p></div><div className="text-right"><p className="text-sm text-slate-500">Trade Price</p><h3 className="mt-1 text-xl font-bold">₹{trade.price}</h3></div></div>))}</div></div>
);

export const CompanyAnalyticsSection = () => (
  <div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-slate-800 bg-[#081225] p-6"><div className="flex items-center gap-3"><BarChart3 size={24} className="text-cyan-300" /><h2 className="text-2xl font-bold">Investor Growth</h2></div><div className="mt-8"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">Monthly Growth</p><p className="font-semibold">78%</p></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[78%] rounded-full bg-cyan-400"></div></div></div></div><div className="rounded-3xl border border-slate-800 bg-[#081225] p-6"><div className="flex items-center gap-3"><ChartNoAxesColumn size={24} className="text-green-400" /><h2 className="text-2xl font-bold">Trade Activity</h2></div><div className="mt-8"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">Engagement</p><p className="font-semibold">64%</p></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[64%] rounded-full bg-green-400"></div></div></div></div></div>
);

export const CompanyIpoSection = ({ ipo, navigate }) => (
  <div className="mt-6 rounded-3xl border border-slate-800 bg-[#081225] p-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">IPO Management</h2><p className="mt-1 text-sm text-slate-500">Manage public offering</p></div><button onClick={() => navigate('/company/ipo')} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Manage IPO</button></div><div className="mt-6 grid gap-4 sm:grid-cols-4">{[{k:'Status',v:ipo.status,c:'text-green-400'},{k:'Subscription',v:ipo.subscribed,c:'text-cyan-300'},{k:'Issue Size',v:ipo.issueSize,c:''},{k:'Applications',v:ipo.applications,c:''}].map((it)=> <div key={it.k} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-500">{it.k}</p><h3 className={`mt-2 text-xl font-bold ${it.c}`}>{it.v}</h3></div>)}</div><div className="mt-6 grid gap-4 sm:grid-cols-3"><button onClick={() => navigate('/company/ipo/create')} className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 py-4 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"><TrendingUp size={18} />Create IPO</button><button onClick={() => navigate('/company/ipo')} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 py-4 text-sm font-medium transition hover:border-cyan-400/30"><Activity size={18} />Update IPO</button><button className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-4 text-sm font-medium text-red-400 transition hover:bg-red-500/20"><Bell size={18} />Close IPO</button></div></div>
);

export const CompanyOverviewSection = ({
  company,
  stock,
  navigate,
}) => (
  <div className="mt-6 space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{k:'Investors',v:company.investors,icon:<Users size={22} className="text-cyan-300" />,bg:'bg-cyan-500/10'},{k:'Total Trades',v:company.totalTrades,icon:<Activity size={22} className="text-green-400" />,bg:'bg-green-500/10'},{k:'Current Price',v:`₹${stock.price}`,icon:<TrendingUp size={22} className="text-purple-400" />,bg:'bg-purple-500/10'},{k:'Volume',v:stock.volume,icon:<Landmark size={22} className="text-yellow-400" />,bg:'bg-yellow-500/10'}].map((s)=> <div key={s.k} className="rounded-3xl border border-slate-800 bg-[#081225] p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">{s.k}</p><h2 className="mt-2 text-2xl font-bold">{s.v}</h2></div><div className={`rounded-2xl ${s.bg} p-3`}>{s.icon}</div></div></div>)}</div><div className="rounded-3xl border border-slate-800 bg-[#081225] p-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Stock Overview</h2><p className="mt-1 text-sm text-slate-500">Real-time company stock metrics</p></div><button onClick={() => navigate('/company/stock')} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">View Public Stock<ArrowUpRight size={16} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-3">{[{k:'Day High',v:`₹${stock.high}`},{k:'Day Low',v:`₹${stock.low}`},{k:'Daily Change',v:stock.change,c:'text-green-400'}].map((it)=> <div key={it.k} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-500">{it.k}</p><h3 className={`mt-2 text-2xl font-bold ${it.c || ''}`}>{it.v}</h3></div>)}</div></div></div>
);
