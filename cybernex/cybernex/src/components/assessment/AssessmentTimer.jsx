import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * Assessment Timer Component
 * Shows the remaining time for the assessment
 */
const AssessmentTimer = ({ 
  duration = 60 * 60, 
  onTimeUp = () => {}, 
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp]);

  useEffect(() => {
    // Show warning when less than 5 minutes left
    setIsWarning(timeLeft <= 5 * 60);
  }, [timeLeft]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hrs, mins, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className={`w-5 h-5 ${isWarning ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-gray-400'}`} />
      <Badge 
        className={isWarning ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}
        variant={isWarning ? 'danger' : 'secondary'}
      >
        {formatTime(timeLeft)}
      </Badge>
      {isWarning && (
        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Time running out!</span>
      )}
    </div>
  );
};

export default AssessmentTimer;