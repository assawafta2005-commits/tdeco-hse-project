import React from "react";

function Placeholder({ icon: Icon, title }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-24 text-center">
      <div className="rounded-full bg-slate-100 p-4 text-slate-400">
        <Icon size={28} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">هذا القسم قيد الإعداد حالياً</p>
    </div>
  );
}

export default Placeholder;
