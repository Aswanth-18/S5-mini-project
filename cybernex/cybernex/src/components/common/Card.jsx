import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Reusable Card component
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Card variant (default, border, elevated)
 * @param {string} props.padding - Padding size (none, sm, md, lg)
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.hoverable - Whether card has hover effect
 * @param {object} props - All other div props
 * @returns {JSX.Element} - Card component
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
  hoverable = false,
  ...props
}) => {
  const { isDarkMode } = useTheme();

  // Base classes
  const baseClasses = 'rounded-xl transition-all duration-200';

  // Variant classes
  const variantClasses = {
    default: isDarkMode ?
      'bg-gray-800 border border-gray-700' :
      'bg-white border border-gray-200',
    border: isDarkMode ?
      'bg-transparent border border-gray-600' :
      'bg-transparent border border-gray-300',
    elevated: isDarkMode ?
      'bg-gray-800 shadow-lg border border-gray-700' :
      'bg-white shadow-lg border border-gray-200'
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  // Hover classes
  const hoverClasses = hoverable ?
    (isDarkMode ?
      'hover:bg-gray-700 cursor-pointer' :
      'hover:shadow-md cursor-pointer') : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;