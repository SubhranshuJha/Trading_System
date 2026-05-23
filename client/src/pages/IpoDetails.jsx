import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../app/api';
import IpoApplyPanel from '../components/ipoDetails/IpoApplyPanel';
import IpoSummaryCard from '../components/ipoDetails/IpoSummaryCard';

const IpoDetails = () => {
  const { id } = useParams();
  const [lots, setLots] = useState(1);
  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    const fetchIpo = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/ipo');
        const selectedIpo = (data.ipos || []).find(
          (item) => item._id === id
        );
        setIpo(selectedIpo || null);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load IPO details'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchIpo();
  }, [id]);

  const totalQuantity = useMemo(
    () => lots * (ipo?.lotSize || 0),
    [ipo?.lotSize, lots]
  );

  const estimatedAmount = useMemo(
    () => totalQuantity * (ipo?.priceRange?.max || 0),
    [ipo?.priceRange?.max, totalQuantity]
  );

  const handleApply = async () => {
    if (!ipo) return;
    try {
      setSubmitting(true);
      setMessage('');
      await api.post(`/api/ipo/${ipo._id}/bid`, {
        quantity: totalQuantity,
        bidPrice: ipo.priceRange?.max,
      });
      setMessage('IPO bid placed successfully');
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to place bid'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="py-16 text-center text-slate-400">
            Loading IPO details...
          </p>
        ) : null}
        {!loading && !ipo ? (
          <p className="py-16 text-center text-slate-400">
            {error || 'IPO not found'}
          </p>
        ) : null}
        {!loading && ipo ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <IpoSummaryCard ipo={ipo} />
            <IpoApplyPanel
              lots={lots}
              onLotsChange={setLots}
              estimatedAmount={estimatedAmount}
              submitting={submitting}
              onApply={handleApply}
              message={message}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IpoDetails;
