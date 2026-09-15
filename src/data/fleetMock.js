const FLEET_STATUS_STYLES = {
  جاهز: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "فحص مستحق": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "قيد الصيانة": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const FLEET = [
  { id: "V-101", model: "رافعة هيدروليكية - Isuzu", dept: "طوارئ طوباس", driver: "أحمد محمود", check: "٢٠٢٦-٠٨-١٥", ins: "٢٠٢٦-١١-٣٠", status: "جاهز" },
  { id: "V-102", model: "مركبة صيانة شبكات - Toyota", dept: "صيانة طمون", driver: "خالد صوافطة", check: "٢٠٢٦-٠٨-١٠", ins: "٢٠٢٦-٠٩-٠١", status: "فحص مستحق" },
  { id: "V-103", model: "شاحنة مواد ومعدات - MAN", dept: "المستودعات", driver: "عمر دراغمة", check: "٢٠٢٦-٠٩-٠٥", ins: "٢٠٢٧-٠١-١٥", status: "جاهز" },
  { id: "V-104", model: "رافعة سلة كهربائية - MAN", dept: "طوارئ عقابا", driver: "سامر مسلم", check: "٢٠٢٦-٠٧-٣٠", ins: "٢٠٢٦-٠٨-٢٠", status: "قيد الصيانة" },
];


export { FLEET_STATUS_STYLES, FLEET };
