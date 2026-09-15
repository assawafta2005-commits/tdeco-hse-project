import { addToCollection, isFirestoreAvailable } from "./firestoreService";

/**
 * Central audit logging. Actions used across the app: login, logout,
 * create_incident, update_incident, delete_record, create_risk,
 * update_risk, create_vehicle, update_vehicle, update_role, submit_form,
 * create_sop, status_change.
 *
 * Logs userId, action, resource, resourceId, timestamp (server-side), and
 * optional metadata. NEVER pass passwords, tokens, or secrets in metadata.
 *
 * No-ops quietly (with a console note) when Firestore isn't configured —
 * audit trail just isn't persisted until a real Firebase project is
 * connected. This one case is an intentional exception to the
 * "no silent fallback" rule elsewhere: there is no meaningful mock/error
 * state for a log write the user never sees rendered in the UI.
 */
export async function logAction({ userId, action, resource, resourceId, metadata = {} }) {
  if (!isFirestoreAvailable()) {
    console.info("[auditLog:not persisted — Firebase not configured]", {
      userId,
      action,
      resource,
      resourceId,
      metadata,
    });
    return;
  }
  const result = await addToCollection("auditLogs", { userId, action, resource, resourceId, metadata });
  if (result.error) {
    console.error("Failed to write audit log entry:", result.error);
  }
}
