import { fetchCollection } from "./firestoreService";
import { MONTHLY_CHART } from "../data/dashboardMock";
import { INCIDENTS } from "../data/incidentsMock";
import { RISKS } from "../data/risksMock";
import { FLEET } from "../data/fleetMock";
import { FORMS } from "../data/formsMock";

const ARABIC_MONTHS = [
  "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول",
];

/**
 * Firestore docs may carry dates as a Firestore Timestamp, an ISO string,
 * or the Arabic-numeral display strings used by the original mock data
 * (e.g. "٢٦ آب ٢٠٢٦"). Only the first two are reliably parseable; the
 * mock display strings intentionally return null so they're excluded from
 * time-based aggregation rather than silently counted in the wrong month.
 */
function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate(); // Firestore Timestamp
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function isSameMonth(date, ref) {
  return date.getFullYear() === ref.getFullYear() && date.getMonth() === ref.getMonth();
}

/**
 * Builds the last-6-months "risks vs reports" series from real records.
 * Records with unparseable dates are skipped (see toDate above) — the
 * chart shows 0 for a month rather than inventing data.
 */
function buildMonthlySeries(risks, incidents) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ month: ARABIC_MONTHS[d.getMonth()], year: d.getFullYear(), monthIdx: d.getMonth(), risks: 0, reports: 0 });
  }

  const tally = (rows, key, dateFields) => {
    rows.forEach((row) => {
      const raw = dateFields.map((f) => row[f]).find(Boolean);
      const d = toDate(raw);
      if (!d) return;
      const bucket = buckets.find((b) => b.monthIdx === d.getMonth() && b.year === d.getFullYear());
      if (bucket) bucket[key] += 1;
    });
  };

  tally(risks, "risks", ["createdAt", "date", "due"]);
  tally(incidents, "reports", ["createdAt", "date"]);

  return buckets.map(({ month, risks: r, reports }) => ({ month, risks: r, reports }));
}

/**
 * Aggregates everything the dashboard needs in one call.
 * Returns { rows: [summary], source, error } to match useServiceData.
 *
 * When Firebase isn't configured, falls back to the original mock arrays
 * (and the static MONTHLY_CHART) so dev mode still renders — flagged via
 * source: "mock" so the UI shows the yellow badge.
 *
 * When Firebase IS configured but collections are empty, everything
 * computes to 0 / empty arrays rather than falling back to mock —
 * "no data yet" is a legitimate real state, not an error.
 */
export async function getDashboardSummary() {
  const [risksRes, incidentsRes, formsRes, vehiclesRes] = await Promise.all([
    fetchCollection("risks"),
    fetchCollection("incidents"),
    fetchCollection("permits"),
    fetchCollection("vehicles"),
  ]);

  const unconfigured = risksRes.source === "unconfigured";

  if (unconfigured) {
    const openRisks = RISKS.filter((r) => r.status !== "مغلق").length;
    const readyVehicles = FLEET.filter((v) => v.status === "جاهز").length;
    return {
      rows: [{
        openRisks,
        highRisks: RISKS.filter((r) => r.level === "عالي").length,
        incidentsThisMonth: INCIDENTS.length,
        pendingForms: FORMS.length,
        readyVehicles,
        totalVehicles: FLEET.length,
        readinessPct: FLEET.length ? Math.round((readyVehicles / FLEET.length) * 100) : 0,
        vehiclesNeedingInspection: FLEET.filter((v) => v.status === "فحص مستحق").length,
        chart: MONTHLY_CHART,
        highPriorityAlerts: RISKS.filter((r) => r.level === "عالي" && r.status !== "مغلق"),
        notificationCount:
          RISKS.filter((r) => r.level === "عالي" && r.status !== "مغلق").length +
          INCIDENTS.filter((i) => i.status === "بانتظار نموذج الوزارة").length,
      }],
      source: "mock",
      error: null,
    };
  }

  const error = risksRes.error || incidentsRes.error || formsRes.error || vehiclesRes.error;
  if (error) return { rows: null, source: "firestore", error };

  const risks = risksRes.data ?? [];
  const incidents = incidentsRes.data ?? [];
  const forms = formsRes.data ?? [];
  const vehicles = vehiclesRes.data ?? [];

  const now = new Date();
  const openRisks = risks.filter((r) => r.status && r.status !== "مغلق").length;
  const highRisks = risks.filter((r) => r.level === "عالي" && r.status !== "مغلق");

  const incidentsThisMonth = incidents.filter((i) => {
    const d = toDate(i.createdAt || i.date);
    return d ? isSameMonth(d, now) : false;
  }).length;

  // "Pending" = anything not explicitly closed/approved.
  const pendingForms = forms.filter(
    (f) => !["مغلق", "معتمد", "مكتمل"].includes(f.status)
  ).length;

  const readyVehicles = vehicles.filter((v) => v.status === "جاهز").length;
  const pendingMinistry = incidents.filter((i) => i.status === "بانتظار نموذج الوزارة");

  return {
    rows: [{
      openRisks,
      highRisks: highRisks.length,
      incidentsThisMonth,
      pendingForms,
      readyVehicles,
      totalVehicles: vehicles.length,
      readinessPct: vehicles.length ? Math.round((readyVehicles / vehicles.length) * 100) : 0,
      vehiclesNeedingInspection: vehicles.filter((v) => v.status === "فحص مستحق").length,
      chart: buildMonthlySeries(risks, incidents),
      highPriorityAlerts: highRisks,
      notificationCount: highRisks.length + pendingMinistry.length + pendingForms,
    }],
    source: "firestore",
    error: null,
  };
}
