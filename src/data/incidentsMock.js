const INCIDENT_TYPE_STYLES = {
  حادث: "bg-rose-50 text-rose-700 ring-rose-600/20",
  "حدث وشيك": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "إصابة بسيطة": "bg-sky-50 text-sky-700 ring-sky-600/20",
  "ضرر ممتلكات": "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const SEVERITY_STYLES = {
  عالية: "bg-rose-600",
  متوسطة: "bg-amber-500",
  منخفضة: "bg-emerald-500",
};

const INCIDENTS = [
  { id: "IN-114", type: "حادث", desc: "صعقة كهربائية طفيفة أثناء صيانة لوحة توزيع", loc: "محطة طوباس الرئيسية", date: "٢٦ آب ٢٠٢٦", severity: "عالية", status: "تحقيق جارٍ" },
  { id: "IN-113", type: "حدث وشيك", desc: "سقوط أداة يدوية من ارتفاع بالقرب من فريق عمل", loc: "حقل الطاقة الشمسية - طمون", date: "٢١ آب ٢٠٢٦", severity: "متوسطة", status: "مكتمل" },
  { id: "IN-112", type: "إصابة بسيطة", desc: "جرح سطحي أثناء التعامل مع معدات حادة", loc: "مستودع التخزين المركزي", date: "١٤ آب ٢٠٢٦", severity: "منخفضة", status: "مكتمل" },
  { id: "IN-111", type: "حادث", desc: "ملامسة غير مقصودة لمعدة تحت جهد كهربائي", loc: "شبكة التوزيع - تياسير", date: "٠٩ آب ٢٠٢٦", severity: "عالية", status: "بانتظار نموذج الوزارة" },
  { id: "IN-110", type: "ضرر ممتلكات", desc: "اصطدام مركبة خدمة بحاجز حماية عند مدخل الموقع", loc: "محطة تحويل عقابا", date: "٠٢ آب ٢٠٢٦", severity: "متوسطة", status: "إجراء تصحيحي" },
];

export { INCIDENT_TYPE_STYLES, SEVERITY_STYLES, INCIDENTS };
