import { fetchCollection, addToCollection, deleteFromCollection } from "./firestoreService";
import { logAction } from "./auditLogService";
import { INSURANCE_RESOURCES } from "../config/insuranceListConfig";
import {
  INSURANCE_POLICIES,
  INSURANCE_CLAIMS,
  INSURANCE_VEHICLES,
  INSURANCE_ASSETS,
  INSURANCE_EMPLOYEES,
  INSURERS,
  INSURANCE_FINANCE,
  INSURANCE_RENEWALS,
  INSURANCE_ARCHIVE,
} from "../data/insuranceMock";

const MOCK_BY_RESOURCE = {
  policies: INSURANCE_POLICIES,
  claims: INSURANCE_CLAIMS,
  vehicles: INSURANCE_VEHICLES,
  assets: INSURANCE_ASSETS,
  employees: INSURANCE_EMPLOYEES,
  insurers: INSURERS,
  finance: INSURANCE_FINANCE,
  renewals: INSURANCE_RENEWALS,
  archive: INSURANCE_ARCHIVE,
};

/**
 * Generic CRUD for any Insurance resource (policies/claims/vehicles/
 * assets/employees/insurers/finance/renewals/archive), same
 * {rows, source, error} contract as every other service in this project.
 * `resource` is one of the keys in INSURANCE_RESOURCES.
 */
export async function listInsuranceResource(resource) {
  const { collection } = INSURANCE_RESOURCES[resource];
  const res = await fetchCollection(collection);
  if (res.source === "unconfigured") {
    return { rows: MOCK_BY_RESOURCE[resource] ?? [], source: "mock", error: null };
  }
  return { rows: res.data ?? [], source: "firestore", error: res.error };
}

export async function createInsuranceRecord(resource, data, actingUserId = "unknown") {
  const { collection } = INSURANCE_RESOURCES[resource];
  const res = await addToCollection(collection, data);
  if (res.source === "firestore" && !res.error) {
    await logAction({
      userId: actingUserId,
      action: "create",
      resource: collection,
      resourceId: res.id,
    });
  }
  return res;
}

export async function deleteInsuranceRecord(resource, id, actingUserId = "unknown") {
  const { collection } = INSURANCE_RESOURCES[resource];
  const res = await deleteFromCollection(collection, id);
  if (res.ok) {
    await logAction({
      userId: actingUserId,
      action: "delete",
      resource: collection,
      resourceId: id,
    });
  }
  return res;
}

/**
 * Dashboard needs policies + claims together for KPIs — a small
 * convenience wrapper rather than importing both individually on every
 * dashboard render.
 */
export async function listInsuranceDashboardData() {
  const [policies, claims] = await Promise.all([
    listInsuranceResource("policies"),
    listInsuranceResource("claims"),
  ]);
  return { policies, claims };
}
