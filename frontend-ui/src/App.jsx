import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import CardiovascularBackground from "./components/ui/CardiovascularBackground";
import { DashboardSkeleton, FormSkeleton } from "./components/ui/Skeleton";
import VitalsForm from "./components/VitalsForm";
import { AlertIcon } from "./components/ui/Icons";
import { predictHealth } from "./utils/api";
import { pageTransition } from "./utils/motionVariants";
import Dashboard from "./views/Dashboard";
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
    <div className="relative flex min-h-screen flex-col bg-surface">
      <CardiovascularBackground />
      <div className="pointer-events-none fixed inset-0 bg-hero-gradient" aria-hidden />

      <Header
        step={step}
        onHome={() => { setStep("landing"); setError(""); }}
        onNewAssessment={() => { setStep("form"); setError(""); }}
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div key="landing" {...pageTransition}>
              <Landing onStart={() => setStep("form")} />
            </motion.div>
          )}

          {step === "form" && (
            <motion.div key="form" {...pageTransition} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                        <p className="mt-1 text-caption text-red-600">
                          Start the API:{" "}
                          <code className="rounded bg-red-100/80 px-1.5 py-0.5 font-mono">
                            uvicorn app.main:app --reload
                          </code>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {loading ? <FormSkeleton /> : <VitalsForm onSubmit={handlePredict} loading={loading} />}
            </motion.div>
          )}

          {step === "dashboard" && loading && (
            <motion.div key="loading" {...pageTransition}>
              <DashboardSkeleton />
            </motion.div>
          )}

          {step === "dashboard" && result && input && !loading && (
            <motion.div key="dashboard" {...pageTransition}>
              <Dashboard result={result} input={input} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
