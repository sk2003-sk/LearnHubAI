import { cn } from "../../utils/cn";

function Card({ children, className, padding = true, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-sm transition-theme",
        padding && "p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
