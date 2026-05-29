/** Prepare SHAP contributions for Recharts horizontal bar display. */

export function formatShapForChart(contributions) {
  return [...contributions]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .map((c) => ({
      name: c.label,
      shap: c.shap_value,
      fill:
        c.direction === "risk"
          ? "#ef4444"
          : c.direction === "protective"
            ? "#22c55e"
            : "#94a3b8",
      direction: c.direction,
      value: c.value,
    }));
}

export function riskColor(label) {
  if (label === "low") return "#22c55e";
  if (label === "moderate") return "#f59e0b";
  return "#ef4444";
}
