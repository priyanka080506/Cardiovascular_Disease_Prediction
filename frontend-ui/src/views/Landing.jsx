export default function Landing({ onStart }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center">
      <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
        Explainable AI · Prescriptive Care
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
        Cardiovascular Risk Health Portal
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        A glass-box decision support system that predicts CVD risk, explains{" "}
        <em>why</em> with SHAP, and prescribes targeted DASH or Mediterranean
        protocols — plus interactive what-if simulations.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button type="button" className="btn-primary" onClick={onStart}>
          Start Risk Assessment
        </button>
      </div>
      <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
        {[
          {
            title: "Predict",
            desc: "Ensemble ML (XGBoost / RF) with 10-fold CV accuracy >85%.",
          },
          {
            title: "Explain",
            desc: "SHAP TreeExplainer reveals which vitals drive your risk score.",
          },
          {
            title: "Prescribe & Simulate",
            desc: "Rule-based DASH/Mediterranean plans and lifestyle what-if sliders.",
          },
        ].map((item) => (
          <div key={item.title} className="card">
            <h3 className="font-bold text-brand-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
