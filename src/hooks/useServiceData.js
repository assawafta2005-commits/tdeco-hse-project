import { useCallback, useEffect, useState } from "react";

/**
 * Wraps any service function returning { rows, source, error } into a
 * consistent { status, rows, source, error, reload } shape.
 *
 * status:
 *   "loading" → fetch in progress
 *   "error"   → a configured Firestore call actually failed
 *   "empty"   → real result (mock or Firestore) with zero rows
 *   "ready"   → real result with at least one row
 *
 * This is the single place that decides "empty" vs "error" vs "ready" so
 * every page behaves consistently and no page can accidentally treat a
 * failed read as if it were an empty collection.
 */
export function useServiceData(fetchFn, deps = []) {
  const [state, setState] = useState({ status: "loading", rows: [], source: null, error: null });

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));

    fetchFn()
      .then(({ rows, source, error }) => {
        if (cancelled) return;
        if (error) {
          setState({ status: "error", rows: [], source, error });
        } else if (!rows || rows.length === 0) {
          setState({ status: "empty", rows: [], source, error: null });
        } else {
          setState({ status: "ready", rows, source, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) setState({ status: "error", rows: [], source: null, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => load(), [load]);

  return { ...state, reload: load };
}
