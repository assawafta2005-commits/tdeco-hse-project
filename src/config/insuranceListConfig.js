/**
 * Config-driven table/form definitions for the Insurance module — ported
 * directly from the original vanilla-JS `cfg` (table columns) and
 * `fields` (add-form fields) objects. This is what lets InsuranceListPage
 * be ONE generic component instead of eight near-identical page files,
 * matching the spirit of the original code's architecture.
 *
 * Each resource key maps to: title, table columns [key, label], form
 * fields [key, label, inputType], and the Firestore collection name
 * (see insuranceService.js).
 */

export const INSURANCE_RESOURCES = {
  policies: {
    title: "سجل وثائق التأمين",
    collection: "insurancePolicies",
    cols: [
      ["type", "نوع التأمين"],
      ["insurer", "شركة التأمين"],
      ["end", "تاريخ الانتهاء"],
      ["amount", "مبلغ التأمين"],
      ["status", "الحالة"],
    ],
    fields: [
      ["type", "نوع التأمين", "text"],
      ["insurer", "شركة التأمين", "text"],
      ["start", "تاريخ البداية", "date"],
      ["end", "تاريخ الانتهاء", "date"],
      ["amount", "مبلغ التأمين", "number"],
      ["premium", "القسط", "number"],
      ["status", "الحالة", "text"],
    ],
  },
  claims: {
    title: "سجل المطالبات",
    collection: "insuranceClaims",
    cols: [
      ["claimNo", "رقم المطالبة"],
      ["date", "تاريخ الحادث"],
      ["type", "نوع الحادث"],
      ["amount", "مبلغ المطالبة"],
      ["status", "الحالة"],
    ],
    fields: [
      ["claimNo", "رقم المطالبة", "text"],
      ["date", "تاريخ الحادث", "date"],
      ["type", "نوع الحادث", "text"],
      ["amount", "مبلغ المطالبة", "number"],
      ["received", "التعويض المستلم", "number"],
      ["status", "الحالة", "text"],
    ],
  },
  vehicles: {
    title: "سجل المركبات المؤمَّنة",
    collection: "insuranceVehicles",
    cols: [
      ["name", "المركبة"],
      ["plate", "رقم اللوحة"],
      ["model", "الموديل"],
      ["value", "القيمة التأمينية"],
      ["status", "الحالة"],
    ],
    fields: [
      ["name", "المركبة", "text"],
      ["plate", "رقم اللوحة", "text"],
      ["model", "الموديل", "text"],
      ["value", "القيمة التأمينية", "number"],
      ["status", "الحالة", "text"],
    ],
  },
  assets: {
    title: "سجل الأصول والمعدات",
    collection: "insuranceAssets",
    cols: [
      ["name", "الأصل"],
      ["category", "التصنيف"],
      ["insuredValue", "القيمة التأمينية"],
      ["currentValue", "القيمة الحالية"],
      ["status", "الحالة"],
    ],
    fields: [
      ["name", "اسم الأصل", "text"],
      ["category", "التصنيف", "text"],
      ["insuredValue", "القيمة التأمينية", "number"],
      ["currentValue", "القيمة الحالية", "number"],
      ["status", "الحالة", "text"],
    ],
  },
  employees: {
    title: "سجل الموظفين",
    collection: "insuranceEmployees",
    cols: [
      ["name", "الاسم"],
      ["empNo", "الرقم الوظيفي"],
      ["department", "الدائرة"],
      ["job", "المسمى"],
      ["status", "الحالة"],
    ],
    fields: [
      ["name", "الاسم", "text"],
      ["empNo", "الرقم الوظيفي", "text"],
      ["department", "الدائرة", "text"],
      ["job", "المسمى الوظيفي", "text"],
      ["status", "الحالة", "text"],
    ],
  },
  insurers: {
    title: "شركات التأمين",
    collection: "insurers",
    cols: [
      ["name", "اسم الشركة"],
      ["contact", "جهة الاتصال"],
      ["phone", "الهاتف"],
      ["rating", "التقييم"],
      ["status", "الحالة"],
    ],
    fields: [
      ["name", "اسم الشركة", "text"],
      ["contact", "جهة الاتصال", "text"],
      ["phone", "الهاتف", "text"],
      ["rating", "التقييم", "text"],
      ["status", "الحالة", "text"],
    ],
  },
  finance: {
    title: "الأقساط والتعويضات",
    collection: "insuranceFinance",
    cols: [
      ["kind", "النوع"],
      ["reference", "المرجع"],
      ["date", "التاريخ"],
      ["amount", "المبلغ"],
      ["status", "الحالة"],
    ],
    fields: [
      ["kind", "النوع", "text"],
      ["reference", "المرجع", "text"],
      ["date", "التاريخ", "date"],
      ["amount", "المبلغ", "number"],
      ["status", "الحالة", "text"],
    ],
  },
  renewals: {
    title: "دورات التجديد",
    collection: "insuranceRenewals",
    cols: [
      ["year", "السنة"],
      ["policy", "الوثيقة"],
      ["start", "بدء التجديد"],
      ["recommendation", "التوصية"],
      ["status", "الحالة"],
    ],
    fields: [
      ["year", "السنة", "text"],
      ["policy", "الوثيقة", "text"],
      ["start", "بدء التجديد", "date"],
      ["recommendation", "التوصية", "text"],
      ["status", "الحالة", "text"],
    ],
  },
  archive: {
    title: "الأرشيف والمراسلات",
    collection: "insuranceArchive",
    cols: [
      ["name", "اسم الملف"],
      ["category", "التصنيف"],
      ["reference", "المرجع"],
      ["date", "التاريخ"],
      ["user", "المستخدم"],
    ],
    fields: [
      ["name", "اسم الملف", "text"],
      ["category", "التصنيف", "text"],
      ["reference", "المرجع", "text"],
      ["date", "التاريخ", "date"],
      ["user", "المستخدم", "text"],
    ],
  },
};

// Same three-way badge classification as the original: ok / bad / warn.
export function badgeTone(status) {
  if (!status) return "warn";
  if (/سارية|مغطى|مدفوعة|مغلق/.test(status)) return "ok";
  if (/منتهية|مرفوض|غير مغطى/.test(status)) return "bad";
  return "warn";
}

export function formatMoney(n) {
  return `${(Number(n) || 0).toLocaleString("ar-EG")} ₪`;
}

const MONEY_FIELDS = new Set(["amount", "value", "insuredValue", "currentValue", "premium", "received"]);

export function formatCell(key, value) {
  if (MONEY_FIELDS.has(key)) return formatMoney(value);
  return value ?? "-";
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}
