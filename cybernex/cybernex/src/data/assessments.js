/**
 * CyberNex - Assessments Mock Data
 * Sample assessment records for development and testing
 */

import { SAMPLE_ASSESSMENTS, ASSESSMENT_TYPES, ASSESSMENT_STATES, DIFFICULTY_LEVELS, QUESTION_TYPES } from '../utils/constants';

// Sample assessments (re-exported from constants)
export { SAMPLE_ASSESSMENTS, ASSESSMENT_TYPES, ASSESSMENT_STATES, QUESTION_TYPES, DIFFICULTY_LEVELS };

// Assessment categories
export const ASSESSMENT_CATEGORIES = {
  THEORY: 'Theory',
  PRACTICAL: 'Practical',
  COMBINED: 'Combined',
  FINAL: 'Final',
  QUIZ: 'Quiz',
  PROJECT: 'Project'
};

// Assessment settings structure
export const DEFAULT_ASSESSMENT_SETTINGS = {
  timeLimit: 60, // minutes
  attemptsAllowed: 1,
  passingScore: 70,
  shuffleQuestions: false,
  shuffleAnswers: true,
  showResults: 'after_completion',
  showFeedback: true,
  allowReview: true,
  preventCopyPaste: true,
  fullScreenMode: true,
  randomizeOrder: false,
  autoSubmit: true
};

// Assessment restrictions
export const ASSESSMENT_RESTRICTIONS = {
  NONE: 'none',
  TIMED: 'timed',
  ATTEMPTS: 'attempts',
  IP_RESTRICTION: 'ip_restriction',
  PASSWORD: 'password',
  ALL: 'all'
};

// Default assessment structure
export const DEFAULT_ASSESSMENT_STRUCTURE = {
  id: '',
  title: '',
  code: '',
  description: '',
  type: ASSESSMENT_TYPES.KNOWLEDGE,
  category: ASSESSMENT_CATEGORIES.THEORY,
  domain: '',
  difficulty: DIFFICULTY_LEVELS.BEGINNER,
  level: 1,
  courseId: '',
  courseTitle: '',
  status: ASSESSMENT_STATES.LOCKED,
  isPublished: false,
  questions: [],
  settings: DEFAULT_ASSESSMENT_SETTINGS,
  restrictions: {
    type: ASSESSMENT_RESTRICTIONS.NONE,
    allowedIPs: [],
    password: '',
    startDate: '',
    endDate: '',
    timeWindow: ''
  },
  scoring: {
    totalPoints: 100,
    passingScore: 70,
    weight: 1.0,
    negativeMarking: false,
    penalty: 0
  },
  metadata: {
    createdBy: '',
    createdByName: '',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
    tags: [],
    estimatedTime: 30,
    version: 1
  }
};

// Sample questions for assessments
export const SAMPLE_QUESTIONS = [
  {
    id: 'Q-001',
    text: 'What is the primary purpose of a firewall?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    domain: 'Network Security',
    points: 10,
    options: [
      { id: 'A', text: 'To speed up network connections', isCorrect: false },
      { id: 'B', text: 'To monitor and control incoming and outgoing network traffic', isCorrect: true },
      { id: 'C', text: 'To store backup data', isCorrect: false },
      { id: 'D', text: 'To encrypt all user files', isCorrect: false }
    ],
    explanation: 'A firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.',
    correctAnswer: 'B',
    hints: ['Think about network security', 'It controls traffic between networks']
  },
  {
    id: 'Q-002',
    text: 'Which Linux command displays the current directory contents?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    domain: 'Linux',
    points: 10,
    options: [
      { id: 'A', text: 'dir', isCorrect: false },
      { id: 'B', text: 'ls', isCorrect: true },
      { id: 'C', text: 'cd', isCorrect: false },
      { id: 'D', text: 'pwd', isCorrect: false }
    ],
    explanation: 'The ls command is used to list directory contents in Linux.',
    correctAnswer: 'B',
    hints: ['Commonly used command', 'Starts with l']
  },
  {
    id: 'Q-003',
    text: 'What does the principle of least privilege state?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    domain: 'General Security',
    points: 15,
    options: [
      { id: 'A', text: 'Users should have the minimum access necessary to perform their jobs', isCorrect: true },
      { id: 'B', text: 'All users should have administrative privileges', isCorrect: false },
      { id: 'C', text: 'Privileges should be assigned randomly', isCorrect: false },
      { id: 'D', text: 'Users should share accounts to save resources', isCorrect: false }
    ],
    explanation: 'The principle of least privilege is a security concept that limits user access rights to only what is strictly required to do their work.',
    correctAnswer: 'A',
    hints: ['Security best practice', 'Minimize access']
  },
  {
    id: 'Q-004',
    text: 'Which Windows command shows all running processes?',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    domain: 'Windows',
    points: 10,
    options: [
      { id: 'A', text: 'tasklist', isCorrect: true },
      { id: 'B', text: 'ps', isCorrect: false },
      { id: 'C', text: 'netstat', isCorrect: false },
      { id: 'D', text: 'ipconfig', isCorrect: false }
    ],
    explanation: 'The tasklist command in Windows displays all currently running processes.',
    correctAnswer: 'A',
    hints: ['Windows command', 'Related to tasks']
  },
  {
    id: 'Q-005',
    text: 'Explain the difference between symmetric and asymmetric encryption.',
    type: QUESTION_TYPES.ESSAY,
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    domain: 'Cryptography',
    points: 25,
    options: [],
    explanation: 'Symmetric encryption uses the same key for encryption and decryption, while asymmetric encryption uses a pair of keys (public and private). Symmetric is faster but has key distribution challenges, while asymmetric is more secure for key exchange.',
    correctAnswer: '',
    hints: ['Key usage', 'Performance vs security', 'Common algorithms']
  },
  {
    id: 'Q-006',
    text: 'Identify the security vulnerability in the following code: const password = "admin123";',
    type: QUESTION_TYPES.CODING,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    domain: 'Web Security',
    points: 20,
    options: [],
    explanation: 'The password is stored in plaintext and hardcoded in the source code. It should be hashed and stored securely, and never hardcoded.',
    correctAnswer: 'Hardcoded plaintext password',
    hints: ['Storage method', 'Security best practice', 'Visibility']
  }
];

