/**
 * CyberNex - Audit Service
 * Service layer for system audit logging
 * Tracks all important actions for security and accountability
 */

import {
  getAuditLogs, setAuditLogs, addAuditLog,
  logAction as storageLogAction
} from './storageService';
import { ROLES } from '../utils/constants';

class AuditService {
  /**
   * Log an action to the audit log
   * @param {object} action - Action details
   * @param {string} action.action - Action type (LOGIN, USER_CREATED, etc.)
   * @param {string} action.userId - User ID who performed the action
   * @param {string} action.role - User role
   * @param {string} action.target - Target type (User, Course, etc.)
   * @param {string} action.targetId - Target ID
   * @param {string} action.status - Status (Success/Failure)
   * @param {object} action.details - Additional details
   * @param {string} action.ipAddress - IP address
   * @param {string} action.userAgent - User agent
   * @returns {Promise<object>} - Created audit log entry
   */
  static async logAction(action) {
    try {
      const logEntry = {
        id: `AUDIT-${Date.now()}`,
        userId: action.userId || 'anonymous',
        role: action.role || ROLES.STUDENT,
        action: action.action,
        target: action.target || 'System',
        targetId: action.targetId || null,
        status: action.status || 'Success',
        ipAddress: action.ipAddress || 'unknown',
        userAgent: action.userAgent || navigator.userAgent,
        details: action.details || null,
        timestamp: new Date().toISOString()
      };

      await addAuditLog(logEntry);
      return logEntry;
    } catch (error) {
      console.error('Error logging action:', error);
      throw error;
    }
  }

  /**
   * Get all audit logs
   * @param {object} options - Filter options
   * @returns {Promise<Array>} - Array of audit logs
   */
  static async getAllAuditLogs(options = {}) {
    try {
      let logs = await getAuditLogs();

      // Apply filters
      if (options.userId) {
        logs = logs.filter(log => log.userId === options.userId);
      }

      if (options.role) {
        logs = logs.filter(log => log.role === options.role);
      }

      if (options.action) {
        logs = logs.filter(log => log.action === options.action);
      }

      if (options.target) {
        logs = logs.filter(log => log.target === options.target);
      }

      if (options.targetId) {
        logs = logs.filter(log => log.targetId === options.targetId);
      }

      if (options.status) {
        logs = logs.filter(log => log.status === options.status);
      }

      if (options.startDate) {
        const start = new Date(options.startDate);
        logs = logs.filter(log => new Date(log.timestamp) >= start);
      }

      if (options.endDate) {
        const end = new Date(options.endDate);
        logs = logs.filter(log => new Date(log.timestamp) <= end);
      }

      if (options.search) {
        const query = options.search.toLowerCase();
        logs = logs.filter(log =>
          log.userId.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.target.toLowerCase().includes(query) ||
          (log.targetId && log.targetId.toLowerCase().includes(query)) ||
          (log.details && JSON.stringify(log.details).toLowerCase().includes(query))
        );
      }

      return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting audit logs:', error);
      throw error;
    }
  }

  /**
   * Get audit log by ID
   * @param {string} logId - Audit log ID
   * @returns {Promise<object|null>} - Audit log or null
   */
  static async getAuditLogById(logId) {
    try {
      const logs = await getAuditLogs();
      return logs.find(log => log.id === logId) || null;
    } catch (error) {
      console.error('Error getting audit log by ID:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of audit logs
   */
  static async getAuditLogsForUser(userId) {
    try {
      const logs = await this.getAllAuditLogs({ userId });
      return logs;
    } catch (error) {
      console.error('Error getting audit logs for user:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific target
   * @param {string} target - Target type
   * @param {string} targetId - Target ID
   * @returns {Promise<Array>} - Array of audit logs
   */
  static async getAuditLogsForTarget(target, targetId) {
    try {
      const logs = await this.getAllAuditLogs({ target, targetId });
      return logs;
    } catch (error) {
      console.error('Error getting audit logs for target:', error);
      throw error;
    }
  }

  /**
   * Get recent audit logs
   * @param {number} limit - Number of logs to return
   * @returns {Promise<Array>} - Array of recent audit logs
   */
  static async getRecentAuditLogs(limit = 10) {
    try {
      const logs = await this.getAllAuditLogs();
      return logs.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent audit logs:', error);
      throw error;
    }
  }

  // ===== AUDIT LOG STATISTICS =====
  static async getAuditStats() {
    try {
      const logs = await this.getAllAuditLogs();
      const totalLogs = logs.length;

      // Group by action
      const actionCounts = {};
      logs.forEach(log => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      });

      // Group by role
      const roleCounts = {};
      Object.values(ROLES).forEach(role => {
        roleCounts[role] = logs.filter(log => log.role === role).length;
      });

      // Group by target
      const targetCounts = {};
      [...new Set(logs.map(l => l.target))].forEach(target => {
        targetCounts[target] = logs.filter(log => log.target === target).length;
      });

      // Group by status
      const statusCounts = {
        Success: logs.filter(log => log.status === 'Success').length,
        Failure: logs.filter(log => log.status === 'Failure').length
      };

      // Get most active users
      const userActivity = {};
      logs.forEach(log => {
        userActivity[log.userId] = (userActivity[log.userId] || 0) + 1;
      });
      const mostActiveUsers = Object.entries(userActivity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([userId, count]) => ({ userId, actionCount: count }));

      // Get recent activity by time
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const last24Hours = logs.filter(log =>
        new Date(log.timestamp) >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
      ).length;

      const last7Days = logs.filter(log => new Date(log.timestamp) >= oneWeekAgo).length;
      const last30Days = logs.filter(log => new Date(log.timestamp) >= oneMonthAgo).length;

      return {
        totalLogs,
        actionCounts,
        roleCounts,
        targetCounts,
        statusCounts,
        mostActiveUsers,
        activityTrends: {
          last24Hours,
          last7Days,
          last30Days
        },
        recentLogs: logs.slice(0, 5)
      };
    } catch (error) {
      console.error('Error getting audit stats:', error);
      throw error;
    }
  }

  // ===== AUDIT LOG EXPORT =====
  static async exportAuditLogs(options = {}) {
    try {
      const logs = await this.getAllAuditLogs(options);
      return logs.map(log => ({
        timestamp: log.timestamp,
        userId: log.userId,
        role: log.role,
        action: log.action,
        target: log.target,
        targetId: log.targetId,
        status: log.status,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        details: log.details
      }));
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  }

  // ===== SECURITY-RELATED ACTIONS =====
  static async logSecurityEvent(event) {
    try {
      return await this.logAction({
        action: `SECURITY_${event.type}`,
        userId: event.userId || 'system',
        role: event.role || ROLES.SYSTEM,
        target: event.target || 'System',
        targetId: event.targetId,
        status: event.status || 'Detected',
        details: event.details,
        ipAddress: event.ipAddress,
        severity: event.severity || 'Medium'
      });
    } catch (error) {
      console.error('Error logging security event:', error);
      throw error;
    }
  }

  static async logViolation(violation) {
    try {
      return await this.logAction({
        action: 'VIOLATION_DETECTED',
        userId: violation.studentId,
        role: ROLES.STUDENT,
        target: 'Assessment',
        targetId: violation.assessmentId,
        status: 'Detected',
        details: {
          violationType: violation.type,
          severity: violation.severity,
          timestamp: violation.timestamp
        },
        ipAddress: violation.ipAddress
      });
    } catch (error) {
      console.error('Error logging violation:', error);
      throw error;
    }
  }
}

export default AuditService;