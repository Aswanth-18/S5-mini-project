/**
 * CyberNex - Notification Service
 * Service layer for user notifications
 */

import {
  getNotifications, setNotifications, addNotification, updateNotification, deleteNotification,
  logAction
} from './storageService';
import { ROLES, NOTIFICATION_TYPES } from '../utils/constants';
import UserService from './userService';

class NotificationService {
  // ===== BASIC CRUD OPERATIONS =====
  static async getAllNotifications(userId = null) {
    try {
      let notifications = await getNotifications();
      if (userId) notifications = notifications.filter(n => n.userId === userId);
      return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  static async getNotificationById(notificationId) {
    try {
      const notifications = await getNotifications();
      return notifications.find(n => n.id === notificationId) || null;
    } catch (error) {
      console.error('Error getting notification by ID:', error);
      throw error;
    }
  }

  static async createNotification(notificationData) {
    try {
      const newNotification = {
        ...notificationData,
        id: `NOTIF-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      await addNotification(newNotification);
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async updateNotification(notificationId, updates, updatedBy = null) {
    try {
      const oldNotification = await this.getNotificationById(notificationId);
      if (!oldNotification) throw new Error('Notification not found');

      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();
      const updatedNotification = await updateNotification(notificationId, updates);
      return updatedNotification;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId, deletedBy = null) {
    try {
      const notification = await this.getNotificationById(notificationId);
      if (!notification) throw new Error('Notification not found');
      await deleteNotification(notificationId);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // ===== NOTIFICATION MANAGEMENT =====
  static async markAsRead(notificationId, userId = null) {
    try {
      const notification = await this.getNotificationById(notificationId);
      if (!notification) throw new Error('Notification not found');

      return await this.updateNotification(notificationId, {
        isRead: true,
        readAt: new Date().toISOString()
      }, userId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId) {
    try {
      const notifications = await this.getAllNotifications(userId);
      const updatePromises = notifications
        .filter(n => !n.isRead)
        .map(n => this.markAsRead(n.id, userId));
      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async getUnreadCount(userId) {
    try {
      const notifications = await this.getAllNotifications(userId);
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // ===== NOTIFICATION TYPES =====
  static async createAssessmentUnlockedNotification(studentId, assessmentId, assessmentTitle) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.ASSESSMENT_UNLOCKED,
        title: 'New Assessment Available',
        message: `The assessment "${assessmentTitle}" has been unlocked for you.`,
        data: {
          assessmentId,
          assessmentTitle,
          action: '/student/assessments'
        }
      });
    } catch (error) {
      console.error('Error creating assessment unlocked notification:', error);
      throw error;
    }
  }

  static async createAssessmentStartingNotification(studentId, assessmentId, assessmentTitle, startTime) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.ASSESSMENT_STARTING,
        title: 'Assessment Starting Soon',
        message: `Your assessment "${assessmentTitle}" starts in 1 hour (${new Date(startTime).toLocaleString()}).`,
        data: {
          assessmentId,
          assessmentTitle,
          startTime,
          action: '/student/assessments'
        }
      });
    } catch (error) {
      console.error('Error creating assessment starting notification:', error);
      throw error;
    }
  }

  static async createResultPublishedNotification(studentId, resultId, assessmentTitle, score) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.RESULT_PUBLISHED,
        title: 'Assessment Result Published',
        message: `Your result for "${assessmentTitle}" is now available. Score: ${score}%`,
        data: {
          resultId,
          assessmentTitle,
          score,
          action: '/student/results'
        }
      });
    } catch (error) {
      console.error('Error creating result published notification:', error);
      throw error;
    }
  }

  static async createCourseAssignedNotification(studentId, courseId, courseTitle) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.COURSE_ASSIGNED,
        title: 'New Course Assigned',
        message: `You have been assigned to the course "${courseTitle}".`,
        data: {
          courseId,
          courseTitle,
          action: '/student/learning'
        }
      });
    } catch (error) {
      console.error('Error creating course assigned notification:', error);
      throw error;
    }
  }

  static async createPracticeCompletedNotification(studentId, labId, labTitle, score) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.PRACTICE_COMPLETED,
        title: 'Practice Lab Completed',
        message: `You completed the lab "${labTitle}" with a score of ${score}%.`,
        data: {
          labId,
          labTitle,
          score,
          action: '/student/practice'
        }
      });
    } catch (error) {
      console.error('Error creating practice completed notification:', error);
      throw error;
    }
  }

  static async createLevelIncreasedNotification(studentId, newLevel, levelName) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.LEVEL_INCREASED,
        title: 'Level Up!',
        message: `Congratulations! You have advanced to Level ${newLevel}: ${levelName}.`,
        data: {
          newLevel,
          levelName,
          action: '/student/progress'
        }
      });
    } catch (error) {
      console.error('Error creating level increased notification:', error);
      throw error;
    }
  }

  static async createRestrictionAddedNotification(studentId, restrictionType, reason) {
    try {
      return await this.createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.RESTRICTION_ADDED,
        title: 'Account Restriction Added',
        message: `A restriction has been added to your account: ${restrictionType}. Reason: ${reason}`,
        data: {
          restrictionType,
          reason,
          action: '/student/profile'
        }
      });
    } catch (error) {
      console.error('Error creating restriction added notification:', error);
      throw error;
    }
  }

  static async createViolationDetectedNotification(adminId, violationId, studentId, violationType) {
    try {
      return await this.createNotification({
        userId: adminId,
        type: NOTIFICATION_TYPES.VIOLATION_DETECTED,
        title: 'Security Violation Detected',
        message: `A ${violationType} violation was detected for student ${studentId}.`,
        data: {
          violationId,
          studentId,
          violationType,
          action: '/admin/violations'
        }
      });
    } catch (error) {
      console.error('Error creating violation detected notification:', error);
      throw error;
    }
  }

  static async createBackupCreatedNotification(adminId, backupId, size) {
    try {
      return await this.createNotification({
        userId: adminId,
        type: NOTIFICATION_TYPES.BACKUP_CREATED,
        title: 'Backup Created',
        message: `A new system backup (${backupId}) was created. Size: ${size} MB.`,
        data: {
          backupId,
          size,
          action: '/admin/backups'
        }
      });
    } catch (error) {
      console.error('Error creating backup created notification:', error);
      throw error;
    }
  }

  // ===== BULK NOTIFICATIONS =====
  static async notifyAllStudents(message, data = {}, createdBy = null) {
    try {
      const users = await UserService.getAllUsers();
      const students = users.filter(u => u.role === ROLES.STUDENT);

      const notifications = students.map(student =>
        this.createNotification({
          userId: student.id,
          type: 'ANNOUNCEMENT',
          title: 'Important Announcement',
          message,
          data,
          createdBy
        })
      );

      return await Promise.all(notifications);
    } catch (error) {
      console.error('Error notifying all students:', error);
      throw error;
    }
  }

  static async notifyCourseStudents(courseId, message, data = {}, createdBy = null) {
    try {
      const users = await UserService.getAllUsers();
      const students = users.filter(u => u.role === ROLES.STUDENT);

      // Get students enrolled in the course
      const courseStudents = await CourseService.getEnrolledUsers(courseId);
      const studentIds = courseStudents.map(s => s.id);

      const notifications = studentIds.map(studentId =>
        this.createNotification({
          userId: studentId,
          type: 'COURSE_ANNOUNCEMENT',
          title: 'Course Announcement',
          message,
          data: {
            ...data,
            courseId
          },
          createdBy
        })
      );

      return await Promise.all(notifications);
    } catch (error) {
      console.error('Error notifying course students:', error);
      throw error;
    }
  }

  // ===== NOTIFICATION STATISTICS =====
  static async getNotificationStats() {
    try {
      const notifications = await getNotifications();
      const totalNotifications = notifications.length;
      const unreadNotifications = notifications.filter(n => !n.isRead).length;

      // Group by type
      const typeDistribution = {};
      Object.values(NOTIFICATION_TYPES).forEach(type => {
        typeDistribution[type] = notifications.filter(n => n.type === type).length;
      });

      // Get recent notifications
      const recentNotifications = notifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(n => ({
          id: n.id,
          userId: n.userId,
          type: n.type,
          title: n.title,
          message: n.message,
          isRead: n.isRead,
          createdAt: n.createdAt
        }));

      return {
        totalNotifications,
        unreadNotifications,
        typeDistribution,
        recentNotifications
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

export default NotificationService;