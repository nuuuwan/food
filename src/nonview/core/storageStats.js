export const getStorageStats = () => {
  if (typeof window === "undefined") {
    return { usedKB: 0, remainingKB: 0, usedPct: 0 };
  }

  const assumedCapacityBytes = 5 * 1024 * 1024;
  let usedBytes = 0;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index) || "";
    const value = window.localStorage.getItem(key) || "";
    usedBytes += (key.length + value.length) * 2;
  }

  const remainingBytes = Math.max(assumedCapacityBytes - usedBytes, 0);
  return {
    usedKB: usedBytes / 1024,
    remainingKB: remainingBytes / 1024,
    usedPct: (usedBytes / assumedCapacityBytes) * 100,
  };
};
