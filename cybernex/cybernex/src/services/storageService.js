/**
 * CyberNex - Storage Service
 *
 * Centralized service for managing all localStorage operations.
 * Provides:
 * - Consistent storage/retrieval of application data
 * - Data validation and default values
 * - Backup and restore functionality
 * - Automatic initialization of mock data
 */

import {
  APP_VERSION,
  DEMO_CREDENTIALS,
  SAMPLE_USERS,
  SAMPLE_FACULTY,
  SAMPLE_STUDENT_GROUPS,
  SAMPLE_COURSES,
  SAMPLE_LABS,
  SAMPLE_ASSESSMENTS,
  SAMPLE_RESULTS,
  SAMPLE_ATTENDANCE,
  SAMPLE_SCHEDULES,
  SAMPLE_VIOLATIONS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_AUDIT_LOGS,
  SAMPLE_BACKUPS,
  SAMPLE_RESTRICTIONS,
  ROLES,
  PERMISSIONS
} from '../utils/constants';
import { ADMIN_DEFAULT_PERMISSIONS, FACULTY_DEFAULT_PERMISSIONS, STUDENT_DEFAULT_PERMISSIONS } from '../permissions/rolePermissions';

// ===== STORAGE KEYS =====
const STORAGE_PREFIX = 'cybernex_';

export const STORAGE_KEYS = {
  // Authentication
  USER: `${STORAGE_PREFIX}user`,
  REMEMBER_ME: `${STORAGE_PREFIX}remember_me`,

  // Data
  USERS: `${STORAGE_PREFIX}users`,
  COURSES: `${STORAGE_PREFIX}courses`,
  LESSONS: `${STORAGE_PREFIX}lessons`,
  LABS: `${STORAGE_PREFIX}labs`,
  ASSESSMENTS: `${STORAGE_PREFIX}assessments`,
  RESULTS: `${STORAGE_PREFIX}results`,
  ATTENDANCE: `${STORAGE_PREFIX}attendance`,
  SCHEDULES: `${STORAGE_PREFIX}schedules`,
  VIOLATIONS: `${STORAGE_PREFIX}violations`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  AUDIT_LOGS: `${STORAGE_PREFIX}audit_logs`,
  RESTRICTIONS: `${STORAGE_PREFIX}restrictions`,
  BACKUPS: `${STORAGE_PREFIX}backups`,
  FACULTY: `${STORAGE_PREFIX}faculty`,
  STUDENT_GROUPS: `${STORAGE_PREFIX}student_groups`,

  // Settings
  SETTINGS: `${STORAGE_PREFIX}settings`,
  THEME: `${STORAGE_PREFIX}theme`,
  PERMISSIONS: `${STORAGE_PREFIX}permissions`,
  ASSESSMENT_UNLOCKS: `${STORAGE_PREFIX}assessment_unlocks`,
  STUDENT_PROGRESS: `${STORAGE_PREFIX}student_progress`,

  // State
  LAST_ACTIVITY: `${STORAGE_PREFIX}last_activity`,
  APP_VERSION: `${STORAGE_PREFIX}app_version`,
};

