import { motion } from "framer-motion";
import AnimatedCounter from "./ui/AnimatedCounter";
import { riskColor } from "../utils/chartFormatters";

export default function RiskGauge({ percent, label, compact = false }) {
  const color = riskColor(label);
  const size = compact ? 160 : 208;
  const radius = compact ? 58 : 70;
  const stroke = compact ? 10 : 12;
  const viewBox = compact ? 160 : 180;
  const center = viewBox / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${viewBox} ${viewBox}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold tracking-tight ${compact ? "text-2xl" : "text-4xl"}`}
            style={{ color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <AnimatedCounter value={percent} suffix="%" />
          </motion.span>
          {!compact && (
            <span className="mt-0.5 text-overline text-slate-400">CVD Risk</span>
          )}
        </div>
      </div>
    </div>
  );
}
