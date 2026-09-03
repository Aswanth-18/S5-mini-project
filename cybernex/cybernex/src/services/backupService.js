/**
 * CyberNex - Backup Service
 * Service layer for system backup and restore functionality
 */

import {
  getBackups, setBackups, addBackup, deleteBackup,
  createBackup as createBackupData, downloadBackup as downloadBackupFile,
  restoreBackup as restoreBackupData, importBackupFromFile,
  clearAll, getItem, setItem,
  logAction
} from './storageService';
import { APP_VERSION, STORAGE_KEYS } from '../utils/constants';
import { getAllPermissionsForUser } from '../permissions/rolePermissions';
import { ROLES } from '../utils/constants';

class BackupService {
  // ===== BACKUP OPERATIONS =====
  static async getAllBackups() {
    try {
      return await getBackups();
    } catch (error) {
      console.error('Error getting backups:', error);
      throw error;
    }
  }

  static async getBackupById(backupId) {
    try {
      const backups = await getBackups();
      return backups.find(b => b.id === backupId) || null;
    } catch (error) {
      console.error('Error getting backup by ID:', error);
      throw error;
    }
  }

  static async createBackup(options = {}, createdBy = null) {
    try {
      const backup = await createBackupData({
        createdBy,
        description: options.description || 'Automated backup'
      });

      logAction({
        action: 'BACKUP_CREATED',
        userId: createdBy || 'system',
        role: ROLES.ADMIN,
        target: 'Backup',
        targetId: backup.id,
        status: 'Success',
        details: { size: backup.size, fileCount: backup.fileCount }
      });

      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  static async deleteBackup(backupId, deletedBy = null) {
    try {
      const backup = await this.getBackupById(backupId);
      if (!backup) throw new Error('Backup not found');

      await deleteBackup(backupId);

      logAction({
        action: 'BACKUP_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Backup',
        targetId: backupId,
        status: 'Success'
      });

      return true;
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  }

  // ===== BACKUP RESTORE =====
  static async restoreBackup(backupId, userId = null) {
    try {
      const backup = await this.getBackupById(backupId);
      if (!backup) throw new Error('Backup not found');

      // Verify user has permission
      if (userId) {
        const user = await getItem(STORAGE_KEYS.USER);
        if (!user || !this.hasBackupPermission(user)) {
          throw new Error('Unauthorized: Backup restore requires admin permissions');
        }
      }

      const result = await restoreBackupData(backup);

      if (result.success) {
        logAction({
          action: 'BACKUP_RESTORED',
          userId: userId || 'system',
          role: ROLES.ADMIN,
          target: 'Backup',
          targetId: backupId,
          status: 'Success'
        });
      }

      return result;
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  static hasBackupPermission(user) {
    if (!user) return false;
    const permissions = getAllPermissionsForUser(user.role, user.permissions || []);
    return permissions.includes('backup.restore') || user.role === ROLES.ADMIN;
  }

  // ===== BACKUP EXPORT/IMPORT =====
  static async downloadBackup(backupId) {
    try {
      const backup = await this.getBackupById(backupId);
      if (!backup) throw new Error('Backup not found');
      return downloadBackupFile(backup);
    } catch (error) {
      console.error('Error downloading backup:', error);
      throw error;
    }
  }

  static async importBackup(file, userId = null) {
    try {
      if (userId) {
        const user = await getItem(STORAGE_KEYS.USER);
        if (!user || !this.hasBackupPermission(user)) {
          throw new Error('Unauthorized: Backup import requires admin permissions');
        }
      }

      const backup = await importBackupFromFile(file);

      // Validate backup structure
      if (!this.validateBackup(backup)) {
        throw new Error('Invalid backup file structure');
      }

      // Verify version
      if (backup.version !== APP_VERSION) {
        throw new Error(`Backup version ${backup.version} does not match current app version ${APP_VERSION}`);
      }

      return backup;
    } catch (error) {
      console.error('Error importing backup:', error);
      throw error;
    }
  }

  static validateBackup(backup) {
    if (!backup || !backup.version || !backup.timestamp || !backup.data) {
      return false;
    }

    const requiredDataKeys = [
      'users', 'courses', 'labs', 'assessments', 'results',
      'attendance', 'schedules', 'violations', 'notifications',
      'auditLogs', 'restrictions', 'faculty', 'studentGroups',
      'settings', 'permissions'
    ];

    return requiredDataKeys.every(key => key in backup.data);
  }

  // ===== BACKUP STATISTICS =====
  static async getBackupStats() {
    try {
      const backups = await getBackups();
      const totalBackups = backups.length;
      const totalSize = backups.reduce((sum, b) => sum + (b.size || 0), 0);

      // Get recent backups
      const recentBackups = backups
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(b => ({
          id: b.id,
          timestamp: b.timestamp,
          size: b.size,
          createdBy: b.createdBy
        }));

      return {
        totalBackups,
        totalSize,
        averageSize: totalBackups > 0 ? Math.round(totalSize / totalBackups) : 0,
        recentBackups
      };
    } catch (error) {
      console.error('Error getting backup stats:', error);
      throw error;
    }
  }
}

export default BackupService;