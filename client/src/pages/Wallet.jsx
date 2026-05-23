import { useEffect, useState } from 'react';
import api from '../app/api';
import NavBar from '../components/NavBar';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/user/balance');
      setBalance(data.balance || 0);
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to load balance'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadBalance = async () => {
      try {
        const { data } = await api.get('/api/user/balance');
        if (isMounted) {
          setBalance(data.balance || 0);
          setMessage('');
          setLoading(false);
        }
      } catch (requestError) {
        if (isMounted) {
          setMessage(
            requestError.response?.data?.message ||
              'Unable to load balance'
          );
          setLoading(false);
        }
      }
    };

    loadBalance();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddFunds = async () => {
    try {
      setMessage('');
      await api.post('/api/funds/add', {
        amount: Number(amount),
      });
      setAmount('');
      setMessage('Funds added successfully');
      fetchBalance();
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to add funds'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">Wallet</h1>
        {loading ? <p className="mt-6 text-slate-400">Loading...</p> : null}
        <p className="mt-4 text-xl">Balance: ₹{balance.toLocaleString()}</p>
        <div className="mt-6 flex max-w-md gap-3">
          <input
            type="number"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2"
            placeholder="Amount"
          />
          <button
            onClick={handleAddFunds}
            className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
          >
            Add Funds
          </button>
        </div>
        {message ? (
          <p className="mt-3 text-sm text-cyan-300">{message}</p>
        ) : null}
      </div>
    </div>
  );
};

export default Wallet;
