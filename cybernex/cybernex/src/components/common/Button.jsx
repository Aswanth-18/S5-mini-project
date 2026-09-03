import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Reusable Button component with multiple variants
 *
 * @param {object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, danger, success, outline, ghost, icon)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.isLoading - Whether button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {React.ReactNode} props.startIcon - Icon to display at the start
 * @param {React.ReactNode} props.endIcon - Icon to display at the end
 * @returns {JSX.Element} - Button component
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
  children,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  ...props
}) => {
  const { isDarkMode } = useTheme();

  // Base classes
  const baseClasses = 'btn font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
    secondary: isDarkMode ?
      'bg-gray-700 text-gray-200 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600' :
      'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: isDarkMode ?
      'border border-gray-600 text-gray-300 hover:bg-gray-800' :
      'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: isDarkMode ?
      'text-gray-300 hover:bg-gray-800' :
      'text-gray-600 hover:bg-gray-100',
    icon: isDarkMode ?
      'text-gray-400 hover:bg-gray-800 p-2 rounded-lg' :
      'text-gray-600 hover:bg-gray-100 p-2 rounded-lg'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          {children}
        </>
      ) : (
        <>
          {startIcon && <span className="mr-2">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;