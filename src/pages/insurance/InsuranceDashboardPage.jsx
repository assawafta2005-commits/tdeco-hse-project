import React from "react";
import { ShieldCheck, Clock, AlertTriangle, FileWarning, Wallet, HandCoins } from "lucide-react";
import MetricCard from "../../components/common/MetricCard";
import { DataStatus, MockBadge } from "../../components/common/DataStatus";
import { badgeTone, formatMoney, daysUntil } from "../../config/insuranceListConfig";
import { listInsuranceDashboardData } from "../../services/insuranceService";
import { useServiceData } from "../../hooks/useServiceData";

const BADGE_STYLES = {
  ok: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  bad: "bg-rose-50 text-rose-700 ring-rose-600/20",
  warn: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

/**
 * Wraps the two-resource fetch (policies + claims) into the same
 * {rows, source, error} shape useServiceData expects, since the original
 * dashboard needs both at once for its KPIs.
 */
async function fetchDashboardData() {
  const { policies, claims } = await listInsuranceDashboardData();
  const error = policies.error || claims.error;
  if (error) return { rows: null, source: policies.source, error };
  return {
    rows: [{ policies: policies.rows, claims: claims.rows }],
    source: policies.source === "mock" || claims.source === "mock" ? "mock" : "firestore",
    error: null,
  };
}

function InsuranceDashboardPage() {
  const { status, rows, source, error, reload } = useServiceData(fetchDashboardData, []);
  const policies = rows[0]?.policies ?? [];
  const claims = rows[0]?.claims ?? [];

  // Empty state here would be wrong if policies exist but claims don't —
  // claims legitimately starts empty. Only show the shared Loading/Error
  // wrapper; render KPIs even with zero claims.
  if (status === "loading") {
    return <DataStatus status="loading" />;
  }
  if (status === "error") {
    return <DataStatus status="error" error={error} onRetry={reload} />;
  }

  const active = policies.filter((p) => daysUntil(p.end) > 0).length;
  const expiringSoon = policies.filter((p) => {
    const d = daysUntil(p.end);
    return d !== null && d > 0 && d <= 90;
  }).length;
  const expired = policies.filter((p) => {
    const d = daysUntil(p.end);
    return d !== null && d <= 0;
  }).length;
  const openClaims = claims.filter((c) => c.status !== "مغلقة").length;
  const totalPremiums = policies.reduce((s, p) => s + (Number(p.premium) || 0), 0);
  const totalReceived = claims.reduce((s, c) => s + (Number(c.received) || 0), 0);

  const alerts = [];
  policies.forEach((p) => {
    const d = daysUntil(p.end);
    if (d !== null && d <= 90) {
      alerts.push(`${p.type}: ${d <= 0 ? "منتهية" : `متبقي ${d} يومًا`}`);
    }
  });

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div>
        <h2 className="text-lg font-bold text-slate-900">لوحة قيادة التأمين</h2>
        <p className="text-sm text-slate-500 mt-1">ملخص الوضع التأميني للشركة</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <MetricCard icon={ShieldCheck} label="وثائق سارية" value={active} sub="من إجمالي الوثائق" tone="teal" />
        <MetricCard icon={Clock} label="قريبة الانتهاء" value={expiringSoon} sub="خلال 90 يومًا" tone="amber" />
        <MetricCard icon={AlertTriangle} label="منتهية" value={expired} sub="تحتاج تجديدًا فوريًا" tone="rose" />
        <MetricCard icon={FileWarning} label="مطالبات مفتوحة" value={openClaims} sub="قيد المتابعة" tone="slate" />
        <MetricCard icon={Wallet} label="إجمالي الأقساط" value={formatMoney(totalPremiums)} sub="جميع الوثائق" tone="slate" />
        <MetricCard icon={HandCoins} label="التعويضات المستلمة" value={formatMoney(totalReceived)} sub="من المطالبات" tone="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">حالة وثائق التأمين</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-3 py-2 font-medium">نوع التأمين</th>
                  <th className="px-3 py-2 font-medium">شركة التأمين</th>
                  <th className="px-3 py-2 font-medium">تاريخ الانتهاء</th>
                  <th className="px-3 py-2 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => {
                  let st = p.status;
                  if (p.end) {
                    const d = daysUntil(p.end);
                    st = d <= 0 ? "منتهية" : d <= 90 ? "قريبة الانتهاء" : "سارية";
                  }
                  return (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-3 py-2.5 text-slate-700">{p.type}</td>
                      <td className="px-3 py-2.5 text-slate-500">{p.insurer || "-"}</td>
                      <td className="px-3 py-2.5 text-slate-500 font-mono">{p.end || "حسب الترخيص"}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${BADGE_STYLES[badgeTone(st)]}`}>
                          {st}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">تنبيهات</h3>
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800">
                  {a}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">لا توجد تنبيهات حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsuranceDashboardPage;
