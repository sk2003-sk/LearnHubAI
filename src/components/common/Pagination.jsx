import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page = 1, totalPages = 1, onPageChange, className = "" }) {
  const current = Math.max(1, Math.min(page, totalPages || 1));
  return <div className={`flex items-center justify-between gap-3 ${className}`}><p className="text-xs text-foreground-secondary ">Page {current} of {Math.max(1, totalPages)}</p><div className="flex gap-2"><button type="button" onClick={() => onPageChange?.(current - 1)} disabled={current <= 1} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground disabled:opacity-40  "><ChevronLeft size={15} /> Previous</button><button type="button" onClick={() => onPageChange?.(current + 1)} disabled={current >= totalPages} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground disabled:opacity-40  ">Next <ChevronRight size={15} /></button></div></div>;
}
