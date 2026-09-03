/**
 * CyberNex - Notifications Mock Data
 * Sample notification records for development and testing
 */

import { SAMPLE_NOTIFICATIONS } from '../utils/constants';

// Sample notifications (re-exported from constants)
export { SAMPLE_NOTIFICATIONS };

// Notification types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  COURSE: 'course',
  ASSESSMENT: 'assessment',
  RESULT: 'result',
  ATTENDANCE: 'attendance',
  SCHEDULE: 'schedule',
  VIOLATION: 'violation',
  ANNOUNCEMENT: 'announcement',
  MESSAGE: 'message',
  REMINDER: 'reminder',
  ALERT: 'alert'
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Notification statuses
export const NOTIFICATION_STATUSES = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
};

// Default notification structure
export const DEFAULT_NOTIFICATION_STRUCTURE = {
  id: '',
  type: NOTIFICATION_TYPES.SYSTEM,
  title: '',
  message: '',
  priority: NOTIFICATION_PRIORITIES.NORMAL,
  status: NOTIFICATION_STATUSES.UNREAD,
  senderId: '',
  senderName: '',
  senderRole: '',
  recipientId: '',
  recipientName: '',
  recipientRole: '',
  relatedId: '',
  relatedType: '',
  relatedTitle: '',
  url: '',
  actionText: '',
  actionUrl: '',
  icon: '',
  color: '',
  isGlobal: false,
  expiresAt: '',
  createdAt: '',
  readAt: '',
  archivedAt: '',
  metadata: {
    createdBy: '',
    version: 1
  }
};

