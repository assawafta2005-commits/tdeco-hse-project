import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { VIEW_TITLES, ROUTE_PATH } from "../../data/navItems";
import { INSURANCE_NAV_ITEMS } from "../../data/insuranceNavItems";
import { INSURANCE_RESOURCES } from "../../config/insuranceListConfig";
import { useAuth } from "../../hooks/useAuth";
import { useServiceData } from "../../hooks/useServiceData";
import { getDashboardSummary } from "../../services/dashboardService";

/**
 * Same visual design as the original top bar. View title now derives from
 * the current route instead of activeTab state — extended to also
 * resolve Insurance module routes (fixed pages via INSURANCE_NAV_ITEMS,
 * and the generic /insurance/:resource pages via INSURANCE_RESOURCES).
 */
function Header({ onToggleSidebar }) {
  const location = useLocation();
  const { logout } = useAuth();

  // Notification count comes from the same real aggregation the dashboard
  // uses (high-severity open risks + incidents awaiting the ministry form
  // + pending permits). Zero is a valid result — the badge simply hides.
  const { rows: summaryRows } = useServiceData(getDashboardSummary, []);
  const notificationCount = summaryRows?.[0]?.notificationCount ?? 0;

  const hseId = Object.entries(ROUTE_PATH).find(([, path]) => path === location.pathname)?.[0];
  const insuranceFixed = INSURANCE_NAV_ITEMS.find((item) => item.path === location.pathname);
  const insuranceResourceKey = location.pathname.startsWith("/insurance/")
    ? location.pathname.split("/")[2]
    : null;
  const insuranceResourceTitle = INSURANCE_RESOURCES[insuranceResourceKey]?.title;

  const pageTitle =
    (hseId && VIEW_TITLES[hseId]) || insuranceFixed?.label || insuranceResourceTitle || VIEW_TITLES.dashboard;

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 sticky top-0 z-10">
      <button onClick={onToggleSidebar} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
        <Menu size={18} />
      </button>

      <div className="hidden sm:block">
        <p className="text-sm font-bold text-slate-900">نظام السلامة والصحة المهنية والبيئة</p>
        <p className="text-xs text-slate-400">{pageTitle}</p>
      </div>

      <div className="flex-1 relative max-w-md mr-auto">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="بحث سريع..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <button
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        title={notificationCount ? `${notificationCount} تنبيه يتطلب المتابعة` : "لا توجد تنبيهات"}
      >
        <Bell size={18} />
        {notificationCount > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </button>

      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        title="تسجيل الخروج"
      >
        <LogOut size={18} />
      </button>
    </header>
  );
}

export default Header;
