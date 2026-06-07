import { motion } from "framer-motion";
import { CheckCircleIcon } from "./Icons";

export default function ProgressIndicator({ steps, currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const current = steps[currentStep];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <motion.div
          className="min-w-0"
          key={currentStep}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-overline">Step {currentStep + 1} of {steps.length}</p>
          <p className="truncate text-subheading">{current?.label}</p>
        </motion.div>
        <motion.span
          className="shrink-0 text-caption font-semibold text-brand-600"
          key={progress}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-200/80">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-600 to-secondary-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-24 rounded-full bg-white/40"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ width: `${Math.min(progress, 30)}%` }}
        />
      </div>

      <div className="hidden justify-between sm:flex">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center gap-1.5"
              animate={{ scale: active ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  done
                    ? "border-brand-600 bg-brand-600 text-white"
                    : active
                      ? "border-brand-600 bg-white text-brand-600 shadow-glow-sm"
                      : "border-slate-200 bg-white text-slate-300"
                }`}
                animate={active ? { boxShadow: ["0 0 0 0 rgba(37,99,235,0)", "0 0 0 6px rgba(37,99,235,0.12)", "0 0 0 0 rgba(37,99,235,0)"] } : {}}
                transition={{ duration: 2, repeat: active ? Infinity : 0 }}
              >
                {done ? (
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                ) : (
                  <step.icon className="h-3.5 w-3.5" />
                )}
              </motion.div>
              <span
                className={`max-w-[4.5rem] text-center text-[10px] font-medium leading-tight ${
                  active ? "text-brand-700" : done ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
