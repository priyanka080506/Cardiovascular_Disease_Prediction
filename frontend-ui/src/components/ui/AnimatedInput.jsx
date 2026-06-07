import { motion } from "framer-motion";

/** Wraps form inputs with focus ring animation. */
export default function AnimatedInput({ children, hasError = false, className = "" }) {
  return (
    <motion.div
      className={`relative rounded-xl ${className}`}
      whileFocus={{ scale: 1.005 }}
      transition={{ duration: 0.15 }}
    >
      {children}
      <motion.div
        className={`pointer-events-none absolute inset-0 rounded-xl ring-2 ${
          hasError ? "ring-danger/30" : "ring-brand-500/0"
        }`}
        initial={false}
        animate={{ opacity: hasError ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
