import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ===== CREATE CONTEXT =====
const NotificationContext = createContext(null);

// ===== NOTIFICATION COMPONENT =====
const NotificationItem = ({ notification, onDismiss, position = 'top-right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!notification.duration && notification.duration !== 0) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  // Position classes
  const getPositionClasses = () => {
    const base = 'fixed z-50 p-4 rounded-lg shadow-lg max-w-sm w-full';
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    return `${base} ${positions[position] || positions['top-right']}`;
  };

  // Type classes
  const getTypeClasses = () => {
    const types = {
      success: 'bg-emerald-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-gray-900',
      info: 'bg-blue-500 text-white',
      default: 'bg-gray-800 text-white',
    };

    return types[notification.type] || types.default;
  };

  return (
    <div
      className={`${getPositionClasses()} ${isVisible ? 'animate-fade-in' : 'opacity-0'} ${isExiting ? 'animate-fade-out' : ''}`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className={`flex items-start gap-3 ${getTypeClasses()} p-4 rounded-lg`}>
        {notification.icon && (
          <div className="flex-shrink-0">
            {notification.icon}
          </div>
        )}
        <div className="flex-1">
          {notification.title && (
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
          )}
          <p className="text-sm">{notification.message}</p>
        </div>
        {notification.dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// ===== PROVIDER COMPONENT =====
export const NotificationProvider = ({ children, position = 'top-right' }) => {
  const [notifications, setNotifications] = useState([]);
  const [storedNotifications] = useLocalStorage('notifications', []);

  // Initialize with stored notifications
  useEffect(() => {
    if (storedNotifications.length > 0) {
      setNotifications(storedNotifications.map(n => ({
        ...n,
        id: n.id || uuidv4()
      })));
    }
  }, [storedNotifications]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = uuidv4();
    const newNotification = {
      id,
      type: 'info',
      message: '',
      title: '',
      duration: 5000,
      dismissible: true,
      position,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Store in localStorage if persistent
    if (notification.persistent) {
      const stored = getItem('notifications', []);
      setItem('notifications', [...stored, newNotification]);
    }

    return id;
  }, [position]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    // Remove from localStorage if it exists there
    const stored = getItem('notifications', []);
    setItem('notifications', stored.filter(n => n.id !== id));
  }, []);

  // Remove all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setItem('notifications', []);
  }, []);

  // Update notification
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    );

    // Update in localStorage
    const stored = getItem('notifications', []);
    const updated = stored.map(n => n.id === id ? { ...n, ...updates } : n);
    setItem('notifications', updated);
  }, []);

  // Success notification
  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      title: 'Success',
      ...options
    });
  }, [addNotification]);

  // Error notification
  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      title: 'Error',
      ...options
    });
  }, [addNotification]);

  // Warning notification
  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      title: 'Warning',
      ...options
    });
  }, [addNotification]);

  // Info notification
  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      title: 'Info',
      ...options
    });
  }, [addNotification]);

  // Value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    updateNotification,
    success,
    error,
    warning,
    info,
  };

  return (
    <>
      {children}
      {/* Render notifications container */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
            position={notification.position || position}
          />
        ))}
      </div>
    </>
  );
};

// ===== CUSTOM HOOK =====
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// ===== EXPORT =====
export default NotificationContext;
export { NotificationProvider, useNotifications };