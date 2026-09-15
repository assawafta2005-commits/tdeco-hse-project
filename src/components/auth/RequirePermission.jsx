import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../utils/roles";

/**
 * Route-level guard, nested inside ProtectedRoute (which already handles
 * auth + loading). This adds a permission check: if the signed-in user's
 * role doesn't carry `permission`, redirect to /dashboard instead of
 * rendering the page — real navigation blocking, not just hiding a link.
 *
 * Uses the same hasPermission()/PERMISSIONS system as everywhere else in
 * the app (and firestore.rules) rather than a hardcoded role string, so
 * it stays correct if the permission matrix changes later.
 */
function RequirePermission({ permission, children }) {
  const { role } = useAuth();
  if (!hasPermission(role, permission)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default RequirePermission;
