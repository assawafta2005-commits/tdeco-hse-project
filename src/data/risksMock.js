const RISK_LEVEL_STYLES = {
  عالي: "bg-rose-50 text-rose-700 ring-rose-600/20",
  متوسط: "bg-amber-50 text-amber-700 ring-amber-600/20",
  منخفض: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const RISKS = [
  { id: "R-026", risk: "تلامس محتمل مع خط جهد متوسط مكشوف", loc: "محطة طوباس الرئيسية", level: "عالي", owner: "م. أحمد درويش", status: "قيد المعالجة", due: "٠٢ أيلول", action: "مراجعة" },
  { id: "R-025", risk: "تآكل في هيكل حامل الألواح الشمسية", loc: "حقل الطاقة الشمسية - طمون", level: "متوسط", owner: "م. سامر عوض", status: "مفتوح", due: "٠٥ أيلول", action: "مراجعة" },
  { id: "R-024", risk: "غياب لافتات تحذيرية عند منطقة البطاريات", loc: "مستودع التخزين المركزي", level: "منخفض", owner: "و. ريما حمدان", status: "مغلق", due: "—", action: "عرض" },
  { id: "R-023", risk: "تسرب زيت من محول توزيع", loc: "محطة تحويل عقابا", level: "عالي", owner: "م. أحمد درويش", status: "متأخر", due: "٢٨ آب", action: "تصعيد" },
  { id: "R-022", risk: "عدم كفاية إضاءة الطوارئ في غرفة التحكم", loc: "المقر الرئيسي - طوباس", level: "متوسط", owner: "و. خالد ياسين", status: "قيد المعالجة", due: "٠٧ أيلول", action: "مراجعة" },
  { id: "R-021", risk: "تلف عازل في كابل أرضي", loc: "شبكة التوزيع - تياسير", level: "عالي", owner: "م. سامر عوض", status: "مفتوح", due: "٠٣ أيلول", action: "مراجعة" },
];

export { RISK_LEVEL_STYLES, RISKS };
