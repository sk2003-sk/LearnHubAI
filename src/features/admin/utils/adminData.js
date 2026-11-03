import { extractArray } from "../../../utils/apiResponse";

export const getAdminUsersFromResponse = (response) => extractArray(response, ["users", "items", "results"]);
export const getAdminCoursesFromResponse = (response) => extractArray(response, ["courses", "items", "results"]);
export const getAdminOrdersFromResponse = (response) => extractArray(response, ["orders", "items", "results", "records"]);
export const getAdminEnrollmentsFromResponse = (response) => extractArray(response, ["enrollments", "items", "results", "records"]);
export const getAdminCategoriesFromResponse = (response) => extractArray(response, ["categories", "items", "results"]);
export const getAdminCouponsFromResponse = (response) => extractArray(response, ["coupons", "items", "results"]);
export const getAdminNotificationsFromResponse = (response) => extractArray(response, ["notifications", "items", "results"]);

export const getAdminInstructorsFromResponse = (response) => {
  const instructors = extractArray(response, ["instructors", "users", "items", "results"]);
  const admins = extractArray(response, ["admins"]);
  return [...new Map([...instructors, ...admins].map((item, index) => [item?._id ?? item?.id ?? index, item])).values()];
};

export const getEntityId = (entity) => entity?._id ?? entity?.id ?? null;
export const getPaymentStatus = (order) => order?.payment_info?.status ?? order?.paymentInfo?.status ?? order?.paymentStatus ?? order?.status ?? "Recorded";
export const getOrderReference = (order) => order?.orderId ?? order?._id ?? order?.id ?? "—";

export function getAdminAnalyticsOverview(response) {
  const root = response?.data ?? response ?? {};
  const objects = [root]
    .concat([root.analytics, root.overview, root.totals, root.data])
    .filter((value) => value && typeof value === "object" && !Array.isArray(value));

  return Object.assign({}, ...objects);
}

export function getStatValue(source, keys) {
  for (const key of keys) {
    const value = source?.[key];

    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
      return Number(value);
    }
    if (Array.isArray(value)) return value.length;
    if (value && typeof value === "object") {
      const nested = value.total ?? value.count ?? value.length;
      if (Number.isFinite(Number(nested))) return Number(nested);
    }
  }

  return null;
}
