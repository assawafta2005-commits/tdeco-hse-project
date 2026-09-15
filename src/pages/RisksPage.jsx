import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, Search, Filter, Download, Plus, MapPin, Trash2 } from "lucide-react";
import MetricCard from "../components/common/MetricCard";
import Modal from "../components/common/Modal";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import RoleGate from "../components/auth/RoleGate";
import { RISK_LEVEL_STYLES } from "../data/risksMock";
import { listRisks, createRisk, deleteRisk } from "../services/risksService";
import { useServiceData } from "../hooks/useServiceData";
import { useAuth } from "../hooks/useAuth";
import { PERMISSIONS } from "../utils/roles";

const EMPTY_FORM = { risk: "", loc: "", level: "متوسط", owner: "", status: "مفتوح", due: "" };

function RisksPage() {
  const { user } = useAuth();
  const { status, rows: risks, source, error, reload } = useServiceData(listRisks, []);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await createRisk(form, user?.uid);
    setSaving(false);
    setShowModal(false);
    setForm(EMPTY_FORM);
    reload();
  };

  const handleDelete = async (id) => {
    await deleteRisk(id, user?.uid);
    reload();
  };

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={ShieldAlert} label="مفتوحة" value={risks.filter((r) => r.status !== "مغلق").length} sub="إجمالي المخاطر النشطة" tone="slate" />
        <MetricCard icon={AlertTriangle} label="عالية الخطورة" value={risks.filter((r) => r.level === "عالي").length} sub="تتطلب إجراء عاجل" tone="rose" />
        <MetricCard icon={Clock} label="متأخرة" value={risks.filter((r) => r.status === "متأخر").length} sub="تجاوزت تاريخ الاستحقاق" tone="amber" />
        <MetricCard icon={CheckCircle2} label="مغلقة" value={risks.filter((r) => r.status === "مغلق").length} sub="تمت معالجتها بنجاح" tone="teal" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن خطر..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={14} /> تصفية
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <Download size={14} /> تصدير
            </button>
            <RoleGate permission={PERMISSIONS.MANAGE_RISKS}>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
              >
                <Plus size={14} /> إضافة خطر
              </button>
            </RoleGate>
          </div>
        </div>

        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد مخاطر مسجّلة حالياً">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">الرقم</th>
                  <th className="px-4 py-3 font-medium">الخطر</th>
                  <th className="px-4 py-3 font-medium">الموقع</th>
                  <th className="px-4 py-3 font-medium">المستوى</th>
                  <th className="px-4 py-3 font-medium">المسؤول</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                  <th className="px-4 py-3 font-medium">الاستحقاق</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">{r.id}</td>
                    <td className="px-4 py-3.5 text-slate-700 max-w-xs">{r.risk}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" /> {r.loc}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${RISK_LEVEL_STYLES[r.level] || "bg-slate-100 text-slate-600 ring-slate-500/20"}`}>
                        {r.level}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{r.owner}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{r.status}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{r.due}</td>
                    <td className="px-4 py-3.5 text-left">
                      <RoleGate permission={PERMISSIONS.MANAGE_RISKS}>
                        <button onClick={() => handleDelete(r.id)} className="text-rose-500 hover:text-rose-700">
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
        <Modal title="إضافة خطر جديد" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">وصف الخطر</label>
              <textarea
                required
                value={form.risk}
                onChange={(e) => setForm({ ...form, risk: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm h-20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">الموقع</label>
              <input
                required
                value={form.loc}
                onChange={(e) => setForm({ ...form, loc: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">المستوى</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              >
                <option>عالي</option>
                <option>متوسط</option>
                <option>منخفض</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">المسؤول</label>
              <input
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              />
            </div>
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

export default RisksPage;
