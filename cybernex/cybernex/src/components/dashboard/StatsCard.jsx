import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, TrendingDown, Users, BookOpen, FileText, Calendar, Shield, Clock } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Stats Card component for displaying key metrics
 *
 * @param {object} props - Component props
 * @param {string} props.title - Card title
 * @param {number|string} props.value - Value to display
 * @param {string} props.icon - Icon component
 * @param {string} props.color - Card color (blue, green, yellow, red)
 * @param {string} props.period - Time period label
 * @param {number} props.change - Change percentage
 * @param {boolean} props.isIncrease - Whether change represents an increase
 * @param {string} props.subtitle - Subtitle/description
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Stats Card component
 */
const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  period = 'This month',
  change,
  isIncrease = true,
  subtitle,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Color configuration
  const colorConfig = {
    blue: {
      bg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
      icon: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      text: isDarkMode ? 'text-blue-300' : 'text-blue-700'
    },
    green: {
      bg: isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-50',
      icon: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
      text: isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
    },
    yellow: {
      bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50',
      icon: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      text: isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
    },
    red: {
      bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-50',
      icon: isDarkMode ? 'text-red-400' : 'text-red-600',
      text: isDarkMode ? 'text-red-300' : 'text-red-700'
    },
    purple: {
      bg: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50',
      icon: isDarkMode ? 'text-purple-400' : 'text-purple-600',
      text: isDarkMode ? 'text-purple-300' : 'text-purple-700'
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  // Default icons based on title
  const defaultIcons = {
    'users': Users,
    'students': Users,
    'faculty': Users,
    'courses': BookOpen,
    'assessments': FileText,
    'labs': Shield,
    'results': FileText,
    'attendance': Calendar,
    'schedule': Calendar,
    'violations': Shield
  };

  const FinalIcon = Icon || defaultIcons[title?.toLowerCase()] || BookOpen;

  return (
    <Card className={`flex flex-col ${config.bg} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {subtitle}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${config.text}`}>
              {value}
            </p>

            {change !== undefined && (
              <Badge variant={isIncrease ? 'success' : 'danger'} size="sm">
                {isIncrease ? '+' : ''}{change}%
              </Badge>
            )}
          </div>

          {period && (
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {period}
            </p>
          )}
        </div>

        <div className={`p-2 rounded-lg ${config.bg.replace('/30', '')}`}>
          <FinalIcon className={`w-5 h-5 ${config.icon}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;