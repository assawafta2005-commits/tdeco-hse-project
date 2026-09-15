import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../utils/roles";

/**
 * Conditionally renders children based on the current user's permission.
 * IMPORTANT: this only hides UI. It is NOT a security boundary by itself —
 * every sensitive write must also be enforced in firestore.rules, per the
 * "لا تعتمد على حماية الواجهة فقط" requirement.
 */
function RoleGate({ permission, fallback = null, children }) {
  const { role } = useAuth();
  if (!hasPermission(role, permission)) return fallback;
  return children;
}

export default RoleGate;
