import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../app/api';
import ManageIpoCard from '../components/manageIpo/ManageIpoCard';

const ManageIpo = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchCompanyIpos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/company/ipos');
      setIpos(data.ipos || []);
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to load company IPOs'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadIpos = async () => {
      try {
        const { data } = await api.get('/api/company/ipos');
        if (isMounted) {
          setIpos(data.ipos || []);
          setMessage('');
        }
      } catch (requestError) {
        if (isMounted) {
          setMessage(
            requestError.response?.data?.message ||
              'Unable to load company IPOs'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadIpos();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCloseIpo = async (ipoId) => {
    try {
      setMessage('');
      await api.patch(`/api/ipo/${ipoId}/close`);
      setMessage('IPO closed successfully');
      fetchCompanyIpos();
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to close IPO'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-bold">
          Manage IPOs
        </h1>
        {message ? (
          <p className="mt-3 text-sm text-cyan-300">
            {message}
          </p>
        ) : null}
        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-slate-400">
              Loading company IPOs...
            </p>
          ) : null}
          {!loading && ipos.length === 0 ? (
            <p className="text-slate-400">
              No IPOs available
            </p>
          ) : null}
          {ipos.map((ipo) => (
            <ManageIpoCard
              key={ipo._id}
              ipo={ipo}
              onCloseIpo={handleCloseIpo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageIpo;
