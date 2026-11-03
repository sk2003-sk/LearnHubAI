import { BookOpen, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import ThemeToggle from "../ui/ThemeToggle";

function MarketplaceNavbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={ROUTES.MARKETPLACE} className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen size={22} />
          </div>

          <div>
            <p className="text-lg font-bold text-foreground ">
              LearnHub
            </p>
            <p className="text-[10px] tracking-wide text-foreground-secondary ">
              LEARN. BUILD. GROW.
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to={ROUTES.MARKETPLACE}
            className="hidden text-sm font-medium text-foreground-secondary hover:text-foreground  dark:hover:text-accent sm:inline"
          >
            Explore courses
          </Link>

          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">
                {user?.name ? "Dashboard" : "My dashboard"}
              </span>
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-secondary  "
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>

              <Link
                to={ROUTES.REGISTER}
                className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary dark:bg-accent dark:text-accent-foreground"
              >
                <UserPlus size={16} />
                <span>Sign up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default MarketplaceNavbar;
