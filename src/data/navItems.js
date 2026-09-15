import {
  LayoutDashboard, BookOpen, Wand2, ClipboardList, ShieldAlert, Siren,
  FileSpreadsheet, Files, Truck, BarChart3, Users,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { id: "manual", label: "الدليل", icon: BookOpen },
  { id: "manual-builder", label: "منشئ الدليل", icon: Wand2 },
  { id: "sops", label: "إجراءات العمل", icon: ClipboardList },
  { id: "risks", label: "المخاطر", icon: ShieldAlert },
  { id: "incidents", label: "الحوادث", icon: Siren },
  { id: "ministry-forms", label: "نماذج وزارة العمل", icon: FileSpreadsheet },
  { id: "forms-logs", label: "النماذج والسجلات", icon: Files },
  { id: "fleet", label: "المركبات", icon: Truck },
  { id: "reports", label: "التقارير", icon: BarChart3 },
  { id: "users", label: "المستخدمون والصلاحيات", icon: Users },
];

const VIEW_TITLES = {
  dashboard: "لوحة التحكم",
  manual: "الدليل",
  "manual-builder": "منشئ الدليل",
  sops: "إجراءات العمل",
  risks: "المخاطر",
  incidents: "الحوادث",
  "ministry-forms": "نماذج وزارة العمل",
  "forms-logs": "النماذج والسجلات",
  fleet: "المركبات",
  reports: "التقارير",
  users: "المستخدمون والصلاحيات",
};

/**
 * The original single-file dashboard used in-memory tab state (activeTab).
 * This project uses real routes instead (required for React Router / protected
 * routes), so each nav item maps 1:1 to a route path. Labels, icons, and ids
 * are unchanged from the original hse-dashboard.jsx.
 */
export const ROUTE_PATH = {
  dashboard: "/dashboard",
  manual: "/manual",
  "manual-builder": "/manual-builder",
  sops: "/sops",
  risks: "/risks",
  incidents: "/incidents",
  "ministry-forms": "/ministry-forms",
  "forms-logs": "/forms-logs",
  fleet: "/fleet",
  reports: "/reports",
  users: "/users",
};

export { NAV_ITEMS, VIEW_TITLES };
