/**
 * CyberNex - Courses Mock Data
 * Sample course records for development and testing
 */

import { SAMPLE_COURSES, CYBER_DOMAINS, DIFFICULTY_LEVELS } from '../utils/constants';

// Sample courses (re-exported from constants)
export { SAMPLE_COURSES, CYBER_DOMAINS, DIFFICULTY_LEVELS };

// Course statuses
export const COURSE_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  HIDDEN: 'hidden'
};

// Course categories
export const COURSE_CATEGORIES = {
  FOUNDATIONAL: 'Foundational',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  SPECIALIZATION: 'Specialization',
  ELECTIVE: 'Elective'
};

// Course completion statuses
export const COURSE_COMPLETION_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Default course structure
export const DEFAULT_COURSE_STRUCTURE = {
  id: '',
  title: '',
  code: '',
  description: '',
  domain: '',
  level: 1,
  difficulty: DIFFICULTY_LEVELS.BEGINNER,
  category: COURSE_CATEGORIES.FOUNDATIONAL,
  estimatedTime: 0,
  credits: 0,
  isPublished: false,
  status: COURSE_STATUSES.DRAFT,
  featured: false,
  popularity: 0,
  rating: 0,
  reviewCount: 0,
  prerequisites: [],
  learningObjectives: [],
  modules: [],
  tags: [],
  resources: [],
  createdBy: '',
  createdByName: '',
  createdAt: '',
  updatedAt: '',
  publishedAt: '',
  enrollment: {
    maxStudents: 0,
    currentStudents: 0,
    waitlist: []
  }
};

// Course domains for cybersecurity
export const COURSE_DOMAINS = [
  CYBER_DOMAINS[0], // Web Security
  CYBER_DOMAINS[1], // Network Security  
  CYBER_DOMAINS[2], // Linux
  CYBER_DOMAINS[3], // Windows
  CYBER_DOMAINS[4], // Active Directory
  'Malware Analysis',
  'Digital Forensics',
  'Penetration Testing',
  'Incident Response',
  'Cloud Security',
  'Cryptography'
];

// Get courses by domain
export const getCoursesByDomain = (domain) => {
  return SAMPLE_COURSES.filter(course => course.domain === domain);
};

// Get courses by difficulty
export const getCoursesByDifficulty = (difficulty) => {
  return SAMPLE_COURSES.filter(course => course.difficulty === difficulty);
};

// Get courses by level
export const getCoursesByLevel = (level) => {
  return SAMPLE_COURSES.filter(course => course.level === level);
};

// Get featured courses
export const getFeaturedCourses = () => {
  return SAMPLE_COURSES.filter(course => course.featured);
};

// Get popular courses
export const getPopularCourses = (limit = 5) => {
  return [...SAMPLE_COURSES]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

// Get recent courses
export const getRecentCourses = (limit = 5) => {
  return [...SAMPLE_COURSES]
    .sort((a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt))
    .slice(0, limit);
};

// Get courses by creator
export const getCoursesByCreator = (creatorId) => {
  return SAMPLE_COURSES.filter(course => course.createdBy === creatorId);
};

// Search courses by title, description, or domain
export const searchCourses = (query) => {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_COURSES.filter(course => 
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.domain.toLowerCase().includes(lowerQuery) ||
    course.code.toLowerCase().includes(lowerQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get course statistics
export const getCourseStats = () => {
  const total = SAMPLE_COURSES.length;
  const byDomain = {};
  const byDifficulty = {};
  const byLevel = {};

  SAMPLE_COURSES.forEach(course => {
    // By domain
    byDomain[course.domain] = (byDomain[course.domain] || 0) + 1;
    
    // By difficulty
    byDifficulty[course.difficulty] = (byDifficulty[course.difficulty] || 0) + 1;
    
    // By level
    byLevel[course.level] = (byLevel[course.level] || 0) + 1;
  });

  return {
    total,
    byDomain,
    byDifficulty,
    byLevel,
    featured: SAMPLE_COURSES.filter(c => c.featured).length,
    published: SAMPLE_COURSES.filter(c => c.isPublished).length,
    draft: SAMPLE_COURSES.filter(c => !c.isPublished).length
  };
};

// Get course progress for a student
export const getCourseProgress = (studentId, courseId) => {
  const course = SAMPLE_COURSES.find(c => c.id === courseId);
  if (!course) return null;

  // This would be replaced with actual student progress data in a real app
  const totalModules = course.modules?.length || 0;
  const completedModules = Math.floor(totalModules * 0.7); // Simulate 70% completion

  return {
    courseId,
    courseTitle: course.title,
    totalModules,
    completedModules,
    completionPercentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    status: completedModules === totalModules ? COURSE_COMPLETION_STATUSES.COMPLETED : 
            completedModules > 0 ? COURSE_COMPLETION_STATUSES.IN_PROGRESS : 
            COURSE_COMPLETION_STATUSES.NOT_STARTED,
    lastAccessed: new Date().toISOString()
  };
};

// Default export
export default {
  SAMPLE_COURSES,
  COURSE_STATUSES,
  COURSE_CATEGORIES,
  COURSE_COMPLETION_STATUSES,
  COURSE_DOMAINS,
  DEFAULT_COURSE_STRUCTURE,
  getCoursesByDomain,
  getCoursesByDifficulty,
  getCoursesByLevel,
  getFeaturedCourses,
  getPopularCourses,
  getRecentCourses,
  getCoursesByCreator,
  searchCourses,
  getCourseStats,
  getCourseProgress
};