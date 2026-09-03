/**
 * CyberNex - Schedule Service
 * Calendar events: workshops, course sessions, exams, holidays.
 * CRUD, recurrence expansion, per-user calendar views, conflict detection.
 */
import {
  getSchedules, setSchedules, addSchedule, updateSchedule, deleteSchedule,
  getUsers, getCourses, logAction
} from './storageService';
import { ROLES } from '../utils/constants';

const DAY_MS = 24 * 60 * 60 * 1000;

class ScheduleService {
  static async getAllSchedules(options = {}) {
    try {
      let schedules = await getSchedules();
      if (options.facultyId) schedules = schedules.filter(s => s.facultyId === options.facultyId);
      if (options.courseId) schedules = schedules.filter(s => s.courseId === options.courseId);
      if (options.type) schedules = schedules.filter(s => s.type === options.type);
      if (options.studentId) {
        schedules = schedules.filter(s => (s.students || []).includes(options.studentId));
      }
      if (options.startDate) {
        schedules = schedules.filter(s => new Date(s.startDate) >= new Date(options.startDate));
      }
      if (options.endDate) {
        schedules = schedules.filter(s => new Date(s.startDate) <= new Date(options.endDate));
      }
      return schedules.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } catch (error) {
      console.error('Error getting schedules:', error);
      throw error;
    }
  }

  static async getScheduleById(scheduleId) {
    try {
      const schedules = await getSchedules();
      return schedules.find(s => s.id === scheduleId) || null;
    } catch (error) {
      console.error('Error getting schedule by ID:', error);
      throw error;
    }
  }

  static async createSchedule(scheduleData, createdBy = null) {
    try {
      const newSchedule = {
        id: `SCHED-${Date.now()}`,
        title: scheduleData.title || 'Untitled Event',
        description: scheduleData.description || '',
        type: scheduleData.type || 'Course',
        startDate: scheduleData.startDate || new Date().toISOString(),
        endDate: scheduleData.endDate || scheduleData.startDate || new Date().toISOString(),
        location: scheduleData.location || null,
        facultyId: scheduleData.facultyId || null,
        courseId: scheduleData.courseId || null,
        students: scheduleData.students || [],
        isRecurring: scheduleData.isRecurring || false,
        recurrence: scheduleData.recurrence || null,
        color: scheduleData.color || '#3B82F6',
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addSchedule(newSchedule);

      logAction({
        action: 'SCHEDULE_CREATED',
        userId: createdBy || 'system',
        role: ROLES.ADMIN,
        target: 'Schedule',
        targetId: newSchedule.id,
        status: 'Success',
        details: { title: newSchedule.title, type: newSchedule.type }
      });
      return newSchedule;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  static async updateSchedule(scheduleId, updates, updatedBy = null) {
    try {
      const existing = await this.getScheduleById(scheduleId);
      if (!existing) throw new Error('Schedule not found');

      const updated = await updateSchedule(scheduleId, {
        ...updates,
        updatedBy,
        updatedAt: new Date().toISOString(),
      });

      logAction({
        action: 'SCHEDULE_UPDATED',
        userId: updatedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Schedule',
        targetId: scheduleId,
        status: 'Success'
      });
      return updated;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }

  static async deleteSchedule(scheduleId, deletedBy = null) {
    try {
      const existing = await this.getScheduleById(scheduleId);
      if (!existing) throw new Error('Schedule not found');
      await deleteSchedule(scheduleId);

      logAction({
        action: 'SCHEDULE_DELETED',
        userId: deletedBy || 'system',
        role: ROLES.ADMIN,
        target: 'Schedule',
        targetId: scheduleId,
        status: 'Success'
      });
      return true;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }

  static async getScheduleForUser(userId, role) {
    try {
      const schedules = await getSchedules();
      if (role === ROLES.ADMIN) return schedules;
      if (role === ROLES.FACULTY) {
        return schedules.filter(s => s.facultyId === userId || (s.students || []).includes(userId));
      }
      return schedules.filter(s => (s.students || []).includes(userId) || s.type === 'Holiday');
    } catch (error) {
      console.error('Error getting schedule for user:', error);
      throw error;
    }
  }

  static async getScheduleInRange(rangeStart, rangeEnd, options = {}) {
    try {
      const schedules = await this.getAllSchedules(options);
      const start = new Date(rangeStart);
      const end = new Date(rangeEnd);
      const occurrences = [];

      schedules.forEach((schedule) => {
        if (!schedule.isRecurring || !schedule.recurrence) {
          const eventStart = new Date(schedule.startDate);
          if (eventStart >= start && eventStart <= end) {
            occurrences.push(schedule);
          }
          return;
        }
        occurrences.push(...this.expandRecurrence(schedule, start, end));
      });

      return occurrences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } catch (error) {
      console.error('Error getting schedule in range:', error);
      throw error;
    }
  }

  static expandRecurrence(schedule, rangeStart, rangeEnd) {
    const { recurrence } = schedule;
    if (!recurrence) return [];

    const occurrences = [];
    const duration = new Date(schedule.endDate).getTime() - new Date(schedule.startDate).getTime();
    const recurrenceEnd = recurrence.endDate ? new Date(recurrence.endDate) : rangeEnd;
    const cursorEnd = recurrenceEnd < rangeEnd ? recurrenceEnd : rangeEnd;

    let cursor = new Date(schedule.startDate);

    while (cursor <= cursorEnd) {
      const matchesDay =
        recurrence.type !== 'weekly' ||
        !recurrence.daysOfWeek ||
        recurrence.daysOfWeek.includes(cursor.getUTCDay());

      if (matchesDay && cursor >= rangeStart && cursor <= cursorEnd) {
        occurrences.push({
          ...schedule,
          id: `${schedule.id}-${cursor.toISOString().slice(0, 10)}`,
          parentId: schedule.id,
          startDate: cursor.toISOString(),
          endDate: new Date(cursor.getTime() + duration).toISOString(),
        });
      }

      const interval = recurrence.interval || 1;
      if (recurrence.type === 'weekly') {
        cursor = new Date(cursor.getTime() + DAY_MS);
      } else if (recurrence.type === 'daily') {
        cursor = new Date(cursor.getTime() + DAY_MS * interval);
      } else if (recurrence.type === 'monthly') {
        const next = new Date(cursor);
        next.setUTCMonth(next.getUTCMonth() + interval);
        cursor = next;
      } else {
        break;
      }
    }

    return occurrences;
  }

  static async hasConflict({ facultyId, location, startDate, endDate, excludeId }) {
    try {
      const schedules = await getSchedules();
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      return schedules.some((s) => {
        if (s.id === excludeId) return false;
        if (facultyId && s.facultyId !== facultyId) {
          if (!location || s.location !== location) return false;
        }
        const existingStart = new Date(s.startDate);
        const existingEnd = new Date(s.endDate);
        return newStart < existingEnd && newEnd > existingStart;
      });
    } catch (error) {
      console.error('Error checking schedule conflict:', error);
      throw error;
    }
  }

  static async getUpcomingEvents(userId, role, limit = 5) {
    try {
      const now = new Date();
      const events = await this.getScheduleForUser(userId, role);
      return events
        .filter(e => new Date(e.startDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw error;
    }
  }
}

export default ScheduleService;