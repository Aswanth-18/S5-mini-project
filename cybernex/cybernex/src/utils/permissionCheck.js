/**
 * CyberNex - Permission Check Utilities
 * Pure, framework-free permission logic underlying permissionUtils.js
 * and hooks/usePermissions.js.
 */
import { ROLES, PERMISSIONS } from './constants';
import { ADMIN_DEFAULT_PERMISSIONS, FACULTY_DEFAULT_PERMISSIONS, STUDENT_DEFAULT_PERMISSIONS } from '../permissions/rolePermissions';

const DEFAULT_PERMISSIONS_BY_ROLE = {
  [ROLES.ADMIN]: ADMIN_DEFAULT_PERMISSIONS,
  [ROLES.FACULTY]: FACULTY_DEFAULT_PERMISSIONS,
  [ROLES.STUDENT]: STUDENT_DEFAULT_PERMISSIONS,
};

export const getEffectivePermissions = (user) => {
  if (!user) return [];
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions;
  }
  return DEFAULT_PERMISSIONS_BY_ROLE[user.role] || [];
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;

export const hasPermission = (user, permission) => {
  if (!user || !permission) return false;
  if (isAdmin(user)) return true;
  return getEffectivePermissions(user).includes(permission);
};

export const hasAnyPermission = (user, permissionList = []) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  const effective = getEffectivePermissions(user);
  return permissionList.some((p) => effective.includes(p));
};

export const hasAllPermissions = (user, permissionList = []) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  const effective = getEffectivePermissions(user);
  return permissionList.every((p) => effective.includes(p));
};

export const hasRole = (user, roles) => {
  if (!user) return false;
  const list = Array.isArray(roles) ? roles : [roles];
  return list.includes(user.role);
};

export const canAccessOwnResource = (user, resourceOwnerId, managePermission) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (user.id === resourceOwnerId) return true;
  return hasPermission(user, managePermission);
};

export const canAccess = {
  adminArea: (user) => hasRole(user, ROLES.ADMIN),
  facultyArea: (user) => hasRole(user, [ROLES.ADMIN, ROLES.FACULTY]),
  studentArea: (user) => hasRole(user, [ROLES.ADMIN, ROLES.STUDENT]),
  manageUsers: (user) => hasPermission(user, PERMISSIONS.USERS_EDIT),
  manageCourses: (user) => hasPermission(user, PERMISSIONS.COURSES_EDIT),
  manageAssessments: (user) => hasPermission(user, PERMISSIONS.ASSESSMENT_MANAGE),
  reviewViolations: (user) => hasPermission(user, PERMISSIONS.VIOLATIONS_MANAGE),
  manageBackups: (user) => hasPermission(user, PERMISSIONS.BACKUP_CREATE),
};

export const filterByPermission = (items = [], user) =>
  items.filter((item) => {
    if (item.roles && !hasRole(user, item.roles)) return false;
    if (item.permission && !hasPermission(user, item.permission)) return false;
    if (item.anyPermissions && !hasAnyPermission(user, item.anyPermissions)) return false;
    return true;
  });

export default {
  getEffectivePermissions, isAdmin, hasPermission, hasAnyPermission,
  hasAllPermissions, hasRole, canAccessOwnResource, canAccess, filterByPermission,
};