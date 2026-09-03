import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Progress Bar component
 *
 * @param {object} props - Component props
 * @param {number} props.value - Current progress value (0-100)
 * @param {number} props.max - Maximum value (default: 100)
 * @param {string} props.size - Size of the progress bar (sm, md, lg)
 * @param {string} props.variant - Variant (primary, success, warning, danger)
 * @param {boolean} props.showLabel - Whether to show percentage label
 * @param {string} props.label - Custom label
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Progress Bar component
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Size classes
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600',
    success: 'bg-emerald-600',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  // Track color
  const trackColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className={`w-full rounded-full overflow-hidden ${trackColor}`}>
        <div
          className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;