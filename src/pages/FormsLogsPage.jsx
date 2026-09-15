import React from "react";
import { Plus, CheckCircle2, ChevronLeft } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { listForms } from "../services/formsService";
import { useServiceData } from "../hooks/useServiceData";

function FormsLogsPage() {
  // Falls back to the same mock array (FORMS) only when Firebase isn't
  // configured — see src/services/formsService.js.
  const { status, rows: forms, source, error, reload } = useServiceData(listForms, []);

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <SectionHeading title="النماذج والسجلات التشغيلية" subtitle="مكتبة النماذج المعتمدة لتصاريح العمل، الفحص اليومي، والـ LOTO">
        <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600">
          <Plus size={14} /> إنشاء نموذج جديد
        </button>
      </SectionHeading>

      <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد نماذج مسجّلة حالياً">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {forms.map((f) => (
            <div
              key={f.code}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-amber-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-mono text-slate-400">{f.code}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{f.category}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800">{f.title}</h4>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <CheckCircle2 size={13} /> نشط
                </span>
                <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
                  تعبئة النموذج
                  <ChevronLeft size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DataStatus>
    </div>
  );
}

export default FormsLogsPage;
