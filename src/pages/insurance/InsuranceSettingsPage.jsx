import React, { useState } from "react";
import { Download, ShieldAlert } from "lucide-react";
import { INSURANCE_RESOURCES } from "../../config/insuranceListConfig";
import { listInsuranceResource } from "../../services/insuranceService";
import RoleGate from "../../components/auth/RoleGate";
import { PERMISSIONS } from "../../utils/roles";

/**
 * The original vanilla-JS version had two actions here: "Export backup"
 * and "Reset to default data". Export is ported as-is (safe — just reads
 * current data and downloads JSON). "Reset to defaults" is intentionally
 * NOT ported: against a real Firestore project, silently overwriting
 * every insurance collection with seed data would destroy real records —
 * exactly what this project's "never auto-seed/overwrite real Firebase
 * data" rule exists to prevent. If a real reset/restore tool is needed
 * later, it should be a deliberate, explicitly confirmed, per-collection
 * operation — not a single button.
 */
function InsuranceSettingsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    const entries = await Promise.all(
      Object.keys(INSURANCE_RESOURCES).map(async (resource) => {
        const { rows } = await listInsuranceResource(resource);
        return [resource, rows];
      })
    );
    const backup = Object.fromEntries(entries);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tdeco-insurance-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">إعدادات التأمين والنسخ الاحتياطي</h2>
        <p className="text-sm text-slate-500 mt-1">يمكن حفظ نسخة احتياطية من بيانات التأمين الحالية</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">تصدير نسخة احتياطية</h3>
        <p className="text-xs text-slate-500 mb-4">
          يقرأ جميع سجلات التأمين الحالية (الوثائق، المطالبات، المركبات، الأصول...) ويُنزّلها كملف JSON واحد.
        </p>
        <RoleGate
          permission={PERMISSIONS.MANAGE_INSURANCE}
          fallback={<p className="text-xs text-slate-400">هذا الإجراء متاح فقط لمن لديه صلاحية إدارة التأمين.</p>}
        >
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60"
          >
            <Download size={14} /> {exporting ? "جارٍ التصدير..." : "تصدير نسخة احتياطية"}
          </button>
        </RoleGate>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-600 shrink-0">
          <ShieldAlert size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">ميزة غير مُفعّلة عمدًا: إعادة البيانات الافتراضية</p>
          <p className="text-xs text-amber-700 mt-0.5">
            النسخة الأصلية كانت تسمح بمسح كل البيانات واستبدالها ببيانات أولية بضغطة واحدة. ضد Firestore حقيقي هذا قد
            يحذف سجلات حقيقية بشكل نهائي، لذلك لم تُنقل هذه الميزة كما هي.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InsuranceSettingsPage;
