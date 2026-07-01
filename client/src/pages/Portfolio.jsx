import { useEffect, useState } from 'react';
import api from '../app/api';
import NavBar from '../components/NavBar';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/user/portfolio');
        setStocks(data.portfolio?.stocks || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load portfolio'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        {loading ? <p className="mt-6 text-slate-400">Loading...</p> : null}
        {!loading && error ? <p className="mt-6 text-red-400">{error}</p> : null}
        {!loading && !error && stocks.length === 0 ? <p className="mt-6 text-slate-400">No holdings yet</p> : null}
        <div className="mt-6 space-y-3">
          {stocks.map((stock) => (
            <div key={stock.stockId?._id || stock.stockId?.symbol} className="rounded-xl border border-slate-800 bg-[#081225] p-4">
              <p className="font-semibold">{stock.stockId?.symbol} - {stock.stockId?.name}</p>
              <p className="text-sm text-slate-400">Qty: {stock.quantity} | Avg: ₹{stock.averagePrice ?? 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
