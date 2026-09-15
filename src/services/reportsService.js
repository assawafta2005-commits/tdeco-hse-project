import { fetchCollection } from "./firestoreService";
import { REPORTS } from "../data/reportsMock";

export async function listReports() {
  const res = await fetchCollection("reports");
  if (res.source === "unconfigured") return { rows: REPORTS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}
