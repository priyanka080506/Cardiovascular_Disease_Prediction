import { useCallback, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { simulateChanges } from "../utils/api";

export default function SimulationSandbox({ baselineInput, baselineResult }) {
  const [mods, setMods] = useState({
    weight: baselineInput.weight,
    active: baselineInput.active,
    smoke: baselineInput.smoke,
    cholesterol: baselineInput.cholesterol,
    gluc: baselineInput.gluc,
  });
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSim = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const modifications = {};
      if (mods.weight !== baselineInput.weight) modifications.weight = mods.weight;
      if (mods.active !== baselineInput.active) modifications.active = mods.active;
      if (mods.smoke !== baselineInput.smoke) modifications.smoke = mods.smoke;
      if (mods.cholesterol !== baselineInput.cholesterol)
        modifications.cholesterol = mods.cholesterol;
      if (mods.gluc !== baselineInput.gluc) modifications.gluc = mods.gluc;

      const result = await simulateChanges(baselineInput, modifications);
      setSim(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [baselineInput, mods]);

  const compareData = sim
    ? [
        { name: "Current", risk: sim.baseline.risk_percent },
        { name: "If improved", risk: sim.modified.risk_percent },
      ]
    : [];

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-brand-900">What-If Simulation Sandbox</h3>
      <p className="mt-1 text-sm text-slate-500">
        Adjust modifiable habits to see how your risk could decrease. Age stays locked.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Slider
          label={`Weight (kg): ${mods.weight}`}
          min={40}
          max={150}
          value={mods.weight}
          onChange={(v) => setMods((m) => ({ ...m, weight: v }))}
        />
        <Toggle
          label="Physically active"
          checked={mods.active === 1}
          onChange={(c) => setMods((m) => ({ ...m, active: c ? 1 : 0 }))}
        />
        <Toggle
          label="Non-smoker"
          checked={mods.smoke === 0}
          onChange={(c) => setMods((m) => ({ ...m, smoke: c ? 0 : 1 }))}
        />
        <div>
          <label className="label-text">Cholesterol level</label>
          <select
            className="input-field"
            value={mods.cholesterol}
            onChange={(e) =>
              setMods((m) => ({ ...m, cholesterol: Number(e.target.value) }))
            }
          >
            <option value={1}>Normal</option>
            <option value={2}>Above normal</option>
            <option value={3}>Well above normal</option>
          </select>
        </div>
        <div>
          <label className="label-text">Glucose level</label>
          <select
            className="input-field"
            value={mods.gluc}
            onChange={(e) => setMods((m) => ({ ...m, gluc: Number(e.target.value) }))}
          >
            <option value={1}>Normal</option>
            <option value={2}>Above normal</option>
            <option value={3}>Well above normal</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary mt-5"
        onClick={runSim}
        disabled={loading}
      >
        {loading ? "Simulating…" : "Run What-If Analysis"}
      </button>

      {error && <p className="error-text mt-3">{error}</p>}

      {sim && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <p className="text-sm text-green-800">Potential risk reduction</p>
            <p className="text-3xl font-bold text-green-700">
              −{sim.risk_reduction_percent}%
            </p>
            <p className="text-xs text-green-600">
              {sim.baseline.risk_percent}% → {sim.modified.risk_percent}%
            </p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, "Risk"]} />
                <Bar dataKey="risk" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-600">
            Changes modeled: {sim.improved_features.join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}

function Slider({ label, min, max, value, onChange }) {
  return (
    <div>
      <label className="label-text">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="w-full accent-brand-600"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        className="h-5 w-5 accent-brand-600"
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
