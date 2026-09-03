import { useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ROLES } from '../utils/constants';
import { hasPermission as checkPermission, getAllPermissionsForUser } from '../permissions/rolePermissions';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for checking permissions in React components.
 * Integrates with AuthContext and DataContext for role-based access control.
 *
 * @returns {object} - Permission checking functions and user role info
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const { permissions: globalPermissions } = useData();
  const [customPermissions] = useLocalStorage('user_permissions', []);

  // Get current user's role
  const role = user?.role || ROLES.STUDENT;

  // Get user's specific permissions (from user object or custom)
  const userPermissions = user?.permissions || customPermissions || [];

  // Get role's default permissions
  const rolePermissions = globalPermissions[role] || [];

  // Combine all permissions
  const allPermissions = useMemo(() => {
    return getAllPermissionsForUser(role, userPermissions);
  }, [role, userPermissions, globalPermissions]);

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check (e.g., 'users.view')
   * @returns {boolean} - True if user has the permission
   */
  const hasPermission = useCallback((permission) => {
    if (!isAuthenticated) return false;
    return checkPermission(role, userPermissions, permission);
  }, [role, userPermissions, isAuthenticated]);

  /**
   * Check if user has all of the required permissions
   * @param {string|string[]} permissions - Permission or array of permissions
   * @returns {boolean} - True if user has all permissions
   */
  const hasAllPermissions = useCallback((permissions) => {
    if (!isAuthenticated) return false;

    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : [permissions];

    return permissionsArray.every(p => hasPermission(p));
  }, [isAuthenticated, hasPermission]);

  /**
   * Check if user has any of the required permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean} - True if user has at least one permission
   */
  const hasAnyPermission = useCallback((permissions) => {
    if (!isAuthenticated) return false;

    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : [permissions];

    return permissionsArray.some(p => hasPermission(p));
  }, [isAuthenticated, hasPermission]);

  /**
   * Get all permissions for the current user
   * @returns {string[]} - Array of all permission strings
   */
  const getPermissions = useCallback(() => {
    if (!isAuthenticated) return [];
    return allPermissions;
  }, [isAuthenticated, allPermissions]);

  /**
   * Check if user is an admin
   * @returns {boolean} - True if user is admin
   */
  const isAdmin = useCallback(() => {
    return role === ROLES.ADMIN;
  }, [role]);

  /**
   * Check if user is faculty
   * @returns {boolean} - True if user is faculty
   */
  const isFaculty = useCallback(() => {
    return role === ROLES.FACULTY;
  }, [role]);

  /**
   * Check if user is student
   * @returns {boolean} - True if user is student
   */
  const isStudent = useCallback(() => {
    return role === ROLES.STUDENT;
  }, [role]);

  /**
   * Check if user has a specific role or roles
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} - True if user has one of the roles
   */
  const hasRole = useCallback((roles) => {
    if (!isAuthenticated) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(role);
  }, [isAuthenticated, role]);

  /**
   * Check if user can access a specific resource
   * @param {string} resource - Resource type (e.g., 'users', 'courses')
   * @param {string} action - Action (e.g., 'view', 'create', 'edit')
   * @returns {boolean} - True if user can perform the action
   */
  const canAccess = useCallback((resource, action) => {
    if (!isAuthenticated) return false;
    return hasPermission(`${resource}.${action}`);
  }, [isAuthenticated, hasPermission]);

  /**
   * Check if user can perform an action on a specific resource
   * @param {string} resource - Resource type
   * @param {string} action - Action
   * @param {object} item - The specific item (for future row-level permissions)
   * @returns {boolean} - True if user can perform the action
   */
  const can = useCallback((resource, action, item = null) => {
    if (!isAuthenticated) return false;

    // Basic permission check
    if (!hasPermission(`${resource}.${action}`)) {
      return false;
    }

    // Future: Add row-level permission checks here
    // For example: if (item.ownerId !== user.id && !hasPermission('admin.override'))
    // But for now, we just use the basic permission check

    return true;
  }, [isAuthenticated, hasPermission]);

  /**
   * Get permissions for a specific resource
   * @param {string} resource - Resource type
   * @returns {string[]} - Array of permissions for the resource
   */
  const getResourcePermissions = useCallback((resource) => {
    if (!isAuthenticated) return [];

    const prefix = `${resource}.`;
    return allPermissions.filter(p => p.startsWith(prefix));
  }, [isAuthenticated, allPermissions]);

  /**
   * Check if user is the owner of an item
   * @param {object} item - The item to check
   * @param {string} idField - Field name for owner ID (default: 'createdBy')
   * @returns {boolean} - True if user is the owner
   */
  const isOwner = useCallback((item, idField = 'createdBy') => {
    if (!isAuthenticated || !user) return false;
    return item?.[idField] === user.id;
  }, [isAuthenticated, user]);

  /**
   * Check if user can edit an item (owner or has edit permission)
   * @param {string} resource - Resource type
   * @param {object} item - The item to check
   * @returns {boolean} - True if user can edit
   */
  const canEdit = useCallback((resource, item) => {
    return can(resource, 'edit', item) || isOwner(item);
  }, [can, isOwner]);

  /**
   * Check if user can delete an item (owner or has delete permission)
   * @param {string} resource - Resource type
   * @param {object} item - The item to check
   * @returns {boolean} - True if user can delete
   */
  const canDelete = useCallback((resource, item) => {
    return can(resource, 'delete', item) || isOwner(item);
  }, [can, isOwner]);

  // Return all permission functions
  return {
    // Basic checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getPermissions,
    isAdmin,
    isFaculty,
    isStudent,
    hasRole,
    role,
    userPermissions,
    allPermissions,

    // Resource-specific checks
    canAccess,
    can,
    getResourcePermissions,

    // Ownership checks
    isOwner,
    canEdit,
    canDelete,

    // State
    isAuthenticated,
    user,
  };
};

export default usePermissions;