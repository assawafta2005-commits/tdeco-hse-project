import { fetchCollection, updateInCollection, setDocInCollection, deleteFromCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { ROLES } from "../utils/roles";

const MOCK_USERS = [
  { id: "u1", name: "صالح أبو عرام", email: "saleh@tdeco.ps", role: ROLES.HSE_OFFICER },
  { id: "u2", name: "م. أحمد درويش", email: "ahmad@tdeco.ps", role: ROLES.HSE_MANAGER },
  { id: "u3", name: "م. سامر عوض", email: "samer@tdeco.ps", role: ROLES.SUPERVISOR },
  { id: "u4", name: "و. ريما حمدان", email: "rima@tdeco.ps", role: ROLES.EMPLOYEE },
  { id: "u5", name: "زائر التقارير", email: "viewer@tdeco.ps", role: ROLES.VIEWER },
];

export async function listUsers() {
  const res = await fetchCollection("users");
  if (res.source === "unconfigured") return { rows: MOCK_USERS, source: "mock", error: null };
  // Real Firestore user docs use `displayName`/`email`; normalize a `name`
  // field for display without renaming the underlying schema.
  const rows = (res.data ?? []).map((u) => ({ ...u, name: u.displayName || u.email || u.id }));
  return { rows, source: "firestore", error: res.error };
}

export async function updateUserRole(uid, role, actingUserId = "unknown") {
  const res = await updateInCollection("users", uid, { role });
  if (res.ok) {
    await logAction({
      userId: actingUserId,
      action: "role_change",
      resource: "users",
      resourceId: uid,
      metadata: { newRole: role },
    });
  }
  return res;
}

/**
 * "Add user" from the Users & Permissions page. IMPORTANT technical
 * limitation: the Firebase client SDK cannot create an Auth account for
 * someone else without either signing the admin out of their own session
 * (createUserWithEmailAndPassword logs in as the new user) or using the
 * Admin SDK from a backend (explicitly out of scope for this project).
 *
 * So this does NOT create a login-capable account. It pre-assigns a role
 * to an email address (pendingUserRoles/{email}). The admin still has to
 * create the actual Firebase Auth account separately (Console →
 * Authentication → Add user — see README). The first time that person
 * logs in, AuthContext.jsx applies this pre-assigned role automatically
 * instead of the "viewer" default, and consumes (deletes) this doc.
 */
export async function inviteUser(email, role, actingUserId = "unknown") {
  const normalizedEmail = email.trim().toLowerCase();
  const res = await setDocInCollection("pendingUserRoles", normalizedEmail, {
    email: normalizedEmail,
    role,
    invitedBy: actingUserId,
  });
  if (res.ok) {
    await logAction({
      userId: actingUserId,
      action: "create",
      resource: "pendingUserRoles",
      resourceId: normalizedEmail,
      metadata: { assignedRole: role },
    });
  }
  return res;
}

export async function listPendingInvites() {
  const res = await fetchCollection("pendingUserRoles");
  if (res.source === "unconfigured") return { rows: [], source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function cancelInvite(email, actingUserId = "unknown") {
  const res = await deleteFromCollection("pendingUserRoles", email);
  if (res.ok) {
    await logAction({
      userId: actingUserId,
      action: "delete",
      resource: "pendingUserRoles",
      resourceId: email,
    });
  }
  return res;
}
