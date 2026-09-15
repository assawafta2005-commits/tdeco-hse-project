import { fetchCollection, addToCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { SOPS, SOP_DETAILS } from "../data/sopsMock";

export async function listSops() {
  const res = await fetchCollection("sops");
  if (res.source === "unconfigured") return { rows: SOPS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function getSopDetail(code) {
  const res = await fetchCollection("sops");
  if (res.source === "unconfigured") {
    return { detail: SOP_DETAILS[code] ?? null, source: "mock", error: null };
  }
  if (res.error) return { detail: null, source: "firestore", error: res.error };
  const fromDb = res.data?.find((r) => r.code === code);
  return { detail: fromDb ?? null, source: "firestore", error: null };
}

export async function createSop(data, actingUserId = "unknown") {
  const res = await addToCollection("sops", data);
  if (res.source === "firestore" && !res.error) {
    await logAction({ userId: actingUserId, action: "create_sop", resource: "sops", resourceId: res.id });
  }
  return res;
}
