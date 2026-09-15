/**
 * Seed/mock data for the Insurance module, ported from the provided
 * vanilla-JS seed object. Field names and values are kept exactly as
 * given — only the storage shape changed (was a single localStorage
 * blob; here each resource is its own array, matching every other mock
 * data file in this project, and each maps to its own Firestore
 * collection via INSURANCE_COLLECTIONS in insuranceService.js).
 */

export const INSURANCE_POLICIES = [
  { id: 1, type: "الحريق والسرقة والأخطار الأخرى", insurer: "غير محدد", start: "2025-08-17", end: "2026-02-01", amount: 18919250, premium: 0, status: "منتهية" },
  { id: 2, type: "خيانة الأمانة", insurer: "غير محدد", start: "2025-02-02", end: "2026-02-01", amount: 2000000, premium: 0, status: "منتهية" },
  { id: 3, type: "تأمين النقود والخزنة", insurer: "غير محدد", start: "2025-02-02", end: "2026-02-01", amount: 2000000, premium: 0, status: "منتهية" },
  { id: 4, type: "إصابات العمال", insurer: "غير محدد", start: "2025-02-02", end: "2026-02-01", amount: 6075000, premium: 0, status: "منتهية" },
  { id: 5, type: "المسؤولية المدنية", insurer: "غير محدد", start: "2025-08-17", end: "2026-02-01", amount: 3000000, premium: 0, status: "منتهية" },
  { id: 6, type: "كسر المكائن", insurer: "غير محدد", start: "2025-02-18", end: "2026-02-01", amount: 12919000, premium: 0, status: "منتهية" },
  { id: 7, type: "أخطاء المهن", insurer: "غير محدد", start: "2025-02-02", end: "2026-02-01", amount: 300000, premium: 0, status: "منتهية" },
  { id: 8, type: "تأمين المركبات", insurer: "غير محدد", start: "", end: "", amount: 0, premium: 0, status: "حسب الترخيص" },
];

export const INSURANCE_CLAIMS = [];

export const INSURANCE_VEHICLES = [
  { id: 1, name: "سلة نيسان 2017", plate: "25263-H", model: "2017", value: 220000, status: "بحاجة تحديث" },
  { id: 2, name: "متسوبيشي L200", plate: "52351-H", model: "2022", value: 255000, status: "بحاجة تحديث" },
  { id: 3, name: "سلة مرسيديس ATEGO 1018", plate: "57523-H", model: "2022", value: 450000, status: "بحاجة تحديث" },
];

export const INSURANCE_ASSETS = [
  { id: 1, name: "المحولات", category: "محولات", insuredValue: 9445000, currentValue: 9445000, status: "مغطى" },
  { id: 2, name: "اللوحات", category: "لوحات", insuredValue: 1978250, currentValue: 1978250, status: "مغطى" },
  { id: 3, name: "القواطع الآلية", category: "قواطع", insuredValue: 1775000, currentValue: 1775000, status: "مغطى" },
  { id: 4, name: "المنظم", category: "منظم", insuredValue: 959000, currentValue: 959000, status: "مغطى" },
  { id: 5, name: "سويتش جير", category: "Switchgear", insuredValue: 740000, currentValue: 740000, status: "مغطى" },
  { id: 6, name: "مرافق الشركة", category: "مباني ومرافق", insuredValue: 3500000, currentValue: 3500000, status: "مغطى" },
];

export const INSURANCE_EMPLOYEES = [];
export const INSURERS = [];
export const INSURANCE_FINANCE = [];
export const INSURANCE_RENEWALS = [];
export const INSURANCE_ARCHIVE = [];
