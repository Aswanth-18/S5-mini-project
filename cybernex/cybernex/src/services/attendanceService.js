/**
 * CyberNex - Attendance Service
 * Service layer for attendance tracking
 */

import {
  getAttendance, setAttendance, addAttendance, updateAttendance, deleteAttendance,
  getUsers, getCourses, getSchedules,
  logAction
} from './storageService';
import { ROLES, ATTENDANCE_STATUSES } from '../utils/constants';
import UserService from './userService';
import CourseService from './courseService';

class AttendanceService {
  // ===== BASIC CRUD OPERATIONS =====
  static async getAllAttendance(options = {}) {
    try {
      let attendance = await getAttendance();
      if (options.studentId) attendance = attendance.filter(a => a.studentId === options.studentId);
      if (options.courseId) attendance = attendance.filter(a => a.courseId === options.courseId);
      if (options.date) attendance = attendance.filter(a => a.date === options.date);
      if (options.status) attendance = attendance.filter(a => a.status === options.status);
      return attendance;
    } catch (error) {
      console.error('Error getting attendance:', error);
      throw error;
    }
  }

  static async getAttendanceById(attendanceId) {
    try {
      const attendance = await getAttendance();
      return attendance.find(a => a.id === attendanceId) || null;
    } catch (error) {
      console.error('Error getting attendance by ID:', error);
      throw error;
    }
  }

  static async createAttendance(attendanceData) {
    try {
      const newAttendance = {
        ...attendanceData,
        id: `ATT-${Date.now()}`,
        date: attendanceData.date || new Date().toISOString().split('T')[0],
        checkIn: attendanceData.checkIn || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await addAttendance(newAttendance);

      logAction({
        action: 'ATTENDANCE_CREATED',
        userId: attendanceData.recordedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Attendance',
        targetId: newAttendance.id,
        status: 'Success'
      });
      return newAttendance;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }

  static async updateAttendance(attendanceId, updates, updatedBy = null) {
    try {
      const oldAttendance = await this.getAttendanceById(attendanceId);
      if (!oldAttendance) throw new Error('Attendance not found');

      updates.updatedBy = updatedBy;
      updates.updatedAt = new Date().toISOString();
      const updatedAttendance = await updateAttendance(attendanceId, updates);

      logAction({
        action: 'ATTENDANCE_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.FACULTY,
        target: 'Attendance',
        targetId: attendanceId,
        status: 'Success'
      });
      return updatedAttendance;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  static async deleteAttendance(attendanceId, deletedBy = null) {
    try {
      const attendance = await this.getAttendanceById(attendanceId);
      if (!attendance) throw new Error('Attendance not found');
      await deleteAttendance(attendanceId);

      logAction({
        action: 'ATTENDANCE_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Attendance',
        targetId: attendanceId,
        status: 'Success'
      });
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  // ===== ATTENDANCE MANAGEMENT =====
  static async markPresent(studentId, courseId, recordedBy = null) {
    try {
      const attendanceData = {
        studentId,
        courseId,
        status: ATTENDANCE_STATUSES.PRESENT,
        checkIn: new Date().toISOString(),
        recordedBy
      };
      return await this.createAttendance(attendanceData);
    } catch (error) {
      console.error('Error marking present:', error);
      throw error;
    }
  }

  static async markAbsent(studentId, courseId, recordedBy = null) {
    try {
      const attendanceData = {
        studentId,
        courseId,
        status: ATTENDANCE_STATUSES.ABSENT,
        recordedBy
      };
      return await this.createAttendance(attendanceData);
    } catch (error) {
      console.error('Error marking absent:', error);
      throw error;
    }
  }

  static async markLate(studentId, courseId, recordedBy = null) {
    try {
      const attendanceData = {
        studentId,
        courseId,
        status: ATTENDANCE_STATUSES.LATE,
        checkIn: new Date().toISOString(),
        recordedBy
      };
      return await this.createAttendance(attendanceData);
    } catch (error) {
      console.error('Error marking late:', error);
      throw error;
    }
  }

  static async markExcused(studentId, courseId, recordedBy = null) {
    try {
      const attendanceData = {
        studentId,
        courseId,
        status: ATTENDANCE_STATUSES.EXCUSED,
        recordedBy
      };
      return await this.createAttendance(attendanceData);
    } catch (error) {
      console.error('Error marking excused:', error);
      throw error;
    }
  }
}

export default AttendanceService;