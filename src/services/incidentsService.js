import { fetchCollection, addToCollection, updateInCollection, deleteFromCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { INCIDENTS } from "../data/incidentsMock";

/**
 * Returns { rows, source, error }.
 *   source: "mock"      → Firebase not configured (dev only) — rows = mock data
 *   source: "firestore" → real result; rows may legitimately be []
 *   error: set only when a configured Firestore read actually failed —
 *          callers must show an error state, not fall back to mock.
 */
export async function listIncidents() {
  const res = await fetchCollection("incidents");
  if (res.source === "unconfigured") return { rows: INCIDENTS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function createIncident(data, actingUserId = "unknown") {
  const res = await addToCollection("incidents", data);
  if (res.source === "firestore" && !res.error) {
    await logAction({ userId: actingUserId, action: "create_incident", resource: "incidents", resourceId: res.id });
  }
  return res;
}

export async function updateIncident(id, data, actingUserId = "unknown") {
  const res = await updateInCollection("incidents", id, data);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "update_incident", resource: "incidents", resourceId: id });
  }
  return res;
}

export async function deleteIncident(id, actingUserId = "unknown") {
  const res = await deleteFromCollection("incidents", id);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "delete_record", resource: "incidents", resourceId: id });
  }
  return res;
}
