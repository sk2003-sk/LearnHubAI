import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [], className = "" }) {
  return <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-2 text-sm ${className}`}><ol className="flex flex-wrap items-center gap-2">{items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <ChevronRight size={14} className="text-foreground-secondary" />}{item.to && index !== items.length - 1 ? <Link to={item.to} className="text-brand-secondary hover:underline">{item.label}</Link> : <span aria-current={index === items.length - 1 ? "page" : undefined} className="font-medium text-foreground ">{item.label}</span>}</li>)}</ol></nav>;
}