// Additional sample notifications
export const ADDITIONAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    type: NOTIFICATION_TYPES.RESULT,
    title: 'Assessment Results Available',
    message: 'Your results for Computer Fundamentals Quiz are now available. You scored 85%.',
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    status: NOTIFICATION_STATUSES.UNREAD,
    senderId: 'FACULTY-001',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'faculty',
    recipientId: 'STUDENT-001',
    recipientName: 'John Doe',
    recipientRole: 'student',
    relatedId: 'RESULT-001',
    relatedType: 'result',
    relatedTitle: 'Computer Fundamentals Quiz',
    url: '/student/results/RESULT-001',
    actionText: 'View Results',
    actionUrl: '/student/results/RESULT-001',
    icon: 'bar-chart-3',
    color: 'text-green-600',
    isGlobal: false,
    expiresAt: '2025-02-15T00:00:00Z',
    createdAt: '2025-01-15T10:00:00Z',
    readAt: '',
    archivedAt: '',
    metadata: {
      createdBy: 'SYSTEM',
      version: 1
    }
  },
  {
    id: 'NOTIF-002',
    type: NOTIFICATION_TYPES.ASSESSMENT,
    title: 'New Assessment Available',
    message: 'Network Security Basics assessment is now available for you to take.',
    priority: NOTIFICATION_PRIORITIES.HIGH,
    status: NOTIFICATION_STATUSES.READ,
    senderId: 'SYSTEM',
    senderName: 'System',
    senderRole: 'system',
    recipientId: 'STUDENT-001',
    recipientName: 'John Doe',
    recipientRole: 'student',
    relatedId: 'ASSESSMENT-002',
    relatedType: 'assessment',
    relatedTitle: 'Network Security Basics',
    url: '/student/assessments/ASSESSMENT-002',
    actionText: 'Take Assessment',
    actionUrl: '/student/assessment/ASSESSMENT-002/take',
    icon: 'file-text',
    color: 'text-blue-600',
    isGlobal: false,
    expiresAt: '2025-01-25T00:00:00Z',
    createdAt: '2025-01-16T08:00:00Z',
    readAt: '2025-01-16T08:15:00Z',
    archivedAt: '',
    metadata: {
      createdBy: 'SYSTEM',
      version: 1
    }
  },
  {
    id: 'NOTIF-003',
    type: NOTIFICATION_TYPES.COURSE,
    title: 'Course Enrollment Confirmed',
    message: 'You have been successfully enrolled in Linux Fundamentals (CS-102).',
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    status: NOTIFICATION_STATUSES.READ,
    senderId: 'SYSTEM',
    senderName: 'System',
    senderRole: 'system',
    recipientId: 'STUDENT-001',
    recipientName: 'John Doe',
    recipientRole: 'student',
    relatedId: 'COURSE-003',
    relatedType: 'course',
    relatedTitle: 'Linux Fundamentals',
    url: '/student/courses/COURSE-003',
    actionText: 'View Course',
    actionUrl: '/student/courses/COURSE-003',
    icon: 'book-open',
    color: 'text-green-600',
    isGlobal: false,
    expiresAt: '2025-02-16T00:00:00Z',
    createdAt: '2025-01-10T09:00:00Z',
    readAt: '2025-01-10T09:30:00Z',
    archivedAt: '',
    metadata: {
      createdBy: 'SYSTEM',
      version: 1
    }
  },
  {
    id: 'NOTIF-004',
    type: NOTIFICATION_TYPES.SCHEDULE,
    title: 'Upcoming Class: Computer Fundamentals',
    message: 'Your Computer Fundamentals class starts in 30 minutes. Room 101, Science Building.',
    priority: NOTIFICATION_PRIORITIES.HIGH,
    status: NOTIFICATION_STATUSES.UNREAD,
    senderId: 'SYSTEM',
    senderName: 'System',
    senderRole: 'system',
    recipientId: 'STUDENT-001',
    recipientName: 'John Doe',
    recipientRole: 'student',
    relatedId: 'SCHEDULE-001',
    relatedType: 'schedule',
    relatedTitle: 'Computer Fundamentals',
    url: '/student/schedule',
    actionText: 'View Schedule',
    actionUrl: '/student/schedule',
    icon: 'calendar',
    color: 'text-orange-600',
    isGlobal: false,
    expiresAt: '2025-01-13T10:00:00Z',
    createdAt: '2025-01-13T08:30:00Z',
    readAt: '',
    archivedAt: '',
    metadata: {
      createdBy: 'SYSTEM',
      version: 1
    }
  },
  {
    id: 'NOTIF-005',
    type: NOTIFICATION_TYPES.VIOLATION,
    title: 'Violation Report Filed',
    message: 'A violation report has been filed regarding copying during assessment. Please review and provide your response.',
    priority: NOTIFICATION_PRIORITIES.URGENT,
    status: NOTIFICATION_STATUSES.UNREAD,
    senderId: 'FACULTY-002',
    senderName: 'Prof. Michael Chen',
    senderRole: 'faculty',
    recipientId: 'STUDENT-003',
    recipientName: 'Mike Wilson',
    recipientRole: 'student',
    relatedId: 'VIOLATION-001',
    relatedType: 'violation',
    relatedTitle: 'Copying Answers During Assessment',
    url: '/student/violations/VIOLATION-001',
    actionText: 'View Violation',
    actionUrl: '/student/violations/VIOLATION-001',
    icon: 'alert-triangle',
    color: 'text-red-600',
    isGlobal: false,
    expiresAt: '2025-02-16T00:00:00Z',
    createdAt: '2025-01-16T15:00:00Z',
    readAt: '',
    archivedAt: '',
    metadata: {
      createdBy: 'FACULTY-002',
      version: 1
    }
  },
  {
    id: 'NOTIF-006',
    type: NOTIFICATION_TYPES.SYSTEM,
    title: 'System Maintenance',
    message: 'The system will undergo maintenance tonight from 2:00 AM to 4:00 AM. All services will be temporarily unavailable.',
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    status: NOTIFICATION_STATUSES.UNREAD,
    senderId: 'ADMIN-001',
    senderName: 'Admin User',
    senderRole: 'admin',
    recipientId: 'ALL',
    recipientName: 'All Users',
    recipientRole: 'all',
    relatedId: '',
    relatedType: '',
    relatedTitle: '',
    url: '/help',
    actionText: 'Learn More',
    actionUrl: '/help',
    icon: 'settings',
    color: 'text-gray-600',
    isGlobal: true,
    expiresAt: '2025-01-14T04:00:00Z',
    createdAt: '2025-01-13T10:00:00Z',
    readAt: '',
    archivedAt: '',
    metadata: {
      createdBy: 'ADMIN-001',
      version: 1
    }
  },
  {
    id: 'NOTIF-007',
    type: NOTIFICATION_TYPES.ANNOUNCEMENT,
    title: 'New Course Available: Active Directory Administration',
    message: 'Enrollment is now open for Advanced Active Directory Administration. Limited seats available.',
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    status: NOTIFICATION_STATUSES.READ,
    senderId: 'FACULTY-005',
    senderName: 'Prof. Jennifer Lee',
    senderRole: 'faculty',
    recipientId: 'ALL_STUDENTS',
    recipientName: 'All Students',
    recipientRole: 'student',
    relatedId: 'COURSE-005',
    relatedType: 'course',
    relatedTitle: 'Active Directory Administration',
    url: '/student/courses/COURSE-005',
    actionText: 'Enroll Now',
    actionUrl: '/student/courses/COURSE-005/enroll',
    icon: 'megaphone',
    color: 'text-purple-600',
    isGlobal: true,
    expiresAt: '2025-01-25T00:00:00Z',
    createdAt: '2025-01-10T14:00:00Z',
    readAt: '2025-01-10T14:30:00Z',
    archivedAt: '',
    metadata: {
      createdBy: 'FACULTY-005',
      version: 1
    }
  },
  {
    id: 'NOTIF-008',
    type: NOTIFICATION_TYPES.REMINDER,
    title: 'Assessment Due Soon',
    message: 'Reminder: Your Windows Security assessment is due in 24 hours.',
    priority: NOTIFICATION_PRIORITIES.HIGH,
    status: NOTIFICATION_STATUSES.UNREAD,
    senderId: 'SYSTEM',
    senderName: 'System',
    senderRole: 'system',
    recipientId: 'STUDENT-004',
    recipientName: 'Emily Brown',
    recipientRole: 'student',
    relatedId: 'ASSESSMENT-004',
    relatedType: 'assessment',
    relatedTitle: 'Windows Security',
    url: '/student/assessments/ASSESSMENT-004/take',
    actionText: 'Take Assessment',
    actionUrl: '/student/assessment/ASSESSMENT-004/take',
    icon: 'clock',
    color: 'text-red-600',
    isGlobal: false,
    expiresAt: '2025-01-17T13:00:00Z',
    createdAt: '2025-01-16T13:00:00Z',
    readAt: '',
    archivedAt: '',
    metadata: {
      createdBy: 'SYSTEM',
      version: 1
    }
  },
  {
    id: 'NOTIF-009',
    type: NOTIFICATION_TYPES.MESSAGE,
    title: 'Message from Instructor',
    message: 'Hi John, excellent work on your recent assessments. Keep up the great progress!',
    priority: NOTIFICATION_PRIORITIES.LOW,
    status: NOTIFICATION_STATUSES.READ,
    senderId: 'FACULTY-001',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'faculty',
    recipientId: 'STUDENT-001',
    recipientName: 'John Doe',
    recipientRole: 'student',
    relatedId: '',
    relatedType: '',
    relatedTitle: '',
    url: '/messages/FACULTY-001',
    actionText: 'Reply',
    actionUrl: '/messages/FACULTY-001',
    icon: 'message-circle',
    color: 'text-blue-600',
    isGlobal: false,
    expiresAt: '2025-02-16T00:00:00Z',
    createdAt: '2025-01-15T11:00:00Z',
    readAt: '2025-01-15T11:15:00Z',
    archivedAt: '',
    metadata: {
      createdBy: 'FACULTY-001',
      version: 1
    }
  },
  {
    id: 'NOTIF-010',
    type: NOTIFICATION_TYPES.ALERT,
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected on your account. Please change your password if you did not attempt these logins.',
    priority: NOTIFICATION_PRIORITIES.URGENT,
    status: NOTIFICATION_STATUSES.UNREAD,
    senderId: 'SYSTEM',
    senderName: 'Security System',
    senderRole: 'system',
    recipientId: 'STUDENT-006',
    recipientName: 'Samantha Davis',
    recipientRole: 'student',
    relatedId: '',
    relatedType: '',
    relatedTitle: '',
    url: '/profile/security',
    actionText: 'Secure Account',
    actionUrl: '/profile/security',
    icon: 'shield-alert',
    color: 'text-red-600',
    isGlobal: false,
    expiresAt: '2025-01-20T00:00:00Z',
    createdAt: '2025-01-14T14:30:00Z',
    readAt: '',
    archivedAt: '',
    metadata: {
      createdBy: 'SYSTEM',
      version: 1
    }
  }
];

