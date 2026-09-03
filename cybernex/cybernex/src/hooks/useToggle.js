import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean toggle state
 *
 * @param {boolean} initialValue - Initial toggle state
 * @returns {array} - [isToggled, toggle, setToggle, toggleOn, toggleOff]
 */
export const useToggle = (initialValue = false) => {
  const [isToggled, setIsToggled] = useState(initialValue);

  // Toggle the state
  const toggle = useCallback(() => {
    setIsToggled(prev => !prev);
  }, []);

  // Set specific value
  const setToggle = useCallback((value) => {
    setIsToggled(value);
  }, []);

  // Force on
  const toggleOn = useCallback(() => {
    setIsToggled(true);
  }, []);

  // Force off
  const toggleOff = useCallback(() => {
    setIsToggled(false);
  }, []);

  return [isToggled, toggle, setToggle, toggleOn, toggleOff];
};

export default useToggle;