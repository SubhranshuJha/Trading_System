import StockRow from './StockRow';

const dummyStocks = [
  {
    _id: 1,
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries',
    price: 2943,
    change: 2.14,
    volume: '18.2M',
  },

  {
    _id: 2,
    symbol: 'INFY',
    companyName: 'Infosys',
    price: 1812,
    change: -1.08,
    volume: '9.4M',
  },

  {
    _id: 3,
    symbol: 'TCS',
    companyName: 'Tata Consultancy',
    price: 4120,
    change: 0.84,
    volume: '6.1M',
  },

  {
    _id: 4,
    symbol: 'HDFC',
    companyName: 'HDFC Bank',
    price: 1650,
    change: -0.32,
    volume: '12.7M',
  },

  {
    _id: 5,
    symbol: 'SBIN',
    companyName: 'State Bank of India',
    price: 812,
    change: 1.56,
    volume: '21.5M',
  },

  {
    _id: 6,
    symbol: 'ADANIENT',
    companyName: 'Adani Enterprises',
    price: 3021,
    change: -2.48,
    volume: '14.8M',
  },
];

const StockTable = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
      
      {/* HEADER */}
      <div className="grid grid-cols-5 border-b border-slate-800 px-6 py-5 text-sm text-slate-500">
        <p>Company</p>

        <p className="text-center">
          Price
        </p>

        <p className="text-center">
          Change
        </p>

        <p className="text-center">
          Volume
        </p>

        <p className="text-right">
          Action
        </p>
      </div>

      {/* ROWS */}
      {dummyStocks.map((stock) => (
        <StockRow
          key={stock._id}
          stock={stock}
        />
      ))}
    </div>
  );
};

export default StockTable;