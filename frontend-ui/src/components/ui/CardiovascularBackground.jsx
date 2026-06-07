import { motion } from "framer-motion";
import { HeartPulseIcon, ActivityIcon, BeakerIcon } from "./Icons";

/** Subtle cardiovascular-themed ambient background — never distracts from content. */
export default function CardiovascularBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Soft gradient mesh */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[60%] w-[60%] rounded-full bg-brand-200/20 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[50%] w-[50%] rounded-full bg-secondary-100/30 blur-[90px]"
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ECG heartbeat line — bottom of viewport */}
      <div className="absolute bottom-0 left-0 right-0 opacity-[0.07]">
        <ECGLine />
      </div>

      {/* Floating health particles */}
      <FloatingParticle icon={HeartPulseIcon} className="left-[8%] top-[18%]" delay={0} />
      <FloatingParticle icon={ActivityIcon} className="right-[12%] top-[28%]" delay={2} />
      <FloatingParticle icon={BeakerIcon} className="left-[15%] bottom-[25%]" delay={4} />
      <FloatingParticle icon={HeartPulseIcon} className="right-[8%] bottom-[35%]" delay={1.5} />

      {/* Medical grid dots */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #2563EB 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

function ECGLine() {
  const path =
    "M0,40 L40,40 L50,40 L55,20 L60,55 L65,10 L70,40 L80,40 L120,40 L130,40 L135,22 L140,48 L145,15 L150,40 L160,40 L200,40 L400,40 L800,40 L1200,40 L1600,40";

  return (
    <svg
      className="h-16 w-full sm:h-20"
      viewBox="0 0 1600 80"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        d={path}
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.path
        d={path}
        stroke="#14B8A6"
        strokeWidth="1"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.4, 0.6, 1],
        }}
        style={{ opacity: 0.5 }}
      />
    </svg>
  );
}

function FloatingParticle({ icon: Icon, className, delay }) {
  return (
    <motion.div
      className={`absolute flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-brand-400/40 shadow-sm backdrop-blur-sm sm:h-12 sm:w-12 ${className}`}
      animate={{ y: [0, -14, 0], opacity: [0.3, 0.55, 0.3] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </motion.div>
  );
}
