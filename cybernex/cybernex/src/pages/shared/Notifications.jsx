import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Bell, CheckCircle, AlertCircle, Info, X, Calendar, User, BarChart3 } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    if (notifications && user) {
      const userNotifications = notifications.filter(n => n.userId === user.id);
      
      if (activeTab === 'all') {
        setFilteredNotifications(userNotifications);
      } else if (activeTab === 'unread') {
        setFilteredNotifications(userNotifications.filter(n => !n.read));
      } else if (activeTab === 'important') {
        setFilteredNotifications(userNotifications.filter(n => n.priority === 'high'));
      }
    }
  }, [notifications, user, activeTab]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    // Refresh the filtered notifications
    const userNotifications = notifications.filter(n => n.userId === user.id);
    setFilteredNotifications(userNotifications);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(user.id);
    const userNotifications = notifications.filter(n => n.userId === user.id);
    setFilteredNotifications(userNotifications.map(n => ({ ...n, read: true })));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return 'Just now';
  };

  const getUnreadCount = () => {
    if (!user) return 0;
    const userNotifications = notifications.filter(n => n.userId === user.id);
    return userNotifications.filter(n => !n.read).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        {getUnreadCount() > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" startIcon={<CheckCircle size={16} />}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
            activeTab === 'unread' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Unread <Badge className="bg-red-500 text-white">{getUnreadCount()}</Badge>
        </button>
        <button
          onClick={() => setActiveTab('important')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'important' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Important
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {activeTab === 'all' ? 'You have no notifications yet.' : 
                 activeTab === 'unread' ? 'All notifications have been read.' : 
                 'No important notifications at the moment.'}
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map(notification => (
            <Card 
              key={notification.id} 
              className={`${notification.read ? 'opacity-80' : 'border-l-4 border-primary'}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    {notification.priority === 'high' && (
                      <Badge className="bg-red-100 text-red-800 text-xs">Important</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatTimeAgo(notification.createdAt)}
                    </span>
                    {notification.data?.courseName && (
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} /> {notification.data.courseName}
                      </span>
                    )}
                    {notification.data?.userName && (
                      <span className="flex items-center gap-1">
                        <User size={12} /> {notification.data.userName}
                      </span>
                    )}
                  </div>
                </div>
                {!notification.read && (
                  <Button 
                    onClick={() => handleMarkAsRead(notification.id)} 
                    variant="ghost" 
                    size="sm" 
                    className="flex-shrink-0"
                    title="Mark as read"
                  >
                    <CheckCircle size={18} className="text-green-600" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;