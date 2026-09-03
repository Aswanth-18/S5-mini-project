import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Clock, User, BookOpen, FileText, ShieldCheck, Calendar } from 'lucide-react';

/**
 * Recent Activity component for displaying latest user actions
 *
 * @param {object} props - Component props
 * @param {Array} props.activities - Array of activity items
 * @param {string} props.title - Component title
 * @param {boolean} props.showMore - Whether to show "View All" link
 * @param {string} props.moreLink - Link for "View All"
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Recent Activity component
 */
const RecentActivity = ({
  activities = [],
  title = 'Recent Activity',
  showMore = true,
  moreLink = '/audit-logs',
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Format activity time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';

    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 43200) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return activityDate.toLocaleDateString();
  };

  // Get icon for activity type
  const getActivityIcon = (action) => {
    const iconMap = {
      LOGIN: User,
      LOGOUT: User,
      USER_CREATED: User,
      USER_UPDATED: User,
      COURSE_CREATED: BookOpen,
      COURSE_UPDATED: BookOpen,
      ASSESSMENT_CREATED: FileText,
      ASSESSMENT_STARTED: FileText,
      ASSESSMENT_SUBMITTED: FileText,
      VIOLATION_DETECTED: ShieldCheck,
      RESULT_PUBLISHED: FileText,
      default: Clock
    };

    const Icon = iconMap[action] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  // Get action color
  const getActionColor = (action, status) => {
    if (status === 'Failure') return 'danger';
    if (action.includes('CREATED') || action.includes('PUBLISHED')) return 'success';
    if (action.includes('DELETED')) return 'danger';
    if (action.includes('UPDATED')) return 'primary';
    return 'info';
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {showMore && (
          <Link
            to={moreLink}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity, index) => (
            <div
              key={activity.id || index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                isDarkMode
                  ? 'hover:bg-gray-800 transition-colors'
                  : 'hover:bg-gray-50 transition-colors'
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {getActivityIcon(activity.action)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {activity.userName || activity.userId}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                  <Badge
                    variant={getActionColor(activity.action, activity.status)}
                    size="sm"
                  >
                    {activity.action.replace('_', ' ')}
                  </Badge>
                </div>

                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activity.details || activity.target}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </Card>
  );
};

// Default props
RecentActivity.defaultProps = {
  activities: [],
  title: 'Recent Activity',
  showMore: true,
  moreLink: '/audit-logs'
};

export default RecentActivity;