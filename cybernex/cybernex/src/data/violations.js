/**
 * CyberNex - Violations Mock Data
 * Sample violation records for development and testing
 */

import { SAMPLE_VIOLATIONS } from '../utils/constants';

// Sample violations (re-exported from constants)
export { SAMPLE_VIOLATIONS };

// Violation types
export const VIOLATION_TYPES = {
  POLICY_VIOLATION: 'Policy Violation',
  SECURITY_VIOLATION: 'Security Violation',
  ACADEMIC_MISCONDUCT: 'Academic Misconduct',
  BEHAVIORAL: 'Behavioral',
  SYSTEM_ABUSE: 'System Abuse',
  PLAGIARISM: 'Plagiarism',
  CHEATING: 'Cheating',
  UNAUTHORIZED_ACCESS: 'Unauthorized Access',
  COPYRIGHT_INFRINGEMENT: 'Copyright Infringement',
  HARASSMENT: 'Harassment'
};

// Violation severity levels
export const VIOLATION_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Violation statuses
export const VIOLATION_STATUSES = {
  REPORTED: 'reported',
  UNDER_REVIEW: 'under_review',
  INVESTIGATING: 'investigating',
  PENDING_ACTION: 'pending_action',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
  APPEALED: 'appealed',
  CLOSED: 'closed'
};

// Violation resolutions
export const VIOLATION_RESOLUTIONS = {
  WARNING: 'Warning',
  SUSPENSION: 'Suspension',
  EXPULSION: 'Expulsion',
  PROBATION: 'Probation',
  FINES: 'Fines',
  EDUCATION: 'Education/Re-training',
  ACCESS_REVOKED: 'Access Revoked',
  MONITORING: 'Increased Monitoring'
};

// Default violation structure
export const DEFAULT_VIOLATION_STRUCTURE = {
  id: '',
  userId: '',
  userName: '',
  userRole: '',
  type: '',
  title: '',
  description: '',
  severity: VIOLATION_SEVERITY.MEDIUM,
  status: VIOLATION_STATUSES.REPORTED,
  reportedBy: '',
  reportedByName: '',
  reportedAt: '',
  evidence: [],
  relatedIncidents: [],
  impact: '',
  affectedSystems: [],
  resolution: '',
  resolutionDetails: '',
  resolvedBy: '',
  resolvedByName: '',
  resolvedAt: '',
  assignedTo: '',
  assignedToName: '',
  investigationNotes: '',
  actionsTaken: [],
  followUpRequired: false,
  followUpDate: '',
  appeal: null,
  tags: [],
  metadata: {
    createdAt: '',
    updatedAt: '',
    version: 1
  }
};

