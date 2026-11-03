export default function ProgressBar({ value = 0, label, showValue = true, className = "" }) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className={className}>{(label || showValue) && <div className="mb-2 flex items-center justify-between gap-3 text-xs text-foreground-secondary ">{label && <span>{label}</span>}{showValue && <span className="font-semibold text-foreground ">{Math.round(progress)}%</span>}</div>}<div className="h-2 overflow-hidden rounded-full bg-surface-secondary "><div className="h-full rounded-full bg-brand-secondary transition-all" style={{ width: `${progress}%` }} /></div></div>;
}
