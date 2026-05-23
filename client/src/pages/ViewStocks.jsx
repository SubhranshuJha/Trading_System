import { useEffect, useState } from 'react';
import api from '../app/api';
import NavBar from '../components/NavBar';
import {
  ViewStockHero,
  ViewStockLeft,
  ViewStockRight,
} from '../components/viewStock/ViewStockSections';

const ViewStock = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, stockRes, tradesRes] =
          await Promise.all([
            api.get('/api/company/profile'),
            api.get('/api/company/stock-details'),
            api.get('/api/company/trades'),
          ]);

        const profile = profileRes.data.company || {};
        const stockDetails =
          stockRes.data.stockDetails || {};
        const trades = tradesRes.data.trades || [];

        setCompany({
          name: profile.name || '#',
          symbol: profile.symbol || '#',
          sector: '#',
          marketCap:
            typeof stockDetails.totalShares ===
              'number' &&
            typeof stockDetails.currentPrice ===
              'number'
              ? `₹${(
                  stockDetails.totalShares *
                  stockDetails.currentPrice
                ).toLocaleString()}`
              : '#',
          investors: trades.length || '#',
        });

        setStock({
          price:
            stockDetails.currentPrice ?? '#',
          change: '#',
          volume:
            typeof stockDetails.issuedShares ===
            'number'
              ? stockDetails.issuedShares.toLocaleString()
              : '#',
          high: '#',
          low: '#',
          open: '#',
          close: '#',
          marketStatus:
            stockDetails.isActive === true
              ? 'Active'
              : '#',
        });

        setRecentTrades(
          trades.slice(0, 5).map((trade) => ({
            type:
              trade.sellerId?._id === profile._id
                ? 'SELL'
                : 'BUY',
            quantity: trade.quantity || '#',
            price: trade.price || '#',
            time: trade.createdAt
              ? new Date(
                  trade.createdAt
                ).toLocaleString()
              : '#',
          }))
        );
      } catch {
        // keep # placeholders on API failure
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
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
