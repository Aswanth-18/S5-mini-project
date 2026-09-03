import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for countdown timer
 *
 * @param {number} initialTime - Initial time in seconds
 * @param {boolean} autoStart - Whether to start immediately
 * @param {function} onComplete - Callback when timer completes
 * @returns {object} - Timer state and controls
 */
export const useCountdown = (initialTime = 0, autoStart = false, onComplete = () => {}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Format time as HH:MM:SS
  const formatLongTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start timer
  const start = useCallback(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
      onComplete();
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRunning(true);
    setIsCompleted(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setIsCompleted(true);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeLeft, onComplete]);

  // Pause timer
  const pause = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  }, []);

  // Resume timer (same as start but doesn't reset)
  const resume = useCallback(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
      onComplete();
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRunning(true);
    setIsCompleted(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setIsCompleted(true);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeLeft, onComplete]);

  // Reset timer to initial time
  const reset = useCallback((newTime = initialTime) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeLeft(newTime);
    setIsRunning(false);
    setIsCompleted(false);
  }, [initialTime]);

  // Restart timer (reset + start)
  const restart = useCallback((newTime = initialTime) => {
    reset(newTime);
    start();
  }, [initialTime, reset, start]);

  // Add time to timer
  const addTime = useCallback((seconds) => {
    setTimeLeft(prev => {
      const newTime = prev + seconds;
      return newTime < 0 ? 0 : newTime;
    });
  }, []);

  // Set time directly
  const setTime = useCallback((seconds) => {
    setTimeLeft(Math.max(0, seconds));
  }, []);

  // Get remaining time in seconds
  const getRemainingTime = useCallback(() => {
    return timeLeft;
  }, [timeLeft]);

  // Get elapsed time from initial in seconds
  const getElapsedTime = useCallback(() => {
    return initialTime - timeLeft;
  }, [initialTime, timeLeft]);

  // Get progress percentage (0-100)
  const getProgress = useCallback(() => {
    return initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  }, [initialTime, timeLeft]);

  // Get time in different formats
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft, formatTime]);
  const formattedLongTime = useMemo(() => formatLongTime(timeLeft), [timeLeft, formatLongTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && timeLeft > 0) {
      start();
    }
  }, [autoStart, timeLeft, start]);

  // Restart when initialTime changes
  useEffect(() => {
    if (initialTime !== timeLeft && !isRunning) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, timeLeft, isRunning]);

  return {
    // State
    timeLeft,
    isRunning,
    isCompleted,

    // Formatted values
    formattedTime,
    formattedLongTime,

    // Controls
    start,
    pause,
    resume,
    reset,
    restart,
    addTime,
    setTime,

    // Getters
    getRemainingTime,
    getElapsedTime,
    getProgress,
  };
};

export default useCountdown;