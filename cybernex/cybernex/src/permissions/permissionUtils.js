/**
 * CyberNex - Permission Utilities
 *
 * Helper functions for working with permissions throughout the app
 */

import { ROLES } from '../utils/constants';
import { ALL_PERMISSIONS, PERMISSION_CATEGORIES } from './permissions';
import {
  ROLE_PERMISSIONS,
  getDefaultPermissionsForRole,
  hasPermission as checkPermission,
  getAllPermissionsForUser,
  hasAllPermissions,
  hasAnyPermission,
  getMissingPermissions
} from './rolePermissions';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ===== HOOK: usePermissions =====
/**
 * Custom hook for checking permissions in React components
 * @returns {object} - Permission checking functions
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const [customPermissions] = useLocalStorage('user_permissions', []);

  const role = user?.role || ROLES.STUDENT;
  const userPermissions = user?.permissions || customPermissions;

  /**
   * Check if current user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} - True if user has permission
   */
  const hasPermission = (permission) => {
    if (!user) return false;
    return checkPermission(role, userPermissions, permission);
  };

  /**
   * Check if current user has all required permissions
   * @param {string|string[]} permissions - Permission or array of permissions
   * @returns {boolean} - True if user has all permissions
   */
  const hasAll = (permissions) => {
    if (!user) return false;
    return hasAllPermissions(role, userPermissions, permissions);
  };

  /**
   * Check if current user has any of the required permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean} - True if user has any permission
   */
  const hasAny = (permissions) => {
    if (!user) return false;
    return hasAnyPermission(role, userPermissions, permissions);
  };

  /**
   * Get all permissions for current user
   * @returns {string[]} - Array of all permissions
   */
  const getPermissions = () => {
    if (!user) return [];
    return getAllPermissionsForUser(role, userPermissions);
  };

  /**
   * Check if current user is admin
   * @returns {boolean} - True if user is admin
   */
  const isAdmin = () => {
    return role === ROLES.ADMIN;
  };

  /**
   * Check if current user is faculty
   * @returns {boolean} - True if user is faculty
   */
  const isFaculty = () => {
    return role === ROLES.FACULTY;
  };

  /**
   * Check if current user is student
   * @returns {boolean} - True if user is student
   */
  const isStudent = () => {
    return role === ROLES.STUDENT;
  };

  /**
   * Check if current user has a specific role
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} - True if user has the role
   */
  const hasRole = (roles) => {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(role);
  };

  return {
    hasPermission,
    hasAll,
    hasAny,
    getPermissions,
    isAdmin,
    isFaculty,
    isStudent,
    hasRole,
    role,
    userPermissions,
  };
};

// ===== HIGHER-ORDER COMPONENT: withPermission =====
/**
 * Higher-order component that checks permissions before rendering
 * @param {string|string[]} requiredPermissions - Required permission(s)
 * @param {React.Component} FallbackComponent - Component to show if no permission
 * @returns {function} - HOC function
 */
export const withPermission = (requiredPermissions, FallbackComponent = null) => {
  return (WrappedComponent) => {
    return (props) => {
      const { hasAll } = usePermissions();

      if (!hasAll(requiredPermissions)) {
        return FallbackComponent ? <FallbackComponent {...props} /> : null;
      }

      return <WrappedComponent {...props} />;
    };
  };
};

// ===== COMPONENT: ProtectedRoute =====
/**
 * Protected route component for React Router
 * @param {object} props - Component props
 * @param {string|string[]} props.permissions - Required permission(s)
 * @param {string} props.role - Required role
 * @param {React.Component} props.fallback - Fallback component
 * @param {React.Component} props.children - Child component
 * @returns {React.Component} - Protected route
 */
export const ProtectedRoute = ({
  permissions = null,
  role = null,
  fallback = null,
  children
}) => {
  const { hasAll, hasRole } = usePermissions();

  // Check role first
  if (role && !hasRole(role)) {
    return fallback || null;
  }

  // Check permissions
  if (permissions && !hasAll(permissions)) {
    return fallback || null;
  }

  return children;
};

// ===== UTILITY FUNCTIONS =====

/**
 * Filter an array of items based on permissions
 * @param {Array} items - Array of items to filter
 * @param {string} permissionProperty - Property name containing permission
 * @param {string} role - User role
 * @param {string[]} userPermissions - User's permissions
 * @returns {Array} - Filtered array
 */
export const filterByPermission = (items, permissionProperty, role, userPermissions) => {
  return items.filter(item => {
    const requiredPermission = item[permissionProperty];
    if (!requiredPermission) return true;
    return checkPermission(role, userPermissions, requiredPermission);
  });
};

/**
 * Get permission matrix for access control UI
 * @returns {Array} - Array of permission categories with roles
 */
export const getPermissionMatrix = () => {
  return PERMISSION_CATEGORIES.map(category => ({
    ...category,
    [ROLES.ADMIN]: true, // Admins have all permissions
    [ROLES.FACULTY]: category.permissions.every(perm =>
      FACULTY_DEFAULT_PERMISSIONS.includes(perm)
    ),
    [ROLES.STUDENT]: category.permissions.every(perm =>
      STUDENT_DEFAULT_PERMISSIONS.includes(perm)
    ),
  }));
};

/**
 * Update permission matrix (for admin UI)
 * @param {Array} matrix - Current permission matrix
 * @param {string} categoryId - Category ID
 * @param {string} role - Role to update
 * @param {boolean} value - New permission value
 * @returns {Array} - Updated matrix
 */
export const updatePermissionMatrix = (matrix, categoryId, role, value) => {
  return matrix.map(category => {
    if (category.id !== categoryId) return category;

    const updated = { ...category };
    updated[role] = value;
    return updated;
  });
};

/**
 * Get permissions from matrix that should be granted to a role
 * @param {Array} matrix - Permission matrix
 * @param {string} role - Role to get permissions for
 * @returns {string[]} - Array of permissions
 */
export const getPermissionsFromMatrix = (matrix, role) => {
  return matrix.flatMap(category =>
    category[role] ? category.permissions : []
  );
};

// ===== EXPORT =====
export default {
  usePermissions,
  withPermission,
  ProtectedRoute,
  filterByPermission,
  getPermissionMatrix,
  updatePermissionMatrix,
  getPermissionsFromMatrix,
};