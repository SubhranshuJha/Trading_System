import {
  Activity,
  Bell,
  BriefcaseBusiness,
  CreditCard,
  TrendingUp,
  Trophy,
  User,
  Wallet,
} from 'lucide-react';

const formatCurrency = (value) =>
  typeof value === 'number'
    ? `₹${value.toLocaleString()}`
    : '#';

const valueOrHash = (value) =>
  value === undefined || value === null || value === ''
    ? '#'
    : value;

export const UserProfileHeader = ({ user }) => (
  <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#081225] to-[#0f172a] p-6 sm:p-8">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10 ring-4 ring-cyan-500/10">
          <User size={42} className="text-cyan-300" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{valueOrHash(user.name)}</h1>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">{valueOrHash(user.level)}</div>
          </div>
          <p className="mt-2 text-sm text-slate-400">{valueOrHash(user.username)}</p>
          <p className="mt-1 text-sm text-slate-500">Trader ID: {valueOrHash(user.traderId)}</p>
          <p className="mt-1 text-sm text-slate-500">Joined {valueOrHash(user.joined)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:w-[420px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-500">Virtual Wallet</p>
          <h2 className="mt-2 text-2xl font-bold">{formatCurrency(user.walletBalance)}</h2>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-500">Portfolio Value</p>
          <h2 className="mt-2 text-2xl font-bold text-cyan-300">{formatCurrency(user.portfolioValue)}</h2>
        </div>
      </div>
    </div>
  </div>
);

export const UserStats = ({ user }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {[
      { k: 'Holdings', v: valueOrHash(user.holdings), icon: <BriefcaseBusiness size={22} className="text-cyan-300" />, bg: 'bg-cyan-500/10' },
      { k: 'Total P&L', v: valueOrHash(user.pnl), icon: <TrendingUp size={22} className="text-green-400" />, bg: 'bg-green-500/10', c: 'text-green-400' },
      { k: 'Total Trades', v: valueOrHash(user.trades), icon: <Activity size={22} className="text-purple-400" />, bg: 'bg-purple-500/10' },
      { k: 'Trader Rank', v: '#', icon: <Trophy size={22} className="text-yellow-400" />, bg: 'bg-yellow-500/10' },
    ].map((item) => (
      <div key={item.k} className="rounded-3xl border border-slate-800 bg-[#081225] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{item.k}</p>
            <h2 className={`mt-2 text-2xl font-bold ${item.c || ''}`}>{item.v}</h2>
          </div>
          <div className={`rounded-2xl ${item.bg} p-3`}>{item.icon}</div>
        </div>
      </div>
    ))}
  </div>
);

export const UserHoldings = ({ holdings }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#081225]">
    <div className="border-b border-slate-800 px-6 py-5">
      <h2 className="text-2xl font-bold">Portfolio Holdings</h2>
    </div>
    <div className="divide-y divide-slate-800">
      {holdings.map((stock) => (
        <div key={stock.symbol} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{valueOrHash(stock.symbol)}</h3>
            <p className="mt-1 text-sm text-slate-500">Qty: {valueOrHash(stock.quantity)}</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <div><p className="text-xs text-slate-500">Avg Price</p><h4 className="mt-1 font-medium">{formatCurrency(stock.avgPrice)}</h4></div>
            <div><p className="text-xs text-slate-500">Current</p><h4 className="mt-1 font-medium">{formatCurrency(stock.currentPrice)}</h4></div>
            <div><p className="text-xs text-slate-500">P&L</p><h4 className="mt-1 font-medium text-green-400">{valueOrHash(stock.pnl)}</h4></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const UserActivities = ({ activities }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#081225]">
    <div className="border-b border-slate-800 px-6 py-5">
      <h2 className="text-2xl font-bold">Recent Activity</h2>
    </div>
    <div className="divide-y divide-slate-800">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="font-medium">{valueOrHash(activity.title)}</h3>
            <p className="mt-1 text-sm text-slate-500">{valueOrHash(activity.time)}</p>
          </div>
          <p className="font-semibold text-slate-300">{valueOrHash(activity.amount)}</p>
        </div>
      ))}
    </div>
  </div>
);

export const UserSidebar = ({ user }) => (
  <div className="space-y-6 lg:col-span-4">
    <div className="rounded-3xl border border-slate-800 bg-[#081225] p-6">
      <h2 className="text-xl font-semibold">Profile Details</h2>
      <div className="mt-6 space-y-5">
        {[{ k: 'Full Name', v: user.name }, { k: 'Username', v: user.username }, { k: 'Email Address', v: user.email }, { k: 'Trader Level', v: user.level, c: 'text-cyan-300' }].map((item) => (
          <div key={item.k}>
            <p className="text-sm text-slate-500">{item.k}</p>
            <h3 className={`mt-1 font-medium ${item.c || ''}`}>{valueOrHash(item.v)}</h3>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-3xl border border-slate-800 bg-[#081225] p-6">
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <div className="mt-6 space-y-4">
        {[{ t: 'Add Virtual Credits', d: '#', i: <Wallet size={20} className="text-cyan-300" /> }, { t: 'Wallet Settings', d: '#', i: <CreditCard size={20} className="text-cyan-300" /> }, { t: 'Notifications', d: '#', i: <Bell size={20} className="text-cyan-300" /> }].map((action) => (
          <button key={action.t} className="flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-cyan-400/30">
            <div className="rounded-xl bg-cyan-500/10 p-3">{action.i}</div>
            <div className="text-left"><h3 className="font-medium">{action.t}</h3><p className="mt-1 text-xs text-slate-500">{action.d}</p></div>
          </button>
        ))}
      </div>
    </div>
  </div>
);
