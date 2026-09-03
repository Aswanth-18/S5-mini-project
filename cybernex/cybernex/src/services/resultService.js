/**
 * CyberNex - Result Service
 * Service layer for assessment result management
 */

import {
  getResults, setResults, addResult, updateResult, deleteResult,
  getUsers, getAssessments,
  logAction
} from './storageService';
import { ROLES, ASSESSMENT_STATES } from '../utils/constants';
import UserService from './userService';
import AssessmentService from './assessmentService';

class ResultService {
  /**
   * Get all results
   * @param {object} options - Filter options
   * @returns {Promise<Array>} - Array of results
   */
  static async getAllResults(options = {}) {
    try {
      let results = await getResults();

      if (options.studentId) {
        results = results.filter(r => r.studentId === options.studentId);
      }

      if (options.assessmentId) {
        results = results.filter(r => r.assessmentId === options.assessmentId);
      }

      if (options.status) {
        results = results.filter(r => r.status === options.status);
      }

      if (options.published !== undefined) {
        results = results.filter(r => r.published === options.published);
      }

      if (options.graded !== undefined) {
        results = results.filter(r => r.graded === options.graded);
      }

      if (options.search) {
        const query = options.search.toLowerCase();
        results = results.filter(r =>
          r.studentId.toLowerCase().includes(query) ||
          r.assessmentId.toLowerCase().includes(query) ||
          (r.assessmentTitle && r.assessmentTitle.toLowerCase().includes(query))
        );
      }

      return results;
    } catch (error) {
      console.error('Error getting results:', error);
      throw error;
    }
  }

  /**
   * Get result by ID
   * @param {string} resultId - Result ID
   * @returns {Promise<object|null>} - Result or null
   */
  static async getResultById(resultId) {
    try {
      const results = await getResults();
      return results.find(r => r.id === resultId) || null;
    } catch (error) {
      console.error('Error getting result by ID:', error);
      throw error;
    }
  }

  /**
   * Get results for a student
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} - Array of results
   */
  static async getResultsForStudent(studentId) {
    try {
      const results = await getResults();
      return results.filter(r => r.studentId === studentId);
    } catch (error) {
      console.error('Error getting results for student:', error);
      throw error;
    }
  }

  /**
   * Get results for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Array>} - Array of results
   */
  static async getResultsForAssessment(assessmentId) {
    try {
      const results = await getResults();
      return results.filter(r => r.assessmentId === assessmentId);
    } catch (error) {
      console.error('Error getting results for assessment:', error);
      throw error;
    }
  }

