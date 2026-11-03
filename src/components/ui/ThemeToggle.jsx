import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-surface-secondary p-1 transition-colors",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute size-7 rounded-full bg-surface shadow-sm ring-1 ring-border transition-transform duration-200 ease-out",
          isDark ? "translate-x-7" : "translate-x-0",
        )}
      />
      <span className="relative z-10 flex w-1/2 justify-center">
        <Sun
          size={15}
          className={cn(!isDark ? "text-warning" : "text-foreground-secondary")}
        />
      </span>
      <span className="relative z-10 flex w-1/2 justify-center">
        <Moon
          size={15}
          className={cn(isDark ? "text-brand" : "text-foreground-secondary")}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;
