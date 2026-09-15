import React from "react";

function MetricCard({ icon: Icon, label, value, sub, tone = "slate" }) {
  const tones = {
    slate: "text-slate-700 bg-slate-100",
    rose: "text-rose-700 bg-rose-100",
    amber: "text-amber-700 bg-amber-100",
    teal: "text-emerald-700 bg-emerald-100",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>
      <div className={`rounded-lg p-2.5 ${tones[tone]}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

export default MetricCard;
