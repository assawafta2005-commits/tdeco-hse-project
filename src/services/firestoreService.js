import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, isConfigured } from "../lib/firebase";

/**
 * Generic Firestore helpers shared by every domain service.
 *
 * IMPORTANT — the "no silent Mock fallback" rule: fetchCollection never
 * quietly substitutes mock data itself. It returns one of three explicit
 * states, and each domain service (and ultimately each page) is
 * responsible for reacting to the right one:
 *
 *   - source: "unconfigured" → Firebase has no .env at all. Only in this
 *     case is a domain service allowed to substitute its mock array —
 *     and the UI must still show a visible "بيانات تجريبية" badge.
 *   - source: "firestore", error: null → real result (data may be an
 *     empty array — that's a legitimate "no records yet" state, NOT a
 *     reason to fall back to mock).
 *   - source: "firestore", error: <Error> → a real read/write failed
 *     (permission-denied, offline, etc). The UI must show an error state,
 *     never silently substitute mock data as if it were real.
 */

export function isFirestoreAvailable() {
  return Boolean(db);
}

export async function fetchCollection(name) {
  if (!isConfigured || !db) {
    return { data: null, source: "unconfigured", error: null };
  }
  try {
    const snap = await getDocs(collection(db, name));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { data, source: "firestore", error: null };
  } catch (err) {
    console.error(`Firestore read failed for "${name}":`, err);
    return { data: null, source: "firestore", error: err };
  }
}

export async function addToCollection(name, data) {
  if (!isConfigured || !db) {
    return { id: null, source: "unconfigured", error: null };
  }
  try {
    const ref = await addDoc(collection(db, name), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: ref.id, source: "firestore", error: null };
  } catch (err) {
    console.error(`Firestore create failed for "${name}":`, err);
    return { id: null, source: "firestore", error: err };
  }
}

export async function updateInCollection(name, id, data) {
  if (!isConfigured || !db) {
    return { ok: false, source: "unconfigured", error: null };
  }
  try {
    await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
    return { ok: true, source: "firestore", error: null };
  } catch (err) {
    console.error(`Firestore update failed for "${name}/${id}":`, err);
    return { ok: false, source: "firestore", error: err };
  }
}

/**
 * Like addToCollection, but with a caller-chosen document ID instead of
 * an auto-generated one (e.g. pendingUserRoles keyed by email). `merge`
 * uses setDoc's merge option — pass true to update-or-create.
 */
export async function setDocInCollection(name, id, data, { merge = false } = {}) {
  if (!isConfigured || !db) {
    return { ok: false, source: "unconfigured", error: null };
  }
  try {
    await setDoc(
      doc(db, name, id),
      { ...data, updatedAt: serverTimestamp() },
      { merge }
    );
    return { ok: true, source: "firestore", error: null };
  } catch (err) {
    console.error(`Firestore setDoc failed for "${name}/${id}":`, err);
    return { ok: false, source: "firestore", error: err };
  }
}

export async function deleteFromCollection(name, id) {
  if (!isConfigured || !db) {
    return { ok: false, source: "unconfigured", error: null };
  }
  try {
    await deleteDoc(doc(db, name, id));
    return { ok: true, source: "firestore", error: null };
  } catch (err) {
    console.error(`Firestore delete failed for "${name}/${id}":`, err);
    return { ok: false, source: "firestore", error: err };
  }
}
