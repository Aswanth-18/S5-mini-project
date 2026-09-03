import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { ROLES } from '../../utils/constants';
import { Plus, BookOpen, FileText, Users, ShieldCheck, Calendar } from 'lucide-react';

/**
 * Quick Actions component for displaying common user actions
 *
 * @param {object} props - Component props
 * @param {Array} props.actions - Array of action buttons
 * @param {string} props.title - Component title
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Quick Actions component
 */
const QuickActions = ({
  actions = [],
  title = 'Quick Actions',
  className = ''
}) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Default actions based on user role
  const getDefaultActions = () => {
    if (!user) return [];

    switch (user.role) {
      case ROLES.ADMIN:
        return [
          {
            label: 'Create User',
            icon: Users,
            path: '/admin/users/new',
            variant: 'primary'
          },
          {
            label: 'Create Course',
            icon: BookOpen,
            path: '/admin/courses/new',
            variant: 'primary'
          },
          {
            label: 'Create Assessment',
            icon: FileText,
            path: '/admin/assessments/new',
            variant: 'primary'
          },
          {
            label: 'View Violations',
            icon: ShieldCheck,
            path: '/admin/violations',
            variant: 'outline'
          }
        ];

      case ROLES.FACULTY:
        return [
          {
            label: 'Create Course',
            icon: BookOpen,
            path: '/faculty/courses/new',
            variant: 'primary'
          },
          {
            label: 'Create Assessment',
            icon: FileText,
            path: '/faculty/assessments/new',
            variant: 'primary'
          },
          {
            label: 'View Students',
            icon: Users,
            path: '/faculty/students',
            variant: 'outline'
          },
          {
            label: 'View Schedule',
            icon: Calendar,
            path: '/faculty/schedule',
            variant: 'outline'
          }
        ];

      case ROLES.STUDENT:
        return [
          {
            label: 'Browse Courses',
            icon: BookOpen,
            path: '/student/learning',
            variant: 'primary'
          },
          {
            label: 'Take Assessment',
            icon: FileText,
            path: '/student/assessments',
            variant: 'primary'
          },
          {
            label: 'Practice Labs',
            icon: ShieldCheck,
            path: '/student/practice',
            variant: 'outline'
          },
          {
            label: 'View Progress',
            icon: Calendar,
            path: '/student/progress',
            variant: 'outline'
          }
        ];

      default:
        return [];
    }
  };

  const displayActions = actions.length > 0 ? actions : getDefaultActions();

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.path}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isDarkMode
                  ? 'text-gray-200 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${
                action.variant === 'primary'
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : isDarkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  action.variant === 'primary'
                    ? 'text-blue-600 dark:text-blue-400'
                    : isDarkMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                }`} />
              </div>
              <span className="font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;