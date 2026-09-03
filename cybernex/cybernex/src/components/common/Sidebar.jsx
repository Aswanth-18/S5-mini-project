import React, { useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ROLES } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermissions';
import { ChevronLeft, ChevronRight, Home, LayoutDashboard, BookOpen, FlaskConical, FileText, BarChart3, Users, Settings, HelpCircle, Bell, Calendar, ShieldCheck, Lock, Database, File, ClipboardList, Award, LogOut } from 'lucide-react';

/**
 * Main Sidebar component for navigation
 *
 * @param {object} props - Component props
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {function} props.onToggleCollapse - Function to toggle collapse state
 * @returns {JSX.Element} - Sidebar component
 */
const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Navigation items for each role
  const getNavItems = useCallback(() => {
    if (!user) return [];

    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: user.role === ROLES.ADMIN ? '/admin/dashboard' :
              user.role === ROLES.FACULTY ? '/faculty/dashboard' :
              '/student/dashboard',
        permissions: ['dashboard.view']
      }
    ];

    // Common items for all authenticated users
    const commonItems = [
      {
        id: 'learning',
        label: 'Learning',
        icon: BookOpen,
        path: '/student/learning',
        permissions: ['courses.view'],
        role: ROLES.STUDENT
      },
      {
        id: 'practice',
        label: 'Practice Labs',
        icon: FlaskConical,
        path: '/student/practice',
        permissions: ['practice.view'],
        role: ROLES.STUDENT
      },
      {
        id: 'assessments',
        label: 'Assessments',
        icon: FileText,
        path: user.role === ROLES.ADMIN ? '/admin/assessments' :
              user.role === ROLES.FACULTY ? '/faculty/assessments' :
              '/student/assessments',
        permissions: ['assessment.view']
      },
      {
        id: 'results',
        label: 'Results',
        icon: BarChart3,
        path: user.role === ROLES.ADMIN ? '/admin/results' :
              user.role === ROLES.FACULTY ? '/faculty/results' :
              '/student/results',
        permissions: ['results.view']
      },
      {
        id: 'schedule',
        label: 'Schedule',
        icon: Calendar,
        path: user.role === ROLES.ADMIN ? '/admin/schedule' :
              user.role === ROLES.FACULTY ? '/faculty/schedule' :
              '/student/schedule',
        permissions: ['schedule.view']
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        path: '/notifications',
        permissions: ['notifications.view']
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: Users,
        path: '/profile',
        permissions: ['users.view']
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/settings',
        permissions: ['system.view_settings']
      },
      {
        id: 'help',
        label: 'Help',
        icon: HelpCircle,
        path: '/help',
        permissions: []
      }
    ];

    // Admin-specific items
    const adminItems = [
      {
        id: 'admin-users',
        label: 'Users',
        icon: Users,
        path: '/admin/users',
        permissions: ['users.view']
      },
      {
        id: 'admin-courses',
        label: 'Courses',
        icon: BookOpen,
        path: '/admin/courses',
        permissions: ['courses.view']
      },
      {
        id: 'admin-faculty',
        label: 'Faculty',
        icon: ShieldCheck,
        path: '/admin/faculty',
        permissions: ['faculty.view']
      },
      {
        id: 'admin-attendance',
        label: 'Attendance',
        icon: ClipboardList,
        path: '/admin/attendance',
        permissions: ['attendance.view']
      },
      {
        id: 'admin-restrictions',
        label: 'Restrictions',
        icon: Lock,
        path: '/admin/restrictions',
        permissions: ['restrictions.view']
      },
      {
        id: 'admin-violations',
        label: 'Violations',
        icon: ShieldCheck,
        path: '/admin/violations',
        permissions: ['violations.view']
      },
      {
        id: 'admin-backups',
        label: 'Backups',
        icon: Database,
        path: '/admin/backups',
        permissions: ['backup.view']
      },
      {
        id: 'admin-access-control',
        label: 'Access Control',
        icon: Lock,
        path: '/admin/access-control',
        permissions: ['access_control.manage']
      },
      {
        id: 'admin-audit-logs',
        label: 'Audit Logs',
        icon: File,
        path: '/admin/audit-logs',
        permissions: ['system.view_settings']
      }
    ];

    // Faculty-specific items
    const facultyItems = [
      {
        id: 'faculty-students',
        label: 'Students',
        icon: Users,
        path: '/faculty/students',
        permissions: ['users.view']
      },
      {
        id: 'faculty-courses',
        label: 'Courses',
        icon: BookOpen,
        path: '/faculty/courses',
        permissions: ['courses.view']
      }
    ];

    // Student-specific items
    const studentItems = [
      {
        id: 'student-progress',
        label: 'My Progress',
        icon: BarChart3,
        path: '/student/progress',
        permissions: ['courses.view']
      },
      {
        id: 'student-attendance',
        label: 'Attendance',
        icon: ClipboardList,
        path: '/student/attendance',
        permissions: ['attendance.view']
      },
      {
        id: 'student-certificates',
        label: 'Certificates',
        icon: Award,
        path: '/student/certificates',
        permissions: ['results.view']
      }
    ];

    // Filter items by role and permissions
    const filterItems = (items) => {
      return items.filter(item => {
        // Check role if specified
        if (item.role && item.role !== user.role) return false;
        // Check permissions if specified
        if (item.permissions && item.permissions.length > 0) {
          return item.permissions.some(p => hasPermission(p));
        }
        return true;
      });
    };

    const allItems = [...baseItems, ...filterItems(commonItems)];

    if (user.role === ROLES.ADMIN) {
      allItems.push(...filterItems(adminItems));
    } else if (user.role === ROLES.FACULTY) {
      allItems.push(...filterItems(facultyItems));
    } else if (user.role === ROLES.STUDENT) {
      allItems.push(...filterItems(studentItems));
    }

    return allItems;
  }, [user, hasPermission]);

  // Toggle submenu
  const toggleSubmenu = useCallback((id) => {
    setActiveSubmenu(prev => prev === id ? null : id);
  }, []);

  // Check if nav item is active
  const isNavItemActive = useCallback((path) => {
    if (path === location.pathname) return true;

    // Check if current path starts with the nav item path
    if (location.pathname.startsWith(path)) {
      // For paths with parameters (e.g., /student/learning/:courseId)
      const pathParts = path.split('/').filter(Boolean);
      const locationParts = location.pathname.split('/').filter(Boolean);

      // Check if the first parts match
      return pathParts.every((part, index) =>
        index < locationParts.length &&
        (part.startsWith(':') || part === locationParts[index])
      );
    }

    return false;
  }, [location.pathname]);

  // Render nav item
  const renderNavItem = useCallback((item) => {
    const Icon = item.icon;
    const isActive = isNavItemActive(item.path);

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive: linkActive }) => `
          sidebar-link ${linkActive || isActive ? 'sidebar-link-active' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
        `}
        onClick={() => toggleSubmenu(null)}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.label}</span>}
      </NavLink>
    );
  }, [isCollapsed, isNavItemActive, toggleSubmenu, isDarkMode]);

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">CyberNex</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-4rem)] p-4 overflow-y-auto">
        <div className="space-y-1">
          {getNavItems().map(item => renderNavItem(item))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={logout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;