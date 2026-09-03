/**
 * CyberNex - Assessment Service
 *
 * Service layer for assessment management operations.
 * Handles creation, management, taking, and grading of assessments.
 */

import {
  getAssessments, setAssessments, addAssessment, updateAssessment, deleteAssessment,
  getResults, addResult, updateResult,
  getUsers, getCourses, getSchedules,
  unlockAssessmentForStudent, lockAssessmentForStudent, isAssessmentUnlockedForStudent,
  getAssessmentUnlocks, setAssessmentUnlocks,
  logAction, addViolation
} from './storageService';
import {
  ROLES,
  ASSESSMENT_STATES,
  ASSESSMENT_TYPES,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  VIOLATION_TYPES,
  VIOLATION_SEVERITY
} from '../utils/constants';
import UserService from './userService';
import CourseService from './courseService';

// ===== ASSESSMENT SERVICE =====
class AssessmentService {
  /**
   * Get all assessments
   * @param {object} options - Filter options
   * @returns {Promise<Array>} - Array of assessments
   */
  static async getAllAssessments(options = {}) {
    try {
      let assessments = await getAssessments();

      // Apply filters
      if (options.type) {
        assessments = assessments.filter(a => a.type === options.type);
      }

      if (options.domain) {
        assessments = assessments.filter(a => a.domain === options.domain);
      }

      if (options.level) {
        assessments = assessments.filter(a => a.level === parseInt(options.level));
      }

      if (options.difficulty) {
        assessments = assessments.filter(a => a.difficulty === options.difficulty);
      }

      if (options.status) {
        assessments = assessments.filter(a => a.status === options.status);
      }

      if (options.courseId) {
        assessments = assessments.filter(a => a.courseId === options.courseId);
      }

      if (options.facultyId) {
        assessments = assessments.filter(a =>
          a.createdBy === options.facultyId ||
          (a.facultyIds && a.facultyIds.includes(options.facultyId))
        );
      }

      if (options.search) {
        const query = options.search.toLowerCase();
        assessments = assessments.filter(a =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.id.toLowerCase().includes(query)
        );
      }

      return assessments;
    } catch (error) {
      console.error('Error getting assessments:', error);
      throw error;
    }
  }

  /**
   * Get assessment by ID
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<object|null>} - Assessment or null
   */
  static async getAssessmentById(assessmentId) {
    try {
      const assessments = await getAssessments();
      return assessments.find(a => a.id === assessmentId) || null;
    } catch (error) {
      console.error('Error getting assessment by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new assessment
   * @param {object} assessmentData - Assessment data
   * @param {string} createdBy - ID of user creating the assessment
   * @returns {Promise<object>} - Created assessment
   */
  static async createAssessment(assessmentData, createdBy = null) {
    try {
      // Validate required fields
      if (!assessmentData.title || !assessmentData.type) {
        throw new Error('Title and type are required');
      }

      // Generate ID based on type
      const typePrefix = assessmentData.type
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');

      const id = `ASSESS-${typePrefix}-${Date.now()}`;

      // Set default values
      const newAssessment = {
        id,
        title: assessmentData.title,
        description: assessmentData.description || '',
        type: assessmentData.type,
        domain: assessmentData.domain || null,
        level: assessmentData.level || 1,
        difficulty: assessmentData.difficulty || DIFFICULTY_LEVELS.MEDIUM,
        courseId: assessmentData.courseId || null,
        questions: assessmentData.questions || [],
        practicalTasks: assessmentData.practicalTasks || [],
        duration: assessmentData.duration || 60, // minutes
        passingScore: assessmentData.passingScore || 70, // percentage
        maxAttempts: assessmentData.maxAttempts || 1,
        shuffleQuestions: assessmentData.shuffleQuestions || false,
        allowHints: assessmentData.allowHints || false,
        showResultsImmediately: assessmentData.showResultsImmediately || false,
        enableProctoring: assessmentData.enableProctoring || false,
        startDate: assessmentData.startDate || null,
        endDate: assessmentData.endDate || null,
        isPublished: assessmentData.isPublished || false,
        status: ASSESSMENT_STATES.LOCKED,
        createdBy: createdBy,
        facultyIds: assessmentData.facultyIds || [createdBy],
        students: assessmentData.students || [],
        eligibleStudents: assessmentData.eligibleStudents || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };

      // Add to storage
      await addAssessment(newAssessment);

      // Log action
      logAction({
        action: 'ASSESSMENT_CREATED',
        userId: createdBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: newAssessment.id,
        status: 'Success',
        details: {
          title: newAssessment.title,
          type: newAssessment.type,
          duration: newAssessment.duration,
          passingScore: newAssessment.passingScore
        }
      });

      return newAssessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  /**
   * Update an assessment
   * @param {string} assessmentId - Assessment ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated assessment
   */
  static async updateAssessment(assessmentId, updates, updatedBy = null) {
    try {
      const oldAssessment = await this.getAssessmentById(assessmentId);
      if (!oldAssessment) {
        throw new Error('Assessment not found');
      }

      // Add metadata
      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();
      updates.version = (oldAssessment.version || 1) + 1;

      // Handle status transitions
      if (updates.status && updates.status !== oldAssessment.status) {
        this.handleStatusTransition(oldAssessment, updates.status, updatedBy);
      }

      const updatedAssessment = await updateAssessment(assessmentId, updates);

      // Log action
      logAction({
        action: 'ASSESSMENT_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          title: updatedAssessment.title,
          oldStatus: oldAssessment.status,
          newStatus: updatedAssessment.status,
          changes: Object.keys(updates).filter(k =>
            k !== 'updatedBy' && k !== 'updatedAt' && k !== 'version'
          )
        }
      });

      return updatedAssessment;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  /**
   * Handle assessment status transitions
   * @param {object} assessment - Assessment object
   * @param {string} newStatus - New status
   * @param {string} changedBy - ID of user changing status
   */
  static async handleStatusTransition(assessment, newStatus, changedBy = null) {
    try {
      const oldStatus = assessment.status;

      // Locked -> Eligible: Notify eligible students
      if (oldStatus === ASSESSMENT_STATES.LOCKED && newStatus === ASSESSMENT_STATES.ELIGIBLE) {
        const students = await getUsers();
        const eligibleStudents = assessment.eligibleStudents || assessment.students || [];

        for (const studentId of eligibleStudents) {
          const student = students.find(s => s.id === studentId);
          if (student) {
            // In a real app, you would send a notification here
            // For now, we'll just log it
            logAction({
              action: 'ASSESSMENT_UNLOCKED_NOTIFICATION',
              userId: changedBy || 'system',
              role: ROLES.FACULTY,
              target: 'Notification',
              targetId: studentId,
              status: 'Success',
              details: {
                assessmentId: assessment.id,
                assessmentTitle: assessment.title,
                studentId: studentId
              }
            });
          }
        }
      }

      // Eligible -> Open: Start timer for eligible students
      if (oldStatus === ASSESSMENT_STATES.ELIGIBLE && newStatus === ASSESSMENT_STATES.OPEN) {
        // In a real app, you would start timers here
        // For frontend-only, we'll just log it
        logAction({
          action: 'ASSESSMENT_OPENED',
          userId: changedBy || 'system',
          role: ROLES.FACULTY,
          target: 'Assessment',
          targetId: assessment.id,
          status: 'Success',
          details: {
            startDate: assessment.startDate,
            endDate: assessment.endDate
          }
        });
      }

      // In Progress -> Submitted: Auto-grade if possible
      if (oldStatus === ASSESSMENT_STATES.IN_PROGRESS && newStatus === ASSESSMENT_STATES.SUBMITTED) {
        // In a real app, you would auto-grade here
        // For frontend-only, we'll just log it
        logAction({
          action: 'ASSESSMENT_AUTO_GRADED',
          userId: changedBy || 'system',
          role: ROLES.SYSTEM,
          target: 'Assessment',
          targetId: assessment.id,
          status: 'Success'
        });
      }
    } catch (error) {
      console.error('Error in status transition:', error);
      // Don't throw, as this is a side effect
    }
  }

  /**
   * Delete an assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteAssessment(assessmentId, deletedBy = null) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // Check if assessment has results
      const results = await getResults();
      const assessmentResults = results.filter(r => r.assessmentId === assessmentId);

      if (assessmentResults.length > 0) {
        throw new Error('Cannot delete assessment with existing results');
      }

      await deleteAssessment(assessmentId);

      // Remove from unlocks
      const unlocks = await getAssessmentUnlocks();
      if (unlocks[assessmentId]) {
        delete unlocks[assessmentId];
        await setAssessmentUnlocks(unlocks);
      }

      // Log action
      logAction({
        action: 'ASSESSMENT_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          title: assessment.title,
          type: assessment.type
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }

  /**
   * Publish an assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} publishedBy - ID of user publishing
   * @returns {Promise<object>} - Updated assessment
   */
  static async publishAssessment(assessmentId, publishedBy = null) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      if (assessment.isPublished) {
        return assessment; // Already published
      }

      // Validate assessment is complete
      if (!assessment.title || !assessment.type) {
        throw new Error('Assessment is missing required fields');
      }

      if (assessment.questions.length === 0 && assessment.practicalTasks.length === 0) {
        throw new Error('Assessment must have at least one question or task');
      }

      const updates = {
        isPublished: true,
        publishedAt: new Date().toISOString(),
        publishedBy: publishedBy,
        status: ASSESSMENT_STATES.LOCKED
      };

      const updatedAssessment = await this.updateAssessment(assessmentId, updates, publishedBy);

      // Log action
      logAction({
        action: 'ASSESSMENT_PUBLISHED',
        userId: publishedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          title: updatedAssessment.title,
          type: updatedAssessment.type
        }
      });

      return updatedAssessment;
    } catch (error) {
      console.error('Error publishing assessment:', error);
      throw error;
    }
  }

  /**
   * Unpublish an assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} unpublishedBy - ID of user unpublishing
   * @returns {Promise<object>} - Updated assessment
   */
  static async unpublishAssessment(assessmentId, unpublishedBy = null) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      if (!assessment.isPublished) {
        return assessment; // Already unpublished
      }

      const updates = {
        isPublished: false,
        unpublishedAt: new Date().toISOString(),
        unpublishedBy: unpublishedBy,
        status: ASSESSMENT_STATES.LOCKED
      };

      const updatedAssessment = await this.updateAssessment(assessmentId, updates, unpublishedBy);

      // Log action
      logAction({
        action: 'ASSESSMENT_UNPUBLISHED',
        userId: unpublishedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          title: updatedAssessment.title
        }
      });

      return updatedAssessment;
    } catch (error) {
      console.error('Error unpublishing assessment:', error);
      throw error;
    }
  }

