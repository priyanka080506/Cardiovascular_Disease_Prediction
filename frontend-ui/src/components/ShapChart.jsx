import { motion } from "framer-motion";
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
import SectionHeader from "./ui/SectionHeader";
import {
  formatShapForChart,
  generateShapInsight,
  getProtectiveFactors,
  getTopRiskFactors,
} from "../utils/chartFormatters";
import { CHART, chartMargins } from "../utils/chartTheme";
import { staggerContainer, staggerItem } from "../utils/motionVariants";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-2.5 shadow-elevated backdrop-blur-md"
    >
      <p className="text-sm font-semibold text-ink">{d.name}</p>
      <p className="mt-0.5 text-caption">
        <span className="font-semibold" style={{ color: d.fill }}>
          {d.pct}%
        </span>{" "}
        of total signal ·{" "}
        {d.direction === "risk" ? "increases risk" : "protective"}
      </p>
    </motion.div>
  );
};

function FactorBar({ factor, variant, index }) {
  const isRisk = variant === "risk";
  return (
    <motion.div
      className="flex items-center gap-3 py-1.5"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
    >
      <span className="w-[7.5rem] shrink-0 truncate text-caption text-slate-600 sm:w-36">
        {factor.label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isRisk ? CHART.risk.high : CHART.risk.low }}
          initial={{ width: 0 }}
          animate={{ width: `${factor.pct}%` }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span
        className="w-10 shrink-0 text-right text-caption font-semibold"
        style={{ color: isRisk ? CHART.risk.high : CHART.risk.low }}
      >
        {isRisk ? "+" : "−"}
        {factor.pct}%
      </span>
    </motion.div>
  );
}

export default function ShapChart({ contributions, topDrivers }) {
  const data = formatShapForChart(contributions);
  const insight = generateShapInsight(contributions, topDrivers);
  const riskFactors = getTopRiskFactors(contributions);
  const protectiveFactors = getProtectiveFactors(contributions);
  const chartHeight = Math.max(220, data.length * 36);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader
        eyebrow="Explainable AI"
        title="Why is your risk at this level?"
        description="SHAP feature attribution shows which health markers most influence your score."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <motion.div
          className="panel-glass"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <motion.div
            style={{ height: chartHeight }}
            className="w-full min-w-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ ...chartMargins.vertical, left: 0 }}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke={CHART.grid} />
                <XAxis
                  type="number"
                  domain={["auto", "auto"]}
                  tick={CHART.font.tick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toFixed(2)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={CHART.font.label}
                  axisLine={false}
                  tickLine={false}
                />
                <ReferenceLine x={0} stroke={CHART.reference} strokeWidth={1.5} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37, 99, 235, 0.04)" }} />
                <Bar
                  dataKey="shap"
                  radius={[0, 4, 4, 0]}
                  barSize={14}
                  animationBegin={200}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="mt-4 flex gap-5 border-t border-slate-100/80 pt-4">
            <LegendDot color={CHART.risk.high} label="Increases risk" />
            <LegendDot color={CHART.risk.low} label="Lowers risk" />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {riskFactors.length > 0 && (
            <motion.div variants={staggerItem} className="panel-muted flex-1">
              <p className="stat-label">Risk contributors</p>
              <div className="mt-3 space-y-0.5">
                {riskFactors.map((f, i) => (
                  <FactorBar key={f.label} factor={f} variant="risk" index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {protectiveFactors.length > 0 && (
            <motion.div variants={staggerItem} className="panel-muted">
              <p className="stat-label">Protective factors</p>
              <div className="mt-3 space-y-0.5">
                {protectiveFactors.map((f, i) => (
                  <FactorBar key={f.label} factor={f} variant="protective" index={i} />
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            variants={staggerItem}
            className="panel-glass border-brand-100/60 bg-brand-50/20"
          >
            <p className="stat-label text-brand-600">Clinical insight</p>
            <motion.p
              className="mt-2 text-body leading-relaxed text-slate-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {insight}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-2 text-caption text-slate-500">
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
