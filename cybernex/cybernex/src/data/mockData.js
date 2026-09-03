/**
 * CyberNex - Mock Data Aggregator
 * Centralized access to all mock data for development and testing
 */

// Import all data modules
export * from './users';
export * from './courses';
export * from './assessments';
export * from './labs';
export * from './lessons';
export * from './attendance';
export * from './schedules';
export * from './results';
export * from './violations';
export * from './auditLogs';
export * from './notifications';

// Re-export sample data from constants
import {
  SAMPLE_USERS,
  SAMPLE_FACULTY,
  SAMPLE_COURSES,
  SAMPLE_LABS,
  SAMPLE_ASSESSMENTS,
  SAMPLE_RESULTS,
  SAMPLE_ATTENDANCE,
  SAMPLE_SCHEDULES,
  SAMPLE_VIOLATIONS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_AUDIT_LOGS,
  CYBER_DOMAINS,
  DIFFICULTY_LEVELS,
  ROLES
} from '../utils/constants';

export {
  SAMPLE_USERS,
  SAMPLE_FACULTY,
  SAMPLE_COURSES,
  SAMPLE_LABS,
  SAMPLE_ASSESSMENTS,
  SAMPLE_RESULTS,
  SAMPLE_ATTENDANCE,
  SAMPLE_SCHEDULES,
  SAMPLE_VIOLATIONS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_AUDIT_LOGS,
  CYBER_DOMAINS,
  DIFFICULTY_LEVELS,
  ROLES
};

// Combined data for easy access
export const MOCK_DATA = {
  users: SAMPLE_USERS,
  faculty: SAMPLE_FACULTY,
  courses: SAMPLE_COURSES,
  labs: SAMPLE_LABS,
  assessments: SAMPLE_ASSESSMENTS,
  results: SAMPLE_RESULTS,
  attendance: SAMPLE_ATTENDANCE,
  schedules: SAMPLE_SCHEDULES,
  violations: SAMPLE_VIOLATIONS,
  notifications: SAMPLE_NOTIFICATIONS,
  auditLogs: SAMPLE_AUDIT_LOGS
};

// Initialize localStorage with mock data
export const initializeMockData = () => {
  const storagePrefix = 'cybernex_';
  
  const dataSets = [
    { key: `${storagePrefix}users`, data: SAMPLE_USERS },
    { key: `${storagePrefix}courses`, data: SAMPLE_COURSES },
    { key: `${storagePrefix}labs`, data: SAMPLE_LABS },
    { key: `${storagePrefix}assessments`, data: SAMPLE_ASSESSMENTS },
    { key: `${storagePrefix}results`, data: SAMPLE_RESULTS },
    { key: `${storagePrefix}attendance`, data: SAMPLE_ATTENDANCE },
    { key: `${storagePrefix}schedules`, data: SAMPLE_SCHEDULES },
    { key: `${storagePrefix}violations`, data: SAMPLE_VIOLATIONS },
    { key: `${storagePrefix}notifications`, data: SAMPLE_NOTIFICATIONS },
    { key: `${storagePrefix}audit_logs`, data: SAMPLE_AUDIT_LOGS }
  ];

  dataSets.forEach(({ key, data }) => {
    try {
      // Only set if not already present
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.warn(`Failed to initialize mock data for ${key}:`, error);
    }
  });
  
  return dataSets.length;
};

