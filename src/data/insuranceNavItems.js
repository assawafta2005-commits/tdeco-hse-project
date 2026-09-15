import { Gauge, FileText, FileWarning, CarFront, Boxes, Users2, Building2, Wallet, RefreshCw, BarChart3, Archive, Settings } from "lucide-react";

/**
 * Insurance module nav items. Separate from HSE's NAV_ITEMS/ROUTE_PATH
 * (src/data/navItems.js) since the two modules route differently: HSE
 * pages are one route per fixed id, Insurance list pages share one
 * generic route (/insurance/:resource) driven by insuranceListConfig.js.
 */
export const INSURANCE_NAV_ITEMS = [
  { id: "insurance-dashboard", label: "لوحة القيادة", icon: Gauge, path: "/insurance/dashboard" },
  { id: "insurance-policies", label: "وثائق التأمين", icon: FileText, path: "/insurance/policies" },
  { id: "insurance-claims", label: "المطالبات والحوادث", icon: FileWarning, path: "/insurance/claims" },
  { id: "insurance-vehicles", label: "المركبات", icon: CarFront, path: "/insurance/vehicles" },
  { id: "insurance-assets", label: "الأصول والمعدات", icon: Boxes, path: "/insurance/assets" },
  { id: "insurance-employees", label: "الموظفون", icon: Users2, path: "/insurance/employees" },
  { id: "insurance-insurers", label: "شركات التأمين", icon: Building2, path: "/insurance/insurers" },
  { id: "insurance-finance", label: "الأقساط والتعويضات", icon: Wallet, path: "/insurance/finance" },
  { id: "insurance-renewals", label: "التجديدات", icon: RefreshCw, path: "/insurance/renewals" },
  { id: "insurance-reports", label: "التقارير", icon: BarChart3, path: "/insurance/reports" },
  { id: "insurance-archive", label: "الأرشيف", icon: Archive, path: "/insurance/archive" },
  { id: "insurance-settings", label: "الإعدادات", icon: Settings, path: "/insurance/settings" },
];
