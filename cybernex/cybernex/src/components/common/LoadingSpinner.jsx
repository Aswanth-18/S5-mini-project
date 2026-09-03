import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Loading Spinner component
 *
 * @param {object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg, xl)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.color - Spinner color (primary, white, etc.)
 * @returns {JSX.Element} - Loading Spinner component
 */
const LoadingSpinner = ({
  size = 'md',
  className = '',
  color = 'primary'
}) => {
  const { isDarkMode } = useTheme();

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  // Color classes
  const colorClasses = {
    primary: isDarkMode ? 'border-blue-400' : 'border-blue-600',
    white: 'border-white',
    gray: isDarkMode ? 'border-gray-400' : 'border-gray-600',
    red: 'border-red-500',
    green: 'border-emerald-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;