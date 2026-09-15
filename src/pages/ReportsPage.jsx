import React from "react";
import { BarChart3, Download } from "lucide-react";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { listReports } from "../services/reportsService";
import { useServiceData } from "../hooks/useServiceData";

function ReportsPage() {
  // Falls back to the same mock array (REPORTS) only when Firebase isn't
  // configured — see src/services/reportsService.js.
  const { status, rows: reports, source, error, reload } = useServiceData(listReports, []);

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div>
        <h2 className="text-lg font-bold text-slate-900">التقارير الإحصائية والتحليلية</h2>
        <p className="text-sm text-slate-500 mt-1">
          تقارير السلامة الشهرية والنصف سنوية الموجهة للإدارة العليا ووزارة العمل
        </p>
      </div>

      <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد تقارير متاحة حالياً">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((rep, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <BarChart3 size={18} />
                </div>
                <span className="font-mono text-[11px] text-slate-400">{rep.date}</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{rep.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{rep.sub}</p>
              </div>
              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                <Download size={14} /> تحميل التقرير ({rep.format})
              </button>
            </div>
          ))}
        </div>
      </DataStatus>
    </div>
  );
}

export default ReportsPage;