  /**
   * Create a new result (used by assessment submission)
   * @param {object} resultData - Result data
   * @returns {Promise<object>} - Created result
   */
  static async createResult(resultData) {
    try {
      const newResult = {
        ...resultData,
        id: `RESULT-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: false,
        graded: false
      };

      await addResult(newResult);
      return newResult;
    } catch (error) {
      console.error('Error creating result:', error);
      throw error;
    }
  }

  /**
   * Update a result
   * @param {string} resultId - Result ID
   * @param {object} updates - Updates to apply
   * @param {string} updatedBy - ID of user updating
   * @returns {Promise<object>} - Updated result
   */
  static async updateResult(resultId, updates, updatedBy = null) {
    try {
      const oldResult = await this.getResultById(resultId);
      if (!oldResult) {
        throw new Error('Result not found');
      }

      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();

      const updatedResult = await updateResult(resultId, updates);

      // Log action
      logAction({
        action: 'RESULT_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Result',
        targetId: resultId,
        status: 'Success',
        details: {
          studentId: oldResult.studentId,
          assessmentId: oldResult.assessmentId,
          changes: Object.keys(updates).filter(k => k !== 'updatedBy' && k !== 'updatedAt')
        }
      });

      return updatedResult;
    } catch (error) {
      console.error('Error updating result:', error);
      throw error;
    }
  }

  /**
   * Delete a result
   * @param {string} resultId - Result ID
   * @param {string} deletedBy - ID of user deleting
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteResult(resultId, deletedBy = null) {
    try {
      const result = await this.getResultById(resultId);
      if (!result) {
        throw new Error('Result not found');
      }

      await deleteResult(resultId);

      // Log action
      logAction({
        action: 'RESULT_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Result',
        targetId: resultId,
        status: 'Success',
        details: {
          studentId: result.studentId,
          assessmentId: result.assessmentId
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error;
    }
  }

  /**
   * Publish a result
   * @param {string} resultId - Result ID
   * @param {string} publishedBy - ID of user publishing
   * @returns {Promise<object>} - Updated result
   */
  static async publishResult(resultId, publishedBy = null) {
    try {
      const result = await this.getResultById(resultId);
      if (!result) {
        throw new Error('Result not found');
      }

      const updates = {
        published: true,
        publishedAt: new Date().toISOString(),
        publishedBy: publishedBy
      };

      const updatedResult = await this.updateResult(resultId, updates, publishedBy);

      // Update student XP
      const xpEarned = Math.round(result.percentage * 10);
      await UserService.addXP(result.studentId, xpEarned);

      // Update student streak
      await this.updateStudentStreak(result.studentId);

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
   * Grade a result (for manual grading)
   * @param {string} resultId - Result ID
   * @param {object} grades - Grading data
   * @param {string} gradedBy - ID of user grading
   * @returns {Promise<object>} - Updated result
   */
  static async gradeResult(resultId, grades, gradedBy = null) {
    try {
      const result = await this.getResultById(resultId);
      if (!result) {
        throw new Error('Result not found');
      }

      const updates = {
        ...grades,
        graded: true,
        gradedAt: new Date().toISOString(),
        gradedBy: gradedBy,
        status: result.percentage >= result.passingScore ? ASSESSMENT_STATES.PASSED : ASSESSMENT_STATES.FAILED
      };

      const updatedResult = await this.updateResult(resultId, updates, gradedBy);
      return updatedResult;
    } catch (error) {
      console.error('Error grading result:', error);
      throw error;
    }
  }

  /**
   * Update student streak after result publishing
   * @param {string} studentId - Student ID
   */
  static async updateStudentStreak(studentId) {
    try {
      const progress = await UserService.getProgress(studentId);
      const lastAssessment = progress.lastAssessment ?
        new Date(progress.lastAssessment) : new Date(0);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastAssessment >= yesterday) {
        await UserService.updateProgress(studentId, {
          streak: (progress.streak || 0) + 1,
          lastAssessment: new Date().toISOString()
        });
      } else {
        await UserService.updateProgress(studentId, {
          streak: 1,
          lastAssessment: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating student streak:', error);
    }
  }

  /**
   * Get result statistics for a faculty member
   * @param {string} facultyId - Faculty ID
   * @returns {Promise<object>} - Result statistics
   */
  static async getFacultyResultStats(facultyId) {
    try {
      const faculty = await UserService.getFacultyById(facultyId);
      if (!faculty) {
        throw new Error('Faculty not found');
      }

      const assessments = await AssessmentService.getAllAssessments({ facultyId });
      const assessmentIds = assessments.map(a => a.id);
      const results = await this.getAllResults();

      const facultyResults = results.filter(r => assessmentIds.includes(r.assessmentId));
      const totalResults = facultyResults.length;
      const passedResults = facultyResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
      const failedResults = facultyResults.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;

      const passRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;
      const averageScore = totalResults > 0 ?
        Math.round(facultyResults.reduce((sum, r) => sum + r.percentage, 0) / totalResults) : 0;

      // Get assessment statistics
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
      const users = await getUsers();
      const studentUsers = users.filter(u => u.role === ROLES.STUDENT);
      const studentPerformance = studentUsers.map(student => {
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
      }).sort((a, b) => b.averageScore - a.averageScore);

      const topPerformers = studentPerformance.slice(0, 5);
      const needsImprovement = studentPerformance.slice(-5).reverse();

      return {
        totalResults,
        passedResults,
        failedResults,
        passRate,
        averageScore,
        mostDifficult,
        easiest,
        topPerformers,
        needsImprovement,
        pendingReviews: facultyResults.filter(r => r.status === ASSESSMENT_STATES.SUBMITTED).length,
        unpublishedResults: facultyResults.filter(r => !r.published).length
      };
    } catch (error) {
      console.error('Error getting faculty result stats:', error);
      throw error;
    }
  }

  /**
   * Get result statistics for admin dashboard
   * @returns {Promise<object>} - Result statistics
   */
  static async getResultStats() {
    try {
      const results = await getResults();
      const assessments = await getAssessments();
      const users = await getUsers();

      const totalResults = results.length;
      const passedResults = results.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
      const failedResults = results.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;
      const unpublishedResults = results.filter(r => !r.published).length;
      const pendingReviews = results.filter(r => r.status === ASSESSMENT_STATES.SUBMITTED).length;

      const passRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;
      const averageScore = totalResults > 0 ?
        Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalResults) : 0;

      // Group by assessment
      const assessmentStats = assessments.map(assessment => {
        const assessmentResults = results.filter(r => r.assessmentId === assessment.id);
        const assessmentPassed = assessmentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;

        return {
          assessmentId: assessment.id,
          assessmentTitle: assessment.title,
          attemptCount: assessmentResults.length,
          passRate: assessmentResults.length > 0 ?
            Math.round((assessmentPassed / assessmentResults.length) * 100) : 0,
          averageScore: assessmentResults.length > 0 ?
            Math.round(assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length) : 0
        };
      }).sort((a, b) => a.passRate - b.passRate);

      const mostDifficult = assessmentStats.slice(0, 5);
      const easiest = assessmentStats.slice(-5).reverse();

      // Group by domain
      const domainStats = {};
      const allDomains = [...new Set(assessments.map(a => a.domain).filter(d => d))];
      allDomains.forEach(domain => {
        const domainResults = results.filter(r => {
          const assessment = assessments.find(a => a.id === r.assessmentId);
          return assessment && assessment.domain === domain;
        });
        const domainPassed = domainResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;

        domainStats[domain] = {
          attemptCount: domainResults.length,
          passRate: domainResults.length > 0 ?
            Math.round((domainPassed / domainResults.length) * 100) : 0,
          averageScore: domainResults.length > 0 ?
            Math.round(domainResults.reduce((sum, r) => sum + r.percentage, 0) / domainResults.length) : 0
        };
      });

      // Get recent results
      const recentResults = results
        .filter(r => r.submittedAt)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          studentId: r.studentId,
          assessmentId: r.assessmentId,
          assessmentTitle: r.assessmentTitle,
          percentage: r.percentage,
          status: r.status,
          submittedAt: r.submittedAt
        }));

      return {
        totalResults,
        passedResults,
        failedResults,
        passRate,
        averageScore,
        unpublishedResults,
        pendingReviews,
        mostDifficult,
        easiest,
        domainStats,
        recentResults
      };
    } catch (error) {
      console.error('Error getting result stats:', error);
      throw error;
    }
  }
}

export default ResultService;