// Clear all mock data from localStorage
export const clearMockData = () => {
  const storagePrefix = 'cybernex_';
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(storagePrefix)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to clear mock data for ${key}:`, error);
    }
  });
  
  return keysToRemove.length;
};

// Reset to fresh mock data
export const resetMockData = () => {
  clearMockData();
  return initializeMockData();
};

// Get all mock data as a single object
export const getAllMockData = () => {
  return {
    users: SAMPLE_USERS,
    faculty: SAMPLE_FACULTY,
    courses: SAMPLE_COURSES,
    labs: SAMPLE_LABS,
    assessments: SAMPLE_ASSESSMENTS,
    results: SAMPLE_RESULTS,
    attendance: SAMPLE_ATTENDANCE,
    schedules: SAMPLE_SCHEDULES,
    violations: SAMPLE_VIOLATIONS,
    notifications: SAMPLE_NOTIFICATIONS,
    auditLogs: SAMPLE_AUDIT_LOGS
  };
};

// Data generation utilities
export const DATA_GENERATORS = {
  users: {
    generate: (count) => generateMockUsers(count),
    fields: ['id', 'name', 'email', 'role', 'status']
  },
  courses: {
    generate: (count) => generateMockCourses(count),
    fields: ['id', 'title', 'code', 'domain', 'level', 'difficulty']
  },
  assessments: {
    generate: (count) => generateMockAssessments(count),
    fields: ['id', 'title', 'type', 'domain', 'difficulty', 'level']
  },
  labs: {
    generate: (count) => generateMockLabs(count),
    fields: ['id', 'title', 'domain', 'type', 'environment', 'difficulty']
  }
};

// Mock data generator functions
export function generateMockUsers(count) {
  const users = [];
  const roles = [ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN];
  const departments = ['Computer Science', 'Cybersecurity', 'Information Technology', 'Mathematics', 'Engineering'];

  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const firstName = `User${i + 1}`;
    const lastName = `Test${Math.floor(i / 10) + 1}`;
    
    users.push({
      id: `USER-${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cybernex.edu`,
      role: role,
      status: 'active',
      department: departments[Math.floor(Math.random() * departments.length)],
      password: 'password123',
      createdAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date(Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      profile: {
        firstName,
        lastName,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        avatar: `/avatars/${role.toLowerCase()}.png`,
        bio: `${role} at CyberNex University`,
        skills: [],
        interests: []
      },
      progress: {
        courses: { completed: [], inProgress: [], pending: [] },
        labs: { completed: [], inProgress: [] },
        assessments: { completed: [], inProgress: [], pending: [] },
        xp: Math.floor(Math.random() * 1000),
        level: Math.floor(Math.random() * 5) + 1,
        streak: Math.floor(Math.random() * 30),
        lastAssessment: ''
      },
      securityScore: Math.floor(Math.random() * 100),
      permissions: role === ROLES.ADMIN ? ['users.view', 'users.create', 'users.edit', 'users.delete'] : [],
      preferences: {
        theme: Math.random() > 0.5 ? 'light' : 'dark',
        notifications: true,
        emailNotifications: true,
        language: 'en'
      }
    });
  }

  return users;
}

export function generateMockCourses(count) {
  const courses = [];
  const domains = [...CYBER_DOMAINS, 'Malware Analysis', 'Digital Forensics', 'Penetration Testing', 'Cloud Security'];
  const difficultyLevels = [DIFFICULTY_LEVELS.BEGINNER, DIFFICULTY_LEVELS.INTERMEDIATE, DIFFICULTY_LEVELS.ADVANCED];

  for (let i = 0; i < count; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    const level = Math.floor(Math.random() * 5) + 1;
    
    courses.push({
      id: `COURSE-${String(i + 1).padStart(4, '0')}`,
      title: `${domain} ${level}`,
      code: `${domain.substring(0, 3).toUpperCase()}-${level}0${i + 1}`,
      description: `Comprehensive course on ${domain} for ${difficulty} level students.`,
      domain: domain,
      level: level,
      difficulty: difficulty,
      category: level <= 2 ? 'Foundational' : level <= 4 ? 'Intermediate' : 'Advanced',
      estimatedTime: Math.floor(Math.random() * 40) + 20,
      credits: Math.floor(Math.random() * 4) + 1,
      isPublished: Math.random() > 0.2,
      status: Math.random() > 0.2 ? 'published' : 'draft',
      featured: Math.random() > 0.8,
      popularity: Math.floor(Math.random() * 1000),
      rating: Math.floor(Math.random() * 50) + 50,
      reviewCount: Math.floor(Math.random() * 100),
      prerequisites: [],
      learningObjectives: [
        `Understand ${domain} fundamentals`,
        `Apply ${domain} concepts`,
        `Develop ${domain} skills`
      ],
      modules: [],
      tags: [domain.toLowerCase(), difficulty.toLowerCase()],
      resources: [],
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: new Date(Date.now() - (Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      enrollment: {
        maxStudents: Math.floor(Math.random() * 30) + 10,
        currentStudents: Math.floor(Math.random() * 20),
        waitlist: []
      }
    });
  }

  return courses;
}

export function generateMockAssessments(count) {
  const assessments = [];
  const types = ['Knowledge Assessment', 'Practical Assessment', 'Scenario Assessment', 'Capstone Assessment'];
  const domains = [...CYBER_DOMAINS, 'General', 'Security Fundamentals'];
  const difficultyLevels = [DIFFICULTY_LEVELS.BEGINNER, DIFFICULTY_LEVELS.INTERMEDIATE, DIFFICULTY_LEVELS.ADVANCED];
  const states = ['Locked', 'Eligible', 'Open', 'In Progress'];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    const level = Math.floor(Math.random() * 5) + 1;
    
    assessments.push({
      id: `ASSESSMENT-${String(i + 1).padStart(4, '0')}`,
      title: `${domain} ${type}`,
      code: `ASMT-${domain.substring(0, 3).toUpperCase()}-${level}-${String(i + 1).padStart(2, '0')}`,
      description: `${type} covering ${domain} topics for level ${level} students.`,
      type: type,
      category: type.includes('Knowledge') ? 'Theory' : 'Practical',
      domain: domain,
      difficulty: difficulty,
      level: level,
      courseId: `COURSE-${String(Math.floor(Math.random() * 10) + 1).padStart(4, '0')}`,
      courseTitle: `${domain} Course`,
      status: states[Math.floor(Math.random() * states.length)],
      isPublished: Math.random() > 0.3,
      questions: [],
      settings: {
        timeLimit: Math.floor(Math.random() * 120) + 30,
        attemptsAllowed: Math.floor(Math.random() * 3) + 1,
        passingScore: Math.floor(Math.random() * 30) + 60,
        shuffleQuestions: Math.random() > 0.5,
        shuffleAnswers: Math.random() > 0.5,
        showResults: 'after_completion',
        showFeedback: true,
        allowReview: true,
        preventCopyPaste: true,
        fullScreenMode: true,
        randomizeOrder: false,
        autoSubmit: true
      },
      restrictions: {
        type: Math.random() > 0.7 ? 'timed' : 'none',
        allowedIPs: [],
        password: '',
        startDate: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        endDate: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
        timeWindow: ''
      },
      scoring: {
        totalPoints: 100,
        passingScore: Math.floor(Math.random() * 30) + 60,
        weight: 1.0,
        negativeMarking: false,
        penalty: 0
      },
      metadata: {
        createdBy: 'FACULTY-001',
        createdByName: 'Dr. Sarah Johnson',
        createdAt: new Date(Date.now() - (Math.random() * 45 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: Math.random() > 0.3 ? new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() : '',
        tags: [domain.toLowerCase(), difficulty.toLowerCase(), 'assessment'],
        estimatedTime: Math.floor(Math.random() * 60) + 30,
        version: 1,
        attempts: Math.floor(Math.random() * 500)
      }
    });
  }

  return assessments;
}

export function generateMockLabs(count) {
  const labs = [];
  const types = ['Tutorial', 'Hands-on', 'Challenge', 'Capture The Flag', 'Project'];
  const environments = ['Linux', 'Windows', 'Web Browser', 'Network Simulator', 'Virtual Machine', 'Docker Container'];
  const domains = [...CYBER_DOMAINS, 'General', 'Security Tools'];
  const difficultyLevels = [DIFFICULTY_LEVELS.BEGINNER, DIFFICULTY_LEVELS.INTERMEDIATE, DIFFICULTY_LEVELS.ADVANCED];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const environment = environments[Math.floor(Math.random() * environments.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    const level = Math.floor(Math.random() * 5) + 1;
    
    labs.push({
      id: `LAB-${String(i + 1).padStart(4, '0')}`,
      title: `${type} Lab: ${domain}`,
      code: `LAB-${domain.substring(0, 3).toUpperCase()}-${level}-${String(i + 1).padStart(2, '0')}`,
      description: `${type} laboratory exercise covering ${domain} concepts in ${environment} environment.`,
      domain: domain,
      type: type,
      environment: environment,
      difficulty: difficulty,
      level: level,
      estimatedTime: Math.floor(Math.random() * 120) + 30,
      isPublished: Math.random() > 0.2,
      status: Math.random() > 0.2 ? 'published' : 'draft',
      featured: Math.random() > 0.8,
      popularity: Math.floor(Math.random() * 1000),
      rating: Math.floor(Math.random() * 50) + 50,
      prerequisites: [],
      learningObjectives: [
        `Understand ${domain} concepts in ${environment}`,
        `Apply ${type.toLowerCase()} skills`,
        `Complete practical exercises`
      ],
      tasks: [],
      resources: [],
      hints: [],
      solution: `Detailed solution for ${type} lab`,
      tags: [domain.toLowerCase(), type.toLowerCase(), environment.toLowerCase()],
      settings: {
        maxAttempts: Math.floor(Math.random() * 5) + 1,
        timeLimit: Math.random() > 0.7 ? Math.floor(Math.random() * 180) + 30 : 0,
        autoReset: Math.random() > 0.3,
        showHints: true,
        hintPenalty: Math.random() > 0.7 ? 10 : 0
      },
      metadata: {
        createdBy: 'FACULTY-001',
        createdByName: 'Dr. Sarah Johnson',
        createdAt: new Date(Date.now() - (Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: Math.random() > 0.2 ? new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString() : '',
        version: 1
      }
    });
  }

  return labs;
}

// Default export
export default {
  // Re-export everything
  ...DATA_GENERATORS,
  initializeMockData,
  clearMockData,
  resetMockData,
  getAllMockData,
  MOCK_DATA,
  generateMockUsers,
  generateMockCourses,
  generateMockAssessments,
  generateMockLabs
};