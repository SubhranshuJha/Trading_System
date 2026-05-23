import { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../app/api';
import {
  loginCompany,
  loginUser,
} from '../features/auth/authSlice';

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  TrendingUp,
  User,
} from 'lucide-react';

const Login = () => {
  const { role } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');

  const isCompany =
    role === 'company';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const endpoint = isCompany
        ? '/api/auth-company/login'
        : '/api/auth-user/login';

      const { data } = await api.post(endpoint, {
        email,
        password,
      });

      if (isCompany) {
        dispatch(
          loginCompany({
            token: data.token,
            company: data.company || null,
          })
        );
        navigate('/company-profile');
      } else {
        dispatch(
          loginUser({
            token: data.token,
            user: data.user || null,
          })
        );
        navigate('/market');
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden border-r border-slate-800 bg-gradient-to-br from-[#081225] via-[#0b1324] to-[#020617] lg:flex lg:flex-col lg:justify-between">

          {/* GLOW */}
          <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl"></div>

          <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl"></div>

          {/* TOP */}
          <div className="relative z-10 p-10">

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">

                <TrendingUp size={22} />
              </div>

              <div>

                <h1 className="text-xl font-bold">
                  QuantEdge
                </h1>

                <p className="text-xs text-slate-500">
                  Smart Trading Platform
                </p>
              </div>
            </Link>
          </div>

          {/* CENTER */}
          <div className="relative z-10 px-10">

            <div className="max-w-lg">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5">

                <span className="text-xs font-medium text-cyan-300">
                  Advanced Trading Infrastructure
                </span>
              </div>

              <h2 className="mt-6 text-5xl font-bold leading-tight">

                Trade smarter with
                <span className="text-cyan-400">
                  {' '}real-time markets
                </span>
              </h2>

              <p className="mt-6 text-base leading-8 text-slate-400">

                Invest in stocks, participate in IPOs,
                track portfolios and execute trades
                with institutional-grade infrastructure.
              </p>

              {/* FEATURES */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                  <h3 className="font-semibold">
                    Real-Time Trading
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Live market execution with
                    advanced order handling.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                  <h3 className="font-semibold">
                    IPO Marketplace
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Apply and manage IPO investments
                    before listing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="relative z-10 p-10">

            <div className="flex items-center gap-8">

              <div>
                <p className="text-3xl font-bold">
                  ₹12B+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Trading Volume
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  120K+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Active Traders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">

                <TrendingUp size={22} />
              </div>

              <div>

                <h1 className="text-xl font-bold">
                  TradeX
                </h1>

                <p className="text-xs text-slate-500">
                  Smart Trading Platform
                </p>
              </div>
            </div>

            {/* CARD */}
            <div className="rounded-3xl border border-slate-800 bg-[#081225] p-6 sm:p-8">

              {/* TOP */}
              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">

                    {isCompany ? (
                      <Building2
                        size={24}
                        className="text-cyan-300"
                      />
                    ) : (
                      <User
                        size={24}
                        className="text-cyan-300"
                      />
                    )}
                  </div>

                  <div>

                    <h2 className="text-3xl font-bold">
                      {isCompany
                        ? 'Company Login'
                        : 'Welcome Back'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                      {isCompany
                        ? 'Access your company trading dashboard'
                        : 'Login to continue trading'}
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* EMAIL */}
                <div>

                  <label className="mb-2 block text-[11px] uppercase tracking-wide text-slate-500">

                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>

                  <label className="mb-2 block text-[11px] uppercase tracking-wide text-slate-500">

                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-12 text-sm outline-none transition focus:border-cyan-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 text-sm text-slate-400">

                    <input
                      type="checkbox"
                      className="rounded border-slate-700 bg-slate-900"
                    />

                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-sm text-cyan-300 transition hover:text-cyan-200"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  {loading ? 'Logging in...' : 'Login'}

                  <ArrowRight size={18} />
                </button>
                {error ? (
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                ) : null}
              </form>

              {/* FOOTER */}
              <div className="mt-8 border-t border-slate-800 pt-6">

                <p className="text-center text-sm text-slate-500">

                  Don&apos;t have an account?
                  <Link
                    to="/register"
                    className="ml-2 font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Create Account
                  </Link>
                </p>

                <div className="mt-5 flex items-center justify-center gap-3">

                  <Link
                    to="/login/user"
                    className={`rounded-xl px-4 py-2 text-sm transition ${
                      !isCompany
                        ? 'bg-cyan-400 text-slate-950'
                        : 'border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    User
                  </Link>

                  <Link
                    to="/login/company"
                    className={`rounded-xl px-4 py-2 text-sm transition ${
                      isCompany
                        ? 'bg-cyan-400 text-slate-950'
                        : 'border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Company
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
