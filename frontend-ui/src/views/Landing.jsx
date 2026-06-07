import { motion } from "framer-motion";
import ECGLine from "../components/ui/ECGLine";
import {
  ActivityIcon,
  ArrowRightIcon,
  BrainIcon,
  ChartIcon,
  ClipboardIcon,
  HeartPulseIcon,
  ShieldCheckIcon,
  SlidersIcon,
} from "../components/ui/Icons";
import { fadeUp, staggerContainer, staggerItem } from "../utils/motionVariants";

const FEATURES = [
  {
    id: "predict",
    step: "01",
    title: "Predict",
    subtitle: "XGBoost risk scoring",
    description:
      "Ensemble ML with cross-validated accuracy delivers your cardiovascular risk percentage in seconds.",
    icon: ChartIcon,
  },
  {
    id: "explain",
    step: "02",
    title: "Explain",
    subtitle: "SHAP attribution",
    description:
      "See exactly which vitals push risk up or down — full transparency, no black box.",
    icon: BrainIcon,
  },
  {
    id: "prescribe",
    step: "03",
    title: "Prescribe",
    subtitle: "DASH & Mediterranean",
    description:
      "Evidence-based nutrition and exercise protocols mapped to your primary risk drivers.",
    icon: ClipboardIcon,
  },
  {
    id: "simulate",
    step: "04",
    title: "Simulate",
    subtitle: "What-if analysis",
    description:
      "Model weight, blood pressure, and lifestyle changes before you commit to them.",
    icon: SlidersIcon,
  },
];

const TRUST_ITEMS = ["XGBoost ML", "SHAP Explainability", "DASH Protocol", "HIPAA-aware design"];

const FLOATING_ICONS = [
  { Icon: HeartPulseIcon, pos: "right-4 top-8 sm:right-8 sm:top-12", delay: 0 },
  { Icon: BrainIcon, pos: "left-2 top-1/3 sm:left-6", delay: 1.2 },
  { Icon: ActivityIcon, pos: "right-6 bottom-1/4", delay: 2.4 },
];

export default function Landing({ onStart }) {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:pb-24 sm:pt-16">
        {/* Floating healthcare icons */}
        {FLOATING_ICONS.map(({ Icon, pos, delay }, i) => (
          <motion.div
            key={i}
            className={`pointer-events-none absolute z-0 hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/50 text-brand-500/50 shadow-glass backdrop-blur-md lg:flex ${pos}`}
            animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        ))}

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-overline text-brand-600">
              Explainable AI Healthcare
            </motion.p>

            <motion.h1 variants={fadeUp} className="mt-3 text-balance text-display">
              AI-Powered{" "}
              <span className="gradient-text">Cardiovascular</span>{" "}
              Risk Assessment
            </motion.h1>

            <motion.div variants={fadeUp} className="mt-5 h-10 w-full max-w-xs opacity-80">
              <ECGLine className="h-full" />
            </motion.div>

            <motion.p variants={fadeUp} className="mt-4 text-lg font-medium text-slate-700">
              Predict risk. Understand causes. Prevent disease.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-3 max-w-lg text-body-lg">
              An explainable AI platform that predicts cardiovascular risk, surfaces
              contributing factors via SHAP, and delivers personalized health guidance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <motion.button
                type="button"
                className="btn-primary-lg shadow-glow"
                onClick={onStart}
                whileHover={{ scale: 1.02, boxShadow: "0 0 28px -4px rgba(37, 99, 235, 0.35)" }}
                whileTap={{ scale: 0.98 }}
              >
                Start Assessment
                <ArrowRightIcon className="h-4 w-4" />
              </motion.button>
              <span className="flex items-center gap-2 text-caption text-slate-400">
                <ShieldCheckIcon className="h-4 w-4 text-secondary-500" />
                No account · Results in 30 seconds
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-2">
              {TRUST_ITEMS.map((item, i) => (
                <motion.span
                  key={item}
                  className="badge-neutral"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Product preview mockup */}
          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="card-glass overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100/80 px-5 py-3">
                <span className="text-caption font-semibold text-slate-500">
                  Risk Dashboard Preview
                </span>
                <span className="badge-warning">Moderate</span>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="stat-label">CVD Risk Score</p>
                    <motion.p
                      className="text-4xl font-bold tracking-tight text-amber-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      42%
                    </motion.p>
                  </div>
                  <motion.div
                    className="h-20 w-20"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="213.6"
                        initial={{ strokeDashoffset: 213.6 }}
                        animate={{ strokeDashoffset: 124 }}
                        transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <p className="stat-label">Top Risk Drivers</p>
                  {[
                    { label: "Blood Pressure", pct: 35, color: "#EF4444" },
                    { label: "BMI", pct: 24, color: "#F97316" },
                    { label: "Physical Activity", pct: 18, color: "#22C55E" },
                  ].map((bar, i) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-caption text-slate-500">{bar.label}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: bar.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.pct}%` }}
                          transition={{ delay: 0.9 + i * 0.12, duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                      <span className="w-8 text-right text-caption font-medium text-slate-600">
                        {bar.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-brand-100/50 to-secondary-50/40" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200/80 bg-white/60 py-16 backdrop-blur-sm sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            className="mb-10 max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="accent-bar mb-3" />
            <p className="text-overline">Platform capabilities</p>
            <h2 className="mt-1 text-display-sm text-ink">
              End-to-end cardiovascular intelligence
            </h2>
            <p className="mt-2 text-body-lg">
              Four integrated modules — from prediction to personalized prevention.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {FEATURES.map((feature) => (
              <motion.article
                key={feature.id}
                variants={staggerItem}
                className="card-hover group flex flex-col"
                whileHover={{ y: -4 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-overline text-slate-300">{feature.step}</span>
                </div>
                <h3 className="text-subheading">{feature.title}</h3>
                <p className="mt-0.5 text-caption font-medium text-brand-600">{feature.subtitle}</p>
                <p className="mt-3 flex-1 text-body">{feature.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
