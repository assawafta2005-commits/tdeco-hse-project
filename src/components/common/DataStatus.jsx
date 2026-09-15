import React from "react";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";

/**
 * Shared loading / error / empty presentation so every page is honest
 * about the state of its data instead of silently showing nothing or
 * (worse) mock data disguised as real data.
 */
export function LoadingState({ label = "جاري التحميل..." }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-16 text-sm text-slate-500">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle size={20} />
      </div>
      <p className="text-sm font-semibold text-rose-800">تعذر الاتصال بقاعدة البيانات</p>
      <p className="mt-1 text-xs text-rose-600">
        {error?.message || "حدث خطأ غير متوقع أثناء تحميل البيانات."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border border-rose-300 bg-white px-4 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

export function EmptyState({ label = "لا توجد بيانات حالياً" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-400">
        <Inbox size={22} />
      </div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function MockBadge() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      بيانات تجريبية — Firebase غير مُهيّأ في بيئة التطوير الحالية (راجع ملف .env)
    </div>
  );
}

/**
 * Convenience wrapper: renders the right state automatically, or the
 * children (the real content) when status is "ready".
 */
export function DataStatus({ status, error, onRetry, emptyLabel, children }) {
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState error={error} onRetry={onRetry} />;
  if (status === "empty") return <EmptyState label={emptyLabel} />;
  return children;
}
