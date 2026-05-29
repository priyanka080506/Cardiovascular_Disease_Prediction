import { useState } from "react";

const DEFAULT = {
  age_years: 50,
  height: 170,
  weight: 75,
  gender: 2,
  ap_hi: 120,
  ap_lo: 80,
  cholesterol: 1,
  gluc: 1,
  smoke: 0,
  alco: 0,
  active: 1,
};

function validate(form) {
  const errors = {};
  if (form.ap_lo > form.ap_hi) errors.ap_lo = "Diastolic cannot exceed systolic.";
  if (form.ap_hi > 250 || form.ap_hi < 60)
    errors.ap_hi = "Systolic must be between 60–250 mmHg.";
  if (form.ap_lo > 180 || form.ap_lo < 40)
    errors.ap_lo = "Diastolic must be between 40–180 mmHg.";
  const bmi = form.weight / (form.height / 100) ** 2;
  if (bmi < 10 || bmi > 60) errors.weight = "Weight/height produce unrealistic BMI.";
  return errors;
}

export default function VitalsForm({ onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULT);
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setErrors(validate(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    onSubmit({
      ...form,
      age_years: Number(form.age_years),
      height: Number(form.height),
      weight: Number(form.weight),
      gender: Number(form.gender),
      ap_hi: Number(form.ap_hi),
      ap_lo: Number(form.ap_lo),
      cholesterol: Number(form.cholesterol),
      gluc: Number(form.gluc),
      smoke: Number(form.smoke),
      alco: Number(form.alco),
      active: Number(form.active),
    });
  };

  const bmi = (form.weight / (form.height / 100) ** 2).toFixed(1);

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <h2 className="text-xl font-bold text-brand-900">Vitals Intake Portal</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter health metrics. Outliers are flagged before analysis.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Age (years)" error={errors.age_years}>
          <input
            type="number"
            className="input-field"
            value={form.age_years}
            min={18}
            max={120}
            onChange={(e) => update("age_years", e.target.value)}
          />
        </Field>
        <Field label="Height (cm)" error={errors.height}>
          <input
            type="number"
            className="input-field"
            value={form.height}
            onChange={(e) => update("height", e.target.value)}
          />
        </Field>
        <Field label={`Weight (kg) — BMI ${bmi}`} error={errors.weight}>
          <input
            type="number"
            className="input-field"
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
          />
        </Field>
        <Field label="Gender">
          <select
            className="input-field"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value={1}>Female</option>
            <option value={2}>Male</option>
          </select>
        </Field>
        <Field label="Systolic BP (ap_hi)" error={errors.ap_hi}>
          <input
            type="number"
            className="input-field"
            value={form.ap_hi}
            onChange={(e) => update("ap_hi", e.target.value)}
          />
        </Field>
        <Field label="Diastolic BP (ap_lo)" error={errors.ap_lo}>
          <input
            type="number"
            className="input-field"
            value={form.ap_lo}
            onChange={(e) => update("ap_lo", e.target.value)}
          />
        </Field>
        <Field label="Cholesterol">
          <select
            className="input-field"
            value={form.cholesterol}
            onChange={(e) => update("cholesterol", e.target.value)}
          >
            <option value={1}>Normal</option>
            <option value={2}>Above normal</option>
            <option value={3}>Well above normal</option>
          </select>
        </Field>
        <Field label="Glucose">
          <select
            className="input-field"
            value={form.gluc}
            onChange={(e) => update("gluc", e.target.value)}
          >
            <option value={1}>Normal</option>
            <option value={2}>Above normal</option>
            <option value={3}>Well above normal</option>
          </select>
        </Field>
        <Field label="Smoking">
          <select
            className="input-field"
            value={form.smoke}
            onChange={(e) => update("smoke", e.target.value)}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </Field>
        <Field label="Alcohol">
          <select
            className="input-field"
            value={form.alco}
            onChange={(e) => update("alco", e.target.value)}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </Field>
        <Field label="Physically active">
          <select
            className="input-field"
            value={form.active}
            onChange={(e) => update("active", e.target.value)}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </Field>
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
        {loading ? "Analyzing…" : "Assess Cardiovascular Risk"}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label-text">{label}</label>
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
