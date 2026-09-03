import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X } from 'lucide-react';

/**
 * Chip component for tags and small labels
 *
 * @param {object} props - Component props
 * @param {string} props.variant - Chip variant (default, primary, success, warning, danger)
 * @param {string} props.size - Chip size (sm, md, lg)
 * @param {React.ReactNode} props.children - Chip content
 * @param {boolean} props.dismissible - Whether chip can be dismissed
 * @param {function} props.onDismiss - Function to call when dismissed
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Chip component
 */
const Chip = ({
  variant = 'default',
  size = 'md',
  children,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Variant classes
  const variantClasses = {
    default: isDarkMode
      ? 'bg-gray-700 text-gray-200 dark:bg-gray-700 dark:text-gray-200'
      : 'bg-gray-100 text-gray-800',
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
      : 'bg-red-100 text-red-800'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default Chip;