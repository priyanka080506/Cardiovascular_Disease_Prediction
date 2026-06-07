import { HeartPulseIcon } from "../ui/Icons";

const STEPS = [
  { key: "landing", label: "Home" },
  { key: "form", label: "Assessment" },
  { key: "dashboard", label: "Results" },
];

export default function Header({ step, onHome, onNewAssessment }) {
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="group flex min-w-0 items-center gap-3"
          onClick={onHome}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <HeartPulseIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 text-left">
            <span className="block truncate text-sm font-bold text-ink">
              CVD<span className="text-brand-600">Insight</span>
            </span>
          </div>
        </button>

        {step !== "landing" && (
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Progress"
          >
            {STEPS.slice(1).map((s, i) => {
              const idx = i + 1;
              const active = stepIndex === idx;
              const done = stepIndex > idx;
              return (
                <div key={s.key} className="flex items-center gap-1">
                  {i > 0 && (
                    <span className="mx-1 h-px w-6 bg-slate-200" />
                  )}
                  <span
                    className={`text-caption font-medium ${
                      active
                        ? "text-brand-600"
                        : done
                          ? "text-slate-500"
                          : "text-slate-300"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {step === "dashboard" && (
            <span className="badge-success hidden sm:inline-flex">Complete</span>
          )}
          {step !== "landing" && (
            <button type="button" className="btn-secondary" onClick={onNewAssessment}>
              New Assessment
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