  /**
   * Unlock assessment for specific students
   * @param {string} assessmentId - Assessment ID
   * @param {string|string[]} studentIds - Student ID or array of IDs
   * @param {string} unlockedBy - ID of user unlocking
   * @returns {Promise<boolean>} - Success status
   */
  static async unlockForStudents(assessmentId, studentIds, unlockedBy = null) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

      // Validate students exist
      const users = await getUsers();
      const validStudentIds = studentIdsArray.filter(id =>
        users.some(u => u.id === id)
      );

      if (validStudentIds.length === 0) {
        throw new Error('No valid student IDs provided');
      }

      // Update assessment eligible students
      const currentEligible = new Set(assessment.eligibleStudents || []);
      validStudentIds.forEach(id => currentEligible.add(id));

      const updates = {
        eligibleStudents: Array.from(currentEligible),
        status: ASSESSMENT_STATES.ELIGIBLE,
        updatedBy: unlockedBy,
        updatedAt: new Date().toISOString()
      };

      // Only update if not already eligible
      if (!assessment.eligibleStudents || assessment.eligibleStudents.length === 0) {
        updates.status = ASSESSMENT_STATES.ELIGIBLE;
      }

      await this.updateAssessment(assessmentId, updates, unlockedBy);

      // Update unlocks
      for (const studentId of validStudentIds) {
        await unlockAssessmentForStudent(assessmentId, studentId);
      }