// ===== STORAGE UTILITY FUNCTIONS =====

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setItem = (key, value) => {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Clear all application data from localStorage
 */
export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// ===== DATA INITIALIZATION =====

/**
 * Initialize mock data if not present
 */
export const initializeMockData = () => {
  // Check if data is already initialized
  const currentVersion = getItem(STORAGE_KEYS.APP_VERSION);

  if (currentVersion === APP_VERSION) {
    return;
  }

  console.log('Initializing mock data...');

  // Initialize users
  if (!getItem(STORAGE_KEYS.USERS)) {
    const users = SAMPLE_USERS.map(user => ({
      ...user,
      // Add custom permissions if they exist
      permissions: user.role === ROLES.ADMIN
        ? ADMIN_DEFAULT_PERMISSIONS
        : user.role === ROLES.FACULTY
          ? FACULTY_DEFAULT_PERMISSIONS
          : STUDENT_DEFAULT_PERMISSIONS
    }));
    setItem(STORAGE_KEYS.USERS, users);
  }

  // Initialize faculty
  if (!getItem(STORAGE_KEYS.FACULTY)) {
    setItem(STORAGE_KEYS.FACULTY, SAMPLE_FACULTY);
  }

  // Initialize student groups
  if (!getItem(STORAGE_KEYS.STUDENT_GROUPS)) {
    setItem(STORAGE_KEYS.STUDENT_GROUPS, SAMPLE_STUDENT_GROUPS);
  }

  // Initialize courses
  if (!getItem(STORAGE_KEYS.COURSES)) {
    setItem(STORAGE_KEYS.COURSES, SAMPLE_COURSES);
  }

  // Initialize labs
  if (!getItem(STORAGE_KEYS.LABS)) {
    setItem(STORAGE_KEYS.LABS, SAMPLE_LABS);
  }

  // Initialize assessments
  if (!getItem(STORAGE_KEYS.ASSESSMENTS)) {
    setItem(STORAGE_KEYS.ASSESSMENTS, SAMPLE_ASSESSMENTS);
  }

  // Initialize results
  if (!getItem(STORAGE_KEYS.RESULTS)) {
    setItem(STORAGE_KEYS.RESULTS, SAMPLE_RESULTS);
  }

  // Initialize attendance
  if (!getItem(STORAGE_KEYS.ATTENDANCE)) {
    setItem(STORAGE_KEYS.ATTENDANCE, SAMPLE_ATTENDANCE);
  }

  // Initialize schedules
  if (!getItem(STORAGE_KEYS.SCHEDULES)) {
    setItem(STORAGE_KEYS.SCHEDULES, SAMPLE_SCHEDULES);
  }

  // Initialize violations
  if (!getItem(STORAGE_KEYS.VIOLATIONS)) {
    setItem(STORAGE_KEYS.VIOLATIONS, SAMPLE_VIOLATIONS);
  }

  // Initialize notifications
  if (!getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setItem(STORAGE_KEYS.NOTIFICATIONS, SAMPLE_NOTIFICATIONS);
  }

  // Initialize audit logs
  if (!getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setItem(STORAGE_KEYS.AUDIT_LOGS, SAMPLE_AUDIT_LOGS);
  }

  // Initialize restrictions
  if (!getItem(STORAGE_KEYS.RESTRICTIONS)) {
    setItem(STORAGE_KEYS.RESTRICTIONS, SAMPLE_RESTRICTIONS);
  }

  // Initialize backups
  if (!getItem(STORAGE_KEYS.BACKUPS)) {
    setItem(STORAGE_KEYS.BACKUPS, SAMPLE_BACKUPS);
  }

  // Initialize settings
  if (!getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        sound: true,
      },
      assessment: {
        autoSubmit: true,
        showTimer: true,
        enableProctoring: false,
      },
      dashboard: {
        widgets: ['stats', 'progress', 'recent-activity', 'quick-actions'],
      },
      language: 'en',
    });
  }

  // Initialize theme
  if (!getItem(STORAGE_KEYS.THEME)) {
    setItem(STORAGE_KEYS.THEME, 'system');
  }

  // Initialize permissions
  if (!getItem(STORAGE_KEYS.PERMISSIONS)) {
    setItem(STORAGE_KEYS.PERMISSIONS, {
      [ROLES.ADMIN]: ADMIN_DEFAULT_PERMISSIONS,
      [ROLES.FACULTY]: FACULTY_DEFAULT_PERMISSIONS,
      [ROLES.STUDENT]: STUDENT_DEFAULT_PERMISSIONS,
    });
  }

  // Set app version
  setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);

  console.log('Mock data initialized successfully');
};

// ===== DATA ACCESS FUNCTIONS =====

// Users
export const getUsers = () => getItem(STORAGE_KEYS.USERS, []);
export const setUsers = (users) => setItem(STORAGE_KEYS.USERS, users);
export const addUser = (user) => {
  const users = getUsers();
  setUsers([...users, user]);
  return user;
};
export const updateUser = (userId, updates) => {
  const users = getUsers();
  const updatedUsers = users.map(user =>
    user.id === userId ? { ...user, ...updates } : user
  );
  setUsers(updatedUsers);
  return updatedUsers.find(user => user.id === userId);
};
export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  setUsers(filteredUsers);
  return filteredUsers;
};

