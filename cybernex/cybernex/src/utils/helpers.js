/**
 * CyberNex - General Helper Utilities
 */

export const genId = (prefix = 'id') => {
  const random = Math.random().toString(36).slice(2, 9);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${random}`;
};

export const genUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const debounce = (fn, wait = 300) => {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

export const throttle = (fn, wait = 300) => {
  let lastCall = 0;
  let timeoutId;
  return (...args) => {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    if (remaining <= 0) {
      clearTimeout(timeoutId);
      lastCall = now;
      fn(...args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, remaining);
    }
  };
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const groupBy = (list = [], key) => {
  const getKey = typeof key === 'function' ? key : (item) => item[key];
  return list.reduce((acc, item) => {
    const k = getKey(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
};

export const sortBy = (list = [], key, desc = false) => {
  const getVal = typeof key === 'function' ? key : (item) => item[key];
  const sorted = [...list].sort((a, b) => {
    const av = getVal(a);
    const bv = getVal(b);
    if (av === bv) return 0;
    return av > bv ? 1 : -1;
  });
  return desc ? sorted.reverse() : sorted;
};

export const uniqueBy = (list = [], key) => {
  if (!key) return [...new Set(list)];
  const getKey = typeof key === 'function' ? key : (item) => item[key];
  const seen = new Set();
  return list.filter((item) => {
    const k = getKey(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export const sumBy = (list = [], key) => {
  const getVal = key ? (typeof key === 'function' ? key : (item) => item[key]) : (n) => n;
  return list.reduce((total, item) => total + (Number(getVal(item)) || 0), 0);
};

export const averageBy = (list = [], key) => {
  if (!list.length) return 0;
  return sumBy(list, key) / list.length;
};

export const chunk = (list = [], size = 1) => {
  if (size <= 0) return [list];
  const result = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
};

export const shuffle = (list = []) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const pick = (obj = {}, keys = []) =>
  keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});

export const omit = (obj = {}, keys = []) => {
  const excluded = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !excluded.has(k)));
};

export const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;

export const deepClone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

export const scoreToGrade = (percent) => {
  const p = Number(percent) || 0;
  if (p >= 90) return 'A';
  if (p >= 80) return 'B';
  if (p >= 70) return 'C';
  if (p >= 60) return 'D';
  return 'F';
};

export const cx = (...classes) => classes.filter(Boolean).join(' ');

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const stringToColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
};

export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const downloadAsFile = (content, filename, mimeType = 'application/json') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  genId, genUUID, debounce, throttle, sleep, groupBy, sortBy, uniqueBy,
  sumBy, averageBy, chunk, shuffle, pick, omit, isEmptyObject, deepClone,
  scoreToGrade, cx, clamp, stringToColor, safeJsonParse, downloadAsFile,
};