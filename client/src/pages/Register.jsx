import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../app/api';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const accountType = location.state?.role || 'user';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    symbol: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint =
        accountType === 'company'
          ? '/api/auth-company/register'
          : '/api/auth-user/register';

      const payload =
        accountType === 'company'
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              symbol: formData.symbol,
              description: formData.description,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            };

      const res = await api.post(endpoint, payload);

      console.log(res.data);

      navigate(
        accountType === 'company'
          ? '/login/company'
          : '/login/user'
      );
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        
        {/* TITLE */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
            QuantEdge
          </h1>

          <h2 className="mt-5 text-2xl font-semibold text-white">
            {accountType === 'company'
              ? 'Register Your Company'
              : 'Create Your Account'}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {accountType === 'company'
              ? 'Launch IPOs and manage your listed company.'
              : 'Start trading and build your investment portfolio.'}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              {accountType === 'company'
                ? 'Company Name'
                : 'Full Name'}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={
                accountType === 'company'
                  ? 'ABC Holdings'
                  : 'John Doe'
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@gmail.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          {/* COMPANY FIELDS */}
          {accountType === 'company' && (
            <>
              
              {/* SYMBOL */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Company Symbol
                </label>

                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  required
                  placeholder="ABC"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 uppercase text-white outline-none transition focus:border-cyan-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell investors about your company..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>
            </>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
          >
            {loading
              ? 'Creating Account...'
              : accountType === 'company'
              ? 'Register Company'
              : 'Create Account'}
          </button>
        </form>

        {/* LOGIN */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to={
              accountType === 'company'
                ? '/login/company'
                : '/login/user'
            }
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
