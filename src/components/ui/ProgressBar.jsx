import { cn } from "../../utils/cn";

function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = "md",
  color = "brand",
  className,
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colors = {
    brand: "bg-brand",
    accent: "bg-accent",
    success: "bg-success",
    danger: "bg-danger",
  };

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-foreground-secondary">Progress</span>
          <span className="font-medium text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-secondary",
          sizes[size] || sizes.md,
          className,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            colors[color] || colors.brand,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
