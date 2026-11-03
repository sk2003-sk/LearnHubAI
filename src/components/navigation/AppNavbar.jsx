import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Heart, LogOut, Menu, Search, UserRound } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROLE_LABELS } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { usePrimaryNav } from "./usePrimaryNav";
import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";
import ThemeToggle from "../ui/ThemeToggle";
import { cn } from "../../utils/cn";

function AppNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = usePrimaryNav();
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `${ROUTES.SEARCH}?q=${encodeURIComponent(term)}` : ROUTES.MARKETPLACE);
  };

  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground md:hidden"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="text-lg font-bold">L</span>
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:block">
            LearnHub
          </span>
        </button>
      </div>

      <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
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
                  : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <form onSubmit={handleSearch} className="hidden xl:flex">
          <div className="flex h-9 w-44 items-center gap-2 rounded-xl border border-border bg-surface-secondary px-3 focus-within:border-brand-secondary">
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

        <button
          type="button"
          aria-label="Wishlist"
          onClick={() => navigate(ROUTES.WISHLIST)}
          className="hidden rounded-xl p-2 text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground sm:block"
        >
          <Heart size={19} />
        </button>

        <ThemeToggle />

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-xl p-2 text-foreground-secondary transition hover:bg-surface-secondary hover:text-foreground"
        >
          <Bell size={19} />
        </button>

        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2">
              <Avatar name={user?.name || user?.email || "User"} size="sm" />
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {user?.name || "My Account"}
              </span>
            </div>
          }
        >
          <div className="min-w-48 space-y-2 p-2">
            <div className="border-b border-border px-2 pb-3">
              <p className="font-semibold text-foreground">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-foreground-secondary">
                {user?.email}
              </p>
              <p className="mt-1 text-xs text-brand">
                {ROLE_LABELS[user?.role] || user?.role}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-surface-secondary"
            >
              <UserRound size={16} />
              Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-danger hover:bg-danger/10"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}

export default AppNavbar;
