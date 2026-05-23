import { useEffect, useMemo, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../app/api';
import IpoCard from '../components/ipo/IpoCard';
import IpoFiltersBar from '../components/ipo/IpoFiltersBar';

const Ipo = () => {
  const [activeFilter, setActiveFilter] =
    useState('ALL');
  const [search, setSearch] = useState('');
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/ipo');
        setIpos(data.ipos || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load IPOs'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchIpos();
  }, []);

  const filteredIPOs = useMemo(
    () =>
      ipos.filter((ipo) => {
        const matchesFilter =
          activeFilter === 'ALL'
            ? true
            : ipo.status === activeFilter;
        const companyName =
          ipo.stockId?.name || '';
        const matchesSearch = companyName
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [activeFilter, ipos, search]
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <IpoFiltersBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          search={search}
          onSearchChange={setSearch}
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center text-slate-400">
              Loading IPOs...
            </p>
          ) : null}
          {!loading && error ? (
            <p className="col-span-full text-center text-red-400">
              {error}
            </p>
          ) : null}
          {!loading && filteredIPOs.length === 0 ? (
            <p className="col-span-full text-center text-slate-400">
              No IPOs found
            </p>
          ) : null}
          {filteredIPOs.map((ipo) => (
            <IpoCard key={ipo._id} ipo={ipo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ipo;
