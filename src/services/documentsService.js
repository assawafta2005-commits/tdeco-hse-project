import { fetchCollection } from "./firestoreService";
import { MANUAL_SECTIONS, MANUAL_VOLUMES } from "../data/manualMock";

export async function listManualSections() {
  const res = await fetchCollection("documents");
  if (res.source === "unconfigured") return { rows: MANUAL_SECTIONS, source: "mock", error: null };
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function listManualVolumes() {
  // Volumes describe the manual's structure/metadata rather than individual
  // editable records — kept as static config for now rather than a
  // Firestore-backed list, since no volume-editing UI exists yet.
  return { rows: MANUAL_VOLUMES, source: "mock", error: null };
}
