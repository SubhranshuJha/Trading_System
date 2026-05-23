import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../app/api';
import StockHeader from '../components/stockDetails/StockHeader';
import StockTabs from '../components/stockDetails/StockTabs';
import PriceChart from '../components/stockDetails/PriceChart';
import StockStats from '../components/stockDetails/StockStats';
import RecentTrades from '../components/stockDetails/RecentTrades';
import TradePanel from '../components/stockDetails/TradePanel';

const StockDetails = () => {
  const { symbol } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/stock/all');
        const foundStock = (data.data || []).find(
          (item) => item.symbol === symbol
        );
        setStock(foundStock || null);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load stock details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [symbol]);

  const viewStock = stock
    ? {
        symbol: stock.symbol,
        companyName: stock.name,
        sector: 'Listed',
        price: stock.currentPrice || 0,
        change: stock.currentPrice > 0 ? 1 : 0,
        marketCap: `${(
          (stock.totalShares || 0) *
          (stock.currentPrice || 0)
        ).toLocaleString()}`,
        volume: (stock.issuedShares || 0).toLocaleString(),
        high: stock.currentPrice || 0,
        low: stock.currentPrice || 0,
        open: stock.currentPrice || 0,
      }
    : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        {loading ? (
          <p className="py-16 text-center text-slate-400">
            Loading stock details...
          </p>
        ) : null}
        {!loading && error ? (
          <p className="py-16 text-center text-red-400">
            {error}
          </p>
        ) : null}
        {!loading && !error && !viewStock ? (
          <p className="py-16 text-center text-slate-400">
            Stock not found
          </p>
        ) : null}
        {!loading && !error && viewStock ? (
          <>
            <StockHeader stock={viewStock} />
            <div className="mt-6 grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <StockTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                {activeTab === 'overview' ? (
                  <>
                    <PriceChart />
                    <StockStats stock={viewStock} />
                    <RecentTrades />
                  </>
                ) : null}
              </div>
              <div className="lg:col-span-4">
                <TradePanel stock={viewStock} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default StockDetails;
