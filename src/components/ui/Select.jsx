import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Select = forwardRef(function Select({ label, error, options = [], className, id, ...props }, ref) {
  const fieldId = id || props.name;
  return <div className="space-y-2">{label && <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">{label}</label>}<select ref={ref} id={fieldId} className={cn("h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20", className)} aria-invalid={Boolean(error)} {...props}>{options.map((option) => typeof option === "string" ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select>{error && <p className="text-xs text-danger">{error}</p>}</div>;
});

export default Select;
