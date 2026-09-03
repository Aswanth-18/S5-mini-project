/**
 * CyberNex - Lessons Mock Data
 * Sample lesson records for development and testing
 */

import { CYBER_DOMAINS, DIFFICULTY_LEVELS } from '../utils/constants';

// Lesson statuses
export const LESSON_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  HIDDEN: 'hidden'
};

// Lesson types
export const LESSON_TYPES = {
  TEXT: 'Text',
  VIDEO: 'Video',
  INTERACTIVE: 'Interactive',
  QUIZ: 'Quiz',
  DEMONSTRATION: 'Demonstration',
  CASE_STUDY: 'Case Study'
};

// Lesson formats
export const LESSON_FORMATS = {
  HTML: 'HTML',
  MARKDOWN: 'Markdown',
  PDF: 'PDF',
  VIDEO: 'Video',
  SCORM: 'SCORM',
  INTERACTIVE: 'Interactive'
};

// Default lesson structure
export const DEFAULT_LESSON_STRUCTURE = {
  id: '',
  title: '',
  code: '',
  description: '',
  moduleId: '',
  moduleTitle: '',
  courseId: '',
  courseTitle: '',
  domain: '',
  type: LESSON_TYPES.TEXT,
  format: LESSON_FORMATS.HTML,
  difficulty: DIFFICULTY_LEVELS.BEGINNER,
  order: 0,
  estimatedTime: 0,
  isPublished: false,
  status: LESSON_STATUSES.DRAFT,
  content: '',
  videoUrl: '',
  resources: [],
  prerequisites: [],
  learningObjectives: [],
  keyPoints: [],
  assessment: null,
  tags: [],
  metadata: {
    createdBy: '',
    createdByName: '',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
    version: 1,
    views: 0,
    completionRate: 0
  }
};

// Sample lessons
export const SAMPLE_LESSONS = [
  {
    id: 'LESSON-001',
    title: 'Introduction to Computers',
    code: 'INTRO-001',
    description: 'Overview of computer systems and basic concepts',
    moduleId: 'MOD-001',
    moduleTitle: 'Computer Architecture',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    domain: CYBER_DOMAINS[0],
    type: LESSON_TYPES.TEXT,
    format: LESSON_FORMATS.HTML,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    order: 1,
    estimatedTime: 15,
    isPublished: true,
    status: LESSON_STATUSES.PUBLISHED,
    content: '<h1>Introduction to Computers</h1><p>Computers are electronic devices that process data and perform computations...</p>',
    videoUrl: '',
    resources: [
      { type: 'internal', title: 'Computer Basics PDF', url: '/resources/computer-basics.pdf' },
      { type: 'external', provider: 'YouTube', title: 'Computer Basics', url: 'https://youtube.com/watch?v=example' }
    ],
    prerequisites: [],
    learningObjectives: [
      'Understand what computers are and how they work',
      'Learn about basic computer components',
      'Understand the role of computers in cybersecurity'
    ],
    keyPoints: [
      'Computers process data using CPU',
      'Memory (RAM) provides temporary storage',
      'Storage devices save data permanently',
      'Input and output devices allow user interaction'
    ],
    assessment: null,
    tags: ['computers', 'fundamentals', 'introduction'],
    metadata: {
      createdBy: 'FACULTY-001',
      createdByName: 'Dr. Sarah Johnson',
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-01T08:00:00Z',
      publishedAt: '2025-01-01T08:00:00Z',
      version: 1,
      views: 150,
      completionRate: 85
    }
  },
  {
    id: 'LESSON-002',
    title: 'Hardware Components',
    code: 'HARDWARE-001',
    description: 'CPU, Memory, Storage, etc.',
    moduleId: 'MOD-001',
    moduleTitle: 'Computer Architecture',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    domain: CYBER_DOMAINS[0],
    type: LESSON_TYPES.VIDEO,
    format: LESSON_FORMATS.VIDEO,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    order: 2,
    estimatedTime: 20,
    isPublished: true,
    status: LESSON_STATUSES.PUBLISHED,
    content: '',
    videoUrl: '/videos/hardware-components.mp4',
    resources: [
      { type: 'external', provider: 'YouTube', title: 'Computer Hardware Explained', url: 'https://youtube.com/watch?v=hardware123' }
    ],
    prerequisites: ['LESSON-001'],
    learningObjectives: [
      'Identify major hardware components',
      'Understand the function of each component',
      'Learn how components work together'
    ],
    keyPoints: [
      'CPU performs calculations and processing',
      'RAM is volatile memory for active tasks',
      'Hard drives provide persistent storage',
      'Motherboard connects all components'
    ],
    assessment: {
      id: 'QUIZ-001',
      title: 'Hardware Components Quiz',
      type: 'knowledge',
      questions: ['Q-002'],
      passingScore: 70,
      timeLimit: 10
    },
    tags: ['hardware', 'components', 'cpu', 'memory'],
    metadata: {
      createdBy: 'FACULTY-001',
      createdByName: 'Dr. Sarah Johnson',
      createdAt: '2025-01-02T09:00:00Z',
      updatedAt: '2025-01-02T09:00:00Z',
      publishedAt: '2025-01-02T09:00:00Z',
      version: 1,
      views: 120,
      completionRate: 80
    }
  },
  {
    id: 'LESSON-003',
    title: 'Operating Systems Overview',
    code: 'OS-001',
    description: 'Introduction to operating systems and their functions',
    moduleId: 'MOD-001',
    moduleTitle: 'Computer Architecture',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    domain: CYBER_DOMAINS[0],
    type: LESSON_TYPES.INTERACTIVE,
    format: LESSON_FORMATS.INTERACTIVE,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    order: 3,
    estimatedTime: 25,
    isPublished: true,
    status: LESSON_STATUSES.PUBLISHED,
    content: '<h1>Operating Systems</h1><p>An operating system is system software that manages computer hardware...</p>',
    videoUrl: '',
    resources: [],
    prerequisites: ['LESSON-001', 'LESSON-002'],
    learningObjectives: [
      'Understand what an operating system does',
      'Learn about different types of operating systems',
      'Understand the role of OS in security'
    ],
    keyPoints: [
      'OS manages hardware and software resources',
      'Provides user interface',
      'Handles file systems and memory management',
      'Controls access to system resources'
    ],
    assessment: null,
    tags: ['operating systems', 'windows', 'linux', 'macos'],
    metadata: {
      createdBy: 'FACULTY-001',
      createdByName: 'Dr. Sarah Johnson',
      createdAt: '2025-01-03T10:00:00Z',
      updatedAt: '2025-01-03T10:00:00Z',
      publishedAt: '2025-01-03T10:00:00Z',
      version: 1,
      views: 130,
      completionRate: 88
    }
  }
];

