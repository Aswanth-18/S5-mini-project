/**
 * CyberNex - Audit Logs Mock Data
 * Sample audit log records for development and testing
 */

import { SAMPLE_AUDIT_LOGS } from '../utils/constants';

// Sample audit logs (re-exported from constants)
export { SAMPLE_AUDIT_LOGS };

// Action types
export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  BACKUP: 'BACKUP',
  RESTORE: 'RESTORE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  ROLE_CHANGE: 'ROLE_CHANGE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  VIOLATION_REPORT: 'VIOLATION_REPORT',
  VIOLATION_RESOLVE: 'VIOLATION_RESOLVE',
  ASSESSMENT_START: 'ASSESSMENT_START',
  ASSESSMENT_SUBMIT: 'ASSESSMENT_SUBMIT',
  ASSESSMENT_GRADE: 'ASSESSMENT_GRADE',
  ATTENDANCE_MARK: 'ATTENDANCE_MARK',
  ENROLLMENT_CHANGE: 'ENROLLMENT_CHANGE'
};

// Target types
export const AUDIT_TARGETS = {
  USER: 'User',
  COURSE: 'Course',
  ASSESSMENT: 'Assessment',
  LAB: 'Lab',
  RESULT: 'Result',
  ATTENDANCE: 'Attendance',
  SCHEDULE: 'Schedule',
  VIOLATION: 'Violation',
  BACKUP: 'Backup',
  SETTING: 'Setting',
  ROLE: 'Role',
  PERMISSION: 'Permission',
  SYSTEM: 'System'
};

// Status types
export const AUDIT_STATUSES = {
  SUCCESS: 'Success',
  FAILURE: 'Failure',
  WARNING: 'Warning',
  INFO: 'Info',
  ERROR: 'Error'
};

// Default audit log structure
export const DEFAULT_AUDIT_LOG_STRUCTURE = {
  id: '',
  action: '',
  target: '',
  targetId: '',
  userId: '',
  userName: '',
  userRole: '',
  ipAddress: '',
  userAgent: '',
  timestamp: '',
  status: AUDIT_STATUSES.SUCCESS,
  details: null,
  oldValues: null,
  newValues: null,
  affectedUsers: [],
  metadata: {
    createdAt: '',
    version: 1
  }
};

