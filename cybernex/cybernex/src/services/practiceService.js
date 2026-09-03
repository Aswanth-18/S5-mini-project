/**
 * CyberNex - Practice Service
 *
 * Service layer for practice lab management operations.
 * Handles creation, management, and tracking of practice laboratories.
 */

import {
  getLabs, setLabs, addLab, updateLab, deleteLab,
  getUsers, getCourses,
  logAction
} from './storageService';
import {
  ROLES,
  CYBER_DOMAINS,
  DIFFICULTY_LEVELS,
  LAB_CATEGORIES,
  LAB_DIFFICULTY
} from '../utils/constants';
import UserService from './userService';
import CourseService from './courseService';

// ===== PRACTICE SERVICE =====
class PracticeService {
  /**
   * Get all practice labs
   * @param {object} options - Filter options
   * @returns {Promise<Array>} - Array of labs
   */
  static async getAllLabs(options = {}) {
    try {
      let labs = await getLabs();

      // Apply filters
      if (options.domain) {
        labs = labs.filter(l => l.domain === options.domain);
      }

      if (options.category) {
        labs = labs.filter(l => l.category === options.category);
      }

      if (options.difficulty) {
        labs = labs.filter(l => l.difficulty === options.difficulty);
      }

      if (options.courseId) {
        labs = labs.filter(l => l.courseId === options.courseId);
      }

      if (options.search) {
        const query = options.search.toLowerCase();
        labs = labs.filter(l =>
          l.title.toLowerCase().includes(query) ||
          l.id.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          (l.tags && l.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }

      if (options.isActive !== undefined) {
        labs = labs.filter(l => l.isActive === options.isActive);
      }

      return labs;
    } catch (error) {
      console.error('Error getting labs:', error);
      throw error;
    }
  }

  /**
   * Get lab by ID
   * @param {string} labId - Lab ID
   * @returns {Promise<object|null>} - Lab or null
   */
  static async getLabById(labId) {
    try {
      const labs = await getLabs();
      return labs.find(l => l.id === labId) || null;
    } catch (error) {
      console.error('Error getting lab by ID:', error);
      throw error;
    }
  }

  /**
   * Get lab by slug
   * @param {string} slug - Lab slug
   * @returns {Promise<object|null>} - Lab or null
   */
  static async getLabBySlug(slug) {
    try {
      const labs = await getLabs();
      return labs.find(l => l.slug === slug) || null;
    } catch (error) {
      console.error('Error getting lab by slug:', error);
      throw error;
    }
  }

  /**
   * Create a new practice lab
   * @param {object} labData - Lab data
   * @param {string} createdBy - ID of user creating the lab
   * @returns {Promise<object>} - Created lab
   */
  static async createLab(labData, createdBy = null) {
    try {
      // Validate required fields
      if (!labData.title || !labData.domain || !labData.category) {
        throw new Error('Title, domain, and category are required');
      }

      // Generate ID and slug
      const id = `LAB-${labData.category.substring(0, 3).toUpperCase()}-${Date.now()}`;
      const slug = labData.title.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .substring(0, 50);

      // Set default values
      const newLab = {
        id,
        slug,
        title: labData.title,
        description: labData.description || '',
        domain: labData.domain,
        category: labData.category,
        difficulty: labData.difficulty || DIFFICULTY_LEVELS.EASY,
        estimatedTime: labData.estimatedTime || 30, // minutes
        objectives: labData.objectives || [],
        prerequisites: labData.prerequisites || [],
        environment: labData.environment || '',
        tasks: labData.tasks || [],
        hints: labData.hints || [],
        flags: labData.flags || {},
        isActive: labData.isActive !== undefined ? labData.isActive : true,
        access: labData.access || 'public', // public, department, private
        courseId: labData.courseId || null,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        completionCount: 0,
        averageScore: 0
      };

      // Add to storage
      await addLab(newLab);

      // Log action
      logAction({
        action: 'LAB_CREATED',
        userId: createdBy || 'system',
        role: ROLES.FACULTY,
        target: 'Lab',
        targetId: newLab.id,
        status: 'Success',
        details: {
          title: newLab.title,
          domain: newLab.domain,
          category: newLab.category,
          difficulty: newLab.difficulty
        }
      });

      return newLab;
    } catch (error) {
      console.error('Error creating lab:', error);
      throw error;
    }
  }

  /**
   * Update a practice lab
   * @param {string} labId - Lab ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated lab
   */
  static async updateLab(labId, updates, updatedBy = null) {
    try {
      const oldLab = await this.getLabById(labId);
      if (!oldLab) {
        throw new Error('Lab not found');
      }

      // Update slug if title changed
      if (updates.title && updates.title !== oldLab.title) {
        updates.slug = updates.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .substring(0, 50);
      }

      // Add metadata
      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();
      updates.version = (oldLab.version || 1) + 1;

      const updatedLab = await updateLab(labId, updates);

      // Log action
      logAction({
        action: 'LAB_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          title: updatedLab.title,
          oldTitle: oldLab.title,
          changes: Object.keys(updates).filter(k =>
            k !== 'updatedBy' && k !== 'updatedAt' && k !== 'version' && k !== 'slug'
          )
        }
      });

      return updatedLab;
    } catch (error) {
      console.error('Error updating lab:', error);
      throw error;
    }
  }

  /**
   * Delete a practice lab
   * @param {string} labId - Lab ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteLab(labId, deletedBy = null) {
    try {
      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      await deleteLab(labId);

      // Log action
      logAction({
        action: 'LAB_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          title: lab.title,
          domain: lab.domain
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting lab:', error);
      throw error;
    }
  }

  /**
   * Activate a lab
   * @param {string} labId - Lab ID
   * @param {string} activatedBy - ID of user activating
   * @returns {Promise<object>} - Updated lab
   */
  static async activateLab(labId, activatedBy = null) {
    try {
      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      if (lab.isActive) {
        return lab; // Already active
      }

      const updates = {
        isActive: true,
        activatedAt: new Date().toISOString(),
        activatedBy: activatedBy
      };

      const updatedLab = await this.updateLab(labId, updates, activatedBy);

      // Log action
      logAction({
        action: 'LAB_ACTIVATED',
        userId: activatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          title: updatedLab.title
        }
      });

      return updatedLab;
    } catch (error) {
      console.error('Error activating lab:', error);
      throw error;
    }
  }

