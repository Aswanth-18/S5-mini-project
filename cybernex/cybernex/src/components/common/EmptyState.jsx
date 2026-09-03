import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, BookOpen, AlertCircle, Users, Calendar, BarChart3, FileText } from 'lucide-react';

/**
 * Empty State component for displaying when no data is available
 *
 * @param {object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} props.description - Additional description
 * @param {string} props.type - Type of empty state (search, courses, users, etc.)
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.action - Action button or element
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Empty State component
 */
const EmptyState = ({
  message = 'No data available',
  description = 'There is no data to display at this time.',
  type = 'default',
  icon,
  action,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Default icons for different types
  const typeIcons = {
    search: <Search className="w-12 h-12" />,
    courses: <BookOpen className="w-12 h-12" />,
    users: <Users className="w-12 h-12" />,
    assessments: <FileText className="w-12 h-12" />,
    results: <BarChart3 className="w-12 h-12" />,
    schedule: <Calendar className="w-12 h-12" />,
    default: <AlertCircle className="w-12 h-12" />
  };

  // Icon color based on theme
  const iconColor = isDarkMode ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* Icon */}
      <div className={`mb-4 ${iconColor}`}>
        {icon || typeIcons[type]}
      </div>

      {/* Message */}
      <h3 className={`text-lg font-medium mb-2 ${
        isDarkMode ? 'text-gray-200' : 'text-gray-900'
      }`}>
        {message}
      </h3>

      {/* Description */}
      {description && (
        <p className={`text-center text-sm mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;