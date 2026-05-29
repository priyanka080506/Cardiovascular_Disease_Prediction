import { useState } from "react";
import HealthRoadmap from "./components/HealthRoadmap";
import RiskGauge from "./components/RiskGauge";
import ShapChart from "./components/ShapChart";
import SimulationSandbox from "./components/SimulationSandbox";
import VitalsForm from "./components/VitalsForm";
import { predictHealth } from "./utils/api";
import Landing from "./views/Landing";

export default function App() {
  const [step, setStep] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState(null);
  const [result, setResult] = useState(null);

  const handlePredict = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const data = await predictHealth(payload);
      setInput(payload);
      setResult(data);
      setStep("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <button
            type="button"
            className="text-lg font-bold text-brand-900"
            onClick={() => setStep("landing")}
          >
            CVD<span className="text-brand-600">Insight</span>
          </button>
          {step !== "landing" && (
            <button type="button" className="btn-secondary" onClick={() => setStep("form")}>
              New Assessment
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {step === "landing" && <Landing onStart={() => setStep("form")} />}

        {step === "form" && (
          <div className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
                <p className="mt-1 text-xs">
                  Ensure the API is running:{" "}
                  <code className="rounded bg-red-100 px-1">uvicorn app.main:app --reload</code>
                </p>
              </div>
            )}
            <VitalsForm onSubmit={handlePredict} loading={loading} />
          </div>
        )}

        {step === "dashboard" && result && input && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <RiskGauge
                percent={result.risk_percent}
                label={result.risk_label}
                bmi={result.bmi}
                modelName={result.model_name}
              />
              <div className="lg:col-span-2">
                <ShapChart
                  contributions={result.shap_contributions}
                  topDrivers={result.top_risk_drivers}
                />
              </div>
            </div>
            <HealthRoadmap recommendations={result.recommendations} />
            <SimulationSandbox baselineInput={input} baselineResult={result} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Educational decision support only — not a substitute for clinical diagnosis.
      </footer>
    </div>
  );
}