// Get lessons by course
export const getLessonsByCourse = (courseId) => {
  return SAMPLE_LESSONS.filter(lesson => lesson.courseId === courseId);
};

// Get lessons by module
export const getLessonsByModule = (moduleId) => {
  return SAMPLE_LESSONS.filter(lesson => lesson.moduleId === moduleId);
};

// Get lessons by domain
export const getLessonsByDomain = (domain) => {
  return SAMPLE_LESSONS.filter(lesson => lesson.domain === domain);
};

// Get lessons by difficulty
export const getLessonsByDifficulty = (difficulty) => {
  return SAMPLE_LESSONS.filter(lesson => lesson.difficulty === difficulty);
};

// Get lessons by type
export const getLessonsByType = (type) => {
  return SAMPLE_LESSONS.filter(lesson => lesson.type === type);
};

// Get published lessons
export const getPublishedLessons = () => {
  return SAMPLE_LESSONS.filter(lesson => lesson.isPublished);
};

// Get lessons by creator
export const getLessonsByCreator = (creatorId) => {
  return SAMPLE_LESSONS.filter(lesson => lesson.metadata?.createdBy === creatorId);
};

// Search lessons by title, description, or content
export const searchLessons = (query) => {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_LESSONS.filter(lesson => 
    lesson.title.toLowerCase().includes(lowerQuery) ||
    lesson.description.toLowerCase().includes(lowerQuery) ||
    lesson.domain.toLowerCase().includes(lowerQuery) ||
    lesson.code.toLowerCase().includes(lowerQuery) ||
    lesson.content.toLowerCase().includes(lowerQuery) ||
    lesson.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get lesson statistics
export const getLessonStats = () => {
  const total = SAMPLE_LESSONS.length;
  const byType = {};
  const byFormat = {};
  const byDomain = {};
  const byDifficulty = {};

  SAMPLE_LESSONS.forEach(lesson => {
    byType[lesson.type] = (byType[lesson.type] || 0) + 1;
    byFormat[lesson.format] = (byFormat[lesson.format] || 0) + 1;
    byDomain[lesson.domain] = (byDomain[lesson.domain] || 0) + 1;
    byDifficulty[lesson.difficulty] = (byDifficulty[lesson.difficulty] || 0) + 1;
  });

  return {
    total,
    byType,
    byFormat,
    byDomain,
    byDifficulty,
    published: SAMPLE_LESSONS.filter(l => l.isPublished).length,
    draft: SAMPLE_LESSONS.filter(l => !l.isPublished).length
  };
};

// Get lesson completion for a student
export const getLessonCompletion = (studentId, lessonId) => {
  const lesson = SAMPLE_LESSONS.find(l => l.id === lessonId);
  if (!lesson) return null;

  // Simulate student progress
  const isCompleted = Math.random() > 0.3; // 70% chance of completion
  const completionTime = isCompleted ? lesson.estimatedTime * 0.8 : lesson.estimatedTime * 0.4;

  return {
    lessonId,
    lessonTitle: lesson.title,
    isCompleted,
    completionPercentage: isCompleted ? 100 : Math.floor(Math.random() * 60) + 20,
    timeSpent: completionTime,
    firstAccessed: new Date(Date.now() - (24 * 60 * 60 * 1000 * Math.floor(Math.random() * 7))).toISOString(),
    lastAccessed: new Date().toISOString(),
    notes: isCompleted ? 'Lesson completed successfully' : 'Lesson in progress'
  };
};

// Default export
export default {
  SAMPLE_LESSONS,
  LESSON_STATUSES,
  LESSON_TYPES,
  LESSON_FORMATS,
  DEFAULT_LESSON_STRUCTURE,
  getLessonsByCourse,
  getLessonsByModule,
  getLessonsByDomain,
  getLessonsByDifficulty,
  getLessonsByType,
  getPublishedLessons,
  getLessonsByCreator,
  searchLessons,
  getLessonStats,
  getLessonCompletion
};