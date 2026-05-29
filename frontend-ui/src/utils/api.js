const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail || data.message || res.statusText;
    throw new Error(
      typeof detail === "string" ? detail : JSON.stringify(detail)
    );
  }
  return data;
}

export function predictHealth(payload) {
  return request("/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function simulateChanges(baseline, modifications) {
  return request("/simulate", {
    method: "POST",
    body: JSON.stringify({ baseline, modifications }),
  });
}

export function checkApiHealth() {
  return request("/health");
}
