import { Star } from "lucide-react";

export default function CourseRating({ rating = 0, count, className = "" }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  return <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}><span className="inline-flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} className={index < Math.round(value) ? "fill-[#D7A94B] text-[#D7A94B]" : "text-foreground-secondary"} />)}</span><span className="font-medium text-foreground-secondary ">{value.toFixed(1)}</span>{count != null && <span className="text-xs text-foreground-secondary">({count})</span>}</span>;
}
