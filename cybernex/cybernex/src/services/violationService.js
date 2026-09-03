/**
 * CyberNex - Violation Service
 * Service layer for managing security violations during assessments
 */

import {
  getViolations, setViolations, addViolation, updateViolation, deleteViolation,
  getUsers, getAssessments, getResults,
  logAction
} from './storageService';
import { ROLES, VIOLATION_TYPES, VIOLATION_SEVERITY } from '../utils/constants';
import AssessmentService from './assessmentService';

class ViolationService {
  // ===== BASIC CRUD OPERATIONS =====
  static async getAllViolations(options = {}) {
    try {
      let violations = await getViolations();
      if (options.studentId) violations = violations.filter(v => v.studentId === options.studentId);
      if (options.assessmentId) violations = violations.filter(v => v.assessmentId === options.assessmentId);
      if (options.type) violations = violations.filter(v => v.type === options.type);
      if (options.severity) violations = violations.filter(v => v.severity === options.severity);
      if (options.status) violations = violations.filter(v => v.status === options.status);
      return violations;
    } catch (error) {
      console.error('Error getting violations:', error);
      throw error;
    }
  }

  static async getViolationById(violationId) {
    try {
      const violations = await getViolations();
      return violations.find(v => v.id === violationId) || null;
    } catch (error) {
      console.error('Error getting violation by ID:', error);
      throw error;
    }
  }

  static async createViolation(violationData) {
    try {
      const newViolation = {
        ...violationData,
        id: `VIO-${Date.now()}`,
        status: 'Pending',
        timestamp: violationData.timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      await addViolation(newViolation);

      logAction({
        action: 'VIOLATION_CREATED',
        userId: violationData.recordedBy || 'system',
        role: ROLES.SYSTEM,
        target: 'Violation',
        targetId: newViolation.id,
        status: 'Success'
      });
      return newViolation;
    } catch (error) {
      console.error('Error creating violation:', error);
      throw error;
    }
  }

  static async updateViolation(violationId, updates, updatedBy = null) {
    try {
      const oldViolation = await this.getViolationById(violationId);
      if (!oldViolation) throw new Error('Violation not found');

      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();
      const updatedViolation = await updateViolation(violationId, updates);

      logAction({
        action: 'VIOLATION_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Violation',
        targetId: violationId,
        status: 'Success'
      });
      return updatedViolation;
    } catch (error) {
      console.error('Error updating violation:', error);
      throw error;
    }
  }

  static async deleteViolation(violationId, deletedBy = null) {
    try {
      const violation = await this.getViolationById(violationId);
      if (!violation) throw new Error('Violation not found');
      await deleteViolation(violationId);

      logAction({
        action: 'VIOLATION_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Violation',
        targetId: violationId,
        status: 'Success'
      });
      return true;
    } catch (error) {
      console.error('Error deleting violation:', error);
      throw error;
    }
  }

  // ===== VIOLATION MANAGEMENT =====
  static async recordViolation(assessmentId, studentId, violationType, details = {}, recordedBy = null) {
    try {
      const violation = {
        assessmentId,
        studentId,
        type: violationType,
        severity: this.determineSeverity(violationType),
        timestamp: new Date().toISOString(),
        details,
        status: 'Pending',
        recordedBy: recordedBy || 'system'
      };
      const newViolation = await this.createViolation(violation);

      // Update result with violation reference
      const results = await getResults();
      const activeResult = results.find(r =>
        r.assessmentId === assessmentId &&
        r.studentId === studentId &&
        (r.status === 'In Progress' || r.status === 'Submitted')
      );
      if (activeResult) {
        const violations = activeResult.violations || [];
        await updateResult(activeResult.id, {
          violations: [...violations, newViolation.id]
        });
      }

      return newViolation;
    } catch (error) {
      console.error('Error recording violation:', error);
      throw error;
    }
  }

  static determineSeverity(violationType) {
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

  static async reviewViolation(violationId, notes, status, reviewedBy = null) {
    try {
      const updates = {
        status,
        notes,
        reviewedBy,
        reviewedAt: new Date().toISOString()
      };
      return await this.updateViolation(violationId, updates, reviewedBy);
    } catch (error) {
      console.error('Error reviewing violation:', error);
      throw error;
    }
  }

  static async dismissViolation(violationId, dismissedBy = null) {
    try {
      return await this.reviewViolation(violationId, 'Dismissed as false positive', 'Dismissed', dismissedBy);
    } catch (error) {
      console.error('Error dismissing violation:', error);
      throw error;
    }
  }

  static async escalateViolation(violationId, notes, escalatedBy = null) {
    try {
      return await this.reviewViolation(violationId, notes, 'Escalated', escalatedBy);
    } catch (error) {
      console.error('Error escalating violation:', error);
      throw error;
    }
  }

  // ===== VIOLATION STATISTICS =====
  static async getViolationStats() {
    try {
      const violations = await getViolations();
      const totalViolations = violations.length;
      const pendingViolations = violations.filter(v => v.status === 'Pending').length;
      const reviewedViolations = violations.filter(v => v.status !== 'Pending').length;

      // Group by type
      const typeDistribution = {};
      Object.values(VIOLATION_TYPES).forEach(type => {
        typeDistribution[type] = violations.filter(v => v.type === type).length;
      });

      // Group by severity
      const severityDistribution = {};
      Object.values(VIOLATION_SEVERITY).forEach(severity => {
        severityDistribution[severity] = violations.filter(v => v.severity === severity).length;
      });

      // Get recent violations
      const recentViolations = violations
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(v => ({
          id: v.id,
          studentId: v.studentId,
          assessmentId: v.assessmentId,
          type: v.type,
          severity: v.severity,
          timestamp: v.timestamp,
          status: v.status
        }));

      // Get violations by assessment
      const assessments = await getAssessments();
      const assessmentViolations = assessments.map(assessment => {
        const assessmentViols = violations.filter(v => v.assessmentId === assessment.id);
        return {
          assessmentId: assessment.id,
          assessmentTitle: assessment.title,
          violationCount: assessmentViols.length
        };
      }).sort((a, b) => b.violationCount - a.violationCount).slice(0, 5);

      return {
        totalViolations,
        pendingViolations,
        reviewedViolations,
        typeDistribution,
        severityDistribution,
        recentViolations,
        topOffendingAssessments: assessmentViolations
      };
    } catch (error) {
      console.error('Error getting violation stats:', error);
      throw error;
    }
  }

  static async getViolationsForStudent(studentId) {
    try {
      const violations = await getViolations();
      return violations.filter(v => v.studentId === studentId);
    } catch (error) {
      console.error('Error getting violations for student:', error);
      throw error;
    }
  }

  static async getViolationsForAssessment(assessmentId) {
    try {
      const violations = await getViolations();
      return violations.filter(v => v.assessmentId === assessmentId);
    } catch (error) {
      console.error('Error getting violations for assessment:', error);
      throw error;
    }
  }
}

export default ViolationService;