      // Log action
      logAction({
        action: 'ASSESSMENT_UNLOCKED',
        userId: unlockedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          studentCount: validStudentIds.length,
          studentIds: validStudentIds
        }
      });

      return true;
    } catch (error) {
      console.error('Error unlocking assessment:', error);
      throw error;
    }
  }

  /**
   * Lock assessment for specific students
   * @param {string} assessmentId - Assessment ID
   * @param {string|string[]} studentIds - Student ID or array of IDs
   * @param {string} lockedBy - ID of user locking
   * @returns {Promise<boolean>} - Success status
   */
  static async lockForStudents(assessmentId, studentIds, lockedBy = null) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];

      // Update assessment eligible students
      const currentEligible = new Set(assessment.eligibleStudents || []);
      studentIdsArray.forEach(id => currentEligible.delete(id));

      const updates = {
        eligibleStudents: Array.from(currentEligible),
        updatedBy: lockedBy,
        updatedAt: new Date().toISOString()
      };

      // If no more eligible students, update status
      if (currentEligible.size === 0) {
        updates.status = ASSESSMENT_STATES.LOCKED;
      }

      await this.updateAssessment(assessmentId, updates, lockedBy);

      // Update unlocks
      for (const studentId of studentIdsArray) {
        await lockAssessmentForStudent(assessmentId, studentId);
      }

      // Log action
      logAction({
        action: 'ASSESSMENT_LOCKED',
        userId: lockedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          studentCount: studentIdsArray.length,
          studentIds: studentIdsArray
        }
      });

      return true;
    } catch (error) {
      console.error('Error locking assessment:', error);
      throw error;
    }
  }

  /**
   * Check if assessment is unlocked for a student
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @returns {Promise<boolean>} - True if unlocked
   */
  static async isUnlockedForStudent(assessmentId, studentId) {
    try {
      return await isAssessmentUnlockedForStudent(assessmentId, studentId);
    } catch (error) {
      console.error('Error checking if assessment is unlocked:', error);
      return false;
    }
  }

  /**
   * Get eligible students for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Array>} - Array of eligible students
   */
  static async getEligibleStudents(assessmentId) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const students = await getUsers();
      const eligibleStudentIds = assessment.eligibleStudents || assessment.students || [];

      return students.filter(student =>
        eligibleStudentIds.includes(student.id) &&
        student.role === ROLES.STUDENT
      );
    } catch (error) {
      console.error('Error getting eligible students:', error);
      throw error;
    }
  }

  /**
   * Start an assessment for a student
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @returns {Promise<object>} - Assessment attempt data
   */
  static async startAssessment(assessmentId, studentId) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const user = await UserService.getUserById(studentId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if assessment is available
      if (assessment.status !== ASSESSMENT_STATES.OPEN &&
          assessment.status !== ASSESSMENT_STATES.ELIGIBLE) {
        throw new Error('Assessment is not available');
      }

      // Check if student is eligible
      const isEligible = assessment.eligibleStudents?.includes(studentId) ||
                       assessment.students?.includes(studentId) ||
                       assessment.status === ASSESSMENT_STATES.OPEN;

      if (!isEligible) {
        throw new Error('You are not eligible for this assessment');
      }

      // Check if student has remaining attempts
      const results = await getResults();
      const studentAttempts = results.filter(r =>
        r.studentId === studentId && r.assessmentId === assessmentId
      );

      if (studentAttempts.length >= assessment.maxAttempts) {
        throw new Error('You have reached the maximum number of attempts');
      }

      // Check if assessment has started
      const inProgressAttempt = studentAttempts.find(r =>
        r.status === ASSESSMENT_STATES.IN_PROGRESS
      );

      if (inProgressAttempt) {
        // Return existing attempt
        return {
          assessmentId: assessment.id,
          attemptId: inProgressAttempt.id,
          startedAt: inProgressAttempt.startedAt,
          timeRemaining: this.calculateTimeRemaining(assessment, inProgressAttempt.startedAt),
          status: ASSESSMENT_STATES.IN_PROGRESS
        };
      }

      // Create new attempt
      const now = new Date().toISOString();
      const attemptId = `ATTEMPT-${assessmentId}-${studentId}-${Date.now()}`;

      // In a real app, you would save the attempt to storage here
      // For frontend-only, we'll return the attempt data

      // Log action
      logAction({
        action: 'ASSESSMENT_STARTED',
        userId: studentId,
        role: ROLES.STUDENT,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          attempt: studentAttempts.length + 1,
          maxAttempts: assessment.maxAttempts
        }
      });

      return {
        assessmentId: assessment.id,
        attemptId,
        startedAt: now,
        timeRemaining: assessment.duration * 60, // Convert minutes to seconds
        status: ASSESSMENT_STATES.IN_PROGRESS,
        assessment: {
          id: assessment.id,
          title: assessment.title,
          type: assessment.type,
          duration: assessment.duration,
          passingScore: assessment.passingScore,
          questions: assessment.questions,
          practicalTasks: assessment.practicalTasks,
          shuffleQuestions: assessment.shuffleQuestions,
          allowHints: assessment.allowHints
        }
      };
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw error;
    }
  }

  /**
   * Calculate time remaining for an assessment attempt
   * @param {object} assessment - Assessment object
   * @param {string} startedAt - Start time ISO string
   * @returns {number} - Time remaining in seconds
   */
  static calculateTimeRemaining(assessment, startedAt) {
    const durationMinutes = assessment.duration || 60;
    const durationSeconds = durationMinutes * 60;

    const startTime = new Date(startedAt);
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    return Math.max(0, durationSeconds - elapsedSeconds);
  }

  /**
   * Submit an assessment attempt
   * @param {string} assessmentId - Assessment ID
   * @param {string} attemptId - Attempt ID
   * @param {string} studentId - Student ID
   * @param {object} answers - Object with question IDs as keys and answers as values
   * @param {object} practicalAnswers - Object with task IDs as keys and answers as values
   * @returns {Promise<object>} - Assessment result
   */
  static async submitAssessment(assessmentId, attemptId, studentId, answers = {}, practicalAnswers = {}) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const user = await UserService.getUserById(studentId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate score
      const { score, percentage, questionResults, practicalResults } =
        this.calculateScore(assessment, answers, practicalAnswers);

      // Determine pass/fail
      const passed = percentage >= assessment.passingScore;

      // Create result
      const now = new Date().toISOString();
      const resultId = `RESULT-${assessmentId}-${studentId}-${Date.now()}`;

      const result = {
        id: resultId,
        studentId,
        assessmentId,
        assessmentTitle: assessment.title,
        assessmentType: assessment.type,
        attempt: 1, // Will be updated below
        maxAttempts: assessment.maxAttempts,
        startedAt: now, // Should be the actual start time
        submittedAt: now,
        timeTaken: 0, // Should be calculated from start time
        score,
        percentage,
        grade: this.calculateGrade(percentage),
        status: passed ? ASSESSMENT_STATES.PASSED : ASSESSMENT_STATES.FAILED,
        questions: questionResults,
        practicalTasks: practicalResults,
        knowledgeScore: this.calculateKnowledgeScore(questionResults),
        practicalScore: this.calculatePracticalScore(practicalResults),
        securityScore: percentage, // Simplified for demo
        skillBreakdown: this.calculateSkillBreakdown(assessment, answers, practicalAnswers),
        violations: [],
        feedback: passed ?
          'Congratulations! You have passed the assessment.' :
          'Please review the material and try again.',
        published: false,
        createdAt: now
      };

      // Get previous attempts to determine attempt number
      const previousResults = await getResults();
      const studentAttempts = previousResults.filter(r =>
        r.studentId === studentId && r.assessmentId === assessmentId
      );

      result.attempt = studentAttempts.length + 1;

      // Calculate time taken (simplified)
      result.timeTaken = assessment.duration * 60; // Should be actual time

      // Save result
      await addResult(result);

      // Update assessment status if all attempts used
      if (result.attempt >= assessment.maxAttempts) {
        // In a real app, you might want to update the assessment status here
        // For frontend-only, we'll just log it
        logAction({
          action: 'ASSESSMENT_MAX_ATTEMPTS_REACHED',
          userId: studentId,
          role: ROLES.STUDENT,
          target: 'Assessment',
          targetId: assessmentId,
          status: 'Info',
          details: {
            attempt: result.attempt,
            maxAttempts: assessment.maxAttempts
          }
        });
      }

      // Log action
      logAction({
        action: 'ASSESSMENT_SUBMITTED',
        userId: studentId,
        role: ROLES.STUDENT,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          attempt: result.attempt,
          score: result.score,
          percentage: result.percentage,
          passed: result.status
        }
      });

      return result;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }

  /**
   * Calculate score for an assessment
   * @param {object} assessment - Assessment object
   * @param {object} answers - Object with question IDs as keys and answers as values
   * @param {object} practicalAnswers - Object with task IDs as keys and answers as values
   * @returns {object} - Score calculation results
   */
  static calculateScore(assessment, answers = {}, practicalAnswers = {}) {
    let totalPoints = 0;
    let earnedPoints = 0;
    const questionResults = [];
    const practicalResults = [];

    // Calculate question score
    assessment.questions?.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = this.checkAnswer(question, userAnswer);
      const pointsEarned = isCorrect ? (question.points || 1) : 0;

      totalPoints += question.points || 1;
      earnedPoints += pointsEarned;

      questionResults.push({
        questionId: question.id,
        questionType: question.type,
        answer: userAnswer,
        isCorrect,
        pointsEarned,
        pointsPossible: question.points || 1
      });
    });

    // Calculate practical task score
    assessment.practicalTasks?.forEach(task => {
      const userAnswer = practicalAnswers[task.id];
      const isCorrect = userAnswer === task.flag; // Simplified for demo
      const pointsEarned = isCorrect ? (task.points || 1) : 0;

      totalPoints += task.points || 1;
      earnedPoints += pointsEarned;

      practicalResults.push({
        taskId: task.id,
        answer: userAnswer,
        isCorrect,
        pointsEarned,
        pointsPossible: task.points || 1,
        flag: task.flag // Only in demo
      });
    });

    const score = earnedPoints;
    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return { score, percentage, questionResults, practicalResults };
  }

  /**
   * Check if an answer is correct
   * @param {object} question - Question object
   * @param {any} userAnswer - User's answer
   * @returns {boolean} - True if answer is correct
   */
  static checkAnswer(question, userAnswer) {
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      return false;
    }

    switch (question.type) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return userAnswer === question.correctAnswer;

      case QUESTION_TYPES.MULTIPLE_SELECT:
        if (!Array.isArray(userAnswer)) return false;
        return JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());

      case QUESTION_TYPES.TRUE_FALSE:
        return userAnswer === question.correctAnswer;

      case QUESTION_TYPES.SHORT_ANSWER:
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

      case QUESTION_TYPES.FLAG_SUBMISSION:
        return userAnswer === question.correctAnswer;

      case QUESTION_TYPES.ORDERING:
        if (!Array.isArray(userAnswer)) return false;
        return JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);

      case QUESTION_TYPES.SCENARIO_DECISION:
        return userAnswer === question.correctAnswer;

      case QUESTION_TYPES.LOG_ANALYSIS:
        // For demo, just check if answer matches
        return userAnswer === question.correctAnswer;

      default:
        return false;
    }
  }

  /**
   * Calculate letter grade from percentage
   * @param {number} percentage - Percentage score
   * @returns {string} - Letter grade
   */
  static calculateGrade(percentage) {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'A-';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'C-';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  /**
   * Calculate knowledge score from question results
   * @param {Array} questionResults - Array of question results
   * @returns {number} - Knowledge score (0-100)
   */
  static calculateKnowledgeScore(questionResults) {
    if (questionResults.length === 0) return 0;

    const totalPoints = questionResults.reduce((sum, q) => sum + (q.pointsPossible || 1), 0);
    const earnedPoints = questionResults.reduce((sum, q) => sum + (q.pointsEarned || 0), 0);

    return Math.round((earnedPoints / totalPoints) * 100);
  }

  /**
   * Calculate practical score from practical results
   * @param {Array} practicalResults - Array of practical results
   * @returns {number} - Practical score (0-100)
   */
  static calculatePracticalScore(practicalResults) {
    if (practicalResults.length === 0) return 0;

    const totalPoints = practicalResults.reduce((sum, p) => sum + (p.pointsPossible || 1), 0);
    const earnedPoints = practicalResults.reduce((sum, p) => sum + (p.pointsEarned || 0), 0);

    return Math.round((earnedPoints / totalPoints) * 100);
  }

  /**
   * Calculate skill breakdown from assessment results
   * @param {object} assessment - Assessment object
   * @param {object} answers - User's answers
   * @param {object} practicalAnswers - User's practical answers
   * @returns {object} - Skill breakdown by domain
   */
  static calculateSkillBreakdown(assessment, answers = {}, practicalAnswers = {}) {
    const breakdown = {
      web: { correct: 0, total: 0, percentage: 0 },
      network: { correct: 0, total: 0, percentage: 0 },
      linux: { correct: 0, total: 0, percentage: 0 },
      windows: { correct: 0, total: 0, percentage: 0 },
      ad: { correct: 0, total: 0, percentage: 0 },
      soc: { correct: 0, total: 0, percentage: 0 },
      forensics: { correct: 0, total: 0, percentage: 0 },
      cloud: { correct: 0, total: 0, percentage: 0 },
      ai: { correct: 0, total: 0, percentage: 0 },
      devsecops: { correct: 0, total: 0, percentage: 0 },
      cryptography: { correct: 0, total: 0, percentage: 0 },
      pentesting: { correct: 0, total: 0, percentage: 0 }
    };

    // Process questions
    assessment.questions?.forEach(question => {
      const domain = question.domain || assessment.domain || 'general';
      const domainKey = this.normalizeDomain(domain);
      if (breakdown[domainKey]) {
        breakdown[domainKey].total++;
        if (this.checkAnswer(question, answers[question.id])) {
          breakdown[domainKey].correct++;
        }
      }
    });

    // Process practical tasks
    assessment.practicalTasks?.forEach(task => {
      const domain = task.domain || assessment.domain || 'general';
      const domainKey = this.normalizeDomain(domain);
      if (breakdown[domainKey]) {
        breakdown[domainKey].total++;
        if (practicalAnswers[task.id] === task.flag) {
          breakdown[domainKey].correct++;
        }
      }
    });

    // Calculate percentages
    Object.keys(breakdown).forEach(key => {
      if (breakdown[key].total > 0) {
        breakdown[key].percentage = Math.round(
          (breakdown[key].correct / breakdown[key].total) * 100
        );
      }
    });

    return breakdown;
  }

  /**
   * Normalize domain name to match breakdown keys
   * @param {string} domain - Domain name
   * @returns {string} - Normalized domain key
   */
  static normalizeDomain(domain) {
    if (!domain) return 'general';

    const normalized = domain.toLowerCase();
    if (normalized.includes('web')) return 'web';
    if (normalized.includes('network')) return 'network';
    if (normalized.includes('linux')) return 'linux';
    if (normalized.includes('windows')) return 'windows';
    if (normalized.includes('active directory') || normalized.includes('ad')) return 'ad';
    if (normalized.includes('soc')) return 'soc';
    if (normalized.includes('forensic')) return 'forensics';
    if (normalized.includes('cloud')) return 'cloud';
    if (normalized.includes('ai') || normalized.includes('artificial intelligence')) return 'ai';
    if (normalized.includes('devsecops') || normalized.includes('devops')) return 'devsecops';
    if (normalized.includes('cryptography') || normalized.includes('crypto')) return 'cryptography';
    if (normalized.includes('pentesting') || normalized.includes('penetration')) return 'pentesting';

    return 'general';
  }

  /**
   * Grade a submitted assessment (faculty only)
   * @param {string} resultId - Result ID
   * @param {object} grades - Grading data
   * @param {string} gradedBy - ID of user grading
   * @returns {Promise<object>} - Updated result
   */
  static async gradeAssessment(resultId, grades, gradedBy = null) {
    try {
      const result = (await getResults()).find(r => r.id === resultId);
      if (!result) {
        throw new Error('Result not found');
      }

      if (result.status !== ASSESSMENT_STATES.SUBMITTED &&
          result.status !== ASSESSMENT_STATES.UNDER_REVIEW) {
        throw new Error('Assessment cannot be graded in its current state');
      }

      // Update grades
      const updates = {
        ...grades,
        status: ASSESSMENT_STATES.UNDER_REVIEW,
        gradedBy: gradedBy,
        gradedAt: new Date().toISOString()
      };

      // If all questions are graded, mark as ready to publish
      const allQuestionsGraded = result.questions.every(q => q.graded !== undefined);
      const allPracticalGraded = result.practicalTasks.every(p => p.graded !== undefined);

      if (allQuestionsGraded && allPracticalGraded) {
        updates.status = 'Ready to Publish';
      }

      const updatedResult = await updateResult(resultId, updates);

      // Log action
      logAction({
        action: 'ASSESSMENT_GRADED',
        userId: gradedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Result',
        targetId: resultId,
        status: 'Success',
        details: {
          studentId: result.studentId,
          assessmentId: result.assessmentId,
          score: updatedResult.score
        }
      });

      return updatedResult;
    } catch (error) {
      console.error('Error grading assessment:', error);
      throw error;
    }
  }

  /**
   * Publish assessment results
   * @param {string} resultId - Result ID
   * @param {string} publishedBy - ID of user publishing
   * @returns {Promise<object>} - Updated result
   */
  static async publishResult(resultId, publishedBy = null) {
    try {
      const result = (await getResults()).find(r => r.id === resultId);
      if (!result) {
        throw new Error('Result not found');
      }

      if (result.status !== ASSESSMENT_STATES.UNDER_REVIEW &&
          result.status !== 'Ready to Publish') {
        throw new Error('Result cannot be published in its current state');
      }

      const updates = {
        published: true,
        publishedAt: new Date().toISOString(),
        publishedBy: publishedBy,
        status: result.status === ASSESSMENT_STATES.PASSED ?
          ASSESSMENT_STATES.PASSED : ASSESSMENT_STATES.FAILED
      };

      const updatedResult = await updateResult(resultId, updates);

      // Update student progress
      const user = await UserService.getUserById(result.studentId);
      if (user) {
        const progress = await UserService.getProgress(result.studentId);
        const currentXP = progress.xp || 0;

        // Award XP based on score
        const xpEarned = Math.round(result.percentage * 10);
        await UserService.updateProgress(result.studentId, {
          xp: currentXP + xpEarned,
          lastAssessment: new Date().toISOString()
        });

        // Update streak
        const lastAssessment = progress.lastAssessment ?
          new Date(progress.lastAssessment) : new Date(0);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastAssessment >= yesterday) {
          await UserService.updateProgress(result.studentId, {
            streak: (progress.streak || 0) + 1
          });
        } else {
          await UserService.updateProgress(result.studentId, {
            streak: 1
          });
        }
      }

      // Log action
      logAction({
        action: 'RESULT_PUBLISHED',
        userId: publishedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Result',
        targetId: resultId,
        status: 'Success',
        details: {
          studentId: result.studentId,
          assessmentId: result.assessmentId,
          score: result.score,
          percentage: result.percentage
        }
      });

      return updatedResult;
    } catch (error) {
      console.error('Error publishing result:', error);
      throw error;
    }
  }

  /**
   * Reset assessment attempts for a student
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @param {string} resetBy - ID of user resetting
   * @returns {Promise<boolean>} - Success status
   */
  static async resetAttempts(assessmentId, studentId, resetBy = null) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // Delete all results for this assessment and student
      const results = await getResults();
      const studentResults = results.filter(r =>
        r.assessmentId === assessmentId && r.studentId === studentId
      );

      for (const result of studentResults) {
        await deleteResult(result.id);
      }

      // Lock the assessment for the student
      await lockAssessmentForStudent(assessmentId, studentId);

      // Update assessment status if needed
      const remainingEligible = assessment.eligibleStudents?.filter(id => id !== studentId) || [];
      if (remainingEligible.length === 0) {
        await this.updateAssessment(assessmentId, {
          eligibleStudents: [],
          status: ASSESSMENT_STATES.LOCKED
        }, resetBy);
      } else {
        await this.updateAssessment(assessmentId, {
          eligibleStudents: remainingEligible
        }, resetBy);
      }

      // Log action
      logAction({
        action: 'ASSESSMENT_ATTEMPTS_RESET',
        userId: resetBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: {
          studentId: studentId,
          attemptCount: studentResults.length
        }
      });

      return true;
    } catch (error) {
      console.error('Error resetting attempts:', error);
      throw error;
    }
  }

  /**
   * Record a violation during assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @param {string} violationType - Type of violation
   * @param {string} details - Violation details
   * @returns {Promise<object>} - Created violation
   */
  static async recordViolation(assessmentId, studentId, violationType, details = {}) {
    try {
      const violation = {
        id: `VIO-${Date.now()}`,
        studentId,
        assessmentId,
        type: violationType,
        severity: this.determineViolationSeverity(violationType),
        timestamp: new Date().toISOString(),
        details,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      await addViolation(violation);

      // Update result with violation
      const results = await getResults();
      const activeResult = results.find(r =>
        r.assessmentId === assessmentId &&
        r.studentId === studentId &&
        (r.status === ASSESSMENT_STATES.IN_PROGRESS ||
         r.status === ASSESSMENT_STATES.SUBMITTED)
      );

      if (activeResult) {
        const updatedResult = await updateResult(activeResult.id, {
          violations: [...(activeResult.violations || []), violation.id]
        });
      }

      // Log action
      logAction({
        action: 'VIOLATION_RECORDED',
        userId: studentId,
        role: ROLES.STUDENT,
        target: 'Violation',
        targetId: violation.id,
        status: 'Success',
        details: {
          assessmentId,
          type: violationType,
          severity: violation.severity
        }
      });

      return violation;
    } catch (error) {
      console.error('Error recording violation:', error);
      throw error;
    }
  }

  /**
   * Determine violation severity based on type
   * @param {string} violationType - Type of violation
   * @returns {string} - Severity level
   */
  static determineViolationSeverity(violationType) {
    const severityMap = {
      [VIOLATION_TYPES.TAB_SWITCH]: VIOLATION_SEVERITY.MEDIUM,
      [VIOLATION_TYPES.WINDOW_BLUR]: VIOLATION_SEVERITY.LOW,
      [VIOLATION_TYPES.COPY_ATTEMPT]: VIOLATION_SEVERITY.HIGH,
      [VIOLATION_TYPES.PASTE_ATTEMPT]: VIOLATION_SEVERITY.HIGH,
      [VIOLATION_TYPES.MULTIPLE_LOGIN]: VIOLATION_SEVERITY.CRITICAL,
      [VIOLATION_TYPES.SESSION_TIMEOUT]: VIOLATION_SEVERITY.MEDIUM
    };

    return severityMap[violationType] || VIOLATION_SEVERITY.LOW;
  }

  /**
   * Get assessment statistics for a faculty member
   * @param {string} facultyId - Faculty ID
   * @returns {Promise<object>} - Assessment statistics
   */
  static async getFacultyAssessmentStats(facultyId) {
    try {
      const assessments = await this.getAllAssessments({ facultyId });
      const results = await getResults();
      const users = await getUsers();

      const facultyAssessmentIds = assessments.map(a => a.id);
      const facultyResults = results.filter(r => facultyAssessmentIds.includes(r.assessmentId));

      const totalAssessments = assessments.length;
      const totalAttempts = facultyResults.length;
      const passedAttempts = facultyResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
      const failedAttempts = facultyResults.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;

      const passRate = totalAttempts > 0 ?
        Math.round((passedAttempts / totalAttempts) * 100) : 0;

      const averageScore = facultyResults.length > 0 ?
        Math.round(facultyResults.reduce((sum, r) => sum + r.percentage, 0) / facultyResults.length) : 0;

      // Get most difficult assessments (lowest pass rate)
      const assessmentStats = assessments.map(assessment => {
        const assessmentResults = facultyResults.filter(r => r.assessmentId === assessment.id);
        const assessmentPassed = assessmentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
        const assessmentPassRate = assessmentResults.length > 0 ?
          Math.round((assessmentPassed / assessmentResults.length) * 100) : 0;

        return {
          assessmentId: assessment.id,
          assessmentTitle: assessment.title,
          attemptCount: assessmentResults.length,
          passRate: assessmentPassRate,
          averageScore: assessmentResults.length > 0 ?
            Math.round(assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length) : 0
        };
      }).sort((a, b) => a.passRate - b.passRate);

      const mostDifficult = assessmentStats.slice(0, 3);
      const easiest = assessmentStats.slice(-3).reverse();

      // Get student performance
      const studentPerformance = users
        .filter(u => u.role === ROLES.STUDENT)
        .map(student => {
          const studentResults = facultyResults.filter(r => r.studentId === student.id);
          const studentPassed = studentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
          const studentPassRate = studentResults.length > 0 ?
            Math.round((studentPassed / studentResults.length) * 100) : 0;
          const studentAvgScore = studentResults.length > 0 ?
            Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length) : 0;

          return {
            studentId: student.id,
            studentName: student.name,
            attemptCount: studentResults.length,
            passRate: studentPassRate,
            averageScore: studentAvgScore
          };
        })
        .sort((a, b) => b.averageScore - a.averageScore);

      const topPerformers = studentPerformance.slice(0, 5);
      const needsImprovement = studentPerformance.slice(-5).reverse();

      return {
        totalAssessments,
        totalAttempts,
        passedAttempts,
        failedAttempts,
        passRate,
        averageScore,
        mostDifficult,
        easiest,
        topPerformers,
        needsImprovement,
        pendingReviews: facultyResults.filter(r => r.status === ASSESSMENT_STATES.SUBMITTED).length
      };
    } catch (error) {
      console.error('Error getting faculty assessment stats:', error);
      throw error;
    }
  }

  /**
   * Get assessment statistics for admin dashboard
   * @returns {Promise<object>} - Assessment statistics
   */
  static async getAssessmentStats() {
    try {
      const assessments = await getAssessments();
      const results = await getResults();
      const users = await getUsers();

      const totalAssessments = assessments.length;
      const publishedAssessments = assessments.filter(a => a.isPublished).length;
      const totalAttempts = results.length;
      const passedAttempts = results.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
      const failedAttempts = results.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;

      const passRate = totalAttempts > 0 ?
        Math.round((passedAttempts / totalAttempts) * 100) : 0;

      const averageScore = totalAttempts > 0 ?
        Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts) : 0;

      // Group by assessment type
      // Group by assessment type
      const typeDistribution = {};
      Object.values(ASSESSMENT_TYPES).forEach(type => {
        typeDistribution[type] = assessments.filter(a => a.type === type).length;
      });

      // Group by status
      const statusDistribution = {};
      Object.values(ASSESSMENT_STATES).forEach(state => {
        statusDistribution[state] = assessments.filter(a => a.status === state).length;
      });

      // Group by domain
      const domainDistribution = {};
      const allDomains = [...new Set(assessments.map(a => a.domain).filter(d => d))];
      allDomains.forEach(domain => {
        domainDistribution[domain] = assessments.filter(a => a.domain === domain).length;
      });

      // Group by difficulty
      const difficultyDistribution = {};
      Object.values(DIFFICULTY_LEVELS).forEach(difficulty => {
        difficultyDistribution[difficulty] = assessments.filter(a => a.difficulty === difficulty).length;
      });

      // Get recent assessments
      const recentAssessments = assessments
        .filter(a => a.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(a => ({
          id: a.id,
          title: a.title,
          type: a.type,
          createdAt: a.createdAt,
          status: a.status
        }));

      // Get assessments with most attempts
      const attemptCounts = assessments.map(assessment => {
        const assessmentResults = results.filter(r => r.assessmentId === assessment.id);
        return {
          assessmentId: assessment.id,
          assessmentTitle: assessment.title,
          attemptCount: assessmentResults.length,
          passRate: assessmentResults.length > 0 ?
            Math.round(assessmentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length /
                      assessmentResults.length * 100) : 0
        };
      }).sort((a, b) => b.attemptCount - a.attemptCount);

      const mostAttempted = attemptCounts.slice(0, 5);

      // Get assessments with lowest pass rates
      const lowestPassRates = attemptCounts
        .filter(a => a.attemptCount > 0)
        .sort((a, b) => a.passRate - b.passRate)
        .slice(0, 5);

      // Get pending reviews
      const pendingReviews = results.filter(r =>
        r.status === ASSESSMENT_STATES.SUBMITTED ||
        r.status === ASSESSMENT_STATES.UNDER_REVIEW
      ).length;

      return {
        totalAssessments,
        publishedAssessments,
        totalAttempts,
        passedAttempts,
        failedAttempts,
        passRate,
        averageScore,
        typeDistribution,
        statusDistribution,
        domainDistribution,
        difficultyDistribution,
        recentAssessments,
        mostAttempted,
        lowestPassRates,
        pendingReviews,
        violationCount: (await getViolations()).filter(v => v.type).length
      };
    } catch (error) {
      console.error('Error getting assessment stats:', error);
      throw error;
    }
  }

  /**
   * Search assessments with advanced filtering
   * @param {object} options - Search options
   * @returns {Promise<object>} - Search results with pagination
   */
  static async searchAssessments(options = {}) {
    try {
      const {
        query = '',
        type,
        domain,
        level,
        difficulty,
        status,
        courseId,
        facultyId,
        page = 1,
        limit = 10,
        sortBy = 'title',
        sortOrder = 'asc'
      } = options;

      let assessments = await this.getAllAssessments({
        type,
        domain,
        level,
        difficulty,
        status,
        courseId,
        facultyId,
        search: query
      });

      // Sort
      assessments.sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'type':
            aVal = a.type.toLowerCase();
            bVal = b.type.toLowerCase();
            break;
          case 'level':
            aVal = a.level;
            bVal = b.level;
            break;
          case 'difficulty':
            aVal = DIFFICULTY_LEVELS[a.difficulty] || 0;
            bVal = DIFFICULTY_LEVELS[b.difficulty] || 0;
            break;
          case 'createdAt':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            break;
          case 'updatedAt':
            aVal = new Date(a.updatedAt);
            bVal = new Date(b.updatedAt);
            break;
          case 'attempts':
            aVal = this.getAttemptCount(a.id);
            bVal = this.getAttemptCount(b.id);
            break;
          case 'passRate':
            aVal = this.getPassRate(a.id);
            bVal = this.getPassRate(b.id);
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
      const paginatedAssessments = assessments.slice(startIndex, startIndex + limit);
      const total = assessments.length;
      const totalPages = Math.ceil(total / limit);

      return {
        assessments: paginatedAssessments,
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
      console.error('Error searching assessments:', error);
      throw error;
    }
  }

  /**
   * Get attempt count for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {number} - Number of attempts
   */
  static async getAttemptCount(assessmentId) {
    try {
      const results = await getResults();
      return results.filter(r => r.assessmentId === assessmentId).length;
    } catch (error) {
      console.error('Error getting attempt count:', error);
      return 0;
    }
  }

  /**
   * Get pass rate for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {number} - Pass rate percentage
   */
  static async getPassRate(assessmentId) {
    try {
      const results = await getResults();
      const assessmentResults = results.filter(r => r.assessmentId === assessmentId);
      const passedResults = assessmentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED);

      return assessmentResults.length > 0 ?
        Math.round((passedResults.length / assessmentResults.length) * 100) : 0;
    } catch (error) {
      console.error('Error getting pass rate:', error);
      return 0;
    }
  }

  /**
   * Get average score for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {number} - Average score percentage
   */
  static async getAverageScore(assessmentId) {
    try {
      const results = await getResults();
      const assessmentResults = results.filter(r => r.assessmentId === assessmentId);

      return assessmentResults.length > 0 ?
        Math.round(assessmentResults.reduce((sum, r) => sum + r.percentage, 0) /
                  assessmentResults.length) : 0;
    } catch (error) {
      console.error('Error getting average score:', error);
      return 0;
    }
  }

  /**
   * Bulk unlock assessments for students
   * @param {string[]} assessmentIds - Array of assessment IDs
   * @param {string[]} studentIds - Array of student IDs
   * @param {string} unlockedBy - ID of user unlocking
   * @returns {Promise<object>} - Result object
   */
  static async bulkUnlockAssessments(assessmentIds, studentIds, unlockedBy = null) {
    try {
      const results = await Promise.all(
        assessmentIds.map(assessmentId =>
          this.unlockForStudents(assessmentId, studentIds, unlockedBy)
        )
      );

      const successCount = results.filter(r => r).length;

      // Log action
      logAction({
        action: 'BULK_ASSESSMENTS_UNLOCKED',
        userId: unlockedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Assessment',
        status: 'Success',
        details: {
          assessmentCount: assessmentIds.length,
          studentCount: studentIds.length,
          successCount
        }
      });

      return {
        success: true,
        unlockedCount: successCount,
        failedCount: assessmentIds.length - successCount
      };
    } catch (error) {
      console.error('Error bulk unlocking assessments:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get assessment details for student view
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @returns {Promise<object>} - Assessment details with student-specific info
   */
  static async getAssessmentDetails(assessmentId, studentId) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const user = await UserService.getUserById(studentId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get student's results for this assessment
      const results = await getResults();
      const studentResults = results.filter(r =>
        r.studentId === studentId && r.assessmentId === assessmentId
      );

      // Get course details if assessment is part of a course
      let course = null;
      if (assessment.courseId) {
        course = await CourseService.getCourseById(assessment.courseId);
      }

      // Check if assessment is unlocked
      const isUnlocked = await this.isUnlockedForStudent(assessmentId, studentId);

      // Check if assessment is available
      const now = new Date();
      const startDate = assessment.startDate ? new Date(assessment.startDate) : null;
      const endDate = assessment.endDate ? new Date(assessment.endDate) : null;

      const isAvailable = assessment.status === ASSESSMENT_STATES.OPEN ||
                         (assessment.status === ASSESSMENT_STATES.ELIGIBLE && isUnlocked) ||
                         (startDate && now >= startDate) ||
                         (!endDate || now <= endDate);

      // Check if student has attempts remaining
      const hasAttemptsRemaining = studentResults.length < assessment.maxAttempts;

      // Get latest attempt
      const latestAttempt = studentResults.length > 0 ?
        studentResults[studentResults.length - 1] : null;

      // Check prerequisites
      const prerequisitesMet = course ?
        await CourseService.checkPrerequisites(studentId, course.id) : true;

      return {
        assessment: {
          ...assessment,
          isUnlocked,
          isAvailable,
          hasAttemptsRemaining,
          attemptsUsed: studentResults.length,
          maxAttempts: assessment.maxAttempts
        },
        course,
        prerequisitesMet,
        studentResults,
        latestAttempt
      };
    } catch (error) {
      console.error('Error getting assessment details:', error);
      throw error;
    }
  }

  /**
   * Get assessment timer status
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @returns {Promise<object>} - Timer status
   */
  static async getTimerStatus(assessmentId, studentId) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const results = await getResults();
      const activeAttempt = results.find(r =>
        r.assessmentId === assessmentId &&
        r.studentId === studentId &&
        r.status === ASSESSMENT_STATES.IN_PROGRESS
      );

      const now = new Date();

      if (!activeAttempt) {
        // No active attempt, check if assessment is available
        if (assessment.status !== ASSESSMENT_STATES.OPEN &&
            assessment.status !== ASSESSMENT_STATES.ELIGIBLE) {
          return {
            isRunning: false,
            timeRemaining: 0,
            startedAt: null,
            canStart: false,
            reason: 'Assessment not available'
          };
        }

        // Check if student is eligible
        const isEligible = assessment.eligibleStudents?.includes(studentId) ||
                         assessment.students?.includes(studentId) ||
                         assessment.status === ASSESSMENT_STATES.OPEN;

        if (!isEligible) {
          return {
            isRunning: false,
            timeRemaining: 0,
            startedAt: null,
            canStart: false,
            reason: 'Not eligible'
          };
        }

        // Check start date
        if (assessment.startDate) {
          const startDate = new Date(assessment.startDate);
          if (now < startDate) {
            const timeUntilStart = Math.floor((startDate - now) / 1000);
            return {
              isRunning: false,
              timeRemaining: 0,
              startedAt: null,
              canStart: false,
              reason: 'Not started yet',
              timeUntilStart
            };
          }
        }

        return {
          isRunning: false,
          timeRemaining: assessment.duration * 60,
          startedAt: null,
          canStart: true,
          reason: 'Ready to start'
        };
      }

      // Active attempt exists
      const startedAt = new Date(activeAttempt.startedAt);
      const durationSeconds = assessment.duration * 60;
      const elapsedSeconds = Math.floor((now - startedAt) / 1000);
      const timeRemaining = Math.max(0, durationSeconds - elapsedSeconds);

      return {
        isRunning: true,
        timeRemaining,
        startedAt: activeAttempt.startedAt,
        canStart: false,
        reason: 'In progress',
        duration: assessment.duration,
        elapsedTime: elapsedSeconds
      };
    } catch (error) {
      console.error('Error getting timer status:', error);
      throw error;
    }
  }

  /**
   * Save assessment progress (auto-save)
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @param {object} answers - Current answers
   * @param {object} practicalAnswers - Current practical answers
   * @returns {Promise<object>} - Saved progress
   */
  static async saveProgress(assessmentId, studentId, answers = {}, practicalAnswers = {}) {
    try {
      const assessment = await this.getAssessmentById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const results = await getResults();
      const activeAttempt = results.find(r =>
        r.assessmentId === assessmentId &&
        r.studentId === studentId &&
        (r.status === ASSESSMENT_STATES.IN_PROGRESS || r.status === ASSESSMENT_STATES.SUBMITTED)
      );

      if (!activeAttempt) {
        throw new Error('No active attempt found');
      }

      // Update the attempt with current answers
      const updates = {
        answers: answers,
        practicalAnswers: practicalAnswers,
        lastSaved: new Date().toISOString()
      };

      const updatedResult = await updateResult(activeAttempt.id, updates);

      return {
        success: true,
        savedAt: updatedResult.lastSaved,
        answers: updatedResult.answers,
        practicalAnswers: updatedResult.practicalAnswers
      };
    } catch (error) {
      console.error('Error saving progress:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load saved assessment progress
   * @param {string} assessmentId - Assessment ID
   * @param {string} studentId - Student ID
   * @returns {Promise<object>} - Saved progress
   */
  static async loadProgress(assessmentId, studentId) {
    try {
      const results = await getResults();
      const activeAttempt = results.find(r =>
        r.assessmentId === assessmentId &&
        r.studentId === studentId &&
        (r.status === ASSESSMENT_STATES.IN_PROGRESS || r.status === ASSESSMENT_STATES.SUBMITTED)
      );

      if (!activeAttempt) {
        return { answers: {}, practicalAnswers: {} };
      }

      return {
        answers: activeAttempt.answers || {},
        practicalAnswers: activeAttempt.practicalAnswers || {},
        lastSaved: activeAttempt.lastSaved
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return { answers: {}, practicalAnswers: {} };
    }
  }
}

// ===== EXPORT =====
export default AssessmentService;