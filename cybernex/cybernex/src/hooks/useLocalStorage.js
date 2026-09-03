import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useLocalStorage
 *
 * Drop-in replacement for useState that persists its value to
 * window.localStorage under `key`, and keeps state in sync across
 * multiple components/tabs using the same key (via the `storage` event
 * and a same-tab custom event, since `storage` does not fire in the tab
 * that made the change).
 *
 * @param {string} key - localStorage key to read/write
 * @param {*} initialValue - value or lazy initializer used when nothing is stored yet
 * @returns {[*, function, function]} [value, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const isBrowser = typeof window !== 'undefined' && !!window.localStorage;

  const readValue = useCallback(() => {
    if (!isBrowser) {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue instanceof Function ? initialValue() : initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);
  const keyRef = useRef(key);

  const setValue = useCallback((value) => {
    if (!isBrowser) {
      console.warn(`useLocalStorage: tried to set key "${key}" outside the browser`);
      return;
    }
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(
          new CustomEvent('local-storage', { detail: { key, value: valueToStore } })
        );
        return valueToStore;
      });
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}":`, error);
    }
  }, [key, isBrowser]);

  const removeValue = useCallback(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
      const fallback = initialValue instanceof Function ? initialValue() : initialValue;
      setStoredValue(fallback);
      window.dispatchEvent(
        new CustomEvent('local-storage', { detail: { key, value: fallback } })
      );
    } catch (error) {
      console.warn(`useLocalStorage: error removing key "${key}":`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isBrowser]);

  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      setStoredValue(readValue());
    }
  }, [key, readValue]);

  useEffect(() => {
    if (!isBrowser) return undefined;

    const handleStorageChange = (event) => {
      if (event instanceof StorageEvent) {
        if (event.key && event.key !== key) return;
        setStoredValue(readValue());
      } else if (event?.detail?.key === key) {
        setStoredValue(event.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, isBrowser, readValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;