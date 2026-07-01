import { useEffect, useState } from 'react';
import api from '../app/api';
import { getSocket } from '../app/socket';
import NavBar from '../components/NavBar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/api/user/orders');
      setOrders(data.orders || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to load orders'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const handleOrderUpdate = () => {
      fetchOrders();
    };

    socket.on('market:order-updated', handleOrderUpdate);
    socket.on('market:trade-executed', handleOrderUpdate);

    return () => {
      socket.off('market:order-updated', handleOrderUpdate);
      socket.off('market:trade-executed', handleOrderUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        {loading ? <p className="mt-6 text-slate-400">Loading...</p> : null}
        {!loading && error ? <p className="mt-6 text-red-400">{error}</p> : null}
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-slate-800 bg-[#081225] p-4"
            >
              <p className="font-semibold">
                {order.type} {order.symbol}
              </p>
              <p className="text-sm text-slate-400">
                Qty: {order.quantity} | Remaining: {order.remainingQty} | Price:
                ₹{order.price} | Status: {order.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