// Additional sample violations
export const ADDITIONAL_VIOLATIONS = [
  {
    id: 'VIOLATION-001',
    userId: 'STUDENT-003',
    userName: 'Mike Wilson',
    userRole: 'student',
    type: VIOLATION_TYPES.CHEATING,
    title: 'Copying Answers During Assessment',
    description: 'Student was observed copying answers from another student during the Network Security Basics assessment.',
    severity: VIOLATION_SEVERITY.HIGH,
    status: VIOLATION_STATUSES.UNDER_REVIEW,
    reportedBy: 'FACULTY-002',
    reportedByName: 'Prof. Michael Chen',
    reportedAt: '2025-01-16T14:30:00Z',
    evidence: [
      { type: 'screenshot', url: '/evidence/violation-001-screenshot1.png', description: 'Screenshot showing copied answers' },
      { type: 'witness', name: 'Prof. Michael Chen', statement: 'I observed the student looking at another student\'s screen' }
    ],
    relatedIncidents: [],
    impact: 'Assessment integrity compromised',
    affectedSystems: ['Assessment System'],
    resolution: '',
    resolutionDetails: '',
    resolvedBy: '',
    resolvedByName: '',
    resolvedAt: '',
    assignedTo: 'FACULTY-002',
    assignedToName: 'Prof. Michael Chen',
    investigationNotes: 'Student has been contacted for explanation. Awaiting response.',
    actionsTaken: ['Assessment results withheld', 'Student notified'],
    followUpRequired: true,
    followUpDate: '2025-01-20',
    appeal: null,
    tags: ['cheating', 'assessment', 'academic integrity'],
    metadata: {
      createdAt: '2025-01-16T14:30:00Z',
      updatedAt: '2025-01-16T15:00:00Z',
      version: 1
    }
  },
  {
    id: 'VIOLATION-002',
    userId: 'STUDENT-006',
    userName: 'Samantha Davis',
    userRole: 'student',
    type: VIOLATION_TYPES.UNAUTHORIZED_ACCESS,
    title: 'Attempted Access to Restricted Materials',
    description: 'Student attempted to access administrative course materials without proper authorization.',
    severity: VIOLATION_SEVERITY.HIGH,
    status: VIOLATION_STATUSES.RESOLVED,
    reportedBy: 'SYSTEM',
    reportedByName: 'Automated Security System',
    reportedAt: '2025-01-14T10:15:00Z',
    evidence: [
      { type: 'log', url: '/evidence/violation-002-access-logs.txt', description: 'Access logs showing unauthorized access attempt' },
      { type: 'screenshot', url: '/evidence/violation-002-screenshot.png', description: 'Screenshot of access denied page' }
    ],
    relatedIncidents: ['INCIDENT-001'],
    impact: 'Potential data breach averted',
    affectedSystems: ['Course Management System', 'Authentication System'],
    resolution: VIOLATION_RESOLUTIONS.WARNING,
    resolutionDetails: 'Student received a formal warning and completed mandatory security training.',
    resolvedBy: 'ADMIN-001',
    resolvedByName: 'Admin User',
    resolvedAt: '2025-01-14T11:00:00Z',
    assignedTo: 'ADMIN-001',
    assignedToName: 'Admin User',
    investigationNotes: 'Access was automatically blocked. Student admitted to trying to access materials out of curiosity.',
    actionsTaken: ['Access blocked', 'Warning issued', 'Security training assigned'],
    followUpRequired: false,
    followUpDate: '',
    appeal: null,
    tags: ['unauthorized access', 'security', 'warning'],
    metadata: {
      createdAt: '2025-01-14T10:15:00Z',
      updatedAt: '2025-01-14T11:00:00Z',
      version: 1
    }
  },
  {
    id: 'VIOLATION-003',
    userId: 'STUDENT-004',
    userName: 'Emily Brown',
    userRole: 'student',
    type: VIOLATION_TYPES.POLICY_VIOLATION,
    title: 'Late Submission Policy Violation',
    description: 'Student submitted assessment 48 hours after the deadline without prior approval.',
    severity: VIOLATION_SEVERITY.LOW,
    status: VIOLATION_STATUSES.PENDING_ACTION,
    reportedBy: 'FACULTY-004',
    reportedByName: 'Prof. David Kim',
    reportedAt: '2025-01-17T09:00:00Z',
    evidence: [
      { type: 'document', url: '/evidence/violation-003-submission.png', description: 'Late submission timestamp' }
    ],
    relatedIncidents: [],
    impact: 'Late submission disrupts grading schedule',
    affectedSystems: ['Assessment System'],
    resolution: '',
    resolutionDetails: '',
    resolvedBy: '',
    resolvedByName: '',
    resolvedAt: '',
    assignedTo: 'FACULTY-004',
    assignedToName: 'Prof. David Kim',
    investigationNotes: 'Student claims they had technical issues. Verifying with IT department.',
    actionsTaken: ['Late submission noted', 'Student contacted'],
    followUpRequired: true,
    followUpDate: '2025-01-18',
    appeal: null,
    tags: ['late submission', 'policy', 'deadline'],
    metadata: {
      createdAt: '2025-01-17T09:00:00Z',
      updatedAt: '2025-01-17T09:00:00Z',
      version: 1
    }
  },
  {
    id: 'VIOLATION-004',
    userId: 'STUDENT-007',
    userName: 'Robert Wilson',
    userRole: 'student',
    type: VIOLATION_TYPES.SYSTEM_ABUSE,
    title: 'Excessive Resource Usage',
    description: 'Student consumed excessive server resources during lab exercises, causing performance issues for other users.',
    severity: VIOLATION_SEVERITY.MEDIUM,
    status: VIOLATION_STATUSES.RESOLVED,
    reportedBy: 'SYSTEM',
    reportedByName: 'System Monitor',
    reportedAt: '2025-01-15T14:45:00Z',
    evidence: [
      { type: 'log', url: '/evidence/violation-004-resource-logs.txt', description: 'Server resource usage logs' },
      { type: 'screenshot', url: '/evidence/violation-004-dashboard.png', description: 'System monitoring dashboard screenshot' }
    ],
    relatedIncidents: [],
    impact: 'Service degradation for other users',
    affectedSystems: ['Lab Environment', 'Server Resources'],
    resolution: VIOLATION_RESOLUTIONS.EDUCATION,
    resolutionDetails: 'Student received training on responsible resource usage and lab environment best practices.',
    resolvedBy: 'FACULTY-003',
    resolvedByName: 'Prof. Lisa Rodriguez',
    resolvedAt: '2025-01-15T16:00:00Z',
    assignedTo: 'FACULTY-003',
    assignedToName: 'Prof. Lisa Rodriguez',
    investigationNotes: 'Student was running multiple resource-intensive processes simultaneously. No malicious intent found.',
    actionsTaken: ['Processes terminated', 'Training assigned', 'Resource limits adjusted'],
    followUpRequired: false,
    followUpDate: '',
    appeal: null,
    tags: ['resource abuse', 'lab environment', 'training'],
    metadata: {
      createdAt: '2025-01-15T14:45:00Z',
      updatedAt: '2025-01-15T16:00:00Z',
      version: 1
    }
  },
  {
    id: 'VIOLATION-005',
    userId: 'STUDENT-005',
    userName: 'Alex Johnson',
    userRole: 'student',
    type: VIOLATION_TYPES.PLAGIARISM,
    title: 'Suspected Plagiarism in Assignment',
    description: 'Assignment submitted by student shows significant similarity to previously submitted work by other students.',
    severity: VIOLATION_SEVERITY.CRITICAL,
    status: VIOLATION_STATUSES.INVESTIGATING,
    reportedBy: 'SYSTEM',
    reportedByName: 'Plagiarism Detection System',
    reportedAt: '2025-01-18T11:30:00Z',
    evidence: [
      { type: 'document', url: '/evidence/violation-005-similarity-report.pdf', description: 'Plagiarism detection report' },
      { type: 'document', url: '/evidence/violation-005-original-assignment.docx', description: 'Original assignment submission' },
      { type: 'document', url: '/evidence/violation-005-source-material.docx', description: 'Source material with similarities' }
    ],
    relatedIncidents: [],
    impact: 'Academic integrity compromised',
    affectedSystems: ['Assignment System'],
    resolution: '',
    resolutionDetails: '',
    resolvedBy: '',
    resolvedByName: '',
    resolvedAt: '',
    assignedTo: 'ADMIN-001',
    assignedToName: 'Admin User',
    investigationNotes: 'Reviewing similarity report and comparing with source materials. Student has been notified of the investigation.',
    actionsTaken: ['Assignment withheld', 'Student notified', 'Investigation initiated'],
    followUpRequired: true,
    followUpDate: '2025-01-22',
    appeal: null,
    tags: ['plagiarism', 'academic integrity', 'investigation'],
    metadata: {
      createdAt: '2025-01-18T11:30:00Z',
      updatedAt: '2025-01-18T12:00:00Z',
      version: 1
    }
  }
];

