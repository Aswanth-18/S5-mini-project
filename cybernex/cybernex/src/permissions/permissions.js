/**
 * CyberNex - Permission System
 *
 * This file defines all permissions used throughout the application.
 * Each permission follows the pattern: "resource.action"
 *
 * Example:
 * - users.view: View users
 * - users.create: Create users
 * - assessment.start: Start an assessment
 */

// ===== USER MANAGEMENT PERMISSIONS =====
export const USER_PERMISSIONS = {
  VIEW: 'users.view',
  CREATE: 'users.create',
  EDIT: 'users.edit',
  DELETE: 'users.delete',
  DEACTIVATE: 'users.deactivate',
  REACTIVATE: 'users.reactivate',
  RESET_PASSWORD: 'users.reset_password',
  CHANGE_ROLE: 'users.change_role',
  ASSIGN_COURSES: 'users.assign_courses',
  ASSIGN_LEVEL: 'users.assign_level',
  MANAGE_RESTRICTIONS: 'users.manage_restrictions',
};

// ===== COURSE MANAGEMENT PERMISSIONS =====
export const COURSE_PERMISSIONS = {
  VIEW: 'courses.view',
  CREATE: 'courses.create',
  EDIT: 'courses.edit',
  DELETE: 'courses.delete',
  PUBLISH: 'courses.publish',
  UNPUBLISH: 'courses.unpublish',
  ASSIGN_FACULTY: 'courses.assign_faculty',
  ASSIGN_STUDENTS: 'courses.assign_students',
  SET_PREREQUISITES: 'courses.set_prerequisites',
  SET_DIFFICULTY: 'courses.set_difficulty',
  SET_LEVEL: 'courses.set_level',
};

// ===== LESSON PERMISSIONS =====
export const LESSON_PERMISSIONS = {
  VIEW: 'lessons.view',
  CREATE: 'lessons.create',
  EDIT: 'lessons.edit',
  DELETE: 'lessons.delete',
  MARK_COMPLETE: 'lessons.mark_complete',
};

// ===== PRACTICE LAB PERMISSIONS =====
export const PRACTICE_PERMISSIONS = {
  VIEW: 'practice.view',
  START: 'practice.start',
  MANAGE: 'practice.manage',
  CREATE: 'practice.create',
  EDIT: 'practice.edit',
  DELETE: 'practice.delete',
  VALIDATE_FLAGS: 'practice.validate_flags',
  TRACK_PROGRESS: 'practice.track_progress',
};

// ===== ASSESSMENT PERMISSIONS =====
export const ASSESSMENT_PERMISSIONS = {
  VIEW: 'assessment.view',
  CREATE: 'assessment.create',
  EDIT: 'assessment.edit',
  DELETE: 'assessment.delete',
  MANAGE: 'assessment.manage',
  START: 'assessment.start',
  SUBMIT: 'assessment.submit',
  REVIEW: 'assessment.review',
  GRADE: 'assessment.grade',
  PUBLISH: 'assessment.publish',
  UNLOCK: 'assessment.unlock',
  LOCK: 'assessment.lock',
  RESET_ATTEMPTS: 'assessment.reset_attempts',
  SET_DURATION: 'assessment.set_duration',
  SET_PASSING_SCORE: 'assessment.set_passing_score',
  SET_DIFFICULTY: 'assessment.set_difficulty',
  SET_LEVEL: 'assessment.set_level',
  SCHEDULE: 'assessment.schedule',
  ASSIGN_STUDENTS: 'assessment.assign_students',
};

// ===== RESULT PERMISSIONS =====
export const RESULT_PERMISSIONS = {
  VIEW: 'results.view',
  VIEW_ALL: 'results.view_all',
  MANAGE: 'results.manage',
  PUBLISH: 'results.publish',
  EXPORT: 'results.export',
  ANALYZE: 'results.analyze',
};

// ===== ATTENDANCE PERMISSIONS =====
export const ATTENDANCE_PERMISSIONS = {
  VIEW: 'attendance.view',
  VIEW_ALL: 'attendance.view_all',
  MANAGE: 'attendance.manage',
  MARK_PRESENT: 'attendance.mark_present',
  MARK_ABSENT: 'attendance.mark_absent',
  MARK_LATE: 'attendance.mark_late',
  MARK_EXCUSED: 'attendance.mark_excused',
  EXPORT: 'attendance.export',
};

