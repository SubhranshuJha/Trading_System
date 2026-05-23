import { useState } from 'react';
import api from '../../app/api';

import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import TradeForm from './TradeForm';
import OrderSummary from './OrderSummary';

const TradePanel = ({ stock }) => {
  const [orderType, setOrderType] =
    useState('Market');

  const [tradeSide, setTradeSide] =
    useState('BUY');

  const [quantity, setQuantity] =
    useState(0);

  const [limitPrice, setLimitPrice] =
    useState(2943);
  const [placingOrder, setPlacingOrder] =
    useState(false);
  const [statusMessage, setStatusMessage] =
    useState('');

  const currentPrice =
    orderType === 'Market'
      ? stock.price
      : limitPrice;

  const estimated =
    quantity > 0
      ? quantity * currentPrice
      : 0;

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setStatusMessage('');
      const endpoint =
        tradeSide === 'BUY'
          ? '/api/order/buy'
          : '/api/order/sell';
      await api.post(endpoint, {
        stockSymbol: stock.symbol,
        quantity: Number(quantity),
        price: Number(currentPrice),
        category:
          orderType === 'Market'
            ? 'MARKET'
            : 'LIMIT',
      });
      setStatusMessage(
        `${tradeSide} order placed successfully`
      );
      setQuantity(0);
    } catch (requestError) {
      setStatusMessage(
        requestError.response?.data?.message ||
          'Unable to place order'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-slate-800 bg-[#081225] p-5">

      {/* TOP */}
      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Trade {stock.symbol}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {stock.companyName}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 px-2 py-1">

          <div className="h-2 w-2 rounded-full bg-green-400"></div>

          <span className="text-[11px] font-medium text-green-400">
            OPEN
          </span>
        </div>
      </div>

      {/* BUY SELL */}
      <div className="mt-5 flex gap-2 rounded-xl bg-slate-950 p-1">

        <button
          onClick={() => setTradeSide('BUY')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            tradeSide === 'BUY'
              ? 'bg-green-500 text-white'
              : 'text-slate-500 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Buy
        </button>

        <button
          onClick={() => setTradeSide('SELL')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            tradeSide === 'SELL'
              ? 'bg-red-500 text-white'
              : 'text-slate-500 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      <TradeForm
        quantity={quantity}
        setQuantity={setQuantity}
        orderType={orderType}
        setOrderType={setOrderType}
        limitPrice={limitPrice}
        setLimitPrice={setLimitPrice}
      />

      {/* PRICE CARD */}
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Current Price
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              ₹{stock.price}
            </h3>
          </div>

          <div className="text-right">

            <div className="flex items-center gap-1">

              {stock.change > 0 ? (
                <TrendingUp
                  size={14}
                  className="text-green-400"
                />
              ) : (
                <TrendingDown
                  size={14}
                  className="text-red-400"
                />
              )}

              <span
                className={`text-sm font-medium ${
                  stock.change > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                +{stock.change}%
              </span>
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Today
            </p>
          </div>
        </div>
      </div>

      <OrderSummary estimated={estimated} />

      {/* BUTTON */}
      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder || quantity <= 0}
        className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition ${
          tradeSide === 'BUY'
            ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
            : 'bg-red-500 text-white hover:bg-red-400'
        }`}
      >
        {placingOrder
          ? 'Submitting...'
          : tradeSide === 'BUY'
          ? 'Place Buy Order'
          : 'Place Sell Order'}
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-500">
        Orders are executed based on market liquidity.
      </p>
      {statusMessage ? (
        <p className="mt-2 text-center text-xs text-cyan-300">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
};

export default TradePanel;