// Get all violations (combine constants and additional)
export const ALL_VIOLATIONS = [...SAMPLE_VIOLATIONS, ...ADDITIONAL_VIOLATIONS];

// Get violations by type
export const getViolationsByType = (type) => {
  return ALL_VIOLATIONS.filter(violation => violation.type === type);
};

// Get violations by severity
export const getViolationsBySeverity = (severity) => {
  return ALL_VIOLATIONS.filter(violation => violation.severity === severity);
};

// Get violations by status
export const getViolationsByStatus = (status) => {
  return ALL_VIOLATIONS.filter(violation => violation.status === status);
};

// Get violations by user
export const getViolationsByUser = (userId) => {
  return ALL_VIOLATIONS.filter(violation => violation.userId === userId);
};

// Get open violations (not resolved or dismissed)
export const getOpenViolations = () => {
  return ALL_VIOLATIONS.filter(violation => 
    violation.status !== VIOLATION_STATUSES.RESOLVED &&
    violation.status !== VIOLATION_STATUSES.DISMISSED &&
    violation.status !== VIOLATION_STATUSES.CLOSED
  );
};

// Get high priority violations
export const getHighPriorityViolations = () => {
  return ALL_VIOLATIONS.filter(violation => 
    violation.severity === VIOLATION_SEVERITY.HIGH || 
    violation.severity === VIOLATION_SEVERITY.CRITICAL
  );
};