// Courses
export const getCourses = () => getItem(STORAGE_KEYS.COURSES, []);
export const setCourses = (courses) => setItem(STORAGE_KEYS.COURSES, courses);
export const addCourse = (course) => {
  const courses = getCourses();
  setCourses([...courses, course]);
  return course;
};
export const updateCourse = (courseId, updates) => {
  const courses = getCourses();
  const updatedCourses = courses.map(course =>
    course.id === courseId ? { ...course, ...updates } : course
  );
  setCourses(updatedCourses);
  return updatedCourses.find(course => course.id === courseId);
};
export const deleteCourse = (courseId) => {
  const courses = getCourses();
  const filteredCourses = courses.filter(course => course.id !== courseId);
  setCourses(filteredCourses);
  return filteredCourses;
};

// Lessons (stored within courses in our data model)
// Exporting for consistency
export const getLessons = () => {
  const courses = getCourses();
  return courses.flatMap(course => course.modules?.flatMap(module => module.lessons) || []);
};

// Labs
export const getLabs = () => getItem(STORAGE_KEYS.LABS, []);
export const setLabs = (labs) => setItem(STORAGE_KEYS.LABS, labs);
export const addLab = (lab) => {
  const labs = getLabs();
  setLabs([...labs, lab]);
  return lab;
};
export const updateLab = (labId, updates) => {
  const labs = getLabs();
  const updatedLabs = labs.map(lab =>
    lab.id === labId ? { ...lab, ...updates } : lab
  );
  setLabs(updatedLabs);
  return updatedLabs.find(lab => lab.id === labId);
};
export const deleteLab = (labId) => {
  const labs = getLabs();
  const filteredLabs = labs.filter(lab => lab.id !== labId);
  setLabs(filteredLabs);
  return filteredLabs;
};

// Assessments
export const getAssessments = () => getItem(STORAGE_KEYS.ASSESSMENTS, []);
export const setAssessments = (assessments) => setItem(STORAGE_KEYS.ASSESSMENTS, assessments);
export const addAssessment = (assessment) => {
  const assessments = getAssessments();
  setAssessments([...assessments, assessment]);
  return assessment;
};
export const updateAssessment = (assessmentId, updates) => {
  const assessments = getAssessments();
  const updatedAssessments = assessments.map(assessment =>
    assessment.id === assessmentId ? { ...assessment, ...updates } : assessment
  );
  setAssessments(updatedAssessments);
  return updatedAssessments.find(assessment => assessment.id === assessmentId);
};
export const deleteAssessment = (assessmentId) => {
  const assessments = getAssessments();
  const filteredAssessments = assessments.filter(assessment => assessment.id !== assessmentId);
  setAssessments(filteredAssessments);
  return filteredAssessments;
};

// Results
export const getResults = () => getItem(STORAGE_KEYS.RESULTS, []);
export const setResults = (results) => setItem(STORAGE_KEYS.RESULTS, results);
export const addResult = (result) => {
  const results = getResults();
  setResults([...results, result]);
  return result;
};
export const updateResult = (resultId, updates) => {
  const results = getResults();
  const updatedResults = results.map(result =>
    result.id === resultId ? { ...result, ...updates } : result
  );
  setResults(updatedResults);
  return updatedResults.find(result => result.id === resultId);
};
export const deleteResult = (resultId) => {
  const results = getResults();
  const filteredResults = results.filter(result => result.id !== resultId);
  setResults(filteredResults);
  return filteredResults;
};

// Attendance
export const getAttendance = () => getItem(STORAGE_KEYS.ATTENDANCE, []);
export const setAttendance = (attendance) => setItem(STORAGE_KEYS.ATTENDANCE, attendance);
export const addAttendance = (record) => {
  const attendance = getAttendance();
  setAttendance([...attendance, record]);
  return record;
};
export const updateAttendance = (recordId, updates) => {
  const attendance = getAttendance();
  const updatedAttendance = attendance.map(record =>
    record.id === recordId ? { ...record, ...updates } : record
  );
  setAttendance(updatedAttendance);
  return updatedAttendance.find(record => record.id === recordId);
};
export const deleteAttendance = (recordId) => {
  const attendance = getAttendance();
  const filteredAttendance = attendance.filter(record => record.id !== recordId);
  setAttendance(filteredAttendance);
  return filteredAttendance;
};

