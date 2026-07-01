import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../app/api';
import NavBar from '../components/NavBar';
import {
  CompanyAnalyticsSection,
  CompanyHero,
  CompanyIpoSection,
  CompanyOverviewSection,
  CompanyTabs,
  CompanyTradesSection,
} from '../components/companyProfile/CompanyProfileSections';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [company, setCompany] = useState({
    name: '#',
    symbol: '#',
    sector: '#',
    marketCap: '#',
    growth: '#',
    investors: '#',
    totalTrades: '#',
  });
  const [stock, setStock] = useState({
    price: '#',
    change: '#',
    volume: '#',
    high: '#',
    low: '#',
  });
  const [trades, setTrades] = useState([]);
  const [ipo, setIpo] = useState({
    status: '#',
    subscribed: '#',
    issueSize: '#',
    applications: '#',
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError('');
        const [profileRes, stockRes, tradesRes, ipoRes] = await Promise.allSettled([
          api.get('/api/company/profile'),
          api.get('/api/company/stock-details'),
          api.get('/api/company/trades'),
          api.get('/api/company/ipos'),
        ]);

        if (profileRes.status === 'rejected') {
          throw profileRes.reason;
        }

        if (tradesRes.status === 'rejected') {
          throw tradesRes.reason;
        }

        if (ipoRes.status === 'rejected') {
          throw ipoRes.reason;
        }

        const profile = profileRes.value.data.company || {};
        const companyTrades = tradesRes.value.data.trades || [];
        const companyIpos = ipoRes.value.data.ipos || [];
        const stockDetails =
          stockRes.status === 'fulfilled'
            ? stockRes.value.data.stockDetails || {}
            : stockRes.reason?.response?.status === 404
              ? {}
              : (() => {
                  throw stockRes.reason;
                })();
        const latestIpo = companyIpos[0];

        setCompany({
          name: profile.name || '#',
          symbol: profile.symbol || '#',
          sector: '#',
          marketCap:
            typeof stockDetails.totalShares === 'number' &&
            typeof stockDetails.currentPrice === 'number'
              ? `₹${(stockDetails.totalShares * stockDetails.currentPrice).toLocaleString()}`
              : '#',
          growth: '#',
          investors: companyTrades.length || '#',
          totalTrades:
            typeof companyTrades.length === 'number'
              ? companyTrades.length.toString()
              : '#',
        });

        setStock({
          price:
            typeof stockDetails.currentPrice === 'number'
              ? stockDetails.currentPrice
              : '#',
          change: '#',
          volume:
            typeof stockDetails.issuedShares === 'number'
              ? stockDetails.issuedShares.toLocaleString()
              : '#',
          high: '#',
          low: '#',
        });

        setTrades(
          companyTrades.slice(0, 10).map((trade) => ({
            type:
              trade.sellerId?._id === profile._id
                ? 'SELL'
                : 'BUY',
            quantity: trade.quantity || '#',
            price: trade.price || '#',
            time: trade.createdAt
              ? new Date(trade.createdAt).toLocaleString()
              : '#',
          }))
        );

        if (latestIpo) {
          setIpo({
            status: latestIpo.status || '#',
            subscribed:
              typeof latestIpo.totalShares === 'number' &&
              latestIpo.totalShares > 0
                ? `${Math.round(((latestIpo.soldShares || 0) / latestIpo.totalShares) * 100)}%`
                : '#',
            issueSize:
              typeof latestIpo.totalShares === 'number' &&
              typeof latestIpo.priceRange?.max === 'number'
                ? `₹${(latestIpo.totalShares * latestIpo.priceRange.max).toLocaleString()}`
                : '#',
            applications:
              typeof latestIpo.soldShares === 'number'
                ? latestIpo.soldShares
                : '#',
          });
        }
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load company data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="py-8 text-center text-slate-400">
            Loading company profile...
          </p>
        ) : null}
        {!loading && error ? (
          <p className="py-8 text-center text-red-400">
            {error}
          </p>
        ) : null}
        <CompanyHero company={company} />
        <CompanyTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {activeTab === 'overview' ? (
          <CompanyOverviewSection
            company={company}
            stock={stock}
            navigate={navigate}
          />
        ) : null}
        {activeTab === 'trades' ? (
          <CompanyTradesSection trades={trades} />
        ) : null}
        {activeTab === 'analytics' ? (
          <CompanyAnalyticsSection />
        ) : null}
        {activeTab === 'ipo' ? (
          <CompanyIpoSection
            ipo={ipo}
            navigate={navigate}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CompanyProfile;
