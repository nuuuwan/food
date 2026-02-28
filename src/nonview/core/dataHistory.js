export const HISTORY_STORAGE_KEY = "food:history";

const LEGACY_ID_PATTERN = /^food-00\d+$/;

export const sortByTimestampDesc = (items) =>
  [...items].sort(
    (left, right) => (right?.timestamp || 0) - (left?.timestamp || 0),
  );

export const mergeById = (first, second) => {
  const merged = new Map();
  [...first, ...second].forEach((item) => {
    if (item?.id) {
      merged.set(item.id, item);
    }
  });
  return sortByTimestampDesc(Array.from(merged.values()));
};

export const isRealFoodItem = (item) =>
  item?.id && !LEGACY_ID_PATTERN.test(item.id || "");

export const loadHistoryFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isRealFoodItem) : [];
  } catch {
    return [];
  }
};

export const persistHistoryToLocalStorage = (history) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage quota errors
  }
};
