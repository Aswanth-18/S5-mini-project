/**
 * CyberNex - Users Mock Data
 * Sample user records for development and testing
 */

import { ROLES, SAMPLE_USERS, SAMPLE_FACULTY } from '../utils/constants';

// User roles
export { ROLES };

// Sample users (re-exported from constants)
export { SAMPLE_USERS, SAMPLE_FACULTY };

// User statuses
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  GRADUATED: 'graduated',
  PENDING: 'pending'
};

// User account types
export const ACCOUNT_TYPES = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  ADMIN: 'admin'
};

// Default user structure
export const DEFAULT_USER_STRUCTURE = {
  id: '',
  name: '',
  email: '',
  role: ROLES.STUDENT,
  status: USER_STATUSES.ACTIVE,
  department: '',
  password: '',
  createdAt: '',
  updatedAt: '',
  lastLogin: '',
  profile: {
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
    bio: '',
    skills: [],
    interests: []
  },
  progress: {
    courses: { completed: [], inProgress: [], pending: [] },
    labs: { completed: [], inProgress: [] },
    assessments: { completed: [], inProgress: [], pending: [] },
    xp: 0,
    level: 1,
    streak: 0,
    lastAssessment: ''
  },
  securityScore: 0,
  permissions: [],
  preferences: {
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    language: 'en'
  }
};

// Admin users
export const SAMPLE_ADMINS = [
  {
    id: 'ADMIN-001',
    name: 'Admin User',
    email: 'admin@cybernex.edu',
    role: ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE,
    department: 'Information Technology',
    password: 'admin123',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
    lastLogin: '2025-01-15T09:30:00Z',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1-555-0100',
      avatar: '/avatars/admin.png',
      bio: 'System Administrator',
      skills: ['System Administration', 'Security', 'Networking'],
      interests: ['Cybersecurity', 'DevOps', 'Cloud Computing']
    },
    progress: {
      courses: { completed: [], inProgress: [], pending: [] },
      labs: { completed: [], inProgress: [] },
      assessments: { completed: [], inProgress: [], pending: [] },
      xp: 0,
      level: 1,
      streak: 0,
      lastAssessment: ''
    },
    securityScore: 95,
    permissions: [
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'courses.view', 'courses.create', 'courses.edit', 'courses.delete',
      'attendance.view', 'attendance.manage',
      'schedule.view', 'schedule.manage',
      'faculty.view', 'faculty.manage',
      'assets.view', 'assets.manage',
      'restrictions.view', 'restrictions.manage',
      'violations.view', 'violations.manage',
      'backup.create', 'backup.restore',
      'access_control.manage',
      'system.manage'
    ],
    preferences: {
      theme: 'dark',
      notifications: true,
      emailNotifications: true,
      language: 'en'
    },
    access: {
      restrictedDomains: [],
      allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
      maxSessions: 3,
      sessionTimeout: 60
    }
  }
];

// Get all sample users (including admins and faculty)
export const getAllSampleUsers = () => {
  return [
    ...SAMPLE_ADMINS,
    ...SAMPLE_FACULTY,
    ...SAMPLE_USERS
  ];
};

// Get users by role
export const getUsersByRole = (role) => {
  const allUsers = getAllSampleUsers();
  return allUsers.filter(user => user.role === role);
};

// Get active users
export const getActiveUsers = () => {
  const allUsers = getAllSampleUsers();
  return allUsers.filter(user => user.status === USER_STATUSES.ACTIVE);
};

// Get users by department
export const getUsersByDepartment = (department) => {
  const allUsers = getAllSampleUsers();
  return allUsers.filter(user => user.department === department);
};

// Search users by name or email
export const searchUsers = (query) => {
  const allUsers = getAllSampleUsers();
  const lowerQuery = query.toLowerCase();
  
  return allUsers.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery) ||
    (user.profile?.firstName && user.profile.firstName.toLowerCase().includes(lowerQuery)) ||
    (user.profile?.lastName && user.profile.lastName.toLowerCase().includes(lowerQuery)) ||
    (user.id && user.id.toLowerCase().includes(lowerQuery))
  );
};

// Get user statistics
export const getUserStats = () => {
  const allUsers = getAllSampleUsers();
  const students = getUsersByRole(ROLES.STUDENT);
  const faculty = getUsersByRole(ROLES.FACULTY);
  const admins = getUsersByRole(ROLES.ADMIN);
  const activeUsers = getActiveUsers();

  return {
    total: allUsers.length,
    students: students.length,
    faculty: faculty.length,
    admins: admins.length,
    active: activeUsers.length,
    inactive: allUsers.length - activeUsers.length
  };
};

// Default export
export default {
  SAMPLE_USERS,
  SAMPLE_FACULTY,
  SAMPLE_ADMINS,
  USER_STATUSES,
  ACCOUNT_TYPES,
  DEFAULT_USER_STRUCTURE,
  getAllSampleUsers,
  getUsersByRole,
  getActiveUsers,
  getUsersByDepartment,
  searchUsers,
  getUserStats
};