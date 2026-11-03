import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-surface-secondary text-foreground hover:bg-surface-secondary/80",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-secondary",
  ghost: "bg-transparent text-foreground hover:bg-surface-secondary",
  danger: "bg-danger text-white hover:opacity-90",
  accent: "bg-accent text-accent-foreground hover:opacity-90",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "size-10",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    block = false,
    className,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        block && "w-full",
        className,
      )}
      {...props}
    >
      {loading && <LoaderCircle size={17} className="animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
