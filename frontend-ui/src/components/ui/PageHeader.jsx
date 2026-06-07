import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <motion.div
      className="mb-8 border-b border-slate-200/80 pb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {eyebrow && (
        <motion.p
          className="text-overline text-brand-600"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        className="mt-1 text-display text-ink"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          className="mt-2 max-w-2xl text-body-lg text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.4 }}
        >
          {description}
        </motion.p>
      )}
      <motion.div
        className="accent-bar mt-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        style={{ originX: 0 }}
      />
      {children}
    </motion.div>
  );
}
