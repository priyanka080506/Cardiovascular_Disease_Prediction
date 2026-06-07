import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { simulateChanges } from "../utils/api";
import AnimatedCounter from "./ui/AnimatedCounter";
import SectionHeader from "./ui/SectionHeader";
import { AlertIcon, SlidersIcon } from "./ui/Icons";
import { CHART } from "../utils/chartTheme";

function countChanges(mods, baseline) {
  let n = 0;
  if (mods.weight !== baseline.weight) n++;
  if (mods.ap_hi !== baseline.ap_hi) n++;
  if (mods.ap_lo !== baseline.ap_lo) n++;
  if (mods.active !== baseline.active) n++;
  if (mods.smoke !== baseline.smoke) n++;
  if (mods.cholesterol !== baseline.cholesterol) n++;
  if (mods.gluc !== baseline.gluc) n++;
  return n;
}

export default function SimulationSandbox({ baselineInput, baselineResult }) {
  const [mods, setMods] = useState({
    weight: baselineInput.weight,
    ap_hi: baselineInput.ap_hi,
    ap_lo: baselineInput.ap_lo,
    active: baselineInput.active,
    smoke: baselineInput.smoke,
    cholesterol: baselineInput.cholesterol,
    gluc: baselineInput.gluc,
  });
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeCount = useMemo(() => countChanges(mods, baselineInput), [mods, baselineInput]);
  const hasChanges = changeCount > 0;

  const runSim = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const modifications = {};
      if (mods.weight !== baselineInput.weight) modifications.weight = mods.weight;
      if (mods.ap_hi !== baselineInput.ap_hi) modifications.ap_hi = mods.ap_hi;
      if (mods.ap_lo !== baselineInput.ap_lo) modifications.ap_lo = mods.ap_lo;
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

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <SectionHeader
        eyebrow="Interactive modeling"
        title="What-if simulation"
        description="Adjust modifiable health markers to project how your risk score could change. Age remains locked to your assessment."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <motion.div
          className="panel-muted space-y-4 lg:col-span-3"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="stat-label">Parameters</p>
          <SimSlider
            label="Weight"
            value={mods.weight}
            min={40}
            max={150}
            unit="kg"
            baseline={baselineInput.weight}
            onChange={(v) => setMods((m) => ({ ...m, weight: v }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SimSlider
              label="Systolic BP"
              value={mods.ap_hi}
              min={90}
              max={200}
              unit="mmHg"
              baseline={baselineInput.ap_hi}
              onChange={(v) => setMods((m) => ({ ...m, ap_hi: v }))}
            />
            <SimSlider
              label="Diastolic BP"
              value={mods.ap_lo}
              min={50}
              max={130}
              unit="mmHg"
              baseline={baselineInput.ap_lo}
              onChange={(v) => setMods((m) => ({ ...m, ap_lo: v }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
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
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Cholesterol"
              value={mods.cholesterol}
              onChange={(v) => setMods((m) => ({ ...m, cholesterol: v }))}
            />
            <SelectField
              label="Glucose"
              value={mods.gluc}
              onChange={(v) => setMods((m) => ({ ...m, gluc: v }))}
            />
          </div>

          <motion.button
            type="button"
            className="btn-primary w-full"
            onClick={runSim}
            disabled={loading || !hasChanges}
            whileHover={hasChanges && !loading ? { scale: 1.01 } : {}}
            whileTap={hasChanges && !loading ? { scale: 0.99 } : {}}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Running simulation…
              </span>
            ) : (
              "Run analysis"
            )}
          </motion.button>

          {error && (
            <motion.p
              className="error-text"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertIcon className="h-3.5 w-3.5" />
              {error}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="panel-glass flex flex-col lg:col-span-2"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="stat-label">Projected outcome</p>

          {/* Live baseline preview while adjusting sliders */}
          <AnimatePresence mode="wait">
            {!sim && (
              <motion.div
                key="live-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <LivePreview
                  baselineRisk={baselineResult.risk_percent}
                  changeCount={changeCount}
                  hasChanges={hasChanges}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {sim ? (
              <motion.div
                key={`results-${sim.modified.risk_percent}`}
                className="mt-4 flex flex-1 flex-col"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <ComparisonViz
                  current={sim.baseline.risk_percent}
                  future={sim.modified.risk_percent}
                  reduction={sim.risk_reduction_percent}
                />

                <motion.div
                  className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100/80 pt-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, staggerChildren: 0.06 }}
                >
                  <StatPill label="Current" value={sim.baseline.risk_percent} color={CHART.risk.high} delay={0} />
                  <StatPill label="Projected" value={sim.modified.risk_percent} color={CHART.risk.low} delay={0.06} />
                  <StatPill
                    label="Reduction"
                    value={sim.risk_reduction_percent}
                    color={CHART.risk.future}
                    prefix="−"
                    delay={0.12}
                  />
                </motion.div>

                <p className="mt-4 text-caption leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-600">Modeled changes:</span>{" "}
                  {sim.improved_features.join(" · ")}
                </p>
              </motion.div>
            ) : !hasChanges ? (
              <motion.div
                key="empty"
                className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 px-4 py-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <SlidersIcon className="h-7 w-7 text-slate-300" />
                <p className="mt-3 text-body text-slate-500">
                  Adjust parameters to model changes
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

function LivePreview({ baselineRisk, changeCount, hasChanges }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-100/60 bg-brand-50/30 px-4 py-3">
        <p className="text-caption text-slate-500">Current baseline risk</p>
        <p className="text-3xl font-bold text-ink">
          <AnimatedCounter value={baselineRisk} suffix="%" />
        </p>
      </div>

      {hasChanges && (
        <motion.div
          className="rounded-xl border border-secondary-100/60 bg-secondary-50/20 px-4 py-3"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          key={changeCount}
        >
          <div className="flex items-center justify-between">
            <p className="text-caption font-medium text-secondary-600">
              {changeCount} parameter{changeCount !== 1 ? "s" : ""} modified
            </p>
            <motion.span
              className="h-2 w-2 rounded-full bg-brand-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <p className="mt-1 text-caption text-slate-500">
            Run analysis to compute projected risk
          </p>
          <motion.div
            className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-secondary-500"
              animate={{ width: ["0%", "70%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function ComparisonViz({ current, future, reduction }) {
  const maxVal = Math.max(current, future, 1);

  return (
    <div className="space-y-4">
      <RiskBar label="Current risk" value={current} max={maxVal} color={CHART.risk.high} />
      <RiskBar label="Projected risk" value={future} max={maxVal} color={CHART.risk.low} />

      <AnimatePresence>
        {reduction > 0 && (
          <motion.div
            className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-center backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <p className="text-caption font-medium text-emerald-700">Potential risk reduction</p>
            <p className="text-2xl font-bold text-emerald-600">
              <AnimatedCounter value={reduction} prefix="−" suffix="%" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RiskBar({ label, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-caption text-slate-500">{label}</span>
        <motion.span
          className="text-sm font-semibold"
          style={{ color }}
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

function SimSlider({ label, value, min, max, unit, baseline, onChange }) {
  const changed = value !== baseline;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      layout
      className={changed ? "rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-brand-200/80" : ""}
      animate={changed ? { boxShadow: "0 0 0 1px rgba(37,99,235,0.1)" } : { boxShadow: "none" }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="text-caption font-medium text-slate-600">{label}</label>
        <motion.span
          className={`text-sm font-semibold ${changed ? "text-brand-600" : "text-ink"}`}
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {value} {unit}
        </motion.span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="range-input"
        style={{
          background: `linear-gradient(to right, #2563EB ${pct}%, #E2E8F0 ${pct}%)`,
        }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <AnimatePresence>
        {changed && (
          <motion.p
            className="mt-1 text-caption text-slate-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            Baseline: {baseline} {unit}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <motion.label
      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 backdrop-blur-sm"
      whileTap={{ scale: 0.99 }}
    >
      <span className="text-caption font-medium text-slate-700">{label}</span>
      <div className="relative h-5 w-9">
        <input
          type="checkbox"
          checked={checked}
          className="sr-only"
          onChange={(e) => onChange(e.target.checked)}
        />
        <motion.div
          className="h-5 w-9 rounded-full"
          animate={{ backgroundColor: checked ? "#2563EB" : "#E2E8F0" }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </motion.label>
  );
}

function SelectField({ label, value, onChange }) {
  return (
    <div>
      <label className="label-text text-caption">{label}</label>
      <select
        className="input-field"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={1}>Normal</option>
        <option value={2}>Above normal</option>
        <option value={3}>Well above normal</option>
      </select>
    </div>
  );
}

function StatPill({ label, value, color, prefix = "", delay = 0 }) {
  return (
    <motion.div
      className="rounded-lg border border-slate-100/80 bg-white/60 px-2 py-2.5 text-center shadow-sm backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-base font-bold" style={{ color }}>
        {prefix}
        <AnimatedCounter value={value} suffix="%" />
      </p>
    </motion.div>
  );
}
