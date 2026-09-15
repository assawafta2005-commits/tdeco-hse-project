import { fetchCollection, addToCollection, updateInCollection, deleteFromCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { FLEET } from "../data/fleetMock";

export async function listVehicles() {
  const res = await fetchCollection("vehicles");
  if (res.source === "unconfigured") return { rows: FLEET, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function addVehicle(data, actingUserId = "unknown") {
  const res = await addToCollection("vehicles", data);
  if (res.source === "firestore" && !res.error) {
    await logAction({ userId: actingUserId, action: "create_vehicle", resource: "vehicles", resourceId: res.id });
  }
  return res;
}

export async function updateVehicle(id, data, actingUserId = "unknown") {
  const res = await updateInCollection("vehicles", id, data);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "update_vehicle", resource: "vehicles", resourceId: id });
  }
  return res;
}

export async function deleteVehicle(id, actingUserId = "unknown") {
  const res = await deleteFromCollection("vehicles", id);
  if (res.ok) {
    await logAction({ userId: actingUserId, action: "delete_record", resource: "vehicles", resourceId: id });
  }
  return res;
}
