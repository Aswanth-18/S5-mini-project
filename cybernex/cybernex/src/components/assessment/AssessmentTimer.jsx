import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Badge from '../common/Badge';
import { Clock, AlertTriangle } from 'lucide-react';

/**
 * Assessment Timer component
 *
 * @param {object} props - Component props
 * @param {number} props.remainingTime - Remaining time in seconds
 * @param {number} props.duration - Total duration in minutes
 * @param {boolean} props.isRunning - Whether timer is running
 * @param {boolean} props.isExpired - Whether time has expired
 * @param {function} props.onExpire - Callback when timer expires
 * @param {function} props.onWarning - Callback when warning time is reached
 * @param {Array} props.warningTimes - Array of warning times in seconds
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Assessment Timer component
 */
const AssessmentTimer = ({
  remainingTime = 0,
  duration = 60,
  isRunning = true,
  isExpired = false,
  onExpire,
  onWarning,
  warningTimes = [300, 1800, 3600, 5400], // 5m, 30m, 60m, 90m
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [timeLeft, setTimeLeft] = useState(remainingTime);
  const [isDanger, setIsDanger] = useState(false);
  const timerRef = useRef(null);

  // Start timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          // Check for warning times
          if (warningTimes.includes(newTime) && onWarning) {
            onWarning(newTime);
          }

          // Check if time expired
          if (newTime <= 0 && onExpire) {
            clearInterval(timerRef.current);
            onExpire();
            return 0;
          }

          // Set danger mode for last 5 minutes or 10% of time
          if (newTime <= 300 || newTime <= duration * 60 * 0.1) {
            setIsDanger(true);
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, warningTimes, onWarning, onExpire, duration]);

  // Update time when remainingTime prop changes
  useEffect(() => {
    setTimeLeft(remainingTime);
    setIsDanger(remainingTime <= 300 || remainingTime <= duration * 60 * 0.1);
  }, [remainingTime, duration]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Format time for display with better readability
  const formattedTime = formatTime(timeLeft);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Clock className={`w-6 h-6 ${
          isExpired
            ? 'text-red-500 animate-pulse'
            : isDanger
              ? 'text-orange-500 animate-pulse'
              : isDarkMode
                ? 'text-cyan-400'
                : 'text-blue-600'
        }`} />

        {isDanger && !isExpired && (
          <div className="absolute -top-1 -right-1">
            <AlertTriangle className="w-4 h-4 text-orange-500 animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-mono font-medium ${
            isExpired
              ? 'text-red-500'
              : isDanger
                ? 'text-orange-500'
                : isDarkMode
                  ? 'text-white'
                  : 'text-gray-900'
          }`}>
            {formattedTime}
          </span>
        </div>

        {isExpired && (
          <Badge variant="danger" size="sm" className="mt-1">
            Time's up!
          </Badge>
        )}

        {isDanger && !isExpired && (
          <Badge variant="warning" size="sm" className="mt-1">
            Less than 5 minutes
          </Badge>
        )}
      </div>
    </div>
  );
};

// Default props
AssessmentTimer.defaultProps = {
  remainingTime: 0,
  duration: 60,
  isRunning: true,
  isExpired: false,
  onExpire: () => {},
  onWarning: () => {},
  warningTimes: [300, 1800, 3600, 5400]
};

export default AssessmentTimer;