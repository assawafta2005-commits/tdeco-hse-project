import React, { useEffect, useState } from "react";
import {
  ShieldAlert, ChevronLeft, ClipboardList, CheckCircle2, HardHat, XOctagon, FileText,
} from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { SOP_RISK_STYLES } from "../data/sopsMock";
import { listSops, getSopDetail } from "../services/sopsService";
import { useServiceData } from "../hooks/useServiceData";

function SopsPage() {
  // Falls back to the same mock arrays (SOPS / SOP_DETAILS) only when
  // Firebase isn't configured — see src/services/sopsService.js.
  const { status, rows: sops, source, error, reload } = useServiceData(listSops, []);
  const [selectedCode, setSelectedCode] = useState("MV-01");
  const [detail, setDetail] = useState(null);
  const [detailSource, setDetailSource] = useState(null);

  useEffect(() => {
    let active = true;
    getSopDetail(selectedCode).then((res) => {
      if (!active) return;
      setDetail(res.detail);
      setDetailSource(res.source);
    });
    return () => {
      active = false;
    };
  }, [selectedCode]);

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div>
        <SectionHeading title="إجراءات العمل التشغيلية" subtitle="الإجراءات القياسية المعتمدة لكل نشاط ميداني عالي الخطورة" />
        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد إجراءات عمل مسجّلة حالياً">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {sops.map((s) => {
              const active = s.code === selectedCode;
              return (
                <button
                  key={s.code}
                  onClick={() => setSelectedCode(s.code)}
                  className={`text-right rounded-xl border bg-white p-5 transition-colors ${
                    active ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400">{s.code}</span>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${SOP_RISK_STYLES[s.risk]}`}>
                      {s.risk}
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-slate-800">{s.title}</h4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  <span className="mt-4 flex items-center gap-1 text-xs font-medium text-amber-700">
                    فتح الإجراء الكامل
                    <ChevronLeft size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </DataStatus>
      </div>

      {detail ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <span className="font-mono text-xs text-slate-400">{detail.docCode}</span>
                <h3 className="text-base font-bold text-slate-900">{detail.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">{detail.summary}</p>
              </div>
            </div>
            <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${SOP_RISK_STYLES[detail.risk]}`}>
              تصنيف المخاطر: {detail.risk}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <ClipboardList size={16} className="text-slate-500" /> المتطلبات المسبقة
              </h4>
              <ul className="space-y-2">
                {detail.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <HardHat size={16} className="text-slate-500" /> معدات الحماية الشخصية المطلوبة
              </h4>
              <ul className="space-y-2">
                {detail.ppe.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <ClipboardList size={16} className="text-slate-500" /> خطوات التنفيذ الميدانية
            </h4>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {detail.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs text-slate-700 leading-snug pt-0.5">{s}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 mb-6">
            <h4 className="text-sm font-semibold text-rose-800 flex items-center gap-2 mb-3">
              <XOctagon size={16} /> حالات إيقاف العمل الفورية
            </h4>
            <ul className="space-y-2">
              {detail.emergencyStop.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">النماذج ذات الصلة</h4>
            <div className="flex flex-wrap gap-2">
              {detail.relatedForms.map((f, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
                >
                  <FileText size={13} className="text-slate-400" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-600">الإجراء التفصيلي لهذا التصنيف قيد الإعداد</p>
          <p className="text-xs text-slate-400 mt-1">سيتم نشر خطوات التنفيذ الكاملة قريباً</p>
        </div>
      )}
    </div>
  );
}


export default SopsPage;
