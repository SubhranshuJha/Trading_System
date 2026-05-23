import { useEffect, useMemo, useState } from 'react';
import api from '../app/api';
import NavBar from '../components/NavBar';
import {
  UserActivities,
  UserHoldings,
  UserProfileHeader,
  UserSidebar,
  UserStats,
} from '../components/userProfile/UserProfileSections';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        const [profileRes, balanceRes, portfolioRes, tradesRes] =
          await Promise.all([
            api.get('/api/user/profile'),
            api.get('/api/user/balance'),
            api.get('/api/user/portfolio'),
            api.get('/api/user/trades'),
          ]);

        setProfile(profileRes.data.user || null);
        setBalance(
          typeof balanceRes.data.balance === 'number'
            ? balanceRes.data.balance
            : null
        );
        setPortfolio(portfolioRes.data.portfolio?.stocks || []);
        setTrades(tradesRes.data.trades || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load profile data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const holdings = useMemo(
    () =>
      portfolio.map((stock) => ({
        symbol: stock.stockId?.symbol || '#',
        quantity: stock.quantity ?? '#',
        avgPrice: stock.averagePrice ?? '#',
        currentPrice: '#',
        pnl: '#',
      })),
    [portfolio]
  );

  const activities = useMemo(
    () =>
      trades.slice(0, 5).map((trade) => ({
        title:
          trade.symbol && trade.type
            ? `${trade.type} ${trade.symbol}`
            : '#',
        time: trade.createdAt
          ? new Date(trade.createdAt).toLocaleString()
          : '#',
        amount:
          typeof trade.totalAmount === 'number'
            ? `₹${trade.totalAmount.toLocaleString()}`
            : '#',
      })),
    [trades]
  );

  const portfolioValueRaw = portfolio.reduce(
    (sum, stock) =>
      sum +
      ((stock.quantity || 0) * (stock.averagePrice || 0)),
    0
  );

  const user = {
    name: profile?.name || '#',
    username: profile?.email
      ? `@${profile.email.split('@')[0]}`
      : '#',
    email: profile?.email || '#',
    joined: profile?.createdAt
      ? new Date(profile.createdAt).toLocaleDateString()
      : '#',
    traderId: profile?._id
      ? `QE-TR-${profile._id.slice(-4).toUpperCase()}`
      : '#',
    level: '#',
    walletBalance: balance ?? '#',
    portfolioValue:
      portfolio.length > 0
        ? portfolioValueRaw
        : '#',
    pnl: '#',
    holdings:
      typeof portfolio?.length === 'number'
        ? portfolio.length
        : '#',
    trades:
      typeof trades?.length === 'number'
        ? trades.length
        : '#',
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="py-8 text-center text-slate-400">
            Loading profile...
          </p>
        ) : null}
        {!loading && error ? (
          <p className="py-8 text-center text-red-400">
            {error}
          </p>
        ) : null}
        <UserProfileHeader user={user} />
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <UserStats user={user} />
            <UserHoldings holdings={holdings} />
            <UserActivities activities={activities} />
          </div>
          <UserSidebar user={user} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
