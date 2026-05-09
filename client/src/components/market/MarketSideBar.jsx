import MarketAlerts from './MarketAlerts';
import TrendingStocks from './TrendingStocks';

const MarketSidebar = () => {
  return (
    <div className="space-y-6">
      <MarketAlerts />
      <TrendingStocks />
    </div>
  );
};

export default MarketSidebar;