import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * Same outer shell (RTL wrapper, Tajawal/Cairo font, flex layout) as the
 * original hse-dashboard.jsx App shell. renderView()'s switch statement is
 * replaced by React Router's <Outlet /> rendering whichever page route
 * matched — visual result is identical.
 */
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
    >
      <div className="flex min-h-screen">
        <Sidebar sidebarOpen={sidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