// Schedules
export const getSchedules = () => getItem(STORAGE_KEYS.SCHEDULES, []);
export const setSchedules = (schedules) => setItem(STORAGE_KEYS.SCHEDULES, schedules);
export const addSchedule = (schedule) => {
  const schedules = getSchedules();
  setSchedules([...schedules, schedule]);
  return schedule;
};
export const updateSchedule = (scheduleId, updates) => {
  const schedules = getSchedules();
  const updatedSchedules = schedules.map(schedule =>
    schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
  );
  setSchedules(updatedSchedules);
  return updatedSchedules.find(schedule => schedule.id === scheduleId);
};
export const deleteSchedule = (scheduleId) => {
  const schedules = getSchedules();
  const filteredSchedules = schedules.filter(schedule => schedule.id !== scheduleId);
  setSchedules(filteredSchedules);
  return filteredSchedules;
};

// Violations
export const getViolations = () => getItem(STORAGE_KEYS.VIOLATIONS, []);
export const setViolations = (violations) => setItem(STORAGE_KEYS.VIOLATIONS, violations);
export const addViolation = (violation) => {
  const violations = getViolations();
  setViolations([...violations, violation]);
  return violation;
};
export const updateViolation = (violationId, updates) => {
  const violations = getViolations();
  const updatedViolations = violations.map(violation =>
    violation.id === violationId ? { ...violation, ...updates } : violation
  );
  setViolations(updatedViolations);
  return updatedViolations.find(violation => violation.id === violationId);
};
export const deleteViolation = (violationId) => {
  const violations = getViolations();
  const filteredViolations = violations.filter(violation => violation.id !== violationId);
  setViolations(filteredViolations);
  return filteredViolations;
};

// Notifications
export const getNotifications = () => getItem(STORAGE_KEYS.NOTIFICATIONS, []);
export const setNotifications = (notifications) => setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
export const addNotification = (notification) => {
  const notifications = getNotifications();
  setNotifications([notification, ...notifications]); // Add to beginning
  return notification;
};
export const updateNotification = (notificationId, updates) => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId ? { ...notification, ...updates } : notification
  );
  setNotifications(updatedNotifications);
  return updatedNotifications.find(notification => notification.id === notificationId);
};
export const deleteNotification = (notificationId) => {
  const notifications = getNotifications();
  const filteredNotifications = notifications.filter(n => n.id !== notificationId);
  setNotifications(filteredNotifications);
  return filteredNotifications;
};

// Audit Logs
export const getAuditLogs = () => getItem(STORAGE_KEYS.AUDIT_LOGS, []);
export const setAuditLogs = (logs) => setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
export const addAuditLog = (log) => {
  const logs = getAuditLogs();
  setAuditLogs([log, ...logs]); // Add to beginning
  return log;
};

// Restrictions
export const getRestrictions = () => getItem(STORAGE_KEYS.RESTRICTIONS, []);
export const setRestrictions = (restrictions) => setItem(STORAGE_KEYS.RESTRICTIONS, restrictions);
export const addRestriction = (restriction) => {
  const restrictions = getRestrictions();
  setRestrictions([...restrictions, restriction]);
  return restriction;
};
export const updateRestriction = (restrictionId, updates) => {
  const restrictions = getRestrictions();
  const updatedRestrictions = restrictions.map(restriction =>
    restriction.id === restrictionId ? { ...restriction, ...updates } : restriction
  );
  setRestrictions(updatedRestrictions);
  return updatedRestrictions.find(r => r.id === restrictionId);
};
export const deleteRestriction = (restrictionId) => {
  const restrictions = getRestrictions();
  const filteredRestrictions = restrictions.filter(r => r.id !== restrictionId);
  setRestrictions(filteredRestrictions);
  return filteredRestrictions;
};

// Backups
export const getBackups = () => getItem(STORAGE_KEYS.BACKUPS, []);
export const setBackups = (backups) => setItem(STORAGE_KEYS.BACKUPS, backups);
export const addBackup = (backup) => {
  const backups = getBackups();
  setBackups([backup, ...backups]); // Add to beginning
  return backup;
};
export const deleteBackup = (backupId) => {
  const backups = getBackups();
  const filteredBackups = backups.filter(b => b.id !== backupId);
  setBackups(filteredBackups);
  return filteredBackups;
};

