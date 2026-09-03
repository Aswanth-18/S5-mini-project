import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ShieldAlert, Home, ArrowLeft, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AccessDenied = () => {
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const getMessage = () => {
    if (!isAuthenticated) {
      return {
        title: 'Access Denied',
        description: 'Please log in to access this page.',
        action: 'Log In',
        actionPath: '/login',
        icon: <LogIn className="w-12 h-12 text-red-500" />
      };
    }

    if (user) {
      return {
        title: 'Unauthorized Access',
        description: `Your account (${user.role}) does not have permission to access this page.`,
        action: 'Go to Dashboard',
        actionPath: user.role === 'admin' ? '/admin/dashboard' :
                   user.role === 'faculty' ? '/faculty/dashboard' :
                   '/student/dashboard',
        icon: <ShieldAlert className="w-12 h-12 text-red-500" />
      };
    }

    return {
      title: 'Access Denied',
      description: 'You do not have permission to access this page.',
      action: 'Go Home',
      actionPath: '/',
      icon: <ShieldAlert className="w-12 h-12 text-red-500" />
    };
  };

  const { title, description, action, actionPath, icon } = getMessage();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Card className="max-w-md w-full text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {description}
        </p>

        <div className="space-y-3">
          <Button
            as={Link}
            to={actionPath}
            variant="primary"
            className="w-full"
          >
            {action}
          </Button>

          <Button
            as={Link}
            to="/"
            variant="outline"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccessDenied;