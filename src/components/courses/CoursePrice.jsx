export default function CoursePrice({ price, estimatedPrice }) {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return <span className="text-sm text-foreground-secondary">Price unavailable</span>;
  return <span className="inline-flex items-baseline gap-2"><strong className="text-lg font-bold text-foreground dark:text-accent">{amount.toFixed(2)}</strong>{Number(estimatedPrice) > amount && <span className="text-xs text-foreground-secondary line-through">{Number(estimatedPrice).toFixed(2)}</span>}</span>;
}
