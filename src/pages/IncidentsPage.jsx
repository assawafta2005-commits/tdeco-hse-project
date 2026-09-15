import React, { useState } from "react";
import { Siren, AlertTriangle, FileSpreadsheet, CheckCircle2, Plus, Trash2 } from "lucide-react";
import MetricCard from "../components/common/MetricCard";
import Modal from "../components/common/Modal";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import RoleGate from "../components/auth/RoleGate";
import { INCIDENT_TYPE_STYLES, SEVERITY_STYLES } from "../data/incidentsMock";
import { listIncidents, createIncident, deleteIncident } from "../services/incidentsService";
import { useServiceData } from "../hooks/useServiceData";
import { useAuth } from "../hooks/useAuth";
import { PERMISSIONS } from "../utils/roles";

const EMPTY_FORM = { type: "حادث", desc: "", loc: "", date: "", severity: "منخفضة", status: "قيد التحقيق" };

function IncidentsPage() {
  const { user } = useAuth();
  const { status, rows: incidents, source, error, reload } = useServiceData(listIncidents, []);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const pendingMinistry = incidents.filter((it) => it.status === "بانتظار نموذج الوزارة");

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await createIncident(form, user?.uid);
    setSaving(false);
    setShowModal(false);
    setForm(EMPTY_FORM);
    reload();
  };

  const handleDelete = async (id) => {
    await deleteIncident(id, user?.uid);
    reload();
  };

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Siren} label="إجمالي هذا الشهر" value={incidents.length} sub="حوادث وأحداث وشيكة" tone="slate" />
        <MetricCard icon={AlertTriangle} label="بحاجة تحقيق" value={incidents.filter((i) => i.status === "تحقيق جارٍ").length} sub="تحقيق قيد التنفيذ" tone="rose" />
        <MetricCard icon={FileSpreadsheet} label="نماذج وزارة العمل" value={pendingMinistry.length} sub="بانتظار التقديم خلال 48 ساعة" tone="amber" />
        <MetricCard icon={CheckCircle2} label="أُغلقت" value={incidents.filter((i) => i.status === "مكتمل").length} sub="تم استكمال التحقيق" tone="teal" />
      </div>

      {pendingMinistry.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600 shrink-0">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">إشعار قانوني مطلوب</p>
            <p className="text-sm text-amber-700 mt-0.5">
              الحادث <span className="font-mono">{pendingMinistry[0].id}</span> يتطلب تعبئة نموذج إشعار رسمي لوزارة العمل خلال 48 ساعة من وقوعه
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-xs font-semibold text-slate-500">متابعة قانونية تلقائية</p>
          <p className="text-sm font-semibold text-slate-700 mt-1">لا توجد بلاغات معلقة لإخطار وزارة العمل حالياً</p>
          <p className="text-xs text-slate-400 mt-1">
            عند تسجيل إصابة عمل أو مرض مهني أو حادث جسيم، سيظهر إشعار المتابعة هنا تلقائياً
          </p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">سجل الحوادث والإصابات والأحداث الوشيكة</h3>
          <RoleGate permission={PERMISSIONS.CREATE_INCIDENT}>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
            >
              <Plus size={14} /> تسجيل حادث
            </button>
          </RoleGate>
        </div>

        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد حوادث مسجّلة حالياً">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">الرقم</th>
                  <th className="px-4 py-3 font-medium">النوع</th>
                  <th className="px-4 py-3 font-medium">الوصف</th>
                  <th className="px-4 py-3 font-medium">الموقع</th>
                  <th className="px-4 py-3 font-medium">التاريخ</th>
                  <th className="px-4 py-3 font-medium">الشدة</th>
                  <th className="px-4 py-3 font-medium">حالة التحقيق</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((it) => (
                  <tr key={it.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap font-mono">{it.id}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${INCIDENT_TYPE_STYLES[it.type] || "bg-slate-100 text-slate-600 ring-slate-500/20"}`}>
                        {it.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 max-w-xs">{it.desc}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{it.loc}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap font-mono">{it.date}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className={`h-2 w-2 rounded-full ${SEVERITY_STYLES[it.severity] || "bg-slate-400"}`} />
                        {it.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{it.status}</td>
                    <td className="px-4 py-3.5 text-left">
                      <RoleGate permission={PERMISSIONS.MANAGE_INCIDENTS}>
                        <button onClick={() => handleDelete(it.id)} className="text-rose-500 hover:text-rose-700">
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
        <Modal title="تسجيل حادث جديد" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">النوع</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              >
                <option>حادث</option>
                <option>حدث وشيك</option>
                <option>إصابة بسيطة</option>
                <option>ضرر ممتلكات</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">الوصف</label>
              <textarea
                required
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
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
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60"
              >
                {saving ? "جارٍ الحفظ..." : "إضافة للسجل"}
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

export default IncidentsPage;
