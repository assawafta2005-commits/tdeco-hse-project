import React from "react";

function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default SectionHeading;
