import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Home } from 'lucide-react';

/**
 * Breadcrumb navigation component
 *
 * @param {object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Breadcrumb component
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // If items are not provided, generate from current path
  const breadcrumbItems = items.length > 0
    ? items
    : generateItemsFromPath(location.pathname);

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path || index}>
          {index > 0 && (
            <span
              className={`text-gray-400 dark:text-gray-500 ${
                isDarkMode ? 'dark:text-gray-500' : 'text-gray-400'
              }`}
            >
              /
            </span>
          )}

          {index === breadcrumbItems.length - 1 ? (
            <span
              className={`text-gray-500 dark:text-gray-400 ${
                isDarkMode ? 'dark:text-gray-400' : 'text-gray-500'
              }`}
            >
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path || '#'}
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                isDarkMode ? 'dark:text-gray-300 dark:hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Generate breadcrumb items from current path
 * @param {string} pathname - Current path
 * @returns {Array} - Array of breadcrumb items
 */
const generateItemsFromPath = (pathname) => {
  const pathParts = pathname.split('/').filter(Boolean);
  const items = [{ label: 'Home', path: '/' }];

  if (pathParts.length === 0) return items;

  // Map path parts to breadcrumb labels
  const pathMap = {
    'admin': 'Admin',
    'faculty': 'Faculty',
    'student': 'Student',
    'dashboard': 'Dashboard',
    'users': 'Users',
    'courses': 'Courses',
    'practice': 'Practice Labs',
    'assessments': 'Assessments',
    'results': 'Results',
    'attendance': 'Attendance',
    'schedule': 'Schedule',
    'violations': 'Violations',
    'backups': 'Backups',
    'access-control': 'Access Control',
    'audit-logs': 'Audit Logs',
    'settings': 'Settings',
    'profile': 'Profile',
    'notifications': 'Notifications',
    'help': 'Help',
    'learning': 'Learning',
    'progress': 'Progress',
    'certificates': 'Certificates',
    'new': 'New',
    'edit': 'Edit'
  };

  let currentPath = '';
  for (const part of pathParts) {
    currentPath += `/${part}`;
    const label = pathMap[part] || part;
    items.push({ label, path: currentPath });
  }

  return items;
};

export default Breadcrumb;