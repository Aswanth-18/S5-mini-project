/**
 * CyberNex - Results Mock Data
 * Sample assessment result records for development and testing
 */

import { SAMPLE_RESULTS, ASSESSMENT_STATES } from '../utils/constants';

// Sample results (re-exported from constants)
export { SAMPLE_RESULTS, ASSESSMENT_STATES };

// Result statuses
export const RESULT_STATUSES = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  PASSED: 'passed',
  FAILED: 'failed',
  REVIEWING: 'reviewing',
  RETAKEN: 'retaken'
};

// Grade types
export const GRADE_TYPES = {
  PERCENTAGE: 'percentage',
  LETTER: 'letter',
  GPA: 'gpa',
  PASS_FAIL: 'pass_fail'
};

// Default result structure
export const DEFAULT_RESULT_STRUCTURE = {
  id: '',
  studentId: '',
  studentName: '',
  assessmentId: '',
  assessmentTitle: '',
  assessmentType: '',
  courseId: '',
  courseTitle: '',
  domain: '',
  score: 0,
  totalPoints: 100,
  percentage: 0,
  timeTaken: 0,
  timeLimit: 0,
  attempts: 1,
  maxAttempts: 1,
  status: RESULT_STATUSES.IN_PROGRESS,
  grade: '',
  feedback: '',
  detailedResults: [],
  answers: [],
  startedAt: '',
  submittedAt: '',
  gradedAt: '',
  gradedBy: '',
  gradedByName: '',
  published: false,
  publishedAt: '',
  publishedBy: '',
  publishedByName: '',
  certificateId: '',
  xpEarned: 0,
  streakUpdated: false,
  newStreak: 0,
  notes: '',
  metadata: {
    createdAt: '',
    updatedAt: '',
    version: 1
  }
};

