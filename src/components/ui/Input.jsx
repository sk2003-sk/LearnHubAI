import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(function Input(
  { label, error, helperText, leftIcon, rightIcon, className, id, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-xl border bg-surface px-3 transition-colors focus-within:border-ring",
          error ? "border-danger" : "border-input",
        )}
      >
        {leftIcon && (
          <span className="shrink-0 text-foreground-secondary">{leftIcon}</span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-foreground-secondary",
            className,
          )}
          {...props}
        />

        {rightIcon && (
          <span className="shrink-0 text-foreground-secondary">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {!error && helperText && (
        <p className="text-xs text-foreground-secondary">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
