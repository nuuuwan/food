export const isLocalFrontend = () =>
  typeof window !== "undefined" &&
  window.location.hostname === "localhost" &&
  window.location.port === "3000";

export const getDefaultBaseURLForEnvironment = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return isLocalFrontend() ? "http://localhost:3001" : "";
};

export const getLocalBaseURL = () =>
  process.env.REACT_APP_LOCAL_API_BASE_URL || "http://localhost:3001";

export const resolveBaseURL = (explicitBaseURL) => {
  if (explicitBaseURL) {
    return explicitBaseURL;
  }
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  const target = (process.env.REACT_APP_VERCEL_TARGET || "auto").toLowerCase();
  const localBaseURL = getLocalBaseURL();
  const remoteBaseURL = process.env.REACT_APP_REMOTE_API_BASE_URL || "";

  if (target === "remote") {
    return remoteBaseURL || getDefaultBaseURLForEnvironment();
  }
  if (target === "local") {
    return localBaseURL;
  }
  if (target === "auto") {
    return isLocalFrontend()
      ? localBaseURL
      : remoteBaseURL || getDefaultBaseURLForEnvironment();
  }
  return getDefaultBaseURLForEnvironment();
};

export const shouldFallbackToLocal = (primaryBaseURL, error) => {
  const fallbackEnabled =
    (process.env.REACT_APP_ENABLE_LOCAL_FALLBACK || "false").toLowerCase() ===
    "true";

  if (!fallbackEnabled || !isLocalFrontend()) {
    return false;
  }

  const localBaseURL = getLocalBaseURL();
  if (!primaryBaseURL || primaryBaseURL === localBaseURL) {
    return false;
  }

  if (error?.name === "TypeError") {
    return true;
  }

  return /401|403|network|cors/i.test(error?.message || "");
};
