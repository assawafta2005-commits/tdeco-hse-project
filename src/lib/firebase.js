import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase config comes ONLY from Vite env vars (VITE_FIREBASE_*), never
 * hardcoded here and never committed. See .env.example for the required
 * variable names.
 *
 * IMPORTANT — no Admin SDK / service account credentials belong in this
 * file or anywhere under src/. Those are backend-only secrets; putting them
 * in a Vite/React app would ship them to every browser that loads the page.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    // Never let a bad/missing Firebase config crash the whole app —
    // pages fall back to mock data (see src/services/*) when db is null.
    console.error("Firebase initialization failed:", err);
  }
} else if (import.meta.env.DEV) {
  console.warn(
    "[firebase] VITE_FIREBASE_* env vars are not set — running with mock data only. " +
      "Copy .env.example to .env and fill in a real Firebase project to enable Auth/Firestore."
  );
}

export { app, auth, db, storage, isConfigured };