  /**
   * Deactivate a lab
   * @param {string} labId - Lab ID
   * @param {string} deactivatedBy - ID of user deactivating
   * @returns {Promise<object>} - Updated lab
   */
  static async deactivateLab(labId, deactivatedBy = null) {
    try {
      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      if (!lab.isActive) {
        return lab; // Already inactive
      }

      const updates = {
        isActive: false,
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: deactivatedBy
      };

      const updatedLab = await this.updateLab(labId, updates, deactivatedBy);

      // Log action
      logAction({
        action: 'LAB_DEACTIVATED',
        userId: deactivatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          title: updatedLab.title
        }
      });

      return updatedLab;
    } catch (error) {
      console.error('Error deactivating lab:', error);
      throw error;
    }
  }

  /**
   * Start a practice lab for a user
   * @param {string} labId - Lab ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Lab attempt data
   */
  static async startLab(labId, userId) {
    try {
      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if lab is active
      if (!lab.isActive) {
        throw new Error('This lab is not currently active');
      }

      // Check if user has access
      const hasAccess = this.checkUserAccess(lab, user);
      if (!hasAccess) {
        throw new Error('You do not have access to this lab');
      }

      // Check if user has completed prerequisites
      if (lab.prerequisites && lab.prerequisites.length > 0) {
        const prerequisitesMet = await this.checkPrerequisites(userId, lab.prerequisites);
        if (!prerequisitesMet) {
          throw new Error('You must complete the prerequisites first');
        }
      }

      // Check if user is already working on this lab
      const progress = await this.getUserLabProgress(userId, labId);
      if (progress && progress.status === 'In Progress') {
        return {
          ...progress,
          lab,
          canContinue: true
        };
      }

      // Create new attempt
      const now = new Date().toISOString();
      const attemptId = `LAB_ATTEMPT-${labId}-${userId}-${Date.now()}`;

      // Initialize progress
      const initialProgress = {
        attemptId,
        userId,
        labId,
        startedAt: now,
        lastAccessed: now,
        status: 'In Progress',
        completedTasks: [],
        currentTask: 0,
        hintsUsed: 0,
        flagsFound: [],
        score: 0,
        timeSpent: 0 // seconds
      };

      // Save progress
      await this.saveLabProgress(userId, labId, initialProgress);

      // Log action
      logAction({
        action: 'LAB_STARTED',
        userId: userId,
        role: ROLES.STUDENT,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          labTitle: lab.title,
          attemptId
        }
      });

      return {
        attemptId,
        lab,
        progress: initialProgress,
        canContinue: false
      };
    } catch (error) {
      console.error('Error starting lab:', error);
      throw error;
    }
  }

  /**
   * Check if user has access to a lab
   * @param {object} lab - Lab object
   * @param {object} user - User object
   * @returns {boolean} - True if user has access
   */
  static checkUserAccess(lab, user) {
    // Public labs are accessible to all
    if (lab.access === 'public') {
      return true;
    }

    // Department labs are accessible to users in the same department
    if (lab.access === 'department' && user.department === lab.department) {
      return true;
    }

    // Private labs check specific access
    if (lab.access === 'private') {
      return lab.allowedUsers?.includes(user.id) ||
             lab.allowedRoles?.includes(user.role) ||
             (user.role === ROLES.ADMIN) ||
             (user.role === ROLES.FACULTY && lab.createdBy === user.id);
    }

    // Default: check if user is in allowed list
    return lab.allowedUsers?.includes(user.id) ||
           lab.allowedRoles?.includes(user.role) ||
           (user.role === ROLES.ADMIN);
  }

  /**
   * Check if user has completed prerequisites
   * @param {string} userId - User ID
   * @param {string[]} prerequisites - Array of prerequisite IDs (labs or courses)
   * @returns {Promise<boolean>} - True if prerequisites are met
   */
  static async checkPrerequisites(userId, prerequisites) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return false;
      }

      const progress = await UserService.getProgress(userId);

      for (const prereqId of prerequisites) {
        // Check if it's a lab
        const lab = await this.getLabById(prereqId);
        if (lab) {
          const labProgress = progress.labs?.completed || [];
          if (!labProgress.includes(prereqId)) {
            return false;
          }
          continue;
        }

        // Check if it's a course
        const course = await CourseService.getCourseById(prereqId);
        if (course) {
          const courseProgress = progress.courses?.completed || [];
          if (!courseProgress.includes(prereqId)) {
            return false;
          }
          continue;
        }

        // Check if it's a level
        if (parseInt(prereqId) >= 1 && parseInt(prereqId) <= 12) {
          if (user.level < parseInt(prereqId)) {
            return false;
          }
          continue;
        }

        // Unknown prerequisite type
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking prerequisites:', error);
      return false;
    }
  }

  /**
   * Get user's progress for a specific lab
   * @param {string} userId - User ID
   * @param {string} labId - Lab ID
   * @returns {Promise<object|null>} - Lab progress or null
   */
  static async getUserLabProgress(userId, labId) {
    try {
      const progress = await UserService.getProgress(userId);
      const labProgress = progress.labs?.[labId] || null;
      return labProgress;
    } catch (error) {
      console.error('Error getting user lab progress:', error);
      return null;
    }
  }

  /**
   * Save user's progress for a lab
   * @param {string} userId - User ID
   * @param {string} labId - Lab ID
   * @param {object} progress - Progress data
   * @returns {Promise<object>} - Updated progress
   */
  static async saveLabProgress(userId, labId, progress) {
    try {
      const currentProgress = await UserService.getProgress(userId);
      const updatedProgress = {
        ...currentProgress,
        labs: {
          ...(currentProgress.labs || {}),
          [labId]: progress
        }
      };

      const result = await UserService.updateProgress(userId, updatedProgress);
      return result.labs?.[labId] || progress;
    } catch (error) {
      console.error('Error saving lab progress:', error);
      throw error;
    }
  }

  /**
   * Update task completion in a lab
   * @param {string} userId - User ID
   * @param {string} labId - Lab ID
   * @param {string} taskId - Task ID
   * @param {string} answer - Task answer/flag
   * @returns {Promise<object>} - Updated progress
   */
  static async completeTask(userId, labId, taskId, answer) {
    try {
      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get current progress
      const progress = await this.getUserLabProgress(userId, labId);
      if (!progress || progress.status !== 'In Progress') {
        throw new Error('Lab not started or already completed');
      }

      // Find the task
      const task = lab.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Check if already completed
      if (progress.completedTasks.includes(taskId)) {
        return progress;
      }

      // Validate answer
      const isCorrect = this.validateAnswer(task, answer);

      if (!isCorrect) {
        return {
          ...progress,
          error: 'Incorrect answer. Try again.'
        };
      }

      // Update progress
      const updatedProgress = {
        ...progress,
        completedTasks: [...progress.completedTasks, taskId],
        flagsFound: [...progress.flagsFound, taskId],
        score: progress.score + (task.points || 1),
        lastAccessed: new Date().toISOString()
      };

      // Check if all tasks are completed
      if (updatedProgress.completedTasks.length === lab.tasks.length) {
        updatedProgress.status = 'Completed';
        updatedProgress.completedAt = new Date().toISOString();

        // Update lab completion count
        const currentLab = await this.getLabById(labId);
        if (currentLab) {
          await this.updateLab(labId, {
            completionCount: (currentLab.completionCount || 0) + 1
          });
        }

        // Award XP to user
        const xpEarned = Math.round(lab.estimatedTime * 2); // 2 XP per minute
        await UserService.addXP(userId, xpEarned);

        // Update streak
        await this.updateUserStreak(userId);
      }

      // Save progress
      const result = await this.saveLabProgress(userId, labId, updatedProgress);

      // Log action
      logAction({
        action: 'LAB_TASK_COMPLETED',
        userId: userId,
        role: ROLES.STUDENT,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          taskId: taskId,
          taskTitle: task.title,
          isFinalTask: updatedProgress.completedTasks.length === lab.tasks.length
        }
      });

      return result;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  /**
   * Validate a task answer
   * @param {object} task - Task object
   * @param {string} answer - User's answer
   * @returns {boolean} - True if answer is correct
   */
  static validateAnswer(task, answer) {
    if (!answer || typeof answer !== 'string') {
      return false;
    }

    // Get the correct answer from flags
    const correctAnswer = task.flag || task.answer;

    // Case-insensitive comparison
    return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  /**
   * Get hint for a task
   * @param {string} userId - User ID
   * @param {string} labId - Lab ID
   * @param {string} taskId - Task ID
   * @returns {Promise<object>} - Hint data
   */
  static async getHint(userId, labId, taskId) {
    try {
      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get current progress
      const progress = await this.getUserLabProgress(userId, labId);
      if (!progress || progress.status !== 'In Progress') {
        throw new Error('Lab not started');
      }

      // Find the task
      const task = lab.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Check if hints are allowed
      if (!lab.allowHints) {
        throw new Error('Hints are not allowed for this lab');
      }

      // Check if user has hints remaining
      const maxHints = lab.maxHints || 3;
      if ((progress.hintsUsed || 0) >= maxHints) {
        throw new Error(`You have used all ${maxHints} hints for this lab`);
      }

      // Find the hint
      const hintIndex = progress.hintsUsed || 0;
      const hints = lab.hints?.[taskId] || lab.hints || [];
      const hint = hints[hintIndex] || null;

      if (!hint) {
        throw new Error('No more hints available for this task');
      }

      // Update hint count
      const updatedProgress = {
        ...progress,
        hintsUsed: (progress.hintsUsed || 0) + 1,
        lastAccessed: new Date().toISOString()
      };

      await this.saveLabProgress(userId, labId, updatedProgress);

      // Log action
      logAction({
        action: 'HINT_USED',
        userId: userId,
        role: ROLES.STUDENT,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: {
          taskId: taskId,
          hintNumber: hintIndex + 1
        }
      });

      return {
        hint,
        hintNumber: hintIndex + 1,
        totalHints: hints.length,
        hintsRemaining: maxHints - updatedProgress.hintsUsed
      };
    } catch (error) {
      console.error('Error getting hint:', error);
      throw error;
    }
  }

  /**
   * Update user streak for lab completion
   * @param {string} userId - User ID
   */
  static async updateUserStreak(userId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) return;

      const progress = await UserService.getProgress(userId);
      const lastLabCompletion = progress.lastLabCompletion ?
        new Date(progress.lastLabCompletion) : new Date(0);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLabCompletion >= yesterday) {
        await UserService.updateProgress(userId, {
          streak: (progress.streak || 0) + 1,
          lastLabCompletion: new Date().toISOString()
        });
      } else {
        await UserService.updateProgress(userId, {
          streak: 1,
          lastLabCompletion: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating user streak:', error);
    }
  }

  /**
   * Get all labs for a user
   * @param {string} userId - User ID
   * @param {object} options - Filter options
   * @returns {Promise<Array>} - Array of labs with user progress
   */
  static async getLabsForUser(userId, options = {}) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const allLabs = await this.getAllLabs(options);
      const progress = await UserService.getProgress(userId);

      // Filter labs by access
      const accessibleLabs = allLabs.filter(lab => {
        return this.checkUserAccess(lab, user);
      });

      // Add progress information
      const labsWithProgress = accessibleLabs.map(lab => {
        const labProgress = progress.labs?.[lab.id] || {};
        const completedTasks = labProgress.completedTasks || [];
        const totalTasks = lab.tasks?.length || 0;
        const completionPercentage = totalTasks > 0 ?
          Math.round((completedTasks.length / totalTasks) * 100) : 0;

        return {
          ...lab,
          userProgress: {
            status: labProgress.status || 'Not Started',
            completionPercentage,
            completedTasks: completedTasks.length,
            totalTasks,
            score: labProgress.score || 0,
            hintsUsed: labProgress.hintsUsed || 0,
            lastAccessed: labProgress.lastAccessed,
            canContinue: labProgress.status === 'In Progress'
          }
        };
      });

      // Sort by user preference or default
      return labsWithProgress.sort((a, b) => {
        // In Progress first
        if (a.userProgress.status === 'In Progress' && b.userProgress.status !== 'In Progress') {
          return -1;
        }
        if (b.userProgress.status === 'In Progress' && a.userProgress.status !== 'In Progress') {
          return 1;
        }

        // Then by completion percentage (descending)
        return b.userProgress.completionPercentage - a.userProgress.completionPercentage;
      });
    } catch (error) {
      console.error('Error getting labs for user:', error);
      throw error;
    }
  }

  /**
   * Get labs by course
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - Array of labs
   */
  static async getLabsByCourse(courseId) {
    try {
      const course = await CourseService.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const labs = await this.getAllLabs({ courseId });
      return labs;
    } catch (error) {
      console.error('Error getting labs by course:', error);
      throw error;
    }
  }

  /**
   * Get labs by domain
   * @param {string} domain - Cybersecurity domain
   * @returns {Promise<Array>} - Array of labs
   */
  static async getLabsByDomain(domain) {
    try {
      if (!CYBER_DOMAINS.includes(domain)) {
        throw new Error('Invalid domain');
      }

      const labs = await this.getAllLabs({ domain });
      return labs.sort((a, b) => {
        // Sort by difficulty (easiest first)
        const difficultyOrder = {
          [DIFFICULTY_LEVELS.BEGINNER]: 1,
          [DIFFICULTY_LEVELS.EASY]: 2,
          [DIFFICULTY_LEVELS.MEDIUM]: 3,
          [DIFFICULTY_LEVELS.HARD]: 4,
          [DIFFICULTY_LEVELS.EXPERT]: 5
        };

        return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
      });
    } catch (error) {
      console.error('Error getting labs by domain:', error);
      throw error;
    }
  }

  /**
   * Get lab categories with counts
   * @returns {Promise<Array>} - Array of categories with lab counts
   */
  static async getLabCategories() {
    try {
      const labs = await getLabs();
      const categoryCounts = {};

      // Initialize all categories
      LAB_CATEGORIES.forEach(category => {
        categoryCounts[category] = 0;
      });

      // Count labs per category
      labs.forEach(lab => {
        if (categoryCounts[lab.category] !== undefined) {
          categoryCounts[lab.category]++;
        }
      });

      return Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
        labs: labs.filter(l => l.category === category)
      }));
    } catch (error) {
      console.error('Error getting lab categories:', error);
      throw error;
    }
  }

  /**
   * Get lab difficulty distribution
   * @returns {Promise<object>} - Difficulty distribution
   */
  static async getLabDifficultyDistribution() {
    try {
      const labs = await getLabs();
      const distribution = {
        [DIFFICULTY_LEVELS.BEGINNER]: 0,
        [DIFFICULTY_LEVELS.EASY]: 0,
        [DIFFICULTY_LEVELS.MEDIUM]: 0,
        [DIFFICULTY_LEVELS.HARD]: 0,
        [DIFFICULTY_LEVELS.EXPERT]: 0
      };

      labs.forEach(lab => {
        if (distribution[lab.difficulty] !== undefined) {
          distribution[lab.difficulty]++;
        }
      });

      return distribution;
    } catch (error) {
      console.error('Error getting lab difficulty distribution:', error);
      throw error;
    }
  }

  /**
   * Get lab statistics for a faculty member
   * @param {string} facultyId - Faculty ID
   * @returns {Promise<object>} - Lab statistics
   */
  static async getFacultyLabStats(facultyId) {
    try {
      const labs = await this.getAllLabs();
      const facultyLabs = labs.filter(lab =>
        lab.createdBy === facultyId ||
        (lab.facultyIds && lab.facultyIds.includes(facultyId))
      );

      const totalLabs = facultyLabs.length;
      const activeLabs = facultyLabs.filter(l => l.isActive).length;
      const totalCompletions = facultyLabs.reduce((sum, lab) => sum + (lab.completionCount || 0), 0);

      // Get completion rate
      const users = await getUsers();
      const studentUsers = users.filter(u => u.role === ROLES.STUDENT);
      const totalStudents = studentUsers.length;

      const completionRate = totalStudents > 0 ?
        Math.round((totalCompletions / (totalLabs * totalStudents)) * 100) : 0;

      // Get most popular labs
      const popularLabs = [...facultyLabs]
        .sort((a, b) => (b.completionCount || 0) - (a.completionCount || 0))
        .slice(0, 5)
        .map(lab => ({
          id: lab.id,
          title: lab.title,
          category: lab.category,
          completionCount: lab.completionCount || 0
        }));

      // Get hardest labs (lowest completion rate)
      const labStats = await Promise.all(
        facultyLabs.map(async lab => {
          const userCount = studentUsers.length;
          const completionCount = lab.completionCount || 0;
          return {
            id: lab.id,
            title: lab.title,
            completionRate: userCount > 0 ? Math.round((completionCount / userCount) * 100) : 0
          };
        })
      );

      const hardestLabs = labStats
        .sort((a, b) => a.completionRate - b.completionRate)
        .slice(0, 5);

      // Get category distribution
      const categoryDistribution = {};
      LAB_CATEGORIES.forEach(category => {
        categoryDistribution[category] = facultyLabs.filter(l => l.category === category).length;
      });

      return {
        totalLabs,
        activeLabs,
        totalCompletions,
        completionRate,
        popularLabs,
        hardestLabs,
        categoryDistribution
      };
    } catch (error) {
      console.error('Error getting faculty lab stats:', error);
      throw error;
    }
  }

  /**
   * Get lab statistics for admin dashboard
   * @returns {Promise<object>} - Lab statistics
   */
  static async getLabStats() {
    try {
      const labs = await getLabs();
      const users = await getUsers();
      const studentUsers = users.filter(u => u.role === ROLES.STUDENT);
      const totalStudents = studentUsers.length;

      const totalLabs = labs.length;
      const activeLabs = labs.filter(l => l.isActive).length;
      const totalCompletions = labs.reduce((sum, lab) => sum + (lab.completionCount || 0), 0);

      const completionRate = totalStudents > 0 && totalLabs > 0 ?
        Math.round((totalCompletions / (totalLabs * totalStudents)) * 100) : 0;

      // Get most popular labs
      const popularLabs = [...labs]
        .sort((a, b) => (b.completionCount || 0) - (a.completionCount || 0))
        .slice(0, 5)
        .map(lab => ({
          id: lab.id,
          title: lab.title,
          category: lab.category,
          domain: lab.domain,
          completionCount: lab.completionCount || 0
        }));

      // Get hardest labs
      const labStats = await Promise.all(
        labs.map(async lab => {
          const completionCount = lab.completionCount || 0;
          return {
            id: lab.id,
            title: lab.title,
            category: lab.category,
            completionRate: totalStudents > 0 ? Math.round((completionCount / totalStudents) * 100) : 0
          };
        })
      );

      const hardestLabs = labStats
        .sort((a, b) => a.completionRate - b.completionRate)
        .slice(0, 5);

      // Get domain distribution
      const domainDistribution = {};
      CYBER_DOMAINS.forEach(domain => {
        domainDistribution[domain] = labs.filter(l => l.domain === domain).length;
      });

      // Get category distribution
      const categoryDistribution = {};
      LAB_CATEGORIES.forEach(category => {
        categoryDistribution[category] = labs.filter(l => l.category === category).length;
      });

      // Get difficulty distribution
      const difficultyDistribution = {};
      Object.values(DIFFICULTY_LEVELS).forEach(difficulty => {
        difficultyDistribution[difficulty] = labs.filter(l => l.difficulty === difficulty).length;
      });

      // Get recent labs
      const recentLabs = labs
        .filter(l => l.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(lab => ({
          id: lab.id,
          title: lab.title,
          category: lab.category,
          createdAt: lab.createdAt,
          createdBy: lab.createdBy
        }));

      return {
        totalLabs,
        activeLabs,
        totalCompletions,
        completionRate,
        popularLabs,
        hardestLabs,
        domainDistribution,
        categoryDistribution,
        difficultyDistribution,
        recentLabs,
        totalStudents
      };
    } catch (error) {
      console.error('Error getting lab stats:', error);
      throw error;
    }
  }

  /**
   * Search labs with advanced filtering
   * @param {object} options - Search options
   * @returns {Promise<object>} - Search results with pagination
   */
  static async searchLabs(options = {}) {
    try {
      const {
        query = '',
        domain,
        category,
        difficulty,
        isActive,
        courseId,
        page = 1,
        limit = 10,
        sortBy = 'title',
        sortOrder = 'asc'
      } = options;

      let labs = await this.getAllLabs({
        domain,
        category,
        difficulty,
        isActive,
        courseId,
        search: query
      });

      // Sort
      labs.sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'category':
            aVal = a.category.toLowerCase();
            bVal = b.category.toLowerCase();
            break;
          case 'domain':
            aVal = a.domain.toLowerCase();
            bVal = b.domain.toLowerCase();
            break;
          case 'difficulty':
            aVal = DIFFICULTY_LEVELS[a.difficulty] || 0;
            bVal = DIFFICULTY_LEVELS[b.difficulty] || 0;
            break;
          case 'completionCount':
            aVal = a.completionCount || 0;
            bVal = b.completionCount || 0;
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            break;
          case 'updatedAt':
            aVal = new Date(a.updatedAt);
            bVal = new Date(b.updatedAt);
            break;
          default:
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Paginate
      const startIndex = (page - 1) * limit;
      const paginatedLabs = labs.slice(startIndex, startIndex + limit);
      const total = labs.length;
      const totalPages = Math.ceil(total / limit);

      return {
        labs: paginatedLabs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error searching labs:', error);
      throw error;
    }
  }

  /**
   * Get lab completion details for a user
   * @param {string} userId - User ID
   * @param {string} labId - Lab ID
   * @returns {Promise<object>} - Lab completion details
   */
  static async getLabCompletionDetails(userId, labId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const lab = await this.getLabById(labId);
      if (!lab) {
        throw new Error('Lab not found');
      }

      const progress = await this.getUserLabProgress(userId, labId);

      if (!progress) {
        return {
          userId,
          labId,
          labTitle: lab.title,
          status: 'Not Started',
          completionPercentage: 0,
          completedTasks: [],
          totalTasks: lab.tasks.length,
          score: 0,
          timeSpent: 0,
          hintsUsed: 0
        };
      }

      const completedTasks = progress.completedTasks || [];
      const totalTasks = lab.tasks.length;
      const completionPercentage = totalTasks > 0 ?
        Math.round((completedTasks.length / totalTasks) * 100) : 0;

      // Get task details
      const taskDetails = lab.tasks.map(task => {
        const isCompleted = completedTasks.includes(task.id);
        return {
          ...task,
          isCompleted,
          status: isCompleted ? 'Completed' : 'Pending'
        };
      });

      return {
        userId,
        labId,
        labTitle: lab.title,
        labDescription: lab.description,
        domain: lab.domain,
        category: lab.category,
        difficulty: lab.difficulty,
        status: progress.status || 'Not Started',
        completionPercentage,
        completedTasks: completedTasks.length,
        totalTasks,
        score: progress.score || 0,
        timeSpent: progress.timeSpent || 0,
        hintsUsed: progress.hintsUsed || 0,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        lastAccessed: progress.lastAccessed,
        taskDetails,
        canContinue: progress.status === 'In Progress'
      };
    } catch (error) {
      console.error('Error getting lab completion details:', error);
      throw error;
    }
  }

  /**
   * Get next recommended lab for a user
   * @param {string} userId - User ID
   * @returns {Promise<object|null>} - Recommended lab or null
   */
  static async getNextRecommendedLab(userId) {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const progress = await UserService.getProgress(userId);
      const allLabs = await this.getAllLabs();

      // Filter labs user hasn't completed
      const completedLabIds = progress.labs?.completed || [];
      const incompleteLabs = allLabs.filter(lab =>
        !completedLabIds.includes(lab.id) &&
        this.checkUserAccess(lab, user)
      );

      if (incompleteLabs.length === 0) {
        return null;
      }

      // Score labs based on relevance
      const scoredLabs = incompleteLabs.map(lab => {
        let score = 0;

        // Same domain as user's current courses
        if (user.courses && user.courses.length > 0) {
          const userCourse = await CourseService.getCourseById(user.courses[0]);
          if (userCourse && userCourse.domain === lab.domain) {
            score += 3;
          }
        }

        // Same level as user
        if (lab.level === user.level) {
          score += 2;
        }

        // Next level after user's current level
        if (lab.level === user.level + 1) {
          score += 1;
        }

        // Same category as user's completed labs
        if (progress.labs && progress.labs.completed && progress.labs.completed.length > 0) {
          const completedLab = await this.getLabById(progress.labs.completed[0]);
          if (completedLab && completedLab.category === lab.category) {
            score += 2;
          }
        }

        // No prerequisites (easier to start)
        if (!lab.prerequisites || lab.prerequisites.length === 0) {
          score += 1;
        }

        // Beginner/Easy difficulty
        if (lab.difficulty === DIFFICULTY_LEVELS.BEGINNER ||
            lab.difficulty === DIFFICULTY_LEVELS.EASY) {
          score += 1;
        }

        return { ...lab, score };
      });

      // Sort by score and return highest
      const recommendedLab = scoredLabs
        .sort((a, b) => b.score - a.score)
        .shift();

      return recommendedLab ? {
        ...recommendedLab,
        reason: this.getRecommendationReason(recommendedLab, user)
      } : null;
    } catch (error) {
      console.error('Error getting next recommended lab:', error);
      throw error;
    }
  }

  /**
   * Get reason for lab recommendation
   * @param {object} lab - Lab object
   * @param {object} user - User object
   * @returns {string} - Recommendation reason
   */
  static getRecommendationReason(lab, user) {
    if (lab.level === user.level) {
      return `This lab matches your current level (${lab.level})`;
    }

    if (lab.level === user.level + 1) {
      return `This lab is at the next level (${lab.level}) - a good challenge!`;
    }

    if (lab.difficulty === DIFFICULTY_LEVELS.BEGINNER ||
        lab.difficulty === DIFFICULTY_LEVELS.EASY) {
      return `This ${lab.difficulty.toLowerCase()} lab is perfect for your current skill level`;
    }

    if (lab.domain === user.department) {
      return `This lab aligns with your ${user.department} focus`;
    }

    return 'Recommended based on your learning progress';
  }

  /**
   * Simulate terminal command execution
   * @param {string} command - Command to simulate
   * @param {string} labId - Current lab ID (for context)
   * @returns {Promise<object>} - Simulated command output
   */
  static async simulateTerminalCommand(command, labId = null) {
    try {
      // Normalize command
      const normalizedCommand = command.trim().toLowerCase();

      // Get lab context if available
      let lab = null;
      if (labId) {
        lab = await this.getLabById(labId);
      }

      // Define command outputs
      const commandOutputs = {
        // System commands
        'help': {
          output: `Available commands:
  help        - Show this help message
  clear       - Clear the terminal
  whoami      - Show current user
  pwd         - Show current directory
  ls          - List directory contents
  cat         - Display file content
  echo        - Display a line of text
  date        - Show current date/time
  uptime      - Show system uptime

Network commands:
  ping        - Ping a host
  nmap        - Network mapper
  curl        - Transfer a URL
  netstat     - Network statistics
  ifconfig    - Network interface config
  dig         - DNS lookup

Linux commands:
  ls          - List files
  cd          - Change directory
  grep        - Search text
  find        - Find files
  chmod       - Change file permissions
  ps          - Process status
  top         - Display processes
  kill        - Terminate a process

Windows commands:
  dir         - List files (Windows)
  ipconfig    - IP configuration (Windows)
  netstat     - Network stats (Windows)
  tasklist    - List processes (Windows)`,
          color: 'blue'
        },
        'clear': {
          output: '',
          action: 'clear'
        },
        'whoami': {
          output: `student@cybernex-lab`,
          color: 'green'
        },
        'pwd': {
          output: lab ? `/home/student/labs/${lab.slug}` : `/home/student`,
          color: 'green'
        },
        'date': {
          output: new Date().toLocaleString(),
          color: 'white'
        },
        'uptime': {
          output: `System uptime: ${Math.floor(Math.random() * 24)} hours, ${Math.floor(Math.random() * 60)} minutes`,
          color: 'white'
        },

        // Network commands
        // Network commands
        'ping 10.10.10.10': {
          output: `PING 10.10.10.10 (10.10.10.10) 56(84) bytes of data.
64 bytes from 10.10.10.10: icmp_seq=1 ttl=64 time=0.045 ms
64 bytes from 10.10.10.10: icmp_seq=2 ttl=64 time=0.038 ms
64 bytes from 10.10.10.10: icmp_seq=3 ttl=64 time=0.041 ms
64 bytes from 10.10.10.10: icmp_seq=4 ttl=64 time=0.039 ms
--- 10.10.10.10 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3064ms
rtt min/avg/max/mdev = 0.038/0.040/0.045/0.003 ms`,
          color: 'white'
        },
        'nmap -sV 10.10.10.10': {
          output: `Starting Nmap 7.92 ( https://nmap.org )
Nmap scan report for 10.10.10.10
Host is up (0.045s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http        Apache httpd 2.4.41 ((Ubuntu))
443/tcp open  ssl/http    Apache httpd 2.4.41 ((Ubuntu))
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.84 seconds`,
          color: 'white'
        },
        'nmap -A 10.10.10.10': {
          output: `Starting Nmap 7.92 ( https://nmap.org )
Nmap scan report for 10.10.10.10
Host is up (0.045s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 3a:2b:1c:4d:5e:6f:7g:8h (RSA)
|   256 9i:0j:1k:2l:3m:4n:5o:6p (ECDSA)
|_  256 7q:8r:9s:0t:1u:2v:3w:4x (ED25519)
80/tcp  open  http        Apache httpd 2.4.41 ((Ubuntu))
|_http-title: CyberNex Training Platform
|_http-server-header: Apache/2.4.41 (Ubuntu)
443/tcp open  ssl/http    Apache httpd 2.4.41 ((Ubuntu))
|_ssl-date: TLS randomness does not represent time
| tls-alpn:
|_  http/1.1
|_http-title: CyberNex Training Platform
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.45 seconds`,
          color: 'white'
        },
        'curl http://10.10.10.10': {
          output: `HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
Date: ${new Date().toUTCString()}
Content-Type: text/html; charset=UTF-8
Content-Length: 1256
Connection: keep-alive

<!DOCTYPE html>
<html>
<head>
    <title>CyberNex Training Platform</title>
</head>
<body>
    <h1>Welcome to CyberNex</h1>
    <p>This is a training environment for cybersecurity education.</p>
</body>
</html>`,
          color: 'white'
        },
        'curl -I http://10.10.10.10': {
          output: `HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
Date: ${new Date().toUTCString()}
Content-Type: text/html; charset=UTF-8
Content-Length: 1256
Connection: keep-alive`,
          color: 'white'
        },
        'netstat -tuln': {
          output: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN
tcp6       0      0 :::80                   :::*                    LISTEN
tcp6       0      0 :::443                  :::*                    LISTEN`,
          color: 'white'
        },
        'ifconfig': {
          output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.10.10.100  netmask 255.255.255.0  broadcast 10.10.10.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 15234  bytes 14987642 (14.9 MB)
        TX packets 8523  bytes 1024562 (1.0 MB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 123  bytes 4567 (4.5 KB)
        TX packets 123  bytes 4567 (4.5 KB)`,
          color: 'white'
        },
        'dig example.com': {
          output: `; <<>> DiG 9.16.1-Ubuntu <<>> example.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;example.com.			IN	A

;; ANSWER SECTION:
example.com.		300	IN	A	93.184.216.34

;; Query time: 45 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: ${new Date().toUTCString()}
;; MSG SIZE  rcvd: 60`,
          color: 'white'
        },

        // Linux commands
        'ls -la': {
          output: `total 24
drwxr-xr-x 4 student student 4096 Sep  3 10:00 .
drwxr-xr-x 4 student student 4096 Sep  3 10:00 ..
-rw-r--r-- 1 student student  220 Sep  3 09:50 .bash_history
-rw-r--r-- 1 student student  148 Sep  3 09:50 flag.txt
-rw-r--r-- 1 student student 3428 Sep  3 09:50 notes.md
drwxr-xr-x 2 student student 4096 Sep  3 09:55 tools`,
          color: 'white'
        },
        'ls': {
          output: `.bash_history  flag.txt  notes.md  tools`,
          color: 'white'
        },
        'cat flag.txt': {
          output: lab && lab.flags && lab.flags['flag.txt'] ?
            lab.flags['flag.txt'] : 'CYBERNEX{S1mpl3_L4b_Fl4g}',
          color: 'yellow'
        },
        'cat notes.md': {
          output: `# Lab Notes

## Objective
Complete all tasks to demonstrate your understanding of basic web enumeration.

## Tasks
1. Identify the web server
2. Find the robots.txt file
3. Discover hidden endpoints
4. Submit the flag

## Hints
- Use curl to inspect HTTP headers
- Check common locations for sensitive files
- Look for backup files and directories`,
          color: 'white'
        },
        'ls tools': {
          output: `nmap  nikto  burpsuite  sqlmap  dirb`,
          color: 'white'
        },
        'cd tools': {
          output: '',
          newPrompt: 'student@cybernex-lab:/home/student/labs/tools$'
        },
        'cd ..': {
          output: '',
          newPrompt: 'student@cybernex-lab:/home/student/labs$'
        },
        'cd ~': {
          output: '',
          newPrompt: 'student@cybernex-lab:~$'
        },
        'grep -i password notes.md': {
          output: `notes.md:admin:P@ssw0rd123
notes.md:user:Welcome123
notes.md:backup:S3cr3tK3y!`,
          color: 'red'
        },
        'find / -name flag.txt': {
          output: `/home/student/labs/flag.txt
/etc/flag.txt
/var/www/flag.txt`,
          color: 'white'
        },

        // Windows commands (for Windows labs)
        'dir': {
          output: ` Volume in drive C has no label.
 Volume Serial Number is 1234-5678

 Directory of C:\\Users\\student\\Desktop\\lab

09/03/2026  10:00 AM    <DIR>          .
09/03/2026  10:00 AM    <DIR>          ..
09/03/2026  09:50 AM               148 flag.txt
09/03/2026  09:50 AM             3,428 notes.txt
09/03/2026  09:55 AM    <DIR>          tools
               2 File(s)          3,576 bytes
               2 Dir(s)   1,048,576 bytes free`,
          color: 'white'
        },
        'type flag.txt': {
          output: lab && lab.flags && lab.flags['flag.txt'] ?
            lab.flags['flag.txt'] : 'CYBERNEX{W1nd0ws_L4b_Fl4g}',
          color: 'yellow'
        },

        // Lab-specific commands (if lab context is available)
        ...(lab ? {
          [`cat ${lab.slug}.txt`]: {
            output: lab.flags && lab.flags[`${lab.slug}.txt`] ?
              lab.flags[`${lab.slug}.txt`] : lab.flags?.main || 'CYBERNEX{L4b_Sp3c1f1c_Fl4g}',
            color: 'yellow'
          }
        } : {})
      };

      // Check for exact match
      for (const [cmd, output] of Object.entries(commandOutputs)) {
        if (normalizedCommand === cmd.toLowerCase()) {
          return {
            output: output.output,
            color: output.color || 'white',
            action: output.action,
            newPrompt: output.newPrompt
          };
        }
      }

      // Check for partial matches (like 'ls -l' matching 'ls -la')
      for (const [cmd, output] of Object.entries(commandOutputs)) {
        if (cmd.toLowerCase().startsWith(normalizedCommand)) {
          return {
            output: output.output,
            color: output.color || 'white',
            action: output.action,
            newPrompt: output.newPrompt
          };
        }
      }

      // Default response for unknown commands
      return {
        output: `bash: ${command}: command not found`,
        color: 'red'
      };
    } catch (error) {
      console.error('Error simulating terminal command:', error);
      return {
        output: `Error: ${error.message}`,
        color: 'red'
      };
    }
  }

  /**
   * Get terminal history for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of command history
   */
  static async getTerminalHistory(userId) {
    try {
      const progress = await UserService.getProgress(userId);
      return progress.terminalHistory || [];
    } catch (error) {
      console.error('Error getting terminal history:', error);
      return [];
    }
  }

  /**
   * Add command to terminal history
   * @param {string} userId - User ID
   * @param {string} command - Command executed
   * @returns {Promise<Array>} - Updated history
   */
  static async addToTerminalHistory(userId, command) {
    try {
      const progress = await UserService.getProgress(userId);
      const history = progress.terminalHistory || [];

      // Add command to history (limit to 100 commands)
      const updatedHistory = [command, ...history].slice(0, 100);

      await UserService.updateProgress(userId, {
        terminalHistory: updatedHistory
      });

      return updatedHistory;
    } catch (error) {
      console.error('Error adding to terminal history:', error);
      return [];
    }
  }
}

// ===== EXPORT =====
export default PracticeService;