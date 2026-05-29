import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatShapForChart } from "../utils/chartFormatters";

export default function ShapChart({ contributions, topDrivers }) {
  const data = formatShapForChart(contributions);

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-brand-900">Glass-Box Explainer (SHAP)</h3>
      <p className="mt-1 text-sm text-slate-500">
        Red/orange bars push risk up; green bars are protective. Magnitude =
        impact strength.
      </p>
      {topDrivers?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {topDrivers.map((d) => (
            <span
              key={d}
              className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
            >
              Top driver: {d}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={["auto", "auto"]} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
            <ReferenceLine x={0} stroke="#64748b" />
            <Tooltip
              formatter={(v) => [v.toFixed(4), "SHAP impact"]}
              labelFormatter={(l) => l}
            />
            <Bar dataKey="shap" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-risk-high" /> Increases risk
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-risk-low" /> Lowers risk
        </span>
      </div>
    </div>
  );
}
