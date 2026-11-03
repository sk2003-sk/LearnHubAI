import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(function Textarea({ label, error, className, id, ...props }, ref) {
  const fieldId = id || props.name;
  return <div className="space-y-2">{label && <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">{label}</label>}<textarea ref={ref} id={fieldId} className={cn("min-h-28 w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20", className)} aria-invalid={Boolean(error)} {...props} />{error && <p className="text-xs text-danger">{error}</p>}</div>;
});

export default Textarea;