// Additional sample results
export const ADDITIONAL_RESULTS = [
  {
    id: 'RESULT-001',
    studentId: 'STUDENT-001',
    studentName: 'John Doe',
    assessmentId: 'ASSESSMENT-001',
    assessmentTitle: 'Computer Fundamentals Quiz',
    assessmentType: 'Knowledge Assessment',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    domain: 'General',
    score: 85,
    totalPoints: 100,
    percentage: 85,
    timeTaken: 1800,
    timeLimit: 3600,
    attempts: 1,
    maxAttempts: 2,
    status: ASSESSMENT_STATES.PASSED,
    grade: 'B',
    feedback: 'Excellent work! You demonstrated strong understanding of computer fundamentals.',
    detailedResults: [
      { questionId: 'Q-001', pointsEarned: 10, pointsPossible: 10, correct: true, timeSpent: 120 },
      { questionId: 'Q-002', pointsEarned: 8, pointsPossible: 10, correct: false, timeSpent: 90 },
      { questionId: 'Q-003', pointsEarned: 10, pointsPossible: 10, correct: true, timeSpent: 150 }
    ],
    answers: [
      { questionId: 'Q-001', answer: 'B', correct: true },
      { questionId: 'Q-002', answer: 'A', correct: false },
      { questionId: 'Q-003', answer: 'A', correct: true }
    ],
    startedAt: '2025-01-15T09:00:00Z',
    submittedAt: '2025-01-15T09:30:00Z',
    gradedAt: '2025-01-15T10:00:00Z',
    gradedBy: 'FACULTY-001',
    gradedByName: 'Dr. Sarah Johnson',
    published: true,
    publishedAt: '2025-01-15T10:00:00Z',
    publishedBy: 'FACULTY-001',
    publishedByName: 'Dr. Sarah Johnson',
    certificateId: 'CERT-001',
    xpEarned: 85,
    streakUpdated: true,
    newStreak: 3,
    notes: 'First attempt, passed with flying colors',
    metadata: {
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      version: 1
    }
  },
  {
    id: 'RESULT-002',
    studentId: 'STUDENT-002',
    studentName: 'Jane Smith',
    assessmentId: 'ASSESSMENT-001',
    assessmentTitle: 'Computer Fundamentals Quiz',
    assessmentType: 'Knowledge Assessment',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    domain: 'General',
    score: 92,
    totalPoints: 100,
    percentage: 92,
    timeTaken: 1200,
    timeLimit: 3600,
    attempts: 1,
    maxAttempts: 2,
    status: ASSESSMENT_STATES.PASSED,
    grade: 'A',
    feedback: 'Outstanding performance! Perfect understanding of the material.',
    detailedResults: [
      { questionId: 'Q-001', pointsEarned: 10, pointsPossible: 10, correct: true, timeSpent: 80 },
      { questionId: 'Q-002', pointsEarned: 10, pointsPossible: 10, correct: true, timeSpent: 60 },
      { questionId: 'Q-003', pointsEarned: 10, pointsPossible: 10, correct: true, timeSpent: 90 }
    ],
    answers: [
      { questionId: 'Q-001', answer: 'B', correct: true },
      { questionId: 'Q-002', answer: 'B', correct: true },
      { questionId: 'Q-003', answer: 'A', correct: true }
    ],
    startedAt: '2025-01-15T09:15:00Z',
    submittedAt: '2025-01-15T09:35:00Z',
    gradedAt: '2025-01-15T10:00:00Z',
    gradedBy: 'FACULTY-001',
    gradedByName: 'Dr. Sarah Johnson',
    published: true,
    publishedAt: '2025-01-15T10:00:00Z',
    publishedBy: 'FACULTY-001',
    publishedByName: 'Dr. Sarah Johnson',
    certificateId: 'CERT-002',
    xpEarned: 92,
    streakUpdated: true,
    newStreak: 5,
    notes: 'Perfect score on first attempt',
    metadata: {
      createdAt: '2025-01-15T09:15:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      version: 1
    }
  },
  {
    id: 'RESULT-003',
    studentId: 'STUDENT-003',
    studentName: 'Mike Wilson',
    assessmentId: 'ASSESSMENT-001',
    assessmentTitle: 'Computer Fundamentals Quiz',
    assessmentType: 'Knowledge Assessment',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    domain: 'General',
    score: 68,
    totalPoints: 100,
    percentage: 68,
    timeTaken: 2500,
    timeLimit: 3600,
    attempts: 1,
    maxAttempts: 2,
    status: ASSESSMENT_STATES.FAILED,
    grade: 'D',
    feedback: 'Good attempt but needs improvement. Focus on hardware concepts and review the lesson materials.',
    detailedResults: [
      { questionId: 'Q-001', pointsEarned: 10, pointsPossible: 10, correct: true, timeSpent: 180 },
      { questionId: 'Q-002', pointsEarned: 5, pointsPossible: 10, correct: false, timeSpent: 150 },
      { questionId: 'Q-003', pointsEarned: 8, pointsPossible: 10, correct: false, timeSpent: 200 }
    ],
    answers: [
      { questionId: 'Q-001', answer: 'B', correct: true },
      { questionId: 'Q-002', answer: 'C', correct: false },
      { questionId: 'Q-003', answer: 'B', correct: false }
    ],
    startedAt: '2025-01-15T09:30:00Z',
    submittedAt: '2025-01-15T10:10:00Z',
    gradedAt: '2025-01-15T10:30:00Z',
    gradedBy: 'FACULTY-001',
    gradedByName: 'Dr. Sarah Johnson',
    published: true,
    publishedAt: '2025-01-15T10:30:00Z',
    publishedBy: 'FACULTY-001',
    publishedByName: 'Dr. Sarah Johnson',
    certificateId: '',
    xpEarned: 68,
    streakUpdated: false,
    newStreak: 0,
    notes: 'Needs to retake the assessment',
    metadata: {
      createdAt: '2025-01-15T09:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      version: 1
    }
  },
  {
    id: 'RESULT-004',
    studentId: 'STUDENT-004',
    studentName: 'Emily Brown',
    assessmentId: 'ASSESSMENT-002',
    assessmentTitle: 'Network Security Basics',
    assessmentType: 'Knowledge Assessment',
    courseId: 'COURSE-002',
    courseTitle: 'Network Security Basics',
    domain: 'Network Security',
    score: 78,
    totalPoints: 100,
    percentage: 78,
    timeTaken: 3000,
    timeLimit: 3600,
    attempts: 1,
    maxAttempts: 2,
    status: ASSESSMENT_STATES.PASSED,
    grade: 'C',
    feedback: 'Good performance. Shows understanding of network security concepts but could improve on practical applications.',
    detailedResults: [],
    answers: [],
    startedAt: '2025-01-16T13:00:00Z',
    submittedAt: '2025-01-16T13:50:00Z',
    gradedAt: '2025-01-16T14:30:00Z',
    gradedBy: 'FACULTY-002',
    gradedByName: 'Prof. Michael Chen',
    published: true,
    publishedAt: '2025-01-16T14:30:00Z',
    publishedBy: 'FACULTY-002',
    publishedByName: 'Prof. Michael Chen',
    certificateId: 'CERT-003',
    xpEarned: 78,
    streakUpdated: true,
    newStreak: 2,
    notes: 'Passed but could improve',
    metadata: {
      createdAt: '2025-01-16T13:00:00Z',
      updatedAt: '2025-01-16T14:30:00Z',
      version: 1
    }
  },
  {
    id: 'RESULT-005',
    studentId: 'STUDENT-001',
    studentName: 'John Doe',
    assessmentId: 'ASSESSMENT-002',
    assessmentTitle: 'Network Security Basics',
    assessmentType: 'Knowledge Assessment',
    courseId: 'COURSE-002',
    courseTitle: 'Network Security Basics',
    domain: 'Network Security',
    score: 95,
    totalPoints: 100,
    percentage: 95,
    timeTaken: 1800,
    timeLimit: 3600,
    attempts: 1,
    maxAttempts: 2,
    status: ASSESSMENT_STATES.PASSED,
    grade: 'A+',
    feedback: 'Exceptional performance! Demonstrated advanced understanding of network security concepts.',
    detailedResults: [],
    answers: [],
    startedAt: '2025-01-16T13:00:00Z',
    submittedAt: '2025-01-16T13:30:00Z',
    gradedAt: '2025-01-16T14:00:00Z',
    gradedBy: 'FACULTY-002',
    gradedByName: 'Prof. Michael Chen',
    published: true,
    publishedAt: '2025-01-16T14:00:00Z',
    publishedBy: 'FACULTY-002',
    publishedByName: 'Prof. Michael Chen',
    certificateId: 'CERT-004',
    xpEarned: 95,
    streakUpdated: true,
    newStreak: 4,
    notes: 'Outstanding performance',
    metadata: {
      createdAt: '2025-01-16T13:00:00Z',
      updatedAt: '2025-01-16T14:00:00Z',
      version: 1
    }
  }
];