// Additional sample audit logs
export const ADDITIONAL_AUDIT_LOGS = [
  {
    id: 'AUDIT-001',
    action: AUDIT_ACTIONS.LOGIN,
    target: AUDIT_TARGETS.USER,
    targetId: 'STUDENT-001',
    userId: 'STUDENT-001',
    userName: 'John Doe',
    userRole: 'student',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-15T08:30:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { method: 'password', rememberMe: false },
    oldValues: null,
    newValues: null,
    affectedUsers: ['STUDENT-001'],
    metadata: {
      createdAt: '2025-01-15T08:30:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-002',
    action: AUDIT_ACTIONS.ASSESSMENT_START,
    target: AUDIT_TARGETS.ASSESSMENT,
    targetId: 'ASSESSMENT-001',
    userId: 'STUDENT-001',
    userName: 'John Doe',
    userRole: 'student',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-15T09:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { assessmentTitle: 'Computer Fundamentals Quiz', timeLimit: 3600 },
    oldValues: null,
    newValues: null,
    affectedUsers: ['STUDENT-001'],
    metadata: {
      createdAt: '2025-01-15T09:00:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-003',
    action: AUDIT_ACTIONS.ASSESSMENT_SUBMIT,
    target: AUDIT_TARGETS.ASSESSMENT,
    targetId: 'ASSESSMENT-001',
    userId: 'STUDENT-001',
    userName: 'John Doe',
    userRole: 'student',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-15T09:30:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { assessmentTitle: 'Computer Fundamentals Quiz', score: 85, timeTaken: 1800 },
    oldValues: null,
    newValues: { status: 'submitted' },
    affectedUsers: ['STUDENT-001', 'FACULTY-001'],
    metadata: {
      createdAt: '2025-01-15T09:30:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-004',
    action: AUDIT_ACTIONS.ASSESSMENT_GRADE,
    target: AUDIT_TARGETS.RESULT,
    targetId: 'RESULT-001',
    userId: 'FACULTY-001',
    userName: 'Dr. Sarah Johnson',
    userRole: 'faculty',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2025-01-15T10:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { studentId: 'STUDENT-001', assessmentId: 'ASSESSMENT-001', score: 85, grade: 'B' },
    oldValues: { status: 'submitted' },
    newValues: { status: 'passed', grade: 'B' },
    affectedUsers: ['STUDENT-001'],
    metadata: {
      createdAt: '2025-01-15T10:00:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-005',
    action: AUDIT_ACTIONS.CREATE,
    target: AUDIT_TARGETS.COURSE,
    targetId: 'COURSE-006',
    userId: 'ADMIN-001',
    userName: 'Admin User',
    userRole: 'admin',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-18T14:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { title: 'Advanced Penetration Testing' },
    oldValues: null,
    newValues: { id: 'COURSE-006', title: 'Advanced Penetration Testing', status: 'published' },
    affectedUsers: [],
    metadata: {
      createdAt: '2025-01-18T14:00:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-006',
    action: AUDIT_ACTIONS.UPDATE,
    target: AUDIT_TARGETS.USER,
    targetId: 'STUDENT-002',
    userId: 'FACULTY-001',
    userName: 'Dr. Sarah Johnson',
    userRole: 'faculty',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2025-01-17T11:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { updateType: 'progress_update' },
    oldValues: { progress: { courses: { completed: ['COURSE-001'] } } },
    newValues: { progress: { courses: { completed: ['COURSE-001', 'COURSE-002'] } } },
    affectedUsers: ['STUDENT-002'],
    metadata: {
      createdAt: '2025-01-17T11:00:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-007',
    action: AUDIT_ACTIONS.DELETE,
    target: AUDIT_TARGETS.VIOLATION,
    targetId: 'VIOLATION-002',
    userId: 'ADMIN-001',
    userName: 'Admin User',
    userRole: 'admin',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-14T11:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { reason: 'Resolved and archived' },
    oldValues: { status: 'resolved' },
    newValues: null,
    affectedUsers: ['STUDENT-006'],
    metadata: {
      createdAt: '2025-01-14T11:00:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-008',
    action: AUDIT_ACTIONS.BACKUP,
    target: AUDIT_TARGETS.BACKUP,
    targetId: 'BACKUP-001',
    userId: 'ADMIN-001',
    userName: 'Admin User',
    userRole: 'admin',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-14T02:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { type: 'full', size: '150MB', components: ['users', 'courses', 'assessments', 'results'] },
    oldValues: null,
    newValues: { backupId: 'BACKUP-001', status: 'completed', fileSize: '150MB' },
    affectedUsers: [],
    metadata: {
      createdAt: '2025-01-14T02:00:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-009',
    action: AUDIT_ACTIONS.SETTINGS_CHANGE,
    target: AUDIT_TARGETS.SETTING,
    targetId: 'GENERAL_SETTINGS',
    userId: 'ADMIN-001',
    userName: 'Admin User',
    userRole: 'admin',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-13T15:30:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { setting: 'session_timeout', category: 'security' },
    oldValues: { session_timeout: 30 },
    newValues: { session_timeout: 60 },
    affectedUsers: [],
    metadata: {
      createdAt: '2025-01-13T15:30:00Z',
      version: 1
    }
  },
  {
    id: 'AUDIT-010',
    action: AUDIT_ACTIONS.PERMISSION_CHANGE,
    target: AUDIT_TARGETS.USER,
    targetId: 'STUDENT-005',
    userId: 'ADMIN-001',
    userName: 'Admin User',
    userRole: 'admin',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2025-01-12T10:00:00Z',
    status: AUDIT_STATUSES.SUCCESS,
    details: { changeType: 'restriction_added' },
    oldValues: { restrictedDomains: [] },
    newValues: { restrictedDomains: ['Network Security'] },
    affectedUsers: ['STUDENT-005'],
    metadata: {
      createdAt: '2025-01-12T10:00:00Z',
      version: 1
    }
  }
];

// Get all audit logs (combine constants and additional)
export const ALL_AUDIT_LOGS = [...SAMPLE_AUDIT_LOGS, ...ADDITIONAL_AUDIT_LOGS];

// Get audit logs by user
export const getAuditLogsByUser = (userId) => {
  return ALL_AUDIT_LOGS.filter(log => log.userId === userId);
};

// Get audit logs by action
export const getAuditLogsByAction = (action) => {
  return ALL_AUDIT_LOGS.filter(log => log.action === action);
};

// Get audit logs by target
export const getAuditLogsByTarget = (target) => {
  return ALL_AUDIT_LOGS.filter(log => log.target === target);
};

// Get audit logs by target ID
export const getAuditLogsByTargetId = (targetId) => {
  return ALL_AUDIT_LOGS.filter(log => log.targetId === targetId);
};

// Get audit logs by status
export const getAuditLogsByStatus = (status) => {
  return ALL_AUDIT_LOGS.filter(log => log.status === status);
};

// Get audit logs by date range
export const getAuditLogsByDateRange = (startDate, endDate) => {
  return ALL_AUDIT_LOGS.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= new Date(startDate) && logDate <= new Date(endDate);
  });
};

// Get recent audit logs
export const getRecentAuditLogs = (limit = 10) => {
  return [...ALL_AUDIT_LOGS]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

// Get audit logs for a specific resource
export const getAuditLogsForResource = (target, targetId) => {
  return ALL_AUDIT_LOGS.filter(log => log.target === target && log.targetId === targetId);
};

// Search audit logs by user, action, or target
export const searchAuditLogs = (query) => {
  const lowerQuery = query.toLowerCase();
  return ALL_AUDIT_LOGS.filter(log => 
    log.userName.toLowerCase().includes(lowerQuery) ||
    log.userId.toLowerCase().includes(lowerQuery) ||
    log.action.toLowerCase().includes(lowerQuery) ||
    log.target.toLowerCase().includes(lowerQuery) ||
    log.targetId.toLowerCase().includes(lowerQuery) ||
    log.status.toLowerCase().includes(lowerQuery)
  );
};

// Get audit log statistics
export const getAuditLogStats = () => {
  const total = ALL_AUDIT_LOGS.length;
  const byAction = {};
  const byTarget = {};
  const byUser = {};
  const byStatus = {};

  ALL_AUDIT_LOGS.forEach(log => {
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    byTarget[log.target] = (byTarget[log.target] || 0) + 1;
    byUser[log.userId] = (byUser[log.userId] || 0) + 1;
    byStatus[log.status] = (byStatus[log.status] || 0) + 1;
  });

  const successCount = ALL_AUDIT_LOGS.filter(l => l.status === AUDIT_STATUSES.SUCCESS).length;
  const failureCount = ALL_AUDIT_LOGS.filter(l => l.status === AUDIT_STATUSES.FAILURE).length;
  const warningCount = ALL_AUDIT_LOGS.filter(l => l.status === AUDIT_STATUSES.WARNING).length;

  return {
    total,
    byAction,
    byTarget,
    byUser,
    byStatus,
    successCount,
    failureCount,
    warningCount,
    successRate: total > 0 ? Math.round((successCount / total) * 100) : 0
  };
};

// Get most active users
export const getMostActiveUsers = (limit = 5) => {
  const userActivity = {};
  
  ALL_AUDIT_LOGS.forEach(log => {
    if (!userActivity[log.userId]) {
      userActivity[log.userId] = { userId: log.userId, userName: log.userName, count: 0 };
    }
    userActivity[log.userId].count++;
  });
  
  return Object.values(userActivity)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Get most targeted resources
export const getMostTargetedResources = (limit = 5) => {
  const targetActivity = {};
  
  ALL_AUDIT_LOGS.forEach(log => {
    const key = `${log.target}:${log.targetId}`;
    if (!targetActivity[key]) {
      targetActivity[key] = { target: log.target, targetId: log.targetId, count: 0 };
    }
    targetActivity[key].count++;
  });
  
  return Object.values(targetActivity)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Get audit log trends
export const getAuditLogTrends = () => {
  const byDay = {};
  const byHour = {};

  ALL_AUDIT_LOGS.forEach(log => {
    const date = new Date(log.timestamp);
    const dayKey = date.toISOString().split('T')[0];
    const hourKey = date.getHours();

    byDay[dayKey] = (byDay[dayKey] || 0) + 1;
    byHour[hourKey] = (byHour[hourKey] || 0) + 1;
  });

  return { byDay, byHour };
};

// Create a new audit log entry
export const createAuditLogEntry = (data) => {
  const newLog = {
    ...DEFAULT_AUDIT_LOG_STRUCTURE,
    ...data,
    id: `AUDIT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    metadata: {
      createdAt: new Date().toISOString(),
      version: 1
    }
  };

  return newLog;
};

// Default export
export default {
  SAMPLE_AUDIT_LOGS,
  ADDITIONAL_AUDIT_LOGS,
  ALL_AUDIT_LOGS,
  AUDIT_ACTIONS,
  AUDIT_TARGETS,
  AUDIT_STATUSES,
  DEFAULT_AUDIT_LOG_STRUCTURE,
  getAuditLogsByUser,
  getAuditLogsByAction,
  getAuditLogsByTarget,
  getAuditLogsByTargetId,
  getAuditLogsByStatus,
  getAuditLogsByDateRange,
  getRecentAuditLogs,
  getAuditLogsForResource,
  searchAuditLogs,
  getAuditLogStats,
  getMostActiveUsers,
  getMostTargetedResources,
  getAuditLogTrends,
  createAuditLogEntry
};