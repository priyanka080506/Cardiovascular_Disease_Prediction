export default function HealthRoadmap({ recommendations }) {
  if (!recommendations) return null;
  const { protocol, title, summary, nutrition, fitness, primary_drivers } =
    recommendations;

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="rounded-lg bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">
            {protocol}
          </span>
          <h3 className="mt-2 text-lg font-bold text-brand-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{summary}</p>
        </div>
      </div>
      {primary_drivers?.length > 0 && (
        <p className="mt-3 text-sm text-slate-500">
          Primary causes addressed:{" "}
          <strong className="text-slate-700">{primary_drivers.join(", ")}</strong>
        </p>
      )}
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <ListBlock title="Nutrition Guide" items={nutrition} icon="🥗" />
        <ListBlock title="Fitness Regimen" items={fitness} icon="🏃" />
      </div>
    </div>
  );
}

function ListBlock({ title, items, icon }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <h4 className="font-semibold text-brand-900">
        {icon} {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600">
            <span className="text-brand-500">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
