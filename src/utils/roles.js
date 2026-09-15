/**
 * Roles & permissions matrix for the HSE system.
 *
 * The spec explicitly required:
 *   - Roles: Admin, HSE Manager, HSE Officer, Supervisor, Employee, Viewer
 *   - Permissions must be enforceable in Firestore Security Rules too,
 *     not just hidden buttons in the UI (see /firestore.rules).
 *
 * NOTE: the request gave concrete permission examples only for Admin,
 * HSE Manager, HSE Officer, and Viewer. Supervisor and Employee are filled
 * in below with conservative, reasonable defaults (view + create-your-own
 * incident report) — these two should be reviewed/adjusted by whoever owns
 * the real access-control policy before going to production.
 */

export const ROLES = {
  ADMIN: "admin",
  HSE_MANAGER: "hse_manager",
  HSE_OFFICER: "hse_officer",
  SUPERVISOR: "supervisor",
  EMPLOYEE: "employee",
  VIEWER: "viewer",
  INSURANCE_OFFICER: "insurance_officer", // مسؤول التأمين — added for the Insurance module
};

export const PERMISSIONS = {
  MANAGE_USERS: "manage_users", // create/edit/delete users, assign roles
  MANAGE_HSE: "manage_hse", // manual, manual builder, governance content
  MANAGE_SOPS: "manage_sops",
  MANAGE_RISKS: "manage_risks",
  MANAGE_INCIDENTS: "manage_incidents",
  CREATE_INCIDENT: "create_incident", // narrower than manage: create/view own only
  MANAGE_FORMS: "manage_forms",
  MANAGE_INSPECTIONS: "manage_inspections",
  MANAGE_VEHICLES: "manage_vehicles",
  VIEW_REPORTS: "view_reports",
  MANAGE_REPORTS: "manage_reports",
  VIEW_ONLY: "view_only",

  // Insurance module (policies, claims, insured vehicles/assets, insurers,
  // finance, renewals, archive) — separate Firestore collections from HSE
  // fleet/incidents, so a dedicated permission avoids ambiguity.
  MANAGE_INSURANCE: "manage_insurance",
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * role -> permission[] matrix. Extend by adding to a role's array, or add a
 * new role key here plus to ROLES above. This matrix drives both the UI
 * (RoleGate component) and should be mirrored in firestore.rules — the two
 * MUST stay in sync since UI-only checks are not real security.
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ALL_PERMISSIONS,

  [ROLES.HSE_MANAGER]: [
    PERMISSIONS.MANAGE_HSE,
    PERMISSIONS.MANAGE_SOPS,
    PERMISSIONS.MANAGE_RISKS,
    PERMISSIONS.MANAGE_INCIDENTS,
    PERMISSIONS.MANAGE_VEHICLES, // fleet oversight assumed under HSE management —
    // not explicitly listed in the original request; documented here and in README.
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_REPORTS,
    // "المستخدمين حسب الصلاحية" — scoped user management, not full admin
    // control over roles. Kept separate from MANAGE_USERS on purpose.
  ],

  [ROLES.HSE_OFFICER]: [
    PERMISSIONS.MANAGE_INCIDENTS,
    PERMISSIONS.MANAGE_RISKS,
    PERMISSIONS.MANAGE_INSPECTIONS,
    PERMISSIONS.MANAGE_FORMS,
  ],

  // Not fully specified in the original request — conservative default.
  [ROLES.SUPERVISOR]: [
    PERMISSIONS.CREATE_INCIDENT,
    PERMISSIONS.MANAGE_INSPECTIONS,
    PERMISSIONS.VIEW_REPORTS,
  ],

  // Not fully specified in the original request — conservative default.
  [ROLES.EMPLOYEE]: [PERMISSIONS.CREATE_INCIDENT],

  [ROLES.VIEWER]: [PERMISSIONS.VIEW_ONLY],

  [ROLES.INSURANCE_OFFICER]: [PERMISSIONS.MANAGE_INSURANCE],
};

export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const perms = ROLE_PERMISSIONS[role];
  return Array.isArray(perms) && perms.includes(permission);
}

export function roleLabel(role) {
  const labels = {
    [ROLES.ADMIN]: "مدير النظام",
    [ROLES.HSE_MANAGER]: "مدير السلامة والصحة المهنية",
    [ROLES.HSE_OFFICER]: "مسؤول السلامة",
    [ROLES.SUPERVISOR]: "مشرف",
    [ROLES.EMPLOYEE]: "موظف",
    [ROLES.VIEWER]: "مشاهد",
    [ROLES.INSURANCE_OFFICER]: "مسؤول التأمين",
  };
  return labels[role] || role;
}
