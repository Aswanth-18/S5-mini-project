import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debouncing values (useful for search inputs)
 *
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debounced callbacks
 *
 * @param {function} callback - Function to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {function} - Debounced callback
 */
export const useDebouncedCallback = (callback, delay = 500) => {
  const callbackRef = useCallback(callback, [callback]);

  return useCallback((...args) => {
    const timer = setTimeout(() => {
      callbackRef(...args);
    }, delay);

    return () => clearTimeout(timer);
  }, [callbackRef, delay]);
};

export default useDebounce;