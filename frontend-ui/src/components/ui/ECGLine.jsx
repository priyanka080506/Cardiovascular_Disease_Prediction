import { motion } from "framer-motion";

/** Compact animated ECG strip for hero sections. */
export default function ECGLine({ className = "" }) {
  const w = 280;
  const h = 48;
  const mid = h / 2;
  const path = `M0,${mid} L30,${mid} L38,${mid} L42,${mid - 14} L46,${mid + 18} L50,${mid - 22} L54,${mid} L62,${mid} L90,${mid} L98,${mid} L102,${mid - 12} L106,${mid + 14} L110,${mid - 8} L114,${mid} L122,${mid} L${w},${mid}`;

  return (
    <div className={`overflow-hidden ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#2563EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke="url(#ecg-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 12"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0], strokeDashoffset: [0, -32] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
