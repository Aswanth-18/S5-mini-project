import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ROLES } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermissions';
import {
  Menu, Bell, Search, Sun, Moon, ChevronDown,
  User, Settings, LogOut, HelpCircle, Home
} from 'lucide-react';
import SearchBar from './SearchBar';
import Notification from './Notification';
import RoleBadge from './RoleBadge';

/**
 * Top Navigation Bar component
 *
 * @param {object} props - Component props
 * @param {function} props.onMenuClick - Function to toggle mobile menu
 * @param {boolean} props.isSidebarCollapsed - Whether sidebar is collapsed
 * @returns {JSX.Element} - TopNav component
 */
const TopNav = ({ onMenuClick, isSidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotifications();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const unreadCount = getUnreadCount(user?.id);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [navigate]);

  // Get breadcrumb items
  const getBreadcrumbItems = useCallback(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
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
      'certificates': 'Certificates'
    };

    let currentPath = '';
    for (const part of pathParts) {
      currentPath += `/${part}`;
      const label = pathMap[part] || part;
      items.push({ label, path: currentPath });
    }

    return items;
  }, [location.pathname]);

  // Render breadcrumb
  const renderBreadcrumb = useCallback(() => {
    const items = getBreadcrumbItems();
    return (
      <nav className="hidden md:flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link
              to={item.path}
              className={`transition-colors ${
                index === items.length - 1
                  ? 'text-gray-500 dark:text-gray-400 cursor-default'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <span className="text-gray-400 dark:text-gray-500">/</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }, [getBreadcrumbItems]);

  // Render profile dropdown
  const renderProfileDropdown = useCallback(() => {
    if (!user) return null;

    const menuItems = [
      {
        id: 'profile',
        label: 'My Profile',
        icon: User,
        path: '/profile',
        permissions: []
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
        label: 'Help Center',
        icon: HelpCircle,
        path: '/help',
        permissions: []
      },
      {
        id: 'divider',
        type: 'divider'
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: LogOut,
        onClick: logout,
        permissions: []
      }
    ];

    return (
      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={() => setShowProfileMenu(prev => !prev)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={showProfileMenu}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="hidden md:block text-left">
            <div className="font-medium text-sm text-gray-900 dark:text-white">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <RoleBadge role={user.role} size="xs" />
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 hidden md:block transition-transform ${
            showProfileMenu ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown menu */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in">
            {menuItems.map((item, index) => {
              if (item.type === 'divider') {
                return <div key={`divider-${index}`} className="border-t border-gray-200 dark:border-gray-700 my-1" />;
              }

              const Icon = item.icon;
              const isAllowed = !item.permissions || item.permissions.some(p => hasPermission(p));

              if (!isAllowed) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }, [user, hasPermission, logout, navigate, showProfileMenu]);

  // Render notifications dropdown
  const renderNotificationsDropdown = useCallback(() => {
    if (!user) return null;

    const userNotifications = notifications.filter(n => n.userId === user.id);

    return (
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={() => {
            setShowNotifications(prev => !prev);
            if (unreadCount > 0) {
              markAllAsRead(user.id);
            }
          }}
          className="relative p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={showNotifications}
          aria-haspopup="true"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown menu */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
            <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Notifications
            </div>

            <div className="max-h-80 overflow-y-auto">
              {userNotifications.length > 0 ? (
                userNotifications.map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id, user.id);
                      }
                      if (notification.data?.action) {
                        navigate(notification.data.action);
                      }
                      setShowNotifications(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                        !notification.isRead ? 'bg-blue-500' : 'bg-transparent'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  No new notifications
                </div>
              )}
            </div>

            <div className="px-4 py-2 text-center border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/notifications"
                onClick={() => setShowNotifications(false)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }, [user, notifications, unreadCount, markAsRead, markAllAsRead, navigate, showNotifications]);

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 h-16 bg-white dark:bg-gray-900
        border-b border-gray-200 dark:border-gray-700 transition-all duration-300
        ${isSidebarCollapsed ? 'left-16' : 'left-64'} w-[calc(100%-4rem)]
      `}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Breadcrumb */}
          {renderBreadcrumb()}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search - Desktop only */}
          <div className="hidden lg:block w-64">
            <SearchBar
              placeholder="Search courses, labs, assessments..."
              onSearch={handleSearch}
              debounce={300}
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          {renderNotificationsDropdown()}

          {/* Profile */}
          {renderProfileDropdown()}

          {/* Mobile search button */}
          <button
            onClick={() => navigate('/search')}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;