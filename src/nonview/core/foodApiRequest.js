export const isCacheHit = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  return false;
};

const buildUrl = (path, baseURL) => `${baseURL}${path}`;

const requestFromBase = async (path, options, baseURL) => {
  const response = await fetch(buildUrl(path, baseURL), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    try {
      const errorPayload = await response.json();
      throw new Error(
        errorPayload?.error || `Request failed: ${response.status}`,
      );
    } catch {
      throw new Error(`Request failed: ${response.status}`);
    }
  }

  return response.json();
};

export const requestWithFallback = async ({
  path,
  options = {},
  baseURL,
  getLocalBaseURL,
  shouldFallbackToLocal,
}) => {
  try {
    return await requestFromBase(path, options, baseURL);
  } catch (error) {
    if (!shouldFallbackToLocal(baseURL, error)) {
      throw error;
    }
    return requestFromBase(path, options, getLocalBaseURL());
  }
};
