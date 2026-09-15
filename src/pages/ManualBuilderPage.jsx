import React, { useState } from "react";
import { BUILDER_SCOPE_OPTIONS, BUILDER_CHAPTERS } from "../data/builderMock";

function ManualBuilderPage() {
  const [company, setCompany] = useState({
    name: "شركة كهرباء منطقة طوباس المساهمة العامة المحدودة",
    activity: "توزيع وتشغيل وصيانة شبكات الطاقة الكهربائية",
    region: "طوباس ومناطق الامتياز التابعة للشركة",
    staff: "80",
    version: "إصدار 2026",
  });
  const [scope, setScope] = useState(() => new Set(BUILDER_SCOPE_OPTIONS));
  const [saved, setSaved] = useState(false);

  const update = (field) => (e) => {
    setCompany((c) => ({ ...c, [field]: e.target.value }));
    setSaved(false);
  };

  const toggleScope = (item) => {
    setScope((s) => {
      const next = new Set(s);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
    setSaved(false);
  };

  const filledCount = Object.values(company).filter((v) => v.trim().length > 0).length;
  const progress = Math.round(((filledCount + (scope.size > 0 ? 1 : 0)) / 6) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">منشئ دليل السلامة للشركة</h2>
        <p className="text-sm text-slate-500 mt-1">
          أدخل بيانات الشركة مرة واحدة، واحفظ ملفها المؤسسي، ثم أنشئ مسودة دليل مرتبطة بالسجلات التشغيلية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Company info form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-medium text-amber-600">الخطوة الأولى</span>
              <h3 className="text-sm font-semibold text-slate-800">بيانات الشركة الأساسية</h3>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                saved ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {saved ? "محفوظ" : "لم يُحفظ بعد"}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">الاسم الرسمي للشركة</label>
              <input
                type="text"
                value={company.name}
                onChange={update("name")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">طبيعة النشاط</label>
                <input
                  type="text"
                  value={company.activity}
                  onChange={update("activity")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">المقر ومناطق العمل</label>
                <input
                  type="text"
                  value={company.region}
                  onChange={update("region")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">عدد العاملين</label>
                <input
                  type="text"
                  value={company.staff}
                  onChange={update("staff")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">الإصدار</label>
                <input
                  type="text"
                  value={company.version}
                  onChange={update("version")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-700 mb-2">نطاق العمل الذي سيتدرج تلقائياً</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BUILDER_SCOPE_OPTIONS.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={scope.has(item)}
                    onChange={() => toggleScope(item)}
                    className="accent-amber-600 rounded"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setSaved(true)}
              className="flex-1 rounded-lg bg-amber-500 py-2.5 text-xs font-semibold text-slate-900 hover:bg-amber-600"
            >
              حفظ ملف الشركة
            </button>
            <button className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              طباعة المسودة
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs text-slate-400">مسودة مولّدة من بيانات النظام مباشرة</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-amber-400">
              {progress}%
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">دليل السلامة والصحة المهنية والبيئة</h3>
            <p className="text-xs text-slate-400 mt-0.5">{company.name || "—"}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between rounded border border-white/10 bg-white/5 p-2.5">
              <span>النشاط الأساسي:</span>
              <span className="font-medium text-white">{company.activity || "—"}</span>
            </div>
            <div className="flex justify-between rounded border border-white/10 bg-white/5 p-2.5">
              <span>النطاق المعتمد:</span>
              <span className="font-medium text-white">{company.region || "—"}</span>
            </div>
            <div className="flex justify-between rounded border border-white/10 bg-white/5 p-2.5">
              <span>عدد العاملين المشمولين:</span>
              <span className="font-medium text-white">{company.staff || "—"}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">الفصول المقترحة تلقائياً</p>
            <div className="space-y-1.5">
              {BUILDER_CHAPTERS.map((ch) => (
                <div key={ch.num} className="flex items-center gap-2 rounded border border-white/10 bg-white/5 p-2">
                  <span className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                    {ch.num}
                  </span>
                  <span className="text-slate-200 text-xs">{ch.title}</span>
                </div>
              ))}
              {scope.has("مركز تخزين الطاقة والبطاريات") && (
                <div className="flex items-center gap-2 rounded border border-white/10 bg-white/5 p-2">
                  <span className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">05</span>
                  <span className="text-slate-200 text-xs">سلامة بطاريات تخزين الطاقة BESS</span>
                </div>
              )}
              {scope.has("أنظمة OT وIT والسيرفرات") && (
                <div className="flex items-center gap-2 rounded border border-white/10 bg-white/5 p-2">
                  <span className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">06</span>
                  <span className="text-slate-200 text-xs">الفصل الآمن لأنظمة التحكم الصناعي OT/IT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualBuilderPage;
