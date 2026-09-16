import { fetchCollection, addToCollection, deleteFromCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { MANUAL_SECTIONS, MANUAL_VOLUMES } from "../data/manualMock";

export async function listManualSections() {
  const res = await fetchCollection("documents");
  if (res.source === "unconfigured") return { rows: MANUAL_SECTIONS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function listManualVolumes() {
  const res = await fetchCollection("manualVolumes");
  if (res.source === "unconfigured") return { rows: MANUAL_VOLUMES, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function createManualSection(data, actingUserId = "unknown") {
  const res = await addToCollection("documents", data);
  if (res.source === "firestore" && !res.error) {
    await logAction({ userId: actingUserId, action: "create", resource: "documents", resourceId: res.id });
  }
  return res;
}

export async function deleteManualSection(id, actingUserId = "unknown") {
  const res = await deleteFromCollection("documents", id);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "delete", resource: "documents", resourceId: id });
  }
  return res;
}

export async function createManualVolume(data, actingUserId = "unknown") {
  const res = await addToCollection("manualVolumes", data);
  if (res.source === "firestore" && !res.error) {
    await logAction({ userId: actingUserId, action: "create", resource: "manualVolumes", resourceId: res.id });
  }
  return res;
}

export async function deleteManualVolume(id, actingUserId = "unknown") {
  const res = await deleteFromCollection("manualVolumes", id);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "delete", resource: "manualVolumes", resourceId: id });
  }
  return res;
}
