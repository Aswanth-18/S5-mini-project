/**
 * CyberNex - Schedules Mock Data
 * Sample schedule records for development and testing
 */

import { SAMPLE_SCHEDULES } from '../utils/constants';

// Sample schedules (re-exported from constants)
export { SAMPLE_SCHEDULES };

// Schedule statuses
export const SCHEDULE_STATUSES = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  PENDING: 'pending'
};

// Schedule types
export const SCHEDULE_TYPES = {
  ONE_TIME: 'one-time',
  RECURRING: 'recurring',
  WEEKLY: 'weekly',
  BI_WEEKLY: 'bi-weekly',
  MONTHLY: 'monthly'
};

// Days of week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Default schedule structure
export const DEFAULT_SCHEDULE_STRUCTURE = {
  id: '',
  courseId: '',
  courseTitle: '',
  courseCode: '',
  instructorId: '',
  instructorName: '',
  department: '',
  day: 'Monday',
  time: '',
  startTime: '',
  endTime: '',
  duration: 0,
  type: SCHEDULE_TYPES.ONE_TIME,
  recurring: false,
  recurrencePattern: '',
  recurrenceEndDate: '',
  location: '',
  room: '',
  building: '',
  online: false,
  meetingLink: '',
  capacity: 0,
  enrolledStudents: [],
  waitlist: [],
  status: SCHEDULE_STATUSES.ACTIVE,
  notes: '',
  metadata: {
    createdBy: '',
    createdByName: '',
    createdAt: '',
    updatedAt: '',
    version: 1
  }
};

// Additional sample schedules
export const ADDITIONAL_SCHEDULES = [
  {
    id: 'SCHEDULE-001',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals',
    courseCode: 'CS-101',
    instructorId: 'FACULTY-001',
    instructorName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    day: 'Monday',
    time: '09:00 AM - 11:00 AM',
    startTime: '09:00',
    endTime: '11:00',
    duration: 120,
    type: SCHEDULE_TYPES.RECURRING,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2025-12-31',
    location: 'Room 101',
    room: '101',
    building: 'Science Building',
    online: false,
    meetingLink: '',
    capacity: 30,
    enrolledStudents: ['STUDENT-001', 'STUDENT-002', 'STUDENT-003', 'STUDENT-004'],
    waitlist: ['STUDENT-005', 'STUDENT-006'],
    status: SCHEDULE_STATUSES.ACTIVE,
    notes: 'Beginner level course, no prerequisites',
    metadata: {
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-10T08:00:00Z',
      version: 1
    }
  },
  {
    id: 'SCHEDULE-002',
    courseId: 'COURSE-002',
    courseTitle: 'Network Security Basics',
    courseCode: 'CS-201',
    instructorId: 'FACULTY-002',
    instructorName: 'Prof. Michael Chen',
    department: 'Cybersecurity',
    day: 'Tuesday',
    time: '13:00 PM - 15:00 PM',
    startTime: '13:00',
    endTime: '15:00',
    duration: 120,
    type: SCHEDULE_TYPES.RECURRING,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2025-12-31',
    location: 'Room 205',
    room: '205',
    building: 'Engineering Building',
    online: false,
    meetingLink: '',
    capacity: 25,
    enrolledStudents: ['STUDENT-001', 'STUDENT-002', 'STUDENT-003', 'STUDENT-004', 'STUDENT-005'],
    waitlist: ['STUDENT-006'],
    status: SCHEDULE_STATUSES.ACTIVE,
    notes: 'Prerequisite: Computer Fundamentals',
    metadata: {
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-10T09:00:00Z',
      version: 1
    }
  },
  {
    id: 'SCHEDULE-003',
    courseId: 'COURSE-003',
    courseTitle: 'Linux Fundamentals',
    courseCode: 'CS-102',
    instructorId: 'FACULTY-003',
    instructorName: 'Prof. Lisa Rodriguez',
    department: 'Computer Science',
    day: 'Wednesday',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00',
    endTime: '12:00',
    duration: 120,
    type: SCHEDULE_TYPES.RECURRING,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2025-12-31',
    location: 'Room 110',
    room: '110',
    building: 'Science Building',
    online: false,
    meetingLink: '',
    capacity: 20,
    enrolledStudents: ['STUDENT-001', 'STUDENT-002', 'STUDENT-003'],
    waitlist: [],
    status: SCHEDULE_STATUSES.ACTIVE,
    notes: 'Hands-on Linux command line practice',
    metadata: {
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: '2025-01-10T10:00:00Z',
      updatedAt: '2025-01-10T10:00:00Z',
      version: 1
    }
  },
  {
    id: 'SCHEDULE-004',
    courseId: 'COURSE-004',
    courseTitle: 'Windows Security',
    courseCode: 'CS-202',
    instructorId: 'FACULTY-004',
    instructorName: 'Prof. David Kim',
    department: 'Cybersecurity',
    day: 'Thursday',
    time: '14:00 PM - 16:00 PM',
    startTime: '14:00',
    endTime: '16:00',
    duration: 120,
    type: SCHEDULE_TYPES.RECURRING,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2025-12-31',
    location: 'Room 210',
    room: '210',
    building: 'Engineering Building',
    online: false,
    meetingLink: '',
    capacity: 25,
    enrolledStudents: ['STUDENT-001', 'STUDENT-004', 'STUDENT-005'],
    waitlist: ['STUDENT-002', 'STUDENT-003'],
    status: SCHEDULE_STATUSES.ACTIVE,
    notes: 'Windows security concepts and practices',
    metadata: {
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: '2025-01-10T11:00:00Z',
      updatedAt: '2025-01-10T11:00:00Z',
      version: 1
    }
  },
  {
    id: 'SCHEDULE-005',
    courseId: 'COURSE-005',
    courseTitle: 'Active Directory Administration',
    courseCode: 'CS-301',
    instructorId: 'FACULTY-005',
    instructorName: 'Prof. Jennifer Lee',
    department: 'Cybersecurity',
    day: 'Friday',
    time: '09:00 AM - 11:00 AM',
    startTime: '09:00',
    endTime: '11:00',
    duration: 120,
    type: SCHEDULE_TYPES.RECURRING,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '2025-12-31',
    location: 'Room 305',
    room: '305',
    building: 'Science Building',
    online: false,
    meetingLink: '',
    capacity: 20,
    enrolledStudents: ['STUDENT-005', 'STUDENT-006', 'STUDENT-007'],
    waitlist: ['STUDENT-001', 'STUDENT-002'],
    status: SCHEDULE_STATUSES.ACTIVE,
    notes: 'Advanced AD configuration and management',
    metadata: {
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: '2025-01-10T12:00:00Z',
      updatedAt: '2025-01-10T12:00:00Z',
      version: 1
    }
  },
  {
    id: 'SCHEDULE-006',
    courseId: 'COURSE-001',
    courseTitle: 'Computer Fundamentals - Evening',
    courseCode: 'CS-101E',
    instructorId: 'FACULTY-001',
    instructorName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    day: 'Monday',
    time: '18:00 PM - 20:00 PM',
    startTime: '18:00',
    endTime: '20:00',
    duration: 120,
    type: SCHEDULE_TYPES.ONE_TIME,
    recurring: false,
    recurrencePattern: '',
    recurrenceEndDate: '',
    location: 'Online',
    room: '',
    building: '',
    online: true,
    meetingLink: 'https://zoom.us/j/cs101evening',
    capacity: 25,
    enrolledStudents: ['STUDENT-007', 'STUDENT-008', 'STUDENT-009'],
    waitlist: ['STUDENT-010'],
    status: SCHEDULE_STATUSES.ACTIVE,
    notes: 'Evening session for working professionals',
    metadata: {
      createdBy: 'ADMIN-001',
      createdByName: 'Admin User',
      createdAt: '2025-01-15T14:00:00Z',
      updatedAt: '2025-01-15T14:00:00Z',
      version: 1
    }
  }
];

