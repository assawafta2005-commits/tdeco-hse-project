import { fetchCollection, addToCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { FORMS } from "../data/formsMock";

export async function listForms() {
  const res = await fetchCollection("permits"); // PTW/JSA/LOTO live under "permits"
  if (res.source === "unconfigured") return { rows: FORMS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function submitForm(formCode, data, actingUserId = "unknown") {
  const res = await addToCollection("permits", { formCode, ...data });
  if (res.source === "firestore" && !res.error) {
    await logAction({
      userId: actingUserId,
      action: "submit_form",
      resource: "permits",
      resourceId: res.id,
      metadata: { formCode },
    });
  }
  return res;
}
