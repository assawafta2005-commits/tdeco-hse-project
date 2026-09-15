import React, { createContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isConfigured } from "../lib/firebase";
import { ROLES } from "../utils/roles";
import { mapAuthError } from "../utils/authErrors";
import { logAction } from "../services/auditLogService";

export const AuthContext = createContext(null);

/**
 * Provides: user, role, profile, loading, authError, isConfigured,
 * login(), logout().
 *
 * - Session persistence is explicit (browserLocalPersistence) rather than
 *   relying on the SDK default, per spec.
 * - Role is ALWAYS read from Firestore (users/{uid}.role), never from
 *   localStorage or any client-side cache.
 * - On first successful sign-in, if no users/{uid} document exists yet,
 *   one is created (self-provisioning). Role defaults to "viewer" —
 *   UNLESS an admin pre-assigned a role to this email beforehand via
 *   the "Add user" flow on UsersPermissionsPage (stored in
 *   pendingUserRoles/{email}), in which case that role is applied and
 *   the pending doc is consumed (deleted). firestore.rules independently
 *   verifies this server-side — the client can't just claim any role.
 * - When Firebase isn't configured, `loading` resolves to false
 *   immediately and login() throws a clear Arabic error instead of the
 *   app hanging or silently pretending to be signed in.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isConfigured);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Failed to set auth persistence:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser && db) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          let snap = await getDoc(ref);

          if (!snap.exists()) {
            // Check for a pre-assigned role (admin used "Add user" with
            // this email before this person ever logged in). Falls back
            // to "viewer" if no such assignment exists.
            let assignedRole = ROLES.VIEWER;
            let pendingRef = null;
            if (firebaseUser.email) {
              pendingRef = doc(db, "pendingUserRoles", firebaseUser.email);
              try {
                const pendingSnap = await getDoc(pendingRef);
                if (pendingSnap.exists()) {
                  assignedRole = pendingSnap.data().role;
                }
              } catch (err) {
                // No pending assignment readable (or none exists) — fine,
                // just proceed with the default "viewer" role.
                console.warn("No pending role assignment found or readable:", err);
              }
            }

            await setDoc(ref, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              role: assignedRole,
              active: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });

            // Consume the pending assignment now that it's been applied.
            if (pendingRef && assignedRole !== ROLES.VIEWER) {
              try {
                await deleteDoc(pendingRef);
              } catch (err) {
                console.warn("Could not delete consumed pendingUserRoles doc:", err);
              }
            }

            snap = await getDoc(ref);
          }

          const data = snap.data();
          setProfile(data);
          setRole(data?.role ?? ROLES.VIEWER);
        } catch (err) {
          console.error("Failed to load/create user profile:", err);
          setProfile(null);
          setRole(ROLES.VIEWER);
        }
      } else {
        setProfile(null);
        setRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setAuthError(null);

    if (!isConfigured || !auth) {
      const msg = "Firebase غير مُهيّأ. أضف بيانات المشروع في ملف .env لتفعيل تسجيل الدخول.";
      setAuthError(msg);
      throw new Error(msg);
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await logAction({
        userId: cred.user.uid,
        action: "login",
        resource: "auth",
        resourceId: cred.user.uid,
      });
      return cred.user;
    } catch (err) {
      const msg = mapAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    if (!isConfigured || !auth) return;
    const uid = user?.uid;
    await signOut(auth);
    if (uid) {
      await logAction({ userId: uid, action: "logout", resource: "auth", resourceId: uid });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, profile, loading, authError, login, logout, isConfigured }}
    >
      {children}
    </AuthContext.Provider>
  );
}