// ===== SCHEDULE PERMISSIONS =====
export const SCHEDULE_PERMISSIONS = {
  VIEW: 'schedule.view',
  VIEW_ALL: 'schedule.view_all',
  MANAGE: 'schedule.manage',
  CREATE: 'schedule.create',
  EDIT: 'schedule.edit',
  DELETE: 'schedule.delete',
  ASSIGN_STUDENTS: 'schedule.assign_students',
  ASSIGN_FACULTY: 'schedule.assign_faculty',
};

// ===== FACULTY PERMISSIONS =====
export const FACULTY_PERMISSIONS = {
  VIEW: 'faculty.view',
  VIEW_ALL: 'faculty.view_all',
  MANAGE: 'faculty.manage',
  CREATE: 'faculty.create',
  EDIT: 'faculty.edit',
  DEACTIVATE: 'faculty.deactivate',
  ASSIGN_PERMISSIONS: 'faculty.assign_permissions',
  ASSIGN_COURSES: 'faculty.assign_courses',
  ASSIGN_GROUPS: 'faculty.assign_groups',
};

// ===== ASSET MANAGEMENT PERMISSIONS =====
export const ASSET_PERMISSIONS = {
  VIEW: 'assets.view',
  MANAGE: 'assets.manage',
  UPLOAD: 'assets.upload',
  EDIT: 'assets.edit',
  DELETE: 'assets.delete',
  TAG: 'assets.tag',
  ASSIGN: 'assets.assign',
  PUBLISH: 'assets.publish',
};

// ===== RESTRICTION PERMISSIONS =====
export const RESTRICTION_PERMISSIONS = {
  VIEW: 'restrictions.view',
  VIEW_ALL: 'restrictions.view_all',
  MANAGE: 'restrictions.manage',
  CREATE: 'restrictions.create',
  EDIT: 'restrictions.edit',
  DELETE: 'restrictions.delete',
  LIFT: 'restrictions.lift',
};

// ===== VIOLATION PERMISSIONS =====
export const VIOLATION_PERMISSIONS = {
  VIEW: 'violations.view',
  VIEW_ALL: 'violations.view_all',
  MANAGE: 'violations.manage',
  REVIEW: 'violations.review',
  DISMISS: 'violations.dismiss',
  ESCALATE: 'violations.escalate',
  ADD_NOTE: 'violations.add_note',
};

// ===== BACKUP PERMISSIONS =====
export const BACKUP_PERMISSIONS = {
  CREATE: 'backup.create',
  VIEW: 'backup.view',
  VIEW_ALL: 'backup.view_all',
  DOWNLOAD: 'backup.download',
  RESTORE: 'backup.restore',
  DELETE: 'backup.delete',
  MANAGE: 'backup.manage',
};

// ===== ACCESS CONTROL PERMISSIONS =====
export const ACCESS_CONTROL_PERMISSIONS = {
  MANAGE: 'access_control.manage',
  CONFIGURE: 'access_control.configure',
  VIEW_MATRIX: 'access_control.view_matrix',
};

// ===== SYSTEM PERMISSIONS =====
export const SYSTEM_PERMISSIONS = {
  MANAGE: 'system.manage',
  CONFIGURE: 'system.configure',
  VIEW_SETTINGS: 'system.view_settings',
  UPDATE_SETTINGS: 'system.update_settings',
};

// ===== ALL PERMISSIONS (Combined) =====
export const ALL_PERMISSIONS = {
  ...USER_PERMISSIONS,
  ...COURSE_PERMISSIONS,
  ...LESSON_PERMISSIONS,
  ...PRACTICE_PERMISSIONS,
  ...ASSESSMENT_PERMISSIONS,
  ...RESULT_PERMISSIONS,
  ...ATTENDANCE_PERMISSIONS,
  ...SCHEDULE_PERMISSIONS,
  ...FACULTY_PERMISSIONS,
  ...ASSET_PERMISSIONS,
  ...RESTRICTION_PERMISSIONS,
  ...VIOLATION_PERMISSIONS,
  ...BACKUP_PERMISSIONS,
  ...ACCESS_CONTROL_PERMISSIONS,
  ...SYSTEM_PERMISSIONS,
};

