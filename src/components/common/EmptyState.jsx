import { BookOpen } from "lucide-react";

export default function EmptyState({ icon: Icon = BookOpen, title = "Nothing here yet", description, action, className = "" }) {
  return <div className={`rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center   ${className}`}><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-surface-secondary text-brand-secondary "><Icon size={24} /></span><h2 className="mt-4 font-semibold text-foreground ">{title}</h2>{description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary ">{description}</p>}{action && <div className="mt-5 flex justify-center">{action}</div>}</div>;
}
