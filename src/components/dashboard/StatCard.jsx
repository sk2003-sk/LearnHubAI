function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm  ">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground-secondary ">
            {title}
          </p>
          <p className="mt-3 text-2xl font-bold text-foreground ">
            {value}
          </p>
          {description && (
            <p className="mt-2 text-xs text-foreground-secondary ">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-foreground  dark:text-accent">
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