// ===== PERMISSION CATEGORIES =====
export const PERMISSION_CATEGORIES = [
  {
    id: 'users',
    name: 'User Management',
    description: 'Permissions related to user accounts',
    permissions: Object.values(USER_PERMISSIONS),
  },
  {
    id: 'courses',
    name: 'Course Management',
    description: 'Permissions related to courses and lessons',
    permissions: [...Object.values(COURSE_PERMISSIONS), ...Object.values(LESSON_PERMISSIONS)],
  },
  {
    id: 'practice',
    name: 'Practice Labs',
    description: 'Permissions related to practice laboratories',
    permissions: Object.values(PRACTICE_PERMISSIONS),
  },
  {
    id: 'assessment',
    name: 'Assessments',
    description: 'Permissions related to assessments and results',
    permissions: [...Object.values(ASSESSMENT_PERMISSIONS), ...Object.values(RESULT_PERMISSIONS)],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    description: 'Permissions related to attendance tracking',
    permissions: Object.values(ATTENDANCE_PERMISSIONS),
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Permissions related to scheduling',
    permissions: Object.values(SCHEDULE_PERMISSIONS),
  },
  {
    id: 'faculty',
    name: 'Faculty Management',
    description: 'Permissions related to faculty accounts',
    permissions: Object.values(FACULTY_PERMISSIONS),
  },
  {
    id: 'assets',
    name: 'Asset Management',
    description: 'Permissions related to assets and resources',
    permissions: Object.values(ASSET_PERMISSIONS),
  },
  {
    id: 'restrictions',
    name: 'Restrictions',
    description: 'Permissions related to user restrictions',
    permissions: Object.values(RESTRICTION_PERMISSIONS),
  },
  {
    id: 'violations',
    name: 'Violations',
    description: 'Permissions related to security violations',
    permissions: Object.values(VIOLATION_PERMISSIONS),
  },
  {
    id: 'backup',
    name: 'Backup',
    description: 'Permissions related to system backups',
    permissions: Object.values(BACKUP_PERMISSIONS),
  },
  {
    id: 'access_control',
    name: 'Access Control',
    description: 'Permissions related to access control settings',
    permissions: Object.values(ACCESS_CONTROL_PERMISSIONS),
  },
  {
    id: 'system',
    name: 'System',
    description: 'System-level permissions',
    permissions: Object.values(SYSTEM_PERMISSIONS),
  },
];

// ===== PERMISSION UTILITIES =====
/**
 * Check if a permission exists
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if permission exists
 */
export const hasPermission = (permission) => {
  return Object.values(ALL_PERMISSIONS).includes(permission);
};

/**
 * Get all permissions as an array
 * @returns {string[]} - Array of all permission strings
 */
export const getAllPermissions = () => {
  return Object.values(ALL_PERMISSIONS);
};

/**
 * Get permissions by category
 * @param {string} categoryId - Category ID
 * @returns {string[]} - Array of permissions in the category
 */
export const getPermissionsByCategory = (categoryId) => {
  const category = PERMISSION_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.permissions : [];
};

/**
 * Get category by permission
 * @param {string} permission - Permission string
 * @returns {object|null} - Category object or null
 */
export const getCategoryByPermission = (permission) => {
  return PERMISSION_CATEGORIES.find(category =>
    category.permissions.includes(permission)
  );
};

export default {
  USER_PERMISSIONS,
  COURSE_PERMISSIONS,
  LESSON_PERMISSIONS,
  PRACTICE_PERMISSIONS,
  ASSESSMENT_PERMISSIONS,
  RESULT_PERMISSIONS,
  ATTENDANCE_PERMISSIONS,
  SCHEDULE_PERMISSIONS,
  FACULTY_PERMISSIONS,
  ASSET_PERMISSIONS,
  RESTRICTION_PERMISSIONS,
  VIOLATION_PERMISSIONS,
  BACKUP_PERMISSIONS,
  ACCESS_CONTROL_PERMISSIONS,
  SYSTEM_PERMISSIONS,
  ALL_PERMISSIONS,
  PERMISSION_CATEGORIES,
  hasPermission,
  getAllPermissions,
  getPermissionsByCategory,
  getCategoryByPermission,
};