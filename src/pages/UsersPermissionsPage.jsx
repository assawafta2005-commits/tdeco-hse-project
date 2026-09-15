import React, { useState } from "react";
import { Plus, ShieldCheck, Mail, X } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import Modal from "../components/common/Modal";
import RoleGate from "../components/auth/RoleGate";
import { DataStatus, MockBadge } from "../components/common/DataStatus";
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS, roleLabel } from "../utils/roles";
import { listUsers, updateUserRole, inviteUser, listPendingInvites, cancelInvite } from "../services/usersService";
import { useServiceData } from "../hooks/useServiceData";
import { useAuth } from "../hooks/useAuth";

/**
 * Real, functional Users & Permissions page (not a placeholder) — required
 * because the whole Authentication/roles system depends on it existing.
 * Reads from Firestore via usersService when configured; otherwise falls
 * back to local mock users so the page still works with `npm run dev`
 * and no .env file.
 */
function UsersPermissionsPage() {
  const { user: myUser, role: myRole } = useAuth();
  const { status, rows: users, source, error, reload } = useServiceData(listUsers, []);
  const {
    rows: invites,
    source: invitesSource,
    reload: reloadInvites,
  } = useServiceData(listPendingInvites, []);
  const [localRoles, setLocalRoles] = useState({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: ROLES.VIEWER });
  const [inviting, setInviting] = useState(false);

  const handleRoleChange = async (uid, newRole) => {
    setLocalRoles((prev) => ({ ...prev, [uid]: newRole }));
    await updateUserRole(uid, newRole, myUser?.uid);
    reload();
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.email.trim()) return;
    setInviting(true);
    await inviteUser(inviteForm.email, inviteForm.role, myUser?.uid);
    setInviting(false);
    setShowInviteModal(false);
    setInviteForm({ email: "", role: ROLES.VIEWER });
    reloadInvites();
  };

  const handleCancelInvite = async (email) => {
    await cancelInvite(email, myUser?.uid);
    reloadInvites();
  };

  return (
    <div className="space-y-6">
      {source === "mock" && <MockBadge />}

      <SectionHeading
        title="المستخدمون والصلاحيات"
        subtitle="إدارة حسابات المستخدمين وأدوارهم داخل النظام"
      >
        <RoleGate permission={PERMISSIONS.MANAGE_USERS}>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-amber-600"
          >
            <Plus size={14} /> إضافة مستخدم
          </button>
        </RoleGate>
      </SectionHeading>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-slate-500" /> مصفوفة الأدوار والصلاحيات
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                <th className="px-3 py-2 font-medium">الدور</th>
                <th className="px-3 py-2 font-medium">الصلاحيات</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(ROLES).map((r) => (
                <tr key={r} className="border-b border-slate-50 last:border-0">
                  <td className="px-3 py-2.5 font-medium text-slate-700 whitespace-nowrap">{roleLabel(r)}</td>
                  <td className="px-3 py-2.5 text-slate-500">
                    {(ROLE_PERMISSIONS[r] || []).join("، ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          هذه المصفوفة يجب أن تُطابق قواعد الأمان في Firestore (firestore.rules) — لا يكفي إخفاء الأزرار في الواجهة فقط.
        </p>
      </div>

      {invites.length > 0 && (
        <RoleGate permission={PERMISSIONS.MANAGE_USERS}>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-3">
              <Mail size={16} /> دعوات بانتظار أول تسجيل دخول
            </h3>
            <div className="space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-slate-700">{inv.email}</span>
                    <span className="text-xs text-slate-400 mr-2">← سيُمنح دور {roleLabel(inv.role)}</span>
                  </div>
                  <button
                    onClick={() => handleCancelInvite(inv.id)}
                    className="text-slate-400 hover:text-rose-600"
                    title="إلغاء الدعوة"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-amber-700">
              تذكير: هذا لا ينشئ حساب دخول فعلي — أنشئ الحساب من Firebase Console (Authentication → Add user) بنفس
              البريد الإلكتروني، وسيُطبَّق الدور تلقائيًا عند أول تسجيل دخول.
            </p>
          </div>
        </RoleGate>
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">المستخدمون</h3>
        </div>
        <DataStatus status={status} error={error} onRetry={reload} emptyLabel="لا يوجد مستخدمون مسجّلون بعد">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">الاسم</th>
                  <th className="px-4 py-3 font-medium">البريد الإلكتروني</th>
                  <th className="px-4 py-3 font-medium">الدور</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const currentRole = localRoles[u.id] ?? u.role;
                  return (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                      <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">{u.name}</td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <RoleGate
                          permission={PERMISSIONS.MANAGE_USERS}
                          fallback={<span className="text-slate-600">{roleLabel(currentRole)}</span>}
                        >
                          <select
                            value={currentRole}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs"
                            disabled={u.id === myUser?.uid && myRole !== ROLES.ADMIN}
                          >
                            {Object.values(ROLES).map((r) => (
                              <option key={r} value={r}>
                                {roleLabel(r)}
                              </option>
                            ))}
                          </select>
                        </RoleGate>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DataStatus>
      </div>

      {showInviteModal && (
        <Modal title="إضافة مستخدم" onClose={() => setShowInviteModal(false)}>
          <div className="mb-3 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 leading-relaxed">
            هذا يُسجّل الدور المخصص لهذا البريد الإلكتروني فقط — <strong>لا</strong> ينشئ حساب دخول. أنشئ الحساب
            الفعلي من Firebase Console (Authentication → Add user)، وسيُطبَّق هذا الدور تلقائيًا عند أول تسجيل دخول
            بنفس البريد.
          </div>
          <form onSubmit={handleInvite} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
                placeholder="name@tdeco.ps"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">الدور</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm"
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>
                    {roleLabel(r)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={inviting}
                className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60"
              >
                {inviting ? "جارٍ الحفظ..." : "حفظ الدور المخصص"}
              </button>
              <button type="button" onClick={() => setShowInviteModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs">
                إلغاء
              </button>
            </div>
            {invitesSource === "mock" && (
              <p className="text-[11px] text-amber-600">
                ملاحظة: Firebase غير مهيأ — لن يتم حفظ هذا التخصيص فعليًا (وضع تجريبي فقط).
              </p>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}

export default UsersPermissionsPage;