// Get all results (combine constants and additional)
export const ALL_RESULTS = [...SAMPLE_RESULTS, ...ADDITIONAL_RESULTS];

// Get results by student
export const getResultsByStudent = (studentId) => {
  return ALL_RESULTS.filter(result => result.studentId === studentId);
};

// Get results by assessment
export const getResultsByAssessment = (assessmentId) => {
  return ALL_RESULTS.filter(result => result.assessmentId === assessmentId);
};

// Get results by course
export const getResultsByCourse = (courseId) => {
  return ALL_RESULTS.filter(result => result.courseId === courseId);
};

// Get results by status
export const getResultsByStatus = (status) => {
  return ALL_RESULTS.filter(result => result.status === status);
};

// Get results by grade
export const getResultsByGrade = (grade) => {
  return ALL_RESULTS.filter(result => result.grade === grade);
};

// Get results by domain
export const getResultsByDomain = (domain) => {
  return ALL_RESULTS.filter(result => result.domain === domain);
};

// Get passed results
export const getPassedResults = () => {
  return ALL_RESULTS.filter(result => result.status === ASSESSMENT_STATES.PASSED);
};

// Get failed results
export const getFailedResults = () => {
  return ALL_RESULTS.filter(result => result.status === ASSESSMENT_STATES.FAILED);
};

// Get unpublished results
export const getUnpublishedResults = () => {
  return ALL_RESULTS.filter(result => !result.published);
};

// Get results by date range
export const getResultsByDateRange = (startDate, endDate) => {
  return ALL_RESULTS.filter(result => {
    if (!result.submittedAt) return false;
    const submittedDate = new Date(result.submittedAt);
    return submittedDate >= new Date(startDate) && submittedDate <= new Date(endDate);
  });
};

// Get recent results
export const getRecentResults = (limit = 5) => {
  return [...ALL_RESULTS]
    .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
    .slice(0, limit);
};

// Get student's best results
export const getBestResults = (studentId, limit = 5) => {
  const studentResults = getResultsByStudent(studentId);
  return [...studentResults]
    .filter(result => result.status === ASSESSMENT_STATES.PASSED)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, limit);
};

// Get results by grader
export const getResultsByGrader = (graderId) => {
  return ALL_RESULTS.filter(result => result.gradedBy === graderId);
};

