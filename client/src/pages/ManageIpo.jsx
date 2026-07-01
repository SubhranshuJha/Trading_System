import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../app/api';
import ManageIpoCard from '../components/manageIpo/ManageIpoCard';

const ManageIpo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreateMode =
    location.pathname === '/company/ipo/create';

  const [ipos, setIpos] = useState([]);
  const [companyStock, setCompanyStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    totalShares: '',
    minPrice: '',
    maxPrice: '',
    lotSize: '1',
    startDate: '',
    endDate: '',
  });

  const canCreateIpo =
    Boolean(companyStock) && !companyStock.isListed;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

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
        const [ipoRes, stockRes] = await Promise.allSettled([
          api.get('/api/company/ipos'),
          api.get('/api/company/stock-details'),
        ]);

        if (isMounted) {
          if (ipoRes.status === 'fulfilled') {
            setIpos(ipoRes.value.data.ipos || []);
          }

          if (stockRes.status === 'fulfilled') {
            setCompanyStock(
              stockRes.value.data.stockDetails || null
            );
          } else {
            const statusCode =
              stockRes.reason?.response?.status;
            if (statusCode === 404) {
              setCompanyStock(null);
            } else {
              throw stockRes.reason;
            }
          }

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

  const handleCreateIpo = async (event) => {
    event.preventDefault();

    if (!companyStock?._id) {
      setMessage(
        'Create company stock first before creating an IPO'
      );
      return;
    }

    try {
      setCreating(true);
      setMessage('');

      const payload = {
        stockId: companyStock._id,
        totalShares: Number(formData.totalShares),
        priceRange: {
          min: Number(formData.minPrice),
          max: Number(formData.maxPrice),
        },
        lotSize: Number(formData.lotSize || 1),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await api.post('/api/ipo/create', payload);
      setMessage('IPO created successfully');
      navigate('/company/ipo');
    } catch (requestError) {
      setMessage(
        requestError.response?.data?.message ||
          'Unable to create IPO'
      );
    } finally {
      setCreating(false);
    }
  };

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
          {isCreateMode ? 'Create IPO' : 'Manage IPOs'}
        </h1>
        {message ? (
          <p className="mt-3 text-sm text-cyan-300">
            {message}
          </p>
        ) : null}
        {isCreateMode ? (
          <div className="mt-6 max-w-2xl rounded-2xl border border-slate-800 bg-[#081225] p-5">
            {!companyStock ? (
              <div className="space-y-4">
                <p className="text-slate-300">
                  No stock found for this company. Create stock before creating an IPO.
                </p>
                <Link
                  to="/company/stock"
                  className="inline-block rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  Go To Stock Page
                </Link>
              </div>
            ) : (
              <form onSubmit={handleCreateIpo} className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Stock</p>
                  <p className="mt-1 font-semibold">
                    {companyStock.name} ({companyStock.symbol})
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Total Shares
                    <input
                      type="number"
                      name="totalShares"
                      value={formData.totalShares}
                      onChange={handleChange}
                      min="1"
                      required
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    Lot Size
                    <input
                      type="number"
                      name="lotSize"
                      value={formData.lotSize}
                      onChange={handleChange}
                      min="1"
                      required
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    Min Price
                    <input
                      type="number"
                      name="minPrice"
                      value={formData.minPrice}
                      onChange={handleChange}
                      min="1"
                      required
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    Max Price
                    <input
                      type="number"
                      name="maxPrice"
                      value={formData.maxPrice}
                      onChange={handleChange}
                      min="1"
                      required
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    Start Date
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                    />
                  </label>

                  <label className="text-sm text-slate-300">
                    End Date
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={creating || !canCreateIpo}
                  className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {creating ? 'Creating IPO...' : 'Create IPO'}
                </button>
              </form>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ManageIpo;
