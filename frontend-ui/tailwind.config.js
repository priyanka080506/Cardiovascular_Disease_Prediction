/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F8FAFC",
          100: "#EFF6FF",
          200: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          900: "#0F172A",
        },
        secondary: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          500: "#14B8A6",
          600: "#0D9488",
        },
        surface: "#F8FAFC",
        ink: "#0F172A",
        muted: "#64748B",
        risk: {
          low: "#22C55E",
          moderate: "#F59E0B",
          high: "#EF4444",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "700" }],
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "card-hover": "0 8px 28px -4px rgb(15 23 42 / 0.1), 0 4px 12px -2px rgb(37 99 235 / 0.06)",
        elevated: "0 16px 48px -12px rgb(15 23 42 / 0.14)",
        glass: "0 8px 32px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        glow: "0 0 24px -4px rgba(37, 99, 235, 0.25)",
        "glow-sm": "0 0 12px -2px rgba(37, 99, 235, 0.15)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(37, 99, 235, 0.07), transparent 70%), radial-gradient(ellipse 40% 30% at 90% 10%, rgba(20, 184, 166, 0.05), transparent 60%)",
        "card-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)",
        "panel-muted": "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
        "accent-line": "linear-gradient(90deg, #2563EB, #14B8A6)",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "ecg-scroll": "ecgScroll 4s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        ecgScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