// Search results by student, assessment, or course
export const searchResults = (query) => {
  const lowerQuery = query.toLowerCase();
  return ALL_RESULTS.filter(result => 
    result.studentName.toLowerCase().includes(lowerQuery) ||
    result.studentId.toLowerCase().includes(lowerQuery) ||
    result.assessmentTitle.toLowerCase().includes(lowerQuery) ||
    result.assessmentId.toLowerCase().includes(lowerQuery) ||
    result.courseTitle.toLowerCase().includes(lowerQuery) ||
    result.courseId.toLowerCase().includes(lowerQuery) ||
    result.domain.toLowerCase().includes(lowerQuery)
  );
};

// Get result statistics
export const getResultStats = () => {
  const total = ALL_RESULTS.length;
  const byStatus = {};
  const byGrade = {};
  const byDomain = {};
  const byCourse = {};

  ALL_RESULTS.forEach(result => {
    byStatus[result.status] = (byStatus[result.status] || 0) + 1;
    byGrade[result.grade] = (byGrade[result.grade] || 0) + 1;
    byDomain[result.domain] = (byDomain[result.domain] || 0) + 1;
    byCourse[result.courseId] = (byCourse[result.courseId] || 0) + 1;
  });

  const passed = getPassedResults().length;
  const failed = getFailedResults().length;
  const published = ALL_RESULTS.filter(r => r.published).length;
  const unpublished = ALL_RESULTS.filter(r => !r.published).length;

  return {
    total,
    byStatus,
    byGrade,
    byDomain,
    byCourse,
    passed,
    failed,
    published,
    unpublished,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    averageScore: total > 0 ? Math.round(ALL_RESULTS.reduce((sum, r) => sum + r.percentage, 0) / total) : 0
  };
};

// Get student performance summary
export const getStudentPerformanceSummary = (studentId) => {
  const studentResults = getResultsByStudent(studentId);
  if (studentResults.length === 0) return null;

  const passed = studentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
  const failed = studentResults.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;
  const totalAttempts = studentResults.length;
  const averageScore = studentResults.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts;
  const totalXP = studentResults.reduce((sum, r) => sum + r.xpEarned, 0);
  
  // Get best domains
  const domainStats = {};
  studentResults.forEach(result => {
    if (!domainStats[result.domain]) {
      domainStats[result.domain] = { scores: [], count: 0 };
    }
    domainStats[result.domain].scores.push(result.percentage);
    domainStats[result.domain].count++;
  });

  const bestDomains = Object.entries(domainStats)
    .map(([domain, stats]) => ({
      domain,
      averageScore: stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length,
      count: stats.count
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);

  return {
    studentId,
    totalAttempts,
    passed,
    failed,
    passRate: totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0,
    averageScore: Math.round(averageScore),
    totalXP,
    bestDomains,
    currentStreak: studentResults.length > 0 ? Math.max(...studentResults.map(r => r.newStreak || 0)) : 0
  };
};

// Get class performance summary
export const getClassPerformanceSummary = (courseId, assessmentId) => {
  let results = ALL_RESULTS;
  
  if (courseId) {
    results = results.filter(r => r.courseId === courseId);
  }
  
  if (assessmentId) {
    results = results.filter(r => r.assessmentId === assessmentId);
  }

  if (results.length === 0) return null;

  const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
  const passed = results.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
  const total = results.length;

  return {
    courseId,
    assessmentId,
    totalSubmissions: total,
    passed,
    failed: total - passed,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    averageScore: Math.round(averageScore),
    highestScore: Math.max(...results.map(r => r.percentage)) || 0,
    lowestScore: Math.min(...results.map(r => r.percentage)) || 0
  };
};

// Default export
export default {
  SAMPLE_RESULTS,
  ADDITIONAL_RESULTS,
  ALL_RESULTS,
  RESULT_STATUSES,
  GRADE_TYPES,
  DEFAULT_RESULT_STRUCTURE,
  getResultsByStudent,
  getResultsByAssessment,
  getResultsByCourse,
  getResultsByStatus,
  getResultsByGrade,
  getResultsByDomain,
  getPassedResults,
  getFailedResults,
  getUnpublishedResults,
  getResultsByDateRange,
  getRecentResults,
  getBestResults,
  getResultsByGrader,
  searchResults,
  getResultStats,
  getStudentPerformanceSummary,
  getClassPerformanceSummary
};