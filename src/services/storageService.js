import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, isConfigured } from "../lib/firebase";

/**
 * Firebase Storage wrapper for file attachments (documents, SOP photos,
 * incident evidence, vehicle photos, report PDFs).
 *
 * NOT wired into any page's UI in this pass — the original dashboard
 * design has no file-upload widget anywhere, and the project's explicit
 * instruction is not to change the design or add new interactions. This
 * service exists so a future upload UI can be added with zero backend
 * work: call uploadFile(), store the returned { path, url } in the
 * relevant Firestore document (never the raw file bytes/Base64), and
 * render the url directly.
 */

export function isStorageAvailable() {
  return Boolean(storage);
}

export async function uploadFile(folder, file, filename = file?.name) {
  if (!isConfigured || !storage) {
    return { path: null, url: null, source: "unconfigured", error: null };
  }
  try {
    const path = `${folder}/${Date.now()}_${filename}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return { path, url, source: "firebase", error: null };
  } catch (err) {
    console.error(`Storage upload failed for "${folder}/${filename}":`, err);
    return { path: null, url: null, source: "firebase", error: err };
  }
}

export async function deleteFile(path) {
  if (!isConfigured || !storage) {
    return { ok: false, source: "unconfigured", error: null };
  }
  try {
    await deleteObject(ref(storage, path));
    return { ok: true, source: "firebase", error: null };
  } catch (err) {
    console.error(`Storage delete failed for "${path}":`, err);
    return { ok: false, source: "firebase", error: err };
  }
}
