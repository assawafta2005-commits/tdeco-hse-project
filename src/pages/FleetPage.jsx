import React, { useState } from "react";
import { Truck, CheckCircle2, Clock, Wrench, Plus, Trash2 } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import MetricCard from "../components/common/MetricCard";
import Modal from "../components/common/Modal";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import RoleGate from "../components/auth/RoleGate";
import { FLEET_STATUS_STYLES } from "../data/fleetMock";
import { listVehicles, addVehicle, deleteVehicle } from "../services/vehiclesService";
import { useServiceData } from "../hooks/useServiceData";
import { useAuth } from "../hooks/useAuth";
import { PERMISSIONS } from "../utils/roles";

const EMPTY_FORM = { model: "", dept: "", driver: "", check: "", ins: "", status: "جاهز" };

function FleetPage() {
  const { user } = useAuth();
  const { status, rows: fleet, source, error, reload } = useServiceData(listVehicles, []);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await addVehicle(form, user?.uid);
    setSaving(false);
    setShowModal(false);
    setForm(EMPTY_FORM);
    reload();
  };

  const handleDelete = async (id) => {
    await deleteVehicle(id, user?.uid);
    reload();
  };

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <SectionHeading title="إدارة المركبات والآليات" subtitle="متابعة الفحص الدوري، التأمين، وجاهزية الرافعات ومركبات الطوارئ">
        <RoleGate permission={PERMISSIONS.MANAGE_VEHICLES}>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
          >
            <Plus size={14} /> إضافة مركبة
          </button>
        </RoleGate>
      </SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Truck} label="إجمالي الأسطول" value={fleet.length} sub="مركبات وآليات ثقيلة" tone="slate" />
        <MetricCard icon={CheckCircle2} label="المركبات الجاهزة" value={fleet.filter((v) => v.status === "جاهز").length} sub="نسبة التشغيل" tone="teal" />
        <MetricCard icon={Clock} label="فحص دوري مستحق" value={fleet.filter((v) => v.status === "فحص مستحق").length} sub="خلال هذا الأسبوع" tone="amber" />
        <MetricCard icon={Wrench} label="قيد الصيانة" value={fleet.filter((v) => v.status === "قيد الصيانة").length} sub="ورشة الصيانة المركزية" tone="rose" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا توجد مركبات مسجّلة حالياً">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">رمز المركبة</th>
                  <th className="px-4 py-3 font-medium">النوع / الموديل</th>
                  <th className="px-4 py-3 font-medium">الفرع / القسم</th>
                  <th className="px-4 py-3 font-medium">السائق / المسؤول</th>
                  <th className="px-4 py-3 font-medium">الفحص الدوري</th>
                  <th className="px-4 py-3 font-medium">انتهاء التأمين</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap font-mono">{v.id}</td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium whitespace-nowrap">{v.model}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{v.dept}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{v.driver}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap font-mono">{v.check}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap font-mono">{v.ins}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${FLEET_STATUS_STYLES[v.status] || "bg-slate-100 text-slate-600 ring-slate-500/20"}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-left">
                      <RoleGate permission={PERMISSIONS.MANAGE_VEHICLES}>
                        <button onClick={() => handleDelete(v.id)} className="text-rose-500 hover:text-rose-700">
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
        <Modal title="إضافة مركبة جديدة" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">النوع / الموديل</label>
              <input
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">الفرع / القسم</label>
              <input
                value={form.dept}
                onChange={(e) => setForm({ ...form, dept: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">السائق / المسؤول</label>
              <input
                value={form.driver}
                onChange={(e) => setForm({ ...form, driver: e.target.value })}
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

export default FleetPage;
