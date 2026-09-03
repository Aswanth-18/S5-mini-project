import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Notification from './Notification';

/**
 * Toast Notification Container
 * Manages multiple toast notifications
 *
 * @param {object} props - Component props
 * @param {string} props.position - Position of the toast container (top-right, top-left, etc.)
 * @returns {JSX.Element} - Toast container component
 */
const ToastContainer = ({ position = 'top-right' }) => {
  const { isDarkMode } = useTheme();
  const [toasts, setToasts] = useState([]);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Add a toast
  const addToast = useCallback((toast) => {
    const id = toast.id || `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return createPortal(
    <div
      className={`fixed z-50 ${positionClasses[position]} flex flex-col gap-3 pointer-events-none`}
    >
      {toasts.map(toast => (
        <Notification
          key={toast.id}
          id={toast.id}
          type={toast.type || 'info'}
          title={toast.title}
          message={toast.message}
          duration={toast.duration || 0}
          dismissible={toast.dismissible !== false}
          onDismiss={removeToast}
          position={position}
          icon={toast.icon}
        />
      ))}
    </div>,
    document.body
  );
};

/**
 * Toast Context for managing toasts globally
 */
import { createContext, useContext } from 'react';

const ToastContext = createContext(null);

const ToastProvider = ({ children, position = 'top-right' }) => {
  const [container, setContainer] = useState(null);

  // Add toast to the container
  const addToast = useCallback((toast) => {
    if (!container) return null;

    // Create a new toast with default values
    const newToast = {
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      dismissible: true,
      ...toast
    };

    // Add to container's state
    const id = container.addToast(newToast);
    return id;
  }, [container]);

  // Success toast
  const success = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      title: 'Success',
      message,
      ...options
    });
  }, [addToast]);

  // Error toast
  const error = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      title: 'Error',
      message,
      ...options
    });
  }, [addToast]);

  // Warning toast
  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      title: 'Warning',
      message,
      ...options
    });
  }, [addToast]);

  // Info toast
  const info = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      title: 'Info',
      message,
      ...options
    });
  }, [addToast]);

  // Clear all toasts
  const clear = useCallback(() => {
    if (container) {
      container.clearToasts();
    }
  }, [container]);

  // Value for context
  const value = {
    addToast,
    success,
    error,
    warning,
    info,
    clear
  };

  return (
    <>
      <ToastContext.Provider value={value}>
        {children}
      </ToastContext.Provider>
      <ToastContainer
        ref={setContainer}
        position={position}
      />
    </>
  );
};

/**
 * Hook for using toasts in components
 */
const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export components
export default ToastContainer;
export { ToastProvider, useToast };