import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LayoutDashboard, LogIn, LogOut, Search, UserPlus } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { usePrimaryNav } from "./usePrimaryNav";
import ThemeToggle from "../ui/ThemeToggle";
import { cn } from "../../utils/cn";

function MarketplaceNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const navItems = usePrimaryNav();
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `${ROUTES.SEARCH}?q=${encodeURIComponent(term)}` : ROUTES.MARKETPLACE);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={ROUTES.MARKETPLACE} className="flex items-center gap-2">
          <img
            src="/images/logo-mark.svg"
            alt=""
            className="size-10 shrink-0"
            aria-hidden="true"
          />

          <span>
            <span className="block text-lg font-bold leading-tight text-foreground">
              LearnHub
            </span>
            <span className="block text-[10px] tracking-wide text-foreground-secondary">
              LEARN. BUILD. GROW.
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-secondary text-foreground"
                    : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground dark:hover:text-accent",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form onSubmit={handleSearch} className="hidden lg:flex">
            <div className="flex h-9 w-40 items-center gap-2 rounded-xl border border-border bg-surface-secondary px-3 focus-within:border-brand-secondary">
              <Search size={15} className="shrink-0 text-foreground-secondary" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses"
                aria-label="Search courses"
                className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-secondary"
              />
            </div>
          </form>

          {isAuthenticated && (
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => navigate(ROUTES.WISHLIST)}
              className="hidden rounded-xl p-2 text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground sm:block"
            >
              <Heart size={19} />
            </button>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-secondary"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to={ROUTES.REGISTER}
                className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
              >
                <UserPlus size={16} />
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default MarketplaceNavbar;
