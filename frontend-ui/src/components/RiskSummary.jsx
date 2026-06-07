import { motion } from "framer-motion";
import AnimatedCounter from "./ui/AnimatedCounter";
import RiskGauge from "./RiskGauge";
import { riskColor, riskStatus } from "../utils/chartFormatters";
import { cardReveal, staggerContainer, staggerItem } from "../utils/motionVariants";

export default function RiskSummary({ percent, label, bmi, modelName }) {
  const color = riskColor(label);
  const status = riskStatus(label);

  return (
    <motion.div
      className="card-glass relative overflow-hidden"
      variants={cardReveal}
      initial="hidden"
      animate="show"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-secondary-500/5" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_200px] lg:gap-10 xl:grid-cols-[1fr_220px]">
        <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="show">
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3">
            <RiskBadge label={label} color={color} />
            <span className="text-caption text-slate-400">
              Model: {modelName} · BMI {bmi}
            </span>
          </motion.div>

          <motion.div variants={staggerItem} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <AnimatedCounter
              value={percent}
              suffix="%"
              className="text-5xl font-bold tracking-tight sm:text-6xl"
              style={{ color }}
            />
            <span className="text-body text-slate-500">cardiovascular risk</span>
          </motion.div>

          <motion.p variants={staggerItem} className="max-w-md text-body-lg text-slate-600">
            {status}
          </motion.p>

          <motion.div variants={staggerItem} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricCell label="Risk level" value={label} capitalize style={{ color }} delay={0} />
            <MetricCell label="BMI" value={bmi} delay={0.05} />
            <MetricCell label="Confidence" value="High" sub="10-fold CV validated" delay={0.1} />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center border-t border-slate-100/80 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <RiskGauge percent={percent} label={label} compact />
        </motion.div>
      </div>
    </motion.div>
  );
}

function RiskBadge({ label, color }) {
  return (
    <motion.span
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize"
      style={{ backgroundColor: `${color}14`, color }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {label} risk
    </motion.span>
  );
}

function MetricCell({ label, value, sub, capitalize, style, delay = 0 }) {
  return (
    <motion.div
      className="rounded-xl border border-slate-100/80 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + delay, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(15,23,42,0.06)" }}
    >
      <p className="stat-label">{label}</p>
      <p
        className={`mt-0.5 text-lg font-semibold text-ink ${capitalize ? "capitalize" : ""}`}
        style={style}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-caption">{sub}</p>}
    </motion.div>
  );
}