// Get all notifications (combine constants and additional)
export const ALL_NOTIFICATIONS = [...SAMPLE_NOTIFICATIONS, ...ADDITIONAL_NOTIFICATIONS];

// Get notifications by recipient
export const getNotificationsByRecipient = (recipientId) => {
  return ALL_NOTIFICATIONS.filter(notif => 
    notif.recipientId === recipientId || 
    notif.recipientId === 'ALL' ||
    notif.recipientId === 'ALL_STUDENTS' && notif.recipientRole === 'student' ||
    notif.recipientId === 'ALL_FACULTY' && notif.recipientRole === 'faculty'
  );
};

// Get notifications by type
export const getNotificationsByType = (type) => {
  return ALL_NOTIFICATIONS.filter(notif => notif.type === type);
};

// Get notifications by priority
export const getNotificationsByPriority = (priority) => {
  return ALL_NOTIFICATIONS.filter(notif => notif.priority === priority);
};

// Get notifications by status
export const getNotificationsByStatus = (status) => {
  return ALL_NOTIFICATIONS.filter(notif => notif.status === status);
};

// Get unread notifications
export const getUnreadNotifications = (recipientId) => {
  const recipientNotifications = getNotificationsByRecipient(recipientId);
  return recipientNotifications.filter(notif => notif.status === NOTIFICATION_STATUSES.UNREAD);
};