// Get all schedules (combine constants and additional)
export const ALL_SCHEDULES = [...SAMPLE_SCHEDULES, ...ADDITIONAL_SCHEDULES];

// Get schedules by course
export const getSchedulesByCourse = (courseId) => {
  return ALL_SCHEDULES.filter(schedule => schedule.courseId === courseId);
};

// Get schedules by instructor
export const getSchedulesByInstructor = (instructorId) => {
  return ALL_SCHEDULES.filter(schedule => schedule.instructorId === instructorId);
};

// Get schedules by day
export const getSchedulesByDay = (day) => {
  return ALL_SCHEDULES.filter(schedule => schedule.day === day);
};

// Get schedules by status
export const getSchedulesByStatus = (status) => {
  return ALL_SCHEDULES.filter(schedule => schedule.status === status);
};

// Get schedules by type
export const getSchedulesByType = (type) => {
  return ALL_SCHEDULES.filter(schedule => schedule.type === type);
};

// Get recurring schedules
export const getRecurringSchedules = () => {
  return ALL_SCHEDULES.filter(schedule => schedule.recurring);
};

// Get one-time schedules
export const getOneTimeSchedules = () => {
  return ALL_SCHEDULES.filter(schedule => !schedule.recurring);
};

// Get schedules by department
export const getSchedulesByDepartment = (department) => {
  return ALL_SCHEDULES.filter(schedule => schedule.department === department);
};

// Get online schedules
export const getOnlineSchedules = () => {
  return ALL_SCHEDULES.filter(schedule => schedule.online);
};

