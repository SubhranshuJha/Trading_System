import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CandlestickChart } from 'lucide-react';

const NavBar = () => {
  const { isAuthenticated, role } = useSelector(
    (state) => state.auth
  );

  const navLinkClass = ({ isActive }) =>
    `transition text-sm font-medium ${
      isActive
        ? 'text-cyan-400'
        : 'text-slate-300 hover:text-cyan-300'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
            <CandlestickChart size={24} />
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
              QuantEdge
            </h1>

            <p className="-mt-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Trading Platform
            </p>
          </div>
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden items-center gap-8 md:flex">
          
          <NavLink to="/market" className={navLinkClass}>
            Market
          </NavLink>

          <NavLink to="/ipo" className={navLinkClass}>
            IPO
          </NavLink>

          {/* USER NAVIGATION */}
          {isAuthenticated && role === 'user' && (
            <>
              <NavLink
                to="/portfolio"
                className={navLinkClass}
              >
                Portfolio
              </NavLink>

              <NavLink
                to="/orders"
                className={navLinkClass}
              >
                Orders
              </NavLink>

              <NavLink
                to="/trades"
                className={navLinkClass}
              >
                Trades
              </NavLink>

              <NavLink
                to="/wallet"
                className={navLinkClass}
              >
                Wallet
              </NavLink>
            </>
          )}

          {/* COMPANY NAVIGATION */}
          {isAuthenticated && role === 'company' && (
            <>
              <NavLink
                to="/company/dashboard"
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/company/ipos"
                className={navLinkClass}
              >
                IPOs
              </NavLink>

              <NavLink
                to="/company/trades"
                className={navLinkClass}
              >
                Trades
              </NavLink>
            </>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          
          {!isAuthenticated ? (
            <>
              <Link
                to="/login/user"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              to={
                role === 'company'
                  ? '/company/dashboard'
                  : '/profile'
              }
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-cyan-500/40"
            >
              {/* AVATAR */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
                {role === 'company' ? 'C' : 'U'}
              </div>

              {/* ACCOUNT INFO */}
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-slate-200">
                  My Account
                </p>

                <p className="text-xs text-slate-500">
                  {role === 'company'
                    ? 'Company Dashboard'
                    : 'Trader Dashboard'}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;