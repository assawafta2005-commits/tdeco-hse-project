import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
    >
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-bold">
            TD
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">TDECO</p>
            <p className="text-xs text-slate-400">منظومة السلامة</p>
          </div>
        </div>

        <h1 className="text-lg font-bold text-slate-900 mb-1">تسجيل الدخول</h1>
        <p className="text-sm text-slate-500 mb-6">نظام السلامة والصحة المهنية والبيئة</p>

        {!isConfigured && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Firebase غير مُهيّأ بعد. أضف بيانات مشروعك في ملف <code className="font-mono">.env</code> (راجع{" "}
            <code className="font-mono">.env.example</code>) لتفعيل تسجيل الدخول الحقيقي.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="name@tdeco.ps"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-60"
          >
            {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
