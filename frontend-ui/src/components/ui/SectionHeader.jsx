export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-overline text-slate-500">{eyebrow}</p>
        )}
        <h2 className="text-heading text-ink">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-body text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
