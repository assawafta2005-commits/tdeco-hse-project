import React, { useState, useMemo } from "react";
import { ChevronLeft, Search } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { MANUAL_CATEGORIES } from "../data/manualMock";
import { listManualSections, listManualVolumes } from "../services/documentsService";
import { useServiceData } from "../hooks/useServiceData";

function ManualPage() {
  // Falls back to the same mock arrays (MANUAL_SECTIONS / MANUAL_VOLUMES)
  // only when Firebase isn't configured — see src/services/documentsService.js.
  const { status, rows: sections, source, error, reload } = useServiceData(listManualSections, []);
  const { rows: volumes } = useServiceData(listManualVolumes, []);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered = useMemo(
    () =>
      activeCategory === "الكل"
        ? sections
        : sections.filter((s) => s.tag === activeCategory),
    [activeCategory, sections]
  );

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">دليل السلامة والصحة المهنية</h2>
            <p className="text-sm text-slate-500 mt-1">المرجع الموحد لجميع سياسات وإجراءات السلامة في الشركة</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث في الدليل..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xl font-bold text-slate-900">1,021</p>
            <p className="text-xs text-slate-400 mt-0.5">صفحة موحدة</p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">11</p>
            <p className="text-xs text-slate-400 mt-0.5">مجلداً تخصيصياً</p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">إصدار 2026</p>
            <p className="text-xs text-slate-400 mt-0.5">آخر تحديث معتمد</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MANUAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-amber-500 text-slate-900"
                : "bg-white text-slate-600 border border-slate-200 hover:border-amber-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div>
        <SectionHeading title="الموضوعات التشغيلية الأهم" />
        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد موضوعات في الدليل حالياً">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                    <s.icon size={18} />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{s.code}</span>
                </div>
                <h4 className="mt-4 text-sm font-semibold text-slate-800">{s.title}</h4>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{s.tag}</span>
                  <button className="flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800">
                    قراءة الإجراء
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DataStatus>
      </div>

      <div>
        <SectionHeading title="مجلدات الدليل المعتمدة" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {volumes.map((v, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3 hover:border-amber-300 transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{v.title}</p>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 font-mono text-[10px] text-slate-400">
                  <span className="truncate">{v.code}</span>
                  <span className="shrink-0">{v.pages}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManualPage;
