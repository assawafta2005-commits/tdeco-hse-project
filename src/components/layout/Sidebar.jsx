import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, ROUTE_PATH } from "../../data/navItems";
import { INSURANCE_NAV_ITEMS } from "../../data/insuranceNavItems";
import { useAuth } from "../../hooks/useAuth";
import { roleLabel, hasPermission, PERMISSIONS } from "../../utils/roles";

/**
 * Same visual design as the original single-file dashboard's sidebar —
 * only the navigation mechanism changed, from activeTab state to real
 * routes (NavLink), since React Router was a required part of this
 * project. sidebarOpen collapse behavior is preserved.
 */
function Sidebar({ sidebarOpen }) {
  const { user, role } = useAuth();

  // "المستخدمون والصلاحيات" is only meaningful (and only actually usable —
  // see RequirePermission on the /users route) for whoever holds
  // MANAGE_USERS. Filtering it here keeps the Sidebar honest: no link to
  // a page you'd be redirected straight out of.
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => item.id !== "users" || hasPermission(role, PERMISSIONS.MANAGE_USERS)
  );

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-0 sm:w-16"
      } shrink-0 bg-slate-900 text-slate-300 flex flex-col transition-all duration-200 overflow-hidden`}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-bold text-sm">
          TD
        </div>
        {sidebarOpen && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">TDECO</p>
            <p className="text-xs text-slate-400 truncate">منظومة السلامة</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.id}
            to={ROUTE_PATH[item.id]}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-amber-500 text-slate-900 font-medium"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-white/10">
          {sidebarOpen && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              نظام إدارة التأمين
            </p>
          )}
          {INSURANCE_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-amber-500 text-slate-900 font-medium"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
            {(user?.email || "?").charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email || "—"}</p>
              <p className="text-xs text-slate-400 truncate">{roleLabel(role)}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
