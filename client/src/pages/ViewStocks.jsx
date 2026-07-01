import { useEffect, useState } from 'react';
import api from '../app/api';
import NavBar from '../components/NavBar';
import {
  ViewStockHero,
  ViewStockLeft,
  ViewStockRight,
} from '../components/viewStock/ViewStockSections';

const ViewStock = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
  });
  const [stockExists, setStockExists] = useState(false);
  const [company, setCompany] = useState({
    name: '#',
    symbol: '#',
    sector: '#',
    marketCap: '#',
    investors: '#',
  });
  const [stock, setStock] = useState({
    price: '#',
    change: '#',
    volume: '#',
    high: '#',
    low: '#',
    open: '#',
    close: '#',
    marketStatus: '#',
  });
  const [recentTrades, setRecentTrades] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage('');

      const [profileRes, stockRes, tradesRes] =
        await Promise.allSettled([
          api.get('/api/company/profile'),
          api.get('/api/company/stock-details'),
          api.get('/api/company/trades'),
        ]);

      if (profileRes.status === 'rejected') {
        throw profileRes.reason;
      }

      if (tradesRes.status === 'rejected') {
        throw tradesRes.reason;
      }

      const profile = profileRes.value.data.company || {};
      const trades = tradesRes.value.data.trades || [];
      const stockDetails =
        stockRes.status === 'fulfilled'
          ? stockRes.value.data.stockDetails || null
          : stockRes.reason?.response?.status === 404
            ? null
            : (() => {
                throw stockRes.reason;
              })();

      setStockExists(Boolean(stockDetails));
      setFormData((current) => ({
        ...current,
        name: current.name || profile.name || '',
      }));

      setCompany({
        name: profile.name || '#',
        symbol: profile.symbol || '#',
        sector: '#',
        marketCap:
          stockDetails &&
          typeof stockDetails.totalShares === 'number' &&
          typeof stockDetails.currentPrice === 'number'
            ? `₹${(
                stockDetails.totalShares * stockDetails.currentPrice
              ).toLocaleString()}`
            : '#',
        investors: trades.length || '#',
      });

      setStock({
        price: stockDetails?.currentPrice ?? '#',
        change: '#',
        volume:
          typeof stockDetails?.issuedShares === 'number'
            ? stockDetails.issuedShares.toLocaleString()
            : '#',
        high: '#',
        low: '#',
        open: '#',
        close: '#',
        marketStatus: stockDetails?.isActive === true ? 'Active' : '#',
      });

      setRecentTrades(
        trades.slice(0, 5).map((trade) => ({
          type: trade.sellerId?._id === profile._id ? 'SELL' : 'BUY',
          quantity: trade.quantity || '#',
          price: trade.price || '#',
          time: trade.createdAt
            ? new Date(trade.createdAt).toLocaleString()
            : '#',
        }))
      );
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to load company stock'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStock = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setMessage('');

      await api.post('/api/stock/create', {
        name: formData.name.trim(),
        quantity: Number(formData.quantity),
      });

      setMessage('Stock created successfully');
      await fetchData();
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to create stock'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {!loading && !stockExists ? (
          <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-amber-100">
            <h2 className="text-xl font-semibold">No stock found yet</h2>
            <p className="mt-2 text-sm text-amber-50/80">
              Creating the company does not create a tradable stock record.
              Create the stock here first, then you can create an IPO.
            </p>

            <form
              onSubmit={handleCreateStock}
              className="mt-5 grid gap-4 rounded-2xl border border-amber-500/20 bg-slate-950/60 p-4 md:grid-cols-3"
            >
              <label className="text-sm text-slate-300 md:col-span-2">
                Stock Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Auto-filled from company name"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                />
              </label>

              <label className="text-sm text-slate-300">
                Total Shares
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                />
              </label>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {creating ? 'Creating Stock...' : 'Create Stock'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {message ? (
          <p className="mb-4 text-sm text-cyan-300">{message}</p>
        ) : null}

        <ViewStockHero
          company={company}
          stock={stock}
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <ViewStockLeft
            stock={stock}
            recentTrades={recentTrades}
          />
          <ViewStockRight
            company={company}
            stock={stock}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewStock;