// Faculty
export const getFaculty = () => getItem(STORAGE_KEYS.FACULTY, []);
export const setFaculty = (faculty) => setItem(STORAGE_KEYS.FACULTY, faculty);
export const addFaculty = (facultyMember) => {
  const faculty = getFaculty();
  setFaculty([...faculty, facultyMember]);
  return facultyMember;
};
export const updateFaculty = (facultyId, updates) => {
  const faculty = getFaculty();
  const updatedFaculty = faculty.map(f =>
    f.id === facultyId ? { ...f, ...updates } : f
  );
  setFaculty(updatedFaculty);
  return updatedFaculty.find(f => f.id === facultyId);
};
export const deleteFaculty = (facultyId) => {
  const faculty = getFaculty();
  const filteredFaculty = faculty.filter(f => f.id !== facultyId);
  setFaculty(filteredFaculty);
  return filteredFaculty;
};

// Student Groups
export const getStudentGroups = () => getItem(STORAGE_KEYS.STUDENT_GROUPS, []);
export const setStudentGroups = (groups) => setItem(STORAGE_KEYS.STUDENT_GROUPS, groups);
export const addStudentGroup = (group) => {
  const groups = getStudentGroups();
  setStudentGroups([...groups, group]);
  return group;
};
export const updateStudentGroup = (groupId, updates) => {
  const groups = getStudentGroups();
  const updatedGroups = groups.map(group =>
    group.id === groupId ? { ...group, ...updates } : group
  );
  setStudentGroups(updatedGroups);
  return updatedGroups.find(g => g.id === groupId);
};
export const deleteStudentGroup = (groupId) => {
  const groups = getStudentGroups();
  const filteredGroups = groups.filter(g => g.id !== groupId);
  setStudentGroups(filteredGroups);
  return filteredGroups;
};

// Settings
export const getSettings = () => getItem(STORAGE_KEYS.SETTINGS, {});
export const setSettings = (settings) => setItem(STORAGE_KEYS.SETTINGS, settings);
export const updateSettings = (updates) => {
  const settings = getSettings();
  setSettings({ ...settings, ...updates });
  return { ...settings, ...updates };
};

// Theme
export const getTheme = () => getItem(STORAGE_KEYS.THEME, 'system');
export const setTheme = (theme) => setItem(STORAGE_KEYS.THEME, theme);

// Permissions
export const getPermissions = () => getItem(STORAGE_KEYS.PERMISSIONS, {});
export const setPermissions = (permissions) => setItem(STORAGE_KEYS.PERMISSIONS, permissions);
export const updateRolePermissions = (role, permissions) => {
  const allPermissions = getPermissions();
  setPermissions({ ...allPermissions, [role]: permissions });
  return { ...allPermissions, [role]: permissions };
};

// Assessment Unlocks (which students have which assessments unlocked)
export const getAssessmentUnlocks = () => getItem(STORAGE_KEYS.ASSESSMENT_UNLOCKS, {});
export const setAssessmentUnlocks = (unlocks) => setItem(STORAGE_KEYS.ASSESSMENT_UNLOCKS, unlocks);
export const unlockAssessmentForStudent = (assessmentId, studentId) => {
  const unlocks = getAssessmentUnlocks();
  const updatedUnlocks = {
    ...unlocks,
    [assessmentId]: [...(unlocks[assessmentId] || []), studentId]
  };
  setAssessmentUnlocks(updatedUnlocks);
  return updatedUnlocks;
};
export const lockAssessmentForStudent = (assessmentId, studentId) => {
  const unlocks = getAssessmentUnlocks();
  const updatedUnlocks = {
    ...unlocks,
    [assessmentId]: (unlocks[assessmentId] || []).filter(id => id !== studentId)
  };
  setAssessmentUnlocks(updatedUnlocks);
  return updatedUnlocks;
};
export const isAssessmentUnlockedForStudent = (assessmentId, studentId) => {
  const unlocks = getAssessmentUnlocks();
  return (unlocks[assessmentId] || []).includes(studentId);
};

