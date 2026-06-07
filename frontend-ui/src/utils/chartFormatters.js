/** Prepare SHAP contributions for Recharts horizontal bar display. */

function normalizedPct(value, total) {
  if (!total) return 0;
  return Math.round((Math.abs(value) / total) * 100);
}

function shapTotal(contributions) {
  return contributions.reduce((sum, c) => sum + Math.abs(c.shap_value), 0);
}

export function formatShapForChart(contributions) {
  const total = shapTotal(contributions);
  return [...contributions]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .map((c) => ({
      name: c.label,
      shap: c.shap_value,
      fill:
        c.direction === "risk"
          ? "#EF4444"
          : c.direction === "protective"
            ? "#22C55E"
            : "#94A3B8",
      direction: c.direction,
      value: c.value,
      pct: normalizedPct(c.shap_value, total),
    }));
}

export function riskColor(label) {
  if (label === "low") return "#22C55E";
  if (label === "moderate") return "#F59E0B";
  return "#EF4444";
}

export function riskGradient(label) {
  if (label === "low") return "from-emerald-500/10 to-teal-500/5";
  if (label === "moderate") return "from-amber-500/10 to-orange-500/5";
  return "from-red-500/10 to-red-600/5";
}

export function riskStatus(label) {
  if (label === "low") return "Within healthy range";
  if (label === "moderate") return "Elevated — lifestyle action advised";
  return "High — consult a physician";
}

export function generateShapInsight(contributions, topDrivers = []) {
  const risks = contributions
    .filter((c) => c.direction === "risk")
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

  const protective = contributions
    .filter((c) => c.direction === "protective")
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

  const total = shapTotal(contributions);

  if (risks.length === 0) {
    return "Your profile is primarily shaped by protective factors. Sustaining current habits will help maintain a favorable cardiovascular outlook.";
  }

  const top = risks[0];
  const pct = normalizedPct(top.shap_value, total);
  let insight = `${top.label} is the dominant risk driver in your assessment, contributing roughly ${pct}% of the total model signal.`;

  if (risks.length > 1) {
    const second = risks[1];
    const secondPct = normalizedPct(second.shap_value, total);
    insight += ` ${second.label} is the second-largest factor at ${secondPct}%.`;
  }

  if (protective.length > 0) {
    const prot = protective[0];
    const protPct = normalizedPct(prot.shap_value, total);
    insight += ` ${prot.label} is actively offsetting risk (${protPct}% protective contribution).`;
  }

  if (topDrivers?.length > 0) {
    insight += ` Clinical focus areas: ${topDrivers.join(", ")}.`;
  }

  return insight;
}

export function getTopRiskFactors(contributions, limit = 4) {
  const total = shapTotal(contributions);
  return contributions
    .filter((c) => c.direction === "risk")
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .slice(0, limit)
    .map((c) => ({
      label: c.label,
      pct: normalizedPct(c.shap_value, total),
    }));
}

export function getProtectiveFactors(contributions, limit = 3) {
  const total = shapTotal(contributions);
  return contributions
    .filter((c) => c.direction === "protective")
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .slice(0, limit)
    .map((c) => ({
      label: c.label,
      pct: normalizedPct(c.shap_value, total),
    }));
}
