/**
 * CyberNex - Labs Mock Data
 * Sample practice lab records for development and testing
 */

import { SAMPLE_LABS, CYBER_DOMAINS, DIFFICULTY_LEVELS } from '../utils/constants';

// Sample labs (re-exported from constants)
export { SAMPLE_LABS, CYBER_DOMAINS, DIFFICULTY_LEVELS };

// Lab statuses
export const LAB_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  MAINTENANCE: 'maintenance'
};

// Lab types
export const LAB_TYPES = {
  TUTORIAL: 'Tutorial',
  HANDS_ON: 'Hands-on',
  CHALLENGE: 'Challenge',
  CTF: 'Capture The Flag',
  PROJECT: 'Project',
  SIMULATION: 'Simulation'
};

// Lab environments
export const LAB_ENVIRONMENTS = {
  LINUX: 'Linux',
  WINDOWS: 'Windows',
  WEB: 'Web Browser',
  NETWORK: 'Network Simulator',
  VM: 'Virtual Machine',
  CONTAINER: 'Docker Container',
  CLOUD: 'Cloud Environment'
};

// Default lab structure
export const DEFAULT_LAB_STRUCTURE = {
  id: '',
  title: '',
  code: '',
  description: '',
  domain: '',
  type: LAB_TYPES.HANDS_ON,
  environment: LAB_ENVIRONMENTS.LINUX,
  difficulty: DIFFICULTY_LEVELS.BEGINNER,
  level: 1,
  estimatedTime: 0,
  isPublished: false,
  status: LAB_STATUSES.DRAFT,
  featured: false,
  popularity: 0,
  rating: 0,
  prerequisites: [],
  learningObjectives: [],
  tasks: [],
  resources: [],
  hints: [],
  solution: '',
  tags: [],
  settings: {
    maxAttempts: 3,
    timeLimit: 0,
    autoReset: true,
    showHints: true,
    hintPenalty: 0
  },
  metadata: {
    createdBy: '',
    createdByName: '',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
    version: 1
  }
};

// Sample lab tasks
export const SAMPLE_LAB_TASKS = [
  {
    id: 'TASK-001',
    title: 'Basic Linux Commands',
    description: 'Practice basic Linux commands in a terminal environment',
    steps: [
      'Open a terminal',
      'List directory contents using ls',
      'Navigate to /home directory',
      'Create a new file called test.txt',
      'View the contents of /etc/passwd file'
    ],
    commands: [
      { command: 'ls', description: 'List directory contents' },
      { command: 'cd /home', description: 'Change to home directory' },
      { command: 'touch test.txt', description: 'Create a new file' },
      { command: 'cat /etc/passwd', description: 'View file contents' }
    ],
    expectedOutput: '',
    validation: 'command_output',
    points: 10
  },
  {
    id: 'TASK-002',
    title: 'Network Scanning',
    description: 'Perform basic network scanning using nmap',
    steps: [
      'Install nmap if not available',
      'Scan localhost for open ports',
      'Identify the open ports and services',
      'Save scan results to a file'
    ],
    commands: [
      { command: 'sudo apt install nmap -y', description: 'Install nmap' },
      { command: 'nmap -sS 127.0.0.1', description: 'TCP SYN scan' },
      { command: 'nmap -O 127.0.0.1', description: 'OS detection' },
      { command: 'nmap -sS 127.0.0.1 -oN scan_results.txt', description: 'Save results' }
    ],
    expectedOutput: '',
    validation: 'file_exists:scan_results.txt',
    points: 20
  },
  {
    id: 'TASK-003',
    title: 'Web Vulnerability Scanning',
    description: 'Use a web vulnerability scanner to identify security issues',
    steps: [
      'Start the vulnerable web application',
      'Run a vulnerability scan',
      'Identify at least 3 vulnerabilities',
      'Document the findings'
    ],
    commands: [],
    expectedOutput: '',
    validation: 'manual_review',
    points: 30
  }
];

// Lab difficulty levels
export const LAB_DIFFICULTY = {
  BEGINNER: 'Beginner',
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert'
};