// Get assessments by type
export const getAssessmentsByType = (type) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => assessment.type === type);
};

// Get assessments by domain
export const getAssessmentsByDomain = (domain) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => assessment.domain === domain);
};

// Get assessments by difficulty
export const getAssessmentsByDifficulty = (difficulty) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => assessment.difficulty === difficulty);
};

// Get assessments by status
export const getAssessmentsByStatus = (status) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => assessment.status === status);
};

// Get assessments by course
export const getAssessmentsByCourse = (courseId) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => assessment.courseId === courseId);
};

// Get available assessments for a student
export const getAvailableAssessments = (studentId, studentProgress) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => {
    // Check if student meets prerequisites
    if (assessment.prerequisites && assessment.prerequisites.length > 0) {
      const hasPrerequisites = assessment.prerequisites.every(prereq => 
        studentProgress.completedCourses?.includes(prereq)
      );
      if (!hasPrerequisites) return false;
    }
    
    // Check if assessment is published and available
    if (!assessment.isPublished) return false;
    
    // Check if student has already completed this assessment
    if (studentProgress.completedAssessments?.includes(assessment.id)) return false;
    
    // Check if assessment is for student's level
    if (assessment.level > (studentProgress.level || 1)) return false;
    
    return true;
  });
};

// Get recent assessments
export const getRecentAssessments = (limit = 5) => {
  return [...SAMPLE_ASSESSMENTS]
    .sort((a, b) => new Date(b.metadata?.createdAt || b.publishedAt) - new Date(a.metadata?.createdAt || a.publishedAt))
    .slice(0, limit);
};

// Get popular assessments
export const getPopularAssessments = (limit = 5) => {
  return [...SAMPLE_ASSESSMENTS]
    .sort((a, b) => (b.metadata?.attempts || 0) - (a.metadata?.attempts || 0))
    .slice(0, limit);
};

// Get assessments by difficulty
export const getAssessmentsByLevel = (level) => {
  return SAMPLE_ASSESSMENTS.filter(assessment => assessment.level === level);
};

// Search assessments by title, description, or domain
export const searchAssessments = (query) => {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_ASSESSMENTS.filter(assessment => 
    assessment.title.toLowerCase().includes(lowerQuery) ||
    assessment.description.toLowerCase().includes(lowerQuery) ||
    assessment.domain.toLowerCase().includes(lowerQuery) ||
    assessment.code.toLowerCase().includes(lowerQuery) ||
    assessment.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get assessment statistics
export const getAssessmentStats = () => {
  const total = SAMPLE_ASSESSMENTS.length;
  const byType = {};
  const byDomain = {};
  const byDifficulty = {};
  const byStatus = {};

  SAMPLE_ASSESSMENTS.forEach(assessment => {
    byType[assessment.type] = (byType[assessment.type] || 0) + 1;
    byDomain[assessment.domain] = (byDomain[assessment.domain] || 0) + 1;
    byDifficulty[assessment.difficulty] = (byDifficulty[assessment.difficulty] || 0) + 1;
    byStatus[assessment.status] = (byStatus[assessment.status] || 0) + 1;
  });

  return {
    total,
    byType,
    byDomain,
    byDifficulty,
    byStatus,
    published: SAMPLE_ASSESSMENTS.filter(a => a.isPublished).length,
    draft: SAMPLE_ASSESSMENTS.filter(a => !a.isPublished).length,
    available: SAMPLE_ASSESSMENTS.filter(a => a.status === ASSESSMENT_STATES.OPEN || a.status === ASSESSMENT_STATES.ELIGIBLE).length
  };
};

// Get questions by assessment
export const getQuestionsByAssessment = (assessmentId) => {
  const assessment = SAMPLE_ASSESSMENTS.find(a => a.id === assessmentId);
  if (!assessment || !assessment.questions) return [];
  return assessment.questions;
};

// Get random questions for a quiz
export const getRandomQuestions = (domain, difficulty, count = 10) => {
  const domainQuestions = SAMPLE_QUESTIONS.filter(q => q.domain === domain);
  const difficultyQuestions = domainQuestions.filter(q => q.difficulty === difficulty);
  
  return difficultyQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
};

// Default export
export default {
  SAMPLE_ASSESSMENTS,
  SAMPLE_QUESTIONS,
  ASSESSMENT_TYPES,
  ASSESSMENT_STATES,
  ASSESSMENT_CATEGORIES,
  ASSESSMENT_RESTRICTIONS,
  QUESTION_TYPES,
  DEFAULT_ASSESSMENT_SETTINGS,
  DEFAULT_ASSESSMENT_STRUCTURE,
  getAssessmentsByType,
  getAssessmentsByDomain,
  getAssessmentsByDifficulty,
  getAssessmentsByStatus,
  getAssessmentsByCourse,
  getAssessmentsByLevel,
  getAvailableAssessments,
  getRecentAssessments,
  getPopularAssessments,
  searchAssessments,
  getAssessmentStats,
  getQuestionsByAssessment,
  getRandomQuestions
};