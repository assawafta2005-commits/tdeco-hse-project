import React from "react";
import { BarChart3 } from "lucide-react";
import { DataStatus, MockBadge } from "../../components/common/DataStatus";
import { formatMoney } from "../../config/insuranceListConfig";
import { listInsuranceDashboardData } from "../../services/insuranceService";
import { useServiceData } from "../../hooks/useServiceData";

async function fetchReportsData() {
  const { policies, claims } = await listInsuranceDashboardData();
  const error = policies.error || claims.error;
  if (error) return { rows: null, source: policies.source, error };
  return {
    rows: [{ policies: policies.rows, claims: claims.rows }],
    source: policies.source === "mock" || claims.source === "mock" ? "mock" : "firestore",
    error: null,
  };
}

function InsuranceReportsPage() {
  const { status, rows, source, error, reload } = useServiceData(fetchReportsData, []);

  if (status === "loading") return <DataStatus status="loading" />;
  if (status === "error") return <DataStatus status="error" error={error} onRetry={reload} />;

  const policies = rows[0]?.policies ?? [];
  const claims = rows[0]?.claims ?? [];

  const premiums = policies.reduce((s, p) => s + (Number(p.premium) || 0), 0);
  const claimsTotal = claims.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  const received = claims.reduce((s, c) => s + (Number(c.received) || 0), 0);
  const recoveryPct = claimsTotal ? Math.round((received / claimsTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div>
        <h2 className="text-lg font-bold text-slate-900">التقارير</h2>
        <p className="text-sm text-slate-500 mt-1">تقارير إدارية وتشغيلية لنشاط التأمين</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600 w-fit">
            <BarChart3 size={18} />
          </div>
          <p className="mt-3 text-xs text-slate-500">إجمالي الأقساط</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(premiums)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600 w-fit">
            <BarChart3 size={18} />
          </div>
          <p className="mt-3 text-xs text-slate-500">إجمالي المطالبات</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(claimsTotal)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600 w-fit">
            <BarChart3 size={18} />
          </div>
          <p className="mt-3 text-xs text-slate-500">التعويضات المستلمة</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(received)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600 w-fit">
            <BarChart3 size={18} />
          </div>
          <p className="mt-3 text-xs text-slate-500">نسبة الاسترداد</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{recoveryPct}%</p>
        </div>
      </div>
    </div>
  );
}

export default InsuranceReportsPage;