// Student Progress
export const getStudentProgress = (studentId) => {
  const progress = getItem(STORAGE_KEYS.STUDENT_PROGRESS, {});
  return progress[studentId] || {
    learning: { completed: 0, total: 0 },
    practice: { completed: 0, total: 0 },
    assessments: { completed: 0, total: 0 },
    xp: 0,
    securityScore: 0,
    streak: 0,
    lastActive: null
  };
};
export const setStudentProgress = (studentId, progress) => {
  const allProgress = getItem(STORAGE_KEYS.STUDENT_PROGRESS, {});
  setItem(STORAGE_KEYS.STUDENT_PROGRESS, {
    ...allProgress,
    [studentId]: progress
  });
};
export const updateStudentProgress = (studentId, updates) => {
  const currentProgress = getStudentProgress(studentId);
  const updatedProgress = { ...currentProgress, ...updates };
  setStudentProgress(studentId, updatedProgress);
  return updatedProgress;
};

// ===== BACKUP & RESTORE FUNCTIONS =====

/**
 * Create a backup of all application data
 * @param {object} options - Backup options
 * @param {string} options.createdBy - User ID who created the backup
 * @param {string} options.description - Backup description
 * @returns {object} - Backup object
 */
export const createBackup = (options = {}) => {
  const backup = {
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    data: {
      users: getUsers(),
      courses: getCourses(),
      labs: getLabs(),
      assessments: getAssessments(),
      results: getResults(),
      attendance: getAttendance(),
      schedules: getSchedules(),
      violations: getViolations(),
      notifications: getNotifications(),
      auditLogs: getAuditLogs(),
      restrictions: getRestrictions(),
      faculty: getFaculty(),
      studentGroups: getStudentGroups(),
      settings: getSettings(),
      permissions: getPermissions(),
      assessmentUnlocks: getAssessmentUnlocks(),
      studentProgress: getItem(STORAGE_KEYS.STUDENT_PROGRESS, {}),
    },
    ...options
  };

  // Add metadata
  backup.id = `BACKUP-${Date.now()}`;
  backup.fileName = `cybernex-backup-${APP_VERSION}-${backup.timestamp.replace(/[:.]/g, '-')}.json`;
  backup.size = JSON.stringify(backup.data).length;
  backup.fileCount = Object.values(backup.data).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 1),
    0
  );

  // Save to storage
  addBackup(backup);

  return backup;
};

/**
 * Download a backup file
 * @param {object} backup - Backup object to download
 */
export const downloadBackup = (backup) => {
  const data = JSON.stringify(backup.data, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = backup.fileName || 'cybernex-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Restore application data from a backup
 * @param {object} backup - Backup object to restore
 * @param {boolean} verifyVersion - Whether to verify app version
 * @returns {object} - Result object with success status
 */
export const restoreBackup = (backup, verifyVersion = true) => {
  // Verify backup structure
  if (!backup || !backup.data || !backup.version) {
    return {
      success: false,
      error: 'Invalid backup file structure'
    };
  }

  // Verify version if required
  if (verifyVersion && backup.version !== APP_VERSION) {
    return {
      success: false,
      error: `Backup version ${backup.version} does not match current app version ${APP_VERSION}`
    };
  }

  try {
    // Clear existing data
    clearAll();

    // Restore each data type
    setUsers(backup.data.users || []);
    setCourses(backup.data.courses || []);
    setLabs(backup.data.labs || []);
    setAssessments(backup.data.assessments || []);
    setResults(backup.data.results || []);
    setAttendance(backup.data.attendance || []);
    setSchedules(backup.data.schedules || []);
    setViolations(backup.data.violations || []);
    setNotifications(backup.data.notifications || []);
    setAuditLogs(backup.data.auditLogs || []);
    setRestrictions(backup.data.restrictions || []);
    setFaculty(backup.data.faculty || []);
    setStudentGroups(backup.data.studentGroups || []);
    setSettings(backup.data.settings || {});
    setPermissions(backup.data.permissions || {});
    setAssessmentUnlocks(backup.data.assessmentUnlocks || {});
    setItem(STORAGE_KEYS.STUDENT_PROGRESS, backup.data.studentProgress || {});

    // Set app version
    setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);

    // Add restore to audit log
    addAuditLog({
      id: `AUDIT-${Date.now()}`,
      userId: backup.createdBy || 'system',
      role: ROLES.ADMIN,
      action: 'BACKUP_RESTORED',
      target: 'System',
      targetId: backup.id,
      status: 'Success',
      ipAddress: 'localhost',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Backup restored successfully'
    };
  } catch (error) {
    console.error('Error restoring backup:', error);
    return {
      success: false,
      error: 'Failed to restore backup: ' + error.message
    };
  }
};

/**
 * Import backup from file
 * @param {File} file - Backup file
 * @returns {Promise<object>} - Promise resolving to backup object or error
 */
export const importBackupFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        resolve(backup);
      } catch (error) {
        reject(new Error('Invalid backup file format'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };

    reader.readAsText(file);
  });
};

