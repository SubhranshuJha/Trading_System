import NavBar from '../components/NavBar';

import MarketHeader from '../components/market/MarketHeader';
import MarketStats from '../components/market/MarketStats';
import StockTable from '../components/market/StockTable';
import MarketSidebar from '../components/market/MarketSidebar';

const Market = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        
        <MarketHeader />

        <MarketStats />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">

          <StockTable />

          <MarketSidebar />
          
        </div>
      </div>
    </div>
  );
};

export default Market;