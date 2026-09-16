import React from "react";
import {
  ShieldAlert, Siren, Files, Truck, AlertTriangle, CircleAlert, Wrench,
} from "lucide-react";
import MetricCard from "../components/common/MetricCard";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { getDashboardSummary } from "../services/dashboardService";
import { useServiceData } from "../hooks/useServiceData";
import { useAuth } from "../hooks/useAuth";

function getTimeGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "صباح الخير" : "مساء الخير";
}

function DashboardPage() {
  const { user, profile } = useAuth();
  const { status, rows, source, error, reload } = useServiceData(getDashboardSummary, []);

  // Prefer the Firestore profile's displayName, then Firebase Auth's
  // displayName, then the part of the email before "@", then a neutral
  // fallback if nothing is available (e.g. mock/dev mode with no session).
  const displayName =
    profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "زائر";

  const greeting = (
    <div>
      <h1 className="text-xl font-bold text-slate-900">
        {getTimeGreeting()}، {displayName}
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        إليك ملخص أداء السلامة والصحة المهنية والبيئة لهذا الأسبوع
      </p>
    </div>
  );

  if (status === "loading") {
    return <div className="space-y-6">{greeting}<DataStatus status="loading" /></div>;
  }
  if (status === "error") {
    return (
      <div className="space-y-6">
        {greeting}
        <DataStatus status="error" error={error} onRetry={reload} />
      </div>
    );
  }

  // A brand-new project with zero records is a valid state, not "empty" —
  // the dashboard should still render with zeros rather than an empty box.
  const s = rows[0] ?? {
    openRisks: 0, highRisks: 0, incidentsThisMonth: 0, pendingForms: 0,
    readyVehicles: 0, totalVehicles: 0, readinessPct: 0,
    vehiclesNeedingInspection: 0, chart: [], highPriorityAlerts: [], notificationCount: 0,
  };

  const maxVal = Math.max(1, ...s.chart.map((m) => Math.max(m.risks, m.reports)));

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      {greeting}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={ShieldAlert}
          label="المخاطر المفتوحة"
          value={s.openRisks}
          sub={s.openRisks ? "تطلب إجراء" : "لا توجد مخاطر مفتوحة"}
          tone="rose"
        />
        <MetricCard
          icon={Siren}
          label="الحوادث هذا الشهر"
          value={s.incidentsThisMonth}
          sub={s.incidentsThisMonth ? "مسجلة هذا الشهر" : "لا حوادث هذا الشهر"}
          tone="amber"
        />
        <MetricCard
          icon={Files}
          label="النماذج المتأخرة"
          value={s.pendingForms}
          sub={s.pendingForms ? "بانتظار الإغلاق" : "لا نماذج معلقة"}
          tone="slate"
        />
        <MetricCard
          icon={Truck}
          label="المركبات الجاهزة"
          value={s.totalVehicles ? `${s.readyVehicles}/${s.totalVehicles}` : "—"}
          sub={s.totalVehicles ? `نسبة الجاهزية ${s.readinessPct}%` : "لا مركبات مسجّلة"}
          tone="teal"
        />
      </div>

      {s.highPriorityAlerts.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
          <div className="rounded-lg bg-rose-100 p-2 text-rose-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-rose-800">
              تنبيه عالي الأهمية: {s.highPriorityAlerts.length} من المخاطر عالية الخطورة تتطلب إجراءً
            </p>
            <p className="text-sm text-rose-700 mt-0.5">
              {s.highPriorityAlerts
                .slice(0, 2)
                .map((r) => r.risk || r.type)
                .filter(Boolean)
                .join(" — ") || "راجع سجل المخاطر لمزيد من التفاصيل"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">المخاطر مقابل البلاغات</h3>
              <p className="text-xs text-slate-400 mt-0.5">آخر 6 أشهر</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> المخاطر
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> البلاغات
              </span>
            </div>
          </div>
          {s.chart.length > 0 ? (
            <div className="flex items-end justify-between gap-3 h-48">
              {s.chart.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                  <div className="flex items-end gap-1 h-full w-full justify-center">
                    <div
                      className="w-3 sm:w-4 rounded-t bg-amber-500"
                      style={{ height: `${(m.risks / maxVal) * 100}%` }}
                      title={`المخاطر: ${m.risks}`}
                    />
                    <div
                      className="w-3 sm:w-4 rounded-t bg-slate-300"
                      style={{ height: `${(m.reports / maxVal) * 100}%` }}
                      title={`البلاغات: ${m.reports}`}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{m.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">لا توجد بيانات كافية لعرض الرسم البياني</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">حالة المركبات</h3>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray={`${s.readinessPct} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
                {s.readinessPct}%
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {s.totalVehicles
                  ? `${s.readyVehicles} من أصل ${s.totalVehicles} مركبة جاهزة`
                  : "لا توجد مركبات مسجّلة"}
              </p>
              <p className="text-xs text-slate-400 mt-1">نسبة الجاهزية الإجمالية للأسطول</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {s.vehiclesNeedingInspection > 0 && (
              <div className="flex items-center gap-2.5 rounded-lg bg-amber-50 px-3 py-2.5">
                <CircleAlert size={16} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800">
                  {s.vehiclesNeedingInspection} مركبات بحاجة لفحص دوري
                </p>
              </div>
            )}
            <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
              <Wrench size={16} className="text-slate-500 shrink-0" />
              <p className="text-xs text-slate-600">
                {s.totalVehicles - s.readyVehicles > 0
                  ? `${s.totalVehicles - s.readyVehicles} مركبة غير جاهزة للتشغيل`
                  : "جميع المركبات جاهزة للتشغيل"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
