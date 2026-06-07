import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import AnimatedInput from "./ui/AnimatedInput";
import PageHeader from "./ui/PageHeader";
import ProgressIndicator from "./ui/ProgressIndicator";
import {
  ActivityIcon,
  AlertIcon,
  BeakerIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ScaleIcon,
  UserIcon,
} from "./ui/Icons";

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

const STEPS = [
  { id: "personal", label: "Personal", icon: UserIcon },
  { id: "body", label: "Body metrics", icon: ScaleIcon },
  { id: "clinical", label: "Clinical", icon: BeakerIcon },
  { id: "lifestyle", label: "Lifestyle", icon: ActivityIcon },
];

function validate(form, step = null) {
  const errors = {};
  if (step === null || step >= 1) {
    const bmi = form.weight / (form.height / 100) ** 2;
    if (bmi < 10 || bmi > 60) errors.weight = "Weight/height produce unrealistic BMI.";
  }
  if (step === null || step >= 2) {
    if (form.ap_lo > form.ap_hi) errors.ap_lo = "Diastolic cannot exceed systolic.";
    if (form.ap_hi > 250 || form.ap_hi < 60)
      errors.ap_hi = "Systolic must be between 60–250 mmHg.";
    if (form.ap_lo > 180 || form.ap_lo < 40)
      errors.ap_lo = "Diastolic must be between 40–180 mmHg.";
  }
  return errors;
}

function validateStep(form, step) {
  const errors = {};
  if (step === 0) {
    if (!form.age_years || form.age_years < 18 || form.age_years > 120)
      errors.age_years = "Age must be between 18–120 years.";
  }
  if (step === 1) {
    if (!form.height || form.height < 100 || form.height > 250)
      errors.height = "Height must be between 100–250 cm.";
    if (!form.weight || form.weight < 30 || form.weight > 300)
      errors.weight = "Weight must be between 30–300 kg.";
    const bmi = form.weight / (form.height / 100) ** 2;
    if (bmi < 10 || bmi > 60) errors.weight = "Weight/height produce unrealistic BMI.";
  }
  if (step === 2) {
    Object.assign(errors, validate(form, 2));
  }
  return errors;
}

export default function VitalsForm({ onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULT);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevStep = useRef(0);

  const update = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setErrors((e) => {
      const nextErrors = { ...e };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const bmi = (form.weight / (form.height / 100) ** 2).toFixed(1);
  const bmiCategory =
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

  const changeStep = (next) => {
    setDirection(next > step ? 1 : -1);
    prevStep.current = step;
    setStep(next);
  };

  const goNext = () => {
    const v = validateStep(form, step);
    setErrors(v);
    if (Object.keys(v).length) return;
    changeStep(Math.min(step + 1, STEPS.length - 1));
  };

  const goBack = () => changeStep(Math.max(step - 1, 0));

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

  const sectionMotion = {
    initial: { opacity: 0, x: direction > 0 ? 28 : -28 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction > 0 ? -28 : 28 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Step-by-step assessment"
        title="Health profile"
        description="Enter your vitals across four sections. All data stays on this device until analysis."
      />

      <motion.div
        className="mb-5 panel-glass"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProgressIndicator steps={STEPS} currentStep={step} />
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="panel-glass"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="personal" {...sectionMotion} className="space-y-5">
              <StepTitle title="Personal information" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Age" error={errors.age_years} hint="18–120 years">
                  <AnimatedInput hasError={!!errors.age_years}>
                    <input
                      type="number"
                      className={errors.age_years ? "input-field-error" : "input-field"}
                      value={form.age_years}
                      min={18}
                      max={120}
                      onChange={(e) => update("age_years", e.target.value)}
                    />
                  </AnimatedInput>
                </Field>
                <Field label="Gender">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 1, label: "Female" },
                      { value: 2, label: "Male" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          Number(form.gender) === opt.value
                            ? "border-brand-600 bg-brand-50 text-brand-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                        onClick={() => update("gender", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="body" {...sectionMotion} className="space-y-5">
              <StepTitle title="Body metrics" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Height (cm)" error={errors.height}>
                  <input
                    type="number"
                    className={errors.height ? "input-field-error" : "input-field"}
                    value={form.height}
                    onChange={(e) => update("height", e.target.value)}
                  />
                </Field>
                <Field label="Weight (kg)" error={errors.weight}>
                  <input
                    type="number"
                    className={errors.weight ? "input-field-error" : "input-field"}
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                  />
                </Field>
              </div>
              <motion.div
                className="flex items-center justify-between rounded-xl border border-brand-100/60 bg-brand-50/40 px-4 py-3"
                key={bmi}
                initial={{ scale: 0.98, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div>
                  <p className="stat-label">Calculated BMI</p>
                  <motion.p
                    className="text-2xl font-bold text-ink"
                    key={bmi}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {bmi}
                  </motion.p>
                </div>
                <span className="badge-neutral">{bmiCategory}</span>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="clinical" {...sectionMotion} className="space-y-5">
              <StepTitle title="Clinical information" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Systolic BP (mmHg)" error={errors.ap_hi}>
                  <input
                    type="number"
                    className={errors.ap_hi ? "input-field-error" : "input-field"}
                    value={form.ap_hi}
                    onChange={(e) => update("ap_hi", e.target.value)}
                  />
                </Field>
                <Field label="Diastolic BP (mmHg)" error={errors.ap_lo}>
                  <input
                    type="number"
                    className={errors.ap_lo ? "input-field-error" : "input-field"}
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
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="lifestyle" {...sectionMotion} className="space-y-5">
              <StepTitle title="Lifestyle" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Smoking">
                  <select
                    className="input-field"
                    value={form.smoke}
                    onChange={(e) => update("smoke", e.target.value)}
                  >
                    <option value={0}>Non-smoker</option>
                    <option value={1}>Current smoker</option>
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
                <Field label="Physical activity" className="sm:col-span-2">
                  <select
                    className="input-field"
                    value={form.active}
                    onChange={(e) => update("active", e.target.value)}
                  >
                    <option value={1}>Active — regular exercise</option>
                    <option value={0}>Inactive — sedentary lifestyle</option>
                  </select>
                </Field>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          {step > 0 ? (
            <button type="button" className="btn-ghost" onClick={goBack}>
              <ChevronLeftIcon className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-primary" onClick={goNext}>
              Continue
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing…
                </span>
              ) : (
                <>
                  Generate risk report
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
}

function StepTitle({ title }) {
  return <h3 className="text-subheading">{title}</h3>;
}

function Field({ label, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label className="label-text">
        {label}
        {hint && <span className="font-normal text-slate-400"> · {hint}</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            className="error-text"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertIcon className="h-3.5 w-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
