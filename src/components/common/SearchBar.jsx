import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search...", className = "", onClear }) {
  return <div className={`relative ${className}`}><Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary" /><input type="search" value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border bg-surface-secondary py-3 pl-11 pr-10 text-sm text-foreground outline-none focus:border-brand-secondary  dark:bg-background " />{value && <button type="button" onClick={() => { onChange?.(""); onClear?.(); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-foreground-secondary hover:bg-surface-secondary " aria-label="Clear search"><X size={15} /></button>}</div>;
}
