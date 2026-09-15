import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RequirePermission from "./components/auth/RequirePermission";
import DashboardLayout from "./components/layout/DashboardLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ManualPage from "./pages/ManualPage";
import ManualBuilderPage from "./pages/ManualBuilderPage";
import SopsPage from "./pages/SopsPage";
import RisksPage from "./pages/RisksPage";
import IncidentsPage from "./pages/IncidentsPage";
import MinistryFormsPage from "./pages/MinistryFormsPage";
import FormsLogsPage from "./pages/FormsLogsPage";
import FleetPage from "./pages/FleetPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPermissionsPage from "./pages/UsersPermissionsPage";
import { PERMISSIONS } from "./utils/roles";
import InsuranceDashboardPage from "./pages/insurance/InsuranceDashboardPage";
import InsuranceListPage from "./pages/insurance/InsuranceListPage";
import InsuranceReportsPage from "./pages/insurance/InsuranceReportsPage";
import InsuranceSettingsPage from "./pages/insurance/InsuranceSettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/manual" element={<ManualPage />} />
            <Route path="/manual-builder" element={<ManualBuilderPage />} />
            <Route path="/sops" element={<SopsPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/ministry-forms" element={<MinistryFormsPage />} />
            <Route path="/forms-logs" element={<FormsLogsPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/users"
              element={
                <RequirePermission permission={PERMISSIONS.MANAGE_USERS}>
                  <UsersPermissionsPage />
                </RequirePermission>
              }
            />

            {/* Insurance module — one generic list route for policies/
                claims/vehicles/assets/employees/insurers/finance/renewals/
                archive, driven by src/config/insuranceListConfig.js */}
            <Route path="/insurance/dashboard" element={<InsuranceDashboardPage />} />
            <Route path="/insurance/reports" element={<InsuranceReportsPage />} />
            <Route path="/insurance/settings" element={<InsuranceSettingsPage />} />
            <Route path="/insurance/:resource" element={<InsuranceListPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