// Get violations by date range
export const getViolationsByDateRange = (startDate, endDate) => {
  return ALL_VIOLATIONS.filter(violation => {
    const reportedDate = new Date(violation.reportedAt);
    return reportedDate >= new Date(startDate) && reportedDate <= new Date(endDate);
  });
};

// Get violations assigned to user
export const getViolationsAssignedTo = (userId) => {
  return ALL_VIOLATIONS.filter(violation => violation.assignedTo === userId);
};

// Get violations reported by user
export const getViolationsReportedBy = (userId) => {
  return ALL_VIOLATIONS.filter(violation => violation.reportedBy === userId);
};

// Get recent violations
export const getRecentViolations = (limit = 5) => {
  return [...ALL_VIOLATIONS]
    .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    .slice(0, limit);
};

// Search violations by user, type, or description
export const searchViolations = (query) => {
  const lowerQuery = query.toLowerCase();
  return ALL_VIOLATIONS.filter(violation => 
    violation.userName.toLowerCase().includes(lowerQuery) ||
    violation.userId.toLowerCase().includes(lowerQuery) ||
    violation.type.toLowerCase().includes(lowerQuery) ||
    violation.title.toLowerCase().includes(lowerQuery) ||
    violation.description.toLowerCase().includes(lowerQuery) ||
    violation.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get violation statistics
export const getViolationStats = () => {
  const total = ALL_VIOLATIONS.length;
  const byType = {};
  const bySeverity = {};
  const byStatus = {};
  const byUserRole = {};

  ALL_VIOLATIONS.forEach(violation => {
    byType[violation.type] = (byType[violation.type] || 0) + 1;
    bySeverity[violation.severity] = (bySeverity[violation.severity] || 0) + 1;
    byStatus[violation.status] = (byStatus[violation.status] || 0) + 1;
    byUserRole[violation.userRole] = (byUserRole[violation.userRole] || 0) + 1;
  });

  const open = getOpenViolations().length;
  const highPriority = getHighPriorityViolations().length;
  const resolved = ALL_VIOLATIONS.filter(v => v.status === VIOLATION_STATUSES.RESOLVED).length;
  const dismissed = ALL_VIOLATIONS.filter(v => v.status === VIOLATION_STATUSES.DISMISSED).length;

  return {
    total,
    byType,
    bySeverity,
    byStatus,
    byUserRole,
    open,
    highPriority,
    resolved,
    dismissed,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
  };
};

// Get violation trend data
export const getViolationTrends = () => {
  const byMonth = {};
  const byWeek = {};

  ALL_VIOLATIONS.forEach(violation => {
    const date = new Date(violation.reportedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const weekKey = `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, '0')}`;

    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
    byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;
  });

  return { byMonth, byWeek };
};

// Helper function to get week number
export const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 + 3 - (week1.getDay() + 6) % 7) / 7);
};

// Create a new violation report
export const createViolationReport = (data) => {
  const newViolation = {
    ...DEFAULT_VIOLATION_STRUCTURE,
    ...data,
    id: `VIOLATION-${Date.now()}`,
    status: VIOLATION_STATUSES.REPORTED,
    reportedAt: new Date().toISOString(),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    }
  };

  return newViolation;
};

// Default export
export default {
  SAMPLE_VIOLATIONS,
  ADDITIONAL_VIOLATIONS,
  ALL_VIOLATIONS,
  VIOLATION_TYPES,
  VIOLATION_SEVERITY,
  VIOLATION_STATUSES,
  VIOLATION_RESOLUTIONS,
  DEFAULT_VIOLATION_STRUCTURE,
  getViolationsByType,
  getViolationsBySeverity,
  getViolationsByStatus,
  getViolationsByUser,
  getOpenViolations,
  getHighPriorityViolations,
  getViolationsByDateRange,
  getViolationsAssignedTo,
  getViolationsReportedBy,
  getRecentViolations,
  searchViolations,
  getViolationStats,
  getViolationTrends,
  createViolationReport
};