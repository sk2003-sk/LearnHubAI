export default function DashboardSection({ title, description, action, children, className = "" }) {
  return <section className={`space-y-4 ${className}`}><div className="flex flex-wrap items-end justify-between gap-3"><div>{title && <h2 className="text-lg font-semibold text-foreground ">{title}</h2>}{description && <p className="mt-1 text-sm text-foreground-secondary ">{description}</p>}</div>{action}</div>{children}</section>;
}
