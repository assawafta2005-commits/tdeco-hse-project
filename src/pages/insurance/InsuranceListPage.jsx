import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Search, Plus, Trash2 } from "lucide-react";
import SectionHeading from "../../components/common/SectionHeading";
import Modal from "../../components/common/Modal";
import { DataStatus, MockBadge } from "../../components/common/DataStatus";
import RoleGate from "../../components/auth/RoleGate";
import { INSURANCE_RESOURCES, badgeTone, formatCell } from "../../config/insuranceListConfig";
import { listInsuranceResource, createInsuranceRecord, deleteInsuranceRecord } from "../../services/insuranceService";
import { useServiceData } from "../../hooks/useServiceData";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../utils/roles";

const BADGE_STYLES = {
  ok: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  bad: "bg-rose-50 text-rose-700 ring-rose-600/20",
  warn: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function StatusBadge({ status }) {
  const tone = badgeTone(status);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${BADGE_STYLES[tone]}`}>
      {status || "-"}
    </span>
  );
}

/**
 * One generic list+CRUD page reused for all 8 Insurance resources
 * (policies/claims/vehicles/assets/employees/insurers/finance/renewals/
 * archive) — driven entirely by INSURANCE_RESOURCES config. This mirrors
 * the original vanilla-JS renderList()/openAdd()/deleteRow() pattern,
 * translated to React + Firestore + this project's RBAC/audit system.
 */
function InsuranceListPage() {
  const { resource } = useParams();
  const { user } = useAuth();
  const config = INSURANCE_RESOURCES[resource];

  const fetcher = React.useCallback(() => listInsuranceResource(resource), [resource]);
  const { status, rows, source, error, reload } = useServiceData(fetcher, [resource]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  if (!config) return <Navigate to="/insurance/policies" replace />;

  const filtered = search
    ? rows.filter((r) => JSON.stringify(r).includes(search))
    : rows;

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await createInsuranceRecord(resource, form, user?.uid);
    setSaving(false);
    setShowModal(false);
    setForm({});
    reload();
  };

  const handleDelete = async (id) => {
    await deleteInsuranceRecord(resource, id, user?.uid);
    reload();
  };

  return (
    <div className="space-y-6" key={resource}>
      {source === "mock" && <MockBadge />}

      <SectionHeading title={config.title}>
        <RoleGate permission={PERMISSIONS.MANAGE_INSURANCE}>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
          >
            <Plus size={14} /> إضافة سجل
          </button>
        </RoleGate>
      </SectionHeading>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد سجلات حالياً">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  {config.cols.map(([key, label]) => (
                    <th key={key} className="px-4 py-3 font-medium">{label}</th>
                  ))}
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    {config.cols.map(([key]) => (
                      <td key={key} className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                        {key === "status" ? <StatusBadge status={row[key]} /> : formatCell(key, row[key])}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-left">
                      <RoleGate permission={PERMISSIONS.MANAGE_INSURANCE}>
                        <button onClick={() => handleDelete(row.id)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 size={14} />
                        </button>
                      </RoleGate>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataStatus>
      </div>

      {showModal && (
        <Modal title={`إضافة سجل — ${config.title}`} onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-sm">
            {config.fields.map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key] ?? ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60"
              >
                {saving ? "جارٍ الحفظ..." : "إضافة"}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs">
                إلغاء
              </button>
            </div>
            {source === "mock" && (
              <p className="text-[11px] text-amber-600">
                ملاحظة: Firebase غير مهيأ — لن يتم حفظ هذا السجل فعليًا (وضع تجريبي فقط).
              </p>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}

export default InsuranceListPage;