// Get recent notifications
export const getRecentNotifications = (recipientId, limit = 5) => {
  const recipientNotifications = getNotificationsByRecipient(recipientId);
  return [...recipientNotifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

// Get high priority notifications
export const getHighPriorityNotifications = (recipientId) => {
  const recipientNotifications = getNotificationsByRecipient(recipientId);
  return recipientNotifications.filter(notif => 
    notif.priority === NOTIFICATION_PRIORITIES.HIGH || 
    notif.priority === NOTIFICATION_PRIORITIES.URGENT
  );
};

// Get global notifications
export const getGlobalNotifications = () => {
  return ALL_NOTIFICATIONS.filter(notif => notif.isGlobal);
};

// Get notifications by sender
export const getNotificationsBySender = (senderId) => {
  return ALL_NOTIFICATIONS.filter(notif => notif.senderId === senderId);
};

// Get notifications by date range
export const getNotificationsByDateRange = (startDate, endDate) => {
  return ALL_NOTIFICATIONS.filter(notif => {
    const notifDate = new Date(notif.createdAt);
    return notifDate >= new Date(startDate) && notifDate <= new Date(endDate);
  });
};

// Search notifications by title, message, or related info
export const searchNotifications = (query, recipientId = null) => {
  const lowerQuery = query.toLowerCase();
  let notifications = ALL_NOTIFICATIONS;
  
  if (recipientId) {
    notifications = getNotificationsByRecipient(recipientId);
  }
  
  return notifications.filter(notif => 
    notif.title.toLowerCase().includes(lowerQuery) ||
    notif.message.toLowerCase().includes(lowerQuery) ||
    notif.senderName.toLowerCase().includes(lowerQuery) ||
    notif.relatedTitle.toLowerCase().includes(lowerQuery) ||
    notif.relatedId.toLowerCase().includes(lowerQuery)
  );
};

// Get notification statistics for a user
export const getNotificationStats = (recipientId) => {
  const recipientNotifications = getNotificationsByRecipient(recipientId);
  const total = recipientNotifications.length;
  const unread = getUnreadNotifications(recipientId).length;
  const highPriority = getHighPriorityNotifications(recipientId).length;

  const byType = {};
  recipientNotifications.forEach(notif => {
    byType[notif.type] = (byType[notif.type] || 0) + 1;
  });

  return {
    total,
    unread,
    read: total - unread,
    highPriority,
    byType,
    unreadPercentage: total > 0 ? Math.round((unread / total) * 100) : 0
  };
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  const notification = ALL_NOTIFICATIONS.find(n => n.id === notificationId);
  if (!notification) return null;

  return {
    ...notification,
    status: NOTIFICATION_STATUSES.READ,
    readAt: new Date().toISOString()
  };
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = (recipientId) => {
  return getNotificationsByRecipient(recipientId).map(notif => 
    markNotificationAsRead(notif.id)
  );
};

// Archive a notification
export const archiveNotification = (notificationId) => {
  const notification = ALL_NOTIFICATIONS.find(n => n.id === notificationId);
  if (!notification) return null;

  return {
    ...notification,
    status: NOTIFICATION_STATUSES.ARCHIVED,
    archivedAt: new Date().toISOString()
  };
};

// Create a new notification
export const createNotification = (data) => {
  const newNotification = {
    ...DEFAULT_NOTIFICATION_STRUCTURE,
    ...data,
    id: `NOTIF-${Date.now()}`,
    status: NOTIFICATION_STATUSES.UNREAD,
    createdAt: new Date().toISOString(),
    metadata: {
      createdBy: data.senderId || 'SYSTEM',
      version: 1
    }
  };

  return newNotification;
};

// Default export
export default {
  SAMPLE_NOTIFICATIONS,
  ADDITIONAL_NOTIFICATIONS,
  ALL_NOTIFICATIONS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_STATUSES,
  DEFAULT_NOTIFICATION_STRUCTURE,
  getNotificationsByRecipient,
  getNotificationsByType,
  getNotificationsByPriority,
  getNotificationsByStatus,
  getUnreadNotifications,
  getRecentNotifications,
  getHighPriorityNotifications,
  getGlobalNotifications,
  getNotificationsBySender,
  getNotificationsByDateRange,
  searchNotifications,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  createNotification
};