// Get schedules by date range
export const getSchedulesByDateRange = (startDate, endDate) => {
  return ALL_SCHEDULES.filter(schedule => {
    // For recurring schedules, check if they have any occurrences in the date range
    if (schedule.recurring) {
      // Simple check - in a real app, you'd calculate the actual recurrence dates
      return true; // Assume recurring schedules are ongoing
    }
    
    // For one-time schedules, check the actual date
    // This would be the schedule's start date in a real implementation
    return true; // Placeholder
  });
};

// Get schedules for a student
export const getSchedulesForStudent = (studentId) => {
  return ALL_SCHEDULES.filter(schedule => 
    schedule.enrolledStudents.includes(studentId) ||
    schedule.waitlist.includes(studentId)
  );
};

// Search schedules by course, instructor, or location
export const searchSchedules = (query) => {
  const lowerQuery = query.toLowerCase();
  return ALL_SCHEDULES.filter(schedule => 
    schedule.courseTitle.toLowerCase().includes(lowerQuery) ||
    schedule.courseCode.toLowerCase().includes(lowerQuery) ||
    schedule.instructorName.toLowerCase().includes(lowerQuery) ||
    schedule.location.toLowerCase().includes(lowerQuery) ||
    schedule.room.toLowerCase().includes(lowerQuery) ||
    schedule.day.toLowerCase().includes(lowerQuery) ||
    schedule.time.toLowerCase().includes(lowerQuery)
  );
};

// Get schedule statistics
export const getScheduleStats = () => {
  const total = ALL_SCHEDULES.length;
  const byDay = {};
  const byDepartment = {};
  const byType = {};
  const byStatus = {};

  ALL_SCHEDULES.forEach(schedule => {
    byDay[schedule.day] = (byDay[schedule.day] || 0) + 1;
    byDepartment[schedule.department] = (byDepartment[schedule.department] || 0) + 1;
    byType[schedule.type] = (byType[schedule.type] || 0) + 1;
    byStatus[schedule.status] = (byStatus[schedule.status] || 0) + 1;
  });

  return {
    total,
    byDay,
    byDepartment,
    byType,
    byStatus,
    recurring: ALL_SCHEDULES.filter(s => s.recurring).length,
    oneTime: ALL_SCHEDULES.filter(s => !s.recurring).length,
    online: ALL_SCHEDULES.filter(s => s.online).length,
    inPerson: ALL_SCHEDULES.filter(s => !s.online).length
  };
};

// Check for schedule conflicts
export const checkScheduleConflicts = (newSchedule) => {
  const conflicts = ALL_SCHEDULES.filter(existing => {
    // Same day
    if (existing.day !== newSchedule.day) return false;
    
    // Check for time overlap
    const [existingStart] = existing.startTime.split(':').map(Number);
    const [existingEnd] = existing.endTime.split(':').map(Number);
    const [newStart] = newSchedule.startTime.split(':').map(Number);
    const [newEnd] = newSchedule.endTime.split(':').map(Number);
    
    // Convert to minutes for easier comparison
    const existingStartMin = existingStart * 60;
    const existingEndMin = existingEnd * 60;
    const newStartMin = newStart * 60;
    const newEndMin = newEnd * 60;
    
    // Check for overlap
    return !(
      newEndMin <= existingStartMin ||
      newStartMin >= existingEndMin
    );
  });
  
  return conflicts;
};

// Get student enrollment status for a schedule
export const getStudentEnrollmentStatus = (scheduleId, studentId) => {
  const schedule = ALL_SCHEDULES.find(s => s.id === scheduleId);
  if (!schedule) return null;
  
  if (schedule.enrolledStudents.includes(studentId)) {
    return { status: 'enrolled', position: schedule.enrolledStudents.indexOf(studentId) + 1 };
  }
  
  if (schedule.waitlist.includes(studentId)) {
    return { status: 'waitlisted', position: schedule.waitlist.indexOf(studentId) + 1 };
  }
  
  if (schedule.enrolledStudents.length < schedule.capacity) {
    return { status: 'available', capacity: schedule.capacity - schedule.enrolledStudents.length };
  }
  
  return { status: 'full', waitlistPosition: schedule.waitlist.length + 1 };
};

// Default export
export default {
  SAMPLE_SCHEDULES,
  ADDITIONAL_SCHEDULES,
  ALL_SCHEDULES,
  SCHEDULE_STATUSES,
  SCHEDULE_TYPES,
  DAYS_OF_WEEK,
  DEFAULT_SCHEDULE_STRUCTURE,
  getSchedulesByCourse,
  getSchedulesByInstructor,
  getSchedulesByDay,
  getSchedulesByStatus,
  getSchedulesByType,
  getRecurringSchedules,
  getOneTimeSchedules,
  getSchedulesByDepartment,
  getOnlineSchedules,
  getSchedulesByDateRange,
  getSchedulesForStudent,
  searchSchedules,
  getScheduleStats,
  checkScheduleConflicts,
  getStudentEnrollmentStatus
};