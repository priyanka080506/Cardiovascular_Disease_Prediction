import { riskColor } from "../utils/chartFormatters";

export default function RiskGauge({ percent, label, bmi, modelName }) {
  const color = riskColor(label);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="card flex flex-col items-center text-center">
      <h3 className="mb-4 text-lg font-bold text-brand-900">Risk Assessment</h3>
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {percent}%
          </span>
          <span className="text-xs uppercase tracking-wide text-slate-500">
            CVD risk
          </span>
        </div>
      </div>
      <p
        className="mt-4 rounded-full px-4 py-1 text-sm font-semibold capitalize"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {label} risk
      </p>
      <p className="mt-2 text-sm text-slate-500">
        BMI: <strong>{bmi}</strong> · Model: {modelName}
      </p>
    </div>
  );
}
