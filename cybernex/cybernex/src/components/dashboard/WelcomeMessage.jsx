import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../common/Avatar';
import RoleBadge from '../common/RoleBadge';
import Button from '../common/Button';
import { Clock, Calendar, ArrowRight, LayoutDashboard, User } from 'lucide-react';

/**
 * Welcome Message component for personalized greetings
 *
 * @param {object} props - Component props
 * @param {string} props.title - Custom title
 * @param {string} props.message - Custom message
 * @param {Array} props.actions - Array of action buttons
 * @param {boolean} props.showTime - Whether to show current time
 * @param {boolean} props.showLastLogin - Whether to show last login time
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Welcome Message component
 */
const WelcomeMessage = ({
  title,
  message,
  actions = [],
  showTime = true,
  showLastLogin = true,
  className = ''
}) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Get personalized greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Default actions based on user role
  const getDefaultActions = () => {
    if (!user) return [];

    return [
      {
        label: 'Go to Dashboard',
        path: user.role === 'admin' ? '/admin/dashboard' :
              user.role === 'faculty' ? '/faculty/dashboard' :
              '/student/dashboard',
        icon: LayoutDashboard
      },
      {
        label: 'My Profile',
        path: '/profile',
        icon: User
      }
    ];
  };

  const displayActions = actions.length > 0 ? actions : getDefaultActions();
  const greeting = title || `${getTimeBasedGreeting()}, ${user?.name || 'User'}!`;
  const welcomeMessage = message || (
    user?.role === 'admin' ? 'Manage your cybersecurity platform and monitor system activity.' :
    user?.role === 'faculty' ? 'Monitor your students, courses, and track progress.' :
    'Continue your cybersecurity learning journey with new challenges.'
  );

  // Format last login
  const formatLastLogin = () => {
    if (!user?.lastActive) return null;
    const lastLogin = new Date(user.lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now - lastLogin) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Last active just now';
    if (diffInHours < 24) return `Last active ${diffInHours}h ago`;
    if (diffInHours < 48) return `Last active yesterday at ${lastLogin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return `Last active on ${lastLogin.toLocaleDateString()}`;
  };

  // Get current time
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`welcome-message ${className}`}>
      <div className={`rounded-xl p-6 mb-6 ${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg'
      }`}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="xl"
              status="online"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-white'
                } mb-1`}>
                  {greeting}
                </h1>
                <p className={isDarkMode ? 'text-gray-300' : 'text-cyan-100'}>
                  {welcomeMessage}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <RoleBadge role={user?.role} />
                {user?.department && (
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-cyan-100'
                  }`}>
                    {user.department}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm mt-2">
              {showTime && (
                <div className="flex items-center gap-1 text-cyan-100">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime}</span>
                </div>
              )}
              {showLastLogin && user?.lastActive && (
                <div className="flex items-center gap-1 text-cyan-100">
                  <Calendar className="w-4 h-4" />
                  <span>{formatLastLogin()}</span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              {displayActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    } transition-colors`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="font-medium">{action.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 text-sm">
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <Calendar className={`w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-blue-600'
          }`} />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {currentDate}
          </span>
        </div>
      </div>
    </div>
  );
};

// Default props
WelcomeMessage.defaultProps = {
  title: null,
  message: null,
  actions: [],
  showTime: true,
  showLastLogin: true
};

export default WelcomeMessage;