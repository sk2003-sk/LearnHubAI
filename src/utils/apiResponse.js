const WRAPPER_KEYS = ["data", "result", "payload", "response", "body"];

export function unwrapApiResponse(response) {
  let value = response;
  const visited = new Set();

  while (value && typeof value === "object" && !Array.isArray(value) && !visited.has(value)) {
    visited.add(value);
    const nextKey = WRAPPER_KEYS.find((key) => {
      const candidate = value[key];
      return candidate && typeof candidate === "object";
    });
    if (!nextKey) break;
    value = value[nextKey];
  }

  return value;
}

function collectCandidates(response) {
  const candidates = [];
  const queue = [response];
  const visited = new Set();

  while (queue.length && candidates.length < 32) {
    const value = queue.shift();
    if (!value || typeof value !== "object" || visited.has(value)) continue;
    visited.add(value);
    candidates.push(value);

    if (Array.isArray(value)) continue;

    for (const key of WRAPPER_KEYS) {
      const nested = value[key];
      if (nested && typeof nested === "object") queue.push(nested);
    }
  }

  return candidates;
}

function isObjectArray(value) {
  return Array.isArray(value) && value.some((item) => item && typeof item === "object");
}

function findDeepArray(response, maxDepth = 3) {
  const queue = [{ value: response, depth: 0 }];
  const visited = new Set();

  while (queue.length) {
    const { value, depth } = queue.shift();
    if (!value || typeof value !== "object" || visited.has(value)) continue;
    visited.add(value);

    if (isObjectArray(value)) return value;
    if (depth >= maxDepth || Array.isArray(value)) continue;

    for (const nested of Object.values(value)) {
      if (nested && typeof nested === "object") {
        queue.push({ value: nested, depth: depth + 1 });
      }
    }
  }

  return [];
}

export function extractArray(response, keys = []) {
  if (isObjectArray(response)) return response;

  for (const candidate of collectCandidates(response)) {
    if (Array.isArray(candidate)) continue;

    for (const key of keys) {
      if (Array.isArray(candidate[key])) return candidate[key];
    }
  }

  return findDeepArray(response);
}

export function extractObject(response, keys = []) {
  const candidates = collectCandidates(response);

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) continue;

    for (const key of keys) {
      const value = candidate[key];
      if (value && typeof value === "object" && !Array.isArray(value)) return value;
    }
  }

  return unwrapApiResponse(response);
}

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
