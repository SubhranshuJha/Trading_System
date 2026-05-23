import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../app/api';

import MarketHeader from '../components/market/MarketHeader';
import MarketStats from '../components/market/MarketStats';
import StockTable from '../components/market/StockTable';
import MarketSidebar from '../components/market/MarketSidebar';

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/stock/all');
        setStocks(data.data || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load stocks'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        
        <MarketHeader />

        <MarketStats stocks={stocks} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <StockTable
            stocks={stocks}
            loading={loading}
            error={error}
          />

          <MarketSidebar />
          
        </div>
      </div>
    </div>
  );
};

export default Market;