// Get labs by domain
export const getLabsByDomain = (domain) => {
  return SAMPLE_LABS.filter(lab => lab.domain === domain);
};

// Get labs by difficulty
export const getLabsByDifficulty = (difficulty) => {
  return SAMPLE_LABS.filter(lab => lab.difficulty === difficulty);
};

// Get labs by type
export const getLabsByType = (type) => {
  return SAMPLE_LABS.filter(lab => lab.type === type);
};

// Get labs by environment
export const getLabsByEnvironment = (environment) => {
  return SAMPLE_LABS.filter(lab => lab.environment === environment);
};

// Get labs by level
export const getLabsByLevel = (level) => {
  return SAMPLE_LABS.filter(lab => lab.level === level);
};

// Get featured labs
export const getFeaturedLabs = () => {
  return SAMPLE_LABS.filter(lab => lab.featured);
};

// Get popular labs
export const getPopularLabs = (limit = 5) => {
  return [...SAMPLE_LABS]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

// Get recent labs
export const getRecentLabs = (limit = 5) => {
  return [...SAMPLE_LABS]
    .sort((a, b) => new Date(b.metadata?.createdAt || b.publishedAt) - new Date(a.metadata?.createdAt || a.publishedAt))
    .slice(0, limit);
};

// Get labs by creator
export const getLabsByCreator = (creatorId) => {
  return SAMPLE_LABS.filter(lab => lab.metadata?.createdBy === creatorId);
};

// Search labs by title, description, or domain
export const searchLabs = (query) => {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_LABS.filter(lab => 
    lab.title.toLowerCase().includes(lowerQuery) ||
    lab.description.toLowerCase().includes(lowerQuery) ||
    lab.domain.toLowerCase().includes(lowerQuery) ||
    lab.code.toLowerCase().includes(lowerQuery) ||
    lab.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get lab statistics
export const getLabStats = () => {
  const total = SAMPLE_LABS.length;
  const byDomain = {};
  const byDifficulty = {};
  const byType = {};
  const byEnvironment = {};

  SAMPLE_LABS.forEach(lab => {
    byDomain[lab.domain] = (byDomain[lab.domain] || 0) + 1;
    byDifficulty[lab.difficulty] = (byDifficulty[lab.difficulty] || 0) + 1;
    byType[lab.type] = (byType[lab.type] || 0) + 1;
    byEnvironment[lab.environment] = (byEnvironment[lab.environment] || 0) + 1;
  });

  return {
    total,
    byDomain,
    byDifficulty,
    byType,
    byEnvironment,
    featured: SAMPLE_LABS.filter(l => l.featured).length,
    published: SAMPLE_LABS.filter(l => l.isPublished).length,
    draft: SAMPLE_LABS.filter(l => !l.isPublished).length
  };
};

// Get lab progress for a student
export const getLabProgress = (studentId, labId) => {
  const lab = SAMPLE_LABS.find(l => l.id === labId);
  if (!lab) return null;

  const totalTasks = lab.tasks?.length || 0;
  const completedTasks = Math.floor(totalTasks * 0.6); // Simulate 60% completion

  return {
    labId,
    labTitle: lab.title,
    totalTasks,
    completedTasks,
    completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    status: completedTasks === totalTasks ? 'completed' : completedTasks > 0 ? 'in_progress' : 'not_started',
    lastAccessed: new Date().toISOString()
  };
};

// Default export
export default {
  SAMPLE_LABS,
  LAB_STATUSES,
  LAB_TYPES,
  LAB_ENVIRONMENTS,
  LAB_DIFFICULTY,
  DEFAULT_LAB_STRUCTURE,
  SAMPLE_LAB_TASKS,
  getLabsByDomain,
  getLabsByDifficulty,
  getLabsByType,
  getLabsByEnvironment,
  getLabsByLevel,
  getFeaturedLabs,
  getPopularLabs,
  getRecentLabs,
  getLabsByCreator,
  searchLabs,
  getLabStats,
  getLabProgress
};