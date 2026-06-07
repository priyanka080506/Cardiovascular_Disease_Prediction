export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-caption text-slate-400">
          Educational decision support only — not a substitute for clinical diagnosis.
          {" "}
          <span className="text-slate-300">© {new Date().getFullYear()} CVD Insight</span>
        </p>
      </div>
    </footer>
  );
}
