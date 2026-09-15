import { fetchCollection, addToCollection, updateInCollection, deleteFromCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { RISKS } from "../data/risksMock";

export async function listRisks() {
  const res = await fetchCollection("risks");
  if (res.source === "unconfigured") return { rows: RISKS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function createRisk(data, actingUserId = "unknown") {
  const res = await addToCollection("risks", data);
  if (res.source === "firestore" && !res.error) {
    await logAction({ userId: actingUserId, action: "create_risk", resource: "risks", resourceId: res.id });
  }
  return res;
}

export async function updateRisk(id, data, actingUserId = "unknown") {
  const res = await updateInCollection("risks", id, data);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "update_risk", resource: "risks", resourceId: id });
  }
  return res;
}

export async function deleteRisk(id, actingUserId = "unknown") {
  const res = await deleteFromCollection("risks", id);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "delete_record", resource: "risks", resourceId: id });
  }
  return res;
}