// ===== AUDIT LOGGING HELPERS =====

/**
 * Log an action to the audit log
 * @param {object} action - Action details
 * @param {string} action.action - Action type (e.g., 'LOGIN', 'USER_CREATED')
 * @param {string} action.userId - User ID
 * @param {string} action.role - User role
 * @param {string} action.target - Target type (e.g., 'User', 'Course')
 * @param {string} action.targetId - Target ID
 * @param {string} action.status - Status ('Success' or 'Failure')
 * @param {object} action.details - Additional details
 */
export const logAction = (action) => {
  const log = {
    id: `AUDIT-${Date.now()}`,
    userId: action.userId || 'anonymous',
    role: action.role || ROLES.STUDENT,
    action: action.action,
    target: action.target,
    targetId: action.targetId,
    status: action.status || 'Success',
    ipAddress: action.ipAddress || 'unknown',
    userAgent: action.userAgent || navigator.userAgent,
    details: action.details,
    timestamp: new Date().toISOString()
  };

  addAuditLog(log);
  return log;
};

// ===== EXPORT =====
export default {
  // Storage keys
  STORAGE_KEYS,

  // Utility functions
  getItem,
  setItem,
  removeItem,
  clearAll,

  // Initialization
  initializeMockData,

  // Data access functions
  // Users
  getUsers,
  setUsers,
  addUser,
  updateUser,
  deleteUser,

  // Courses
  getCourses,
  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getLessons,

  // Labs
  getLabs,
  setLabs,
  addLab,
  updateLab,
  deleteLab,

  // Assessments
  getAssessments,
  setAssessments,
  addAssessment,
  updateAssessment,
  deleteAssessment,

  // Results
  getResults,
  setResults,
  addResult,
  updateResult,
  deleteResult,

  // Attendance
  getAttendance,
  setAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,

  // Schedules
  getSchedules,
  setSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,

  // Violations
  getViolations,
  setViolations,
  addViolation,
  updateViolation,
  deleteViolation,

  // Notifications
  getNotifications,
  setNotifications,
  addNotification,
  updateNotification,
  deleteNotification,

  // Audit Logs
  getAuditLogs,
  setAuditLogs,
  addAuditLog,

  // Restrictions
  getRestrictions,
  setRestrictions,
  addRestriction,
  updateRestriction,
  deleteRestriction,

  // Backups
  getBackups,
  setBackups,
  addBackup,
  deleteBackup,
  createBackup,
  downloadBackup,
  restoreBackup,
  importBackupFromFile,

  // Faculty
  getFaculty,
  setFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,

  // Student Groups
  getStudentGroups,
  setStudentGroups,
  addStudentGroup,
  updateStudentGroup,
  deleteStudentGroup,

  // Settings
  getSettings,
  setSettings,
  updateSettings,

  // Theme
  getTheme,
  setTheme,

  // Permissions
  getPermissions,
  setPermissions,
  updateRolePermissions,

  // Assessment Unlocks
  getAssessmentUnlocks,
  setAssessmentUnlocks,
  unlockAssessmentForStudent,
  lockAssessmentForStudent,
  isAssessmentUnlockedForStudent,

  // Student Progress
  getStudentProgress,
  setStudentProgress,
  updateStudentProgress,

  // Audit logging
  logAction,
};