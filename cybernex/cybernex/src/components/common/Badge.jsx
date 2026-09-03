import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Badge component for status indicators
 *
 * @param {object} props - Component props
 * @param {string} props.variant - Badge variant (primary, success, warning, danger, info, gray)
 * @param {string} props.size - Badge size (sm, md, lg)
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.dot - Whether to show a dot indicator
 * @returns {JSX.Element} - Badge component
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  dot = false
}) => {
  const { isDarkMode } = useTheme();

  // Variant classes
  const variantClasses = {
    primary: isDarkMode
      ? 'bg-blue-900/30 text-blue-300 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-blue-100 text-blue-800',
    success: isDarkMode
      ? 'bg-emerald-900/30 text-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300'
      : 'bg-emerald-100 text-emerald-800',
    warning: isDarkMode
      ? 'bg-yellow-900/30 text-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300'
      : 'bg-yellow-100 text-yellow-800',
    danger: isDarkMode
      ? 'bg-red-900/30 text-red-300 dark:bg-red-900/30 dark:text-red-300'
      : 'bg-red-100 text-red-800',
    info: isDarkMode
      ? 'bg-cyan-900/30 text-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300'
      : 'bg-cyan-100 text-cyan-800',
    gray: isDarkMode
      ? 'bg-gray-700 text-gray-200 dark:bg-gray-700 dark:text-gray-200'
      : 'bg-gray-100 text-gray-800'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full
            ${variant === 'primary' && 'bg-blue-500'}
            ${variant === 'success' && 'bg-emerald-500'}
            ${variant === 'warning' && 'bg-yellow-500'}
            ${variant === 'danger' && 'bg-red-500'}
            ${variant === 'info' && 'bg-cyan-500'}
            ${variant === 'gray' && 'bg-gray-500'}
          `}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;