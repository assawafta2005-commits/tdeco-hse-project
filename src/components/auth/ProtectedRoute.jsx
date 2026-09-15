import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Blocks access to the dashboard entirely without a signed-in user.
 * Shows a loading state while Firebase resolves the current session so we
 * never briefly flash protected content before redirecting.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50" dir="rtl">
        <p className="text-sm text-slate-500">جاري التحقق من الجلسة...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
