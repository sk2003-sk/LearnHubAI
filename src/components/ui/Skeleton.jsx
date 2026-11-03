import { cn } from "../../utils/cn";

function Skeleton({ className, circle = false, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse-soft bg-surface-secondary",
        circle ? "rounded-full" : "rounded-lg",
        className,
      )}
      {...props}
    />
  );
}

export default Skeleton;
