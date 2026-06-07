/** Shared Recharts styling for a cohesive analytics look. */

export const CHART = {
  grid: "#EEF2F6",
  axis: "#94A3B8",
  axisLabel: "#64748B",
  reference: "#CBD5E1",
  tooltip: {
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    fontSize: 13,
  },
  risk: {
    high: "#EF4444",
    low: "#22C55E",
    current: "#64748B",
    future: "#2563EB",
    moderate: "#F59E0B",
  },
  font: {
    tick: { fontSize: 12, fill: "#94A3B8", fontFamily: "DM Sans, sans-serif" },
    label: { fontSize: 12, fill: "#475569", fontFamily: "DM Sans, sans-serif" },
  },
};

export const chartMargins = {
  horizontal: { top: 8, right: 28, bottom: 8, left: 8 },
  vertical: { top: 4, right: 32, bottom: 4, left: 4 },
  comparison: { top: 12, right: 16, bottom: 4, left: 0 },
};
