import { Zap, Sun, BatteryFull, Cpu, Scale, CarFront } from "lucide-react";

const MANUAL_CATEGORIES = [
  "الكل",
  "الجهد المتوسط",
  "الطاقة الشمسية",
  "بطاريات التخزين",
  "OT/IT",
  "الحوكمة",
  "المركبات",
];

const MANUAL_SECTIONS = [
  {
    tag: "الجهد المتوسط",
    code: "ELEC-04.3",
    icon: Zap,
    title: "العزل والتأريض لخطوط الجهد المتوسط",
    desc: "تسلسل العزل الآمن، التحقق من انعدام الجهد، وتركيب أطقم التأريض المؤقت قبل بدء العمل.",
  },
  {
    tag: "الطاقة الشمسية",
    code: "PV-04.8",
    icon: Sun,
    title: "الدخول إلى حظائر الألواح الشمسية",
    desc: "متطلبات التصريح، فحص خطوط الـ DC النشطة، ومعدات الحماية الخاصة بالإشعاع والانعكاس.",
  },
  {
    tag: "بطاريات التخزين",
    code: "BESS-04.9",
    icon: BatteryFull,
    title: "السلامة الحرارية لمنظومات التخزين",
    desc: "حدود درجة الحرارة التشغيلية، إجراءات الاستجابة للتسرب الحراري، وخطة الإخلاء الفوري.",
  },
  {
    tag: "OT/IT",
    code: "OT-02.1",
    icon: Cpu,
    title: "الفصل الآمن لأنظمة التحكم الصناعي",
    desc: "بروتوكول عزل شبكات SCADA قبل الصيانة الميدانية ومنع إعادة التشغيل عن بُعد.",
  },
  {
    tag: "الحوكمة",
    code: "PAL-MOL-47",
    icon: Scale,
    title: "الإخطارات والإحصائيات الرسمية لإصابات العمل",
    desc: "سبعة نماذج قانونية حية للإبلاغ عن إصابات العمل والأمراض المهنية لوزارة العمل الفلسطينية.",
  },
  {
    tag: "المركبات",
    code: "FLT-01.2",
    icon: CarFront,
    title: "فحص المركبات قبل التشغيل",
    desc: "قائمة الفحص اليومية الإلزامية للمركبات الثقيلة ونقاط التوقف عند اكتشاف عطل.",
  },
];

const MANUAL_VOLUMES = [
  { title: "الإدارة والحوكمة", code: "TDECO-HSE-MAN-001", pages: "342 صفحة" },
  { title: "برامج السلامة والصحة المهنية والبيئة", code: "TDECO-HSE-PRO-001", pages: "24 صفحة" },
  { title: "إجراءات وتعليمات العمل الآمن", code: "TDECO-HSE-MAN-003", pages: "171 صفحة" },
  { title: "السلامة الكهربائية", code: "TDECO-HSE-MAN-004", pages: "118 صفحة" },
  { title: "الطاقة المتجددة", code: "TDECO-HSE-MAN-005", pages: "96 صفحة" },
  { title: "إدارة المخاطر", code: "TDECO-HSE-MAN-006", pages: "84 صفحة" },
  { title: "الاستجابة للطوارئ", code: "TDECO-HSE-MAN-007", pages: "77 صفحة" },
  { title: "البيئة والاستدامة", code: "TDECO-HSE-MAN-008", pages: "63 صفحة" },
  { title: "المركبات والمعدات", code: "TDECO-HSE-MAN-009", pages: "58 صفحة" },
  { title: "التدريب والتأهيل", code: "TDECO-HSE-MAN-010", pages: "45 صفحة" },
  { title: "الفهرس العام", code: "TDECO-HSE-MAN-011", pages: "12 صفحة" },
];

export { MANUAL_CATEGORIES, MANUAL_SECTIONS, MANUAL_VOLUMES };
