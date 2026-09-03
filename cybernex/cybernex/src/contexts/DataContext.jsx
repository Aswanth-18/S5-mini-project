import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getUsers, setUsers, addUser, updateUser, deleteUser,
  getCourses, setCourses, addCourse, updateCourse, deleteCourse, getLessons,
  getLabs, setLabs, addLab, updateLab, deleteLab,
  getAssessments, setAssessments, addAssessment, updateAssessment, deleteAssessment,
  getResults, setResults, addResult, updateResult, deleteResult,
  getAttendance, setAttendance, addAttendance, updateAttendance, deleteAttendance,
  getSchedules, setSchedules, addSchedule, updateSchedule, deleteSchedule,
  getViolations, setViolations, addViolation, updateViolation, deleteViolation,
  getNotifications, setNotifications, addNotification, updateNotification, deleteNotification,
  getAuditLogs, setAuditLogs, addAuditLog,
  getRestrictions, setRestrictions, addRestriction, updateRestriction, deleteRestriction,
  getFaculty, setFaculty, addFaculty, updateFaculty, deleteFaculty,
  getStudentGroups, setStudentGroups, addStudentGroup, updateStudentGroup, deleteStudentGroup,
  getSettings, setSettings, updateSettings,
  getTheme, setTheme,
  getPermissions, setPermissions, updateRolePermissions,
  getAssessmentUnlocks, setAssessmentUnlocks, unlockAssessmentForStudent, lockAssessmentForStudent, isAssessmentUnlockedForStudent,
  getStudentProgress, setStudentProgress, updateStudentProgress,
  createBackup, downloadBackup, restoreBackup, importBackupFromFile,
  logAction
} from '../services/storageService';
import { useAuth } from './AuthContext';
import { ROLES, ASSESSMENT_STATES } from '../utils/constants';

// ===== CREATE CONTEXT =====
const DataContext = createContext(null);

// ===== PROVIDER COMPONENT =====
export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== USERS STATE =====
  const [users, setUsersState] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // ===== COURSES STATE =====
  const [courses, setCoursesState] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // ===== LABS STATE =====
  const [labs, setLabsState] = useState([]);
  const [labsLoading, setLabsLoading] = useState(false);
  const [labsError, setLabsError] = useState(null);

  // ===== ASSESSMENTS STATE =====
  const [assessments, setAssessmentsState] = useState([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [assessmentsError, setAssessmentsError] = useState(null);

  // ===== RESULTS STATE =====
  const [results, setResultsState] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // ===== ATTENDANCE STATE =====
  const [attendance, setAttendanceState] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);

  // ===== SCHEDULES STATE =====
  const [schedules, setSchedulesState] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState(null);

  // ===== VIOLATIONS STATE =====
  const [violations, setViolationsState] = useState([]);
  const [violationsLoading, setViolationsLoading] = useState(false);
  const [violationsError, setViolationsError] = useState(null);

  // ===== NOTIFICATIONS STATE =====
  const [notifications, setNotificationsState] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  // ===== AUDIT LOGS STATE =====
  const [auditLogs, setAuditLogsState] = useState([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [auditLogsError, setAuditLogsError] = useState(null);

  // ===== RESTRICTIONS STATE =====
  const [restrictions, setRestrictionsState] = useState([]);
  const [restrictionsLoading, setRestrictionsLoading] = useState(false);
  const [restrictionsError, setRestrictionsError] = useState(null);

  // ===== FACULTY STATE =====
  const [faculty, setFacultyState] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState(null);

  // ===== STUDENT GROUPS STATE =====
  const [studentGroups, setStudentGroupsState] = useState([]);
  const [studentGroupsLoading, setStudentGroupsLoading] = useState(false);
  const [studentGroupsError, setStudentGroupsError] = useState(null);

  // ===== SETTINGS STATE =====
  const [settings, setSettingsState] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  // ===== THEME STATE =====
  const [theme, setThemeState] = useState('system');
  const [themeLoading, setThemeLoading] = useState(false);

  // ===== PERMISSIONS STATE =====
  const [permissions, setPermissionsState] = useState({});
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  // ===== ASSESSMENT UNLOCKS STATE =====
  const [assessmentUnlocks, setAssessmentUnlocksState] = useState({});
  const [assessmentUnlocksLoading, setAssessmentUnlocksLoading] = useState(false);

  // ===== INITIAL DATA LOAD =====
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        // Load all data in parallel
        const [
          usersData, coursesData, labsData, assessmentsData,
          resultsData, attendanceData, schedulesData, violationsData,
          notificationsData, auditLogsData, restrictionsData,
          facultyData, studentGroupsData, settingsData,
          themeData, permissionsData, unlocksData
        ] = await Promise.all([
          getUsers(), getCourses(), getLabs(), getAssessments(),
          getResults(), getAttendance(), getSchedules(), getViolations(),
          getNotifications(), getAuditLogs(), getRestrictions(),
          getFaculty(), getStudentGroups(), getSettings(),
          getTheme(), getPermissions(), getAssessmentUnlocks()
        ]);

        // Set all state
        setUsersState(usersData);
        setCoursesState(coursesData);
        setLabsState(labsData);
        setAssessmentsState(assessmentsData);
        setResultsState(resultsData);
        setAttendanceState(attendanceData);
        setSchedulesState(schedulesData);
        setViolationsState(violationsData);
        setNotificationsState(notificationsData);
        setAuditLogsState(auditLogsData);
        setRestrictionsState(restrictionsData);
        setFacultyState(facultyData);
        setStudentGroupsState(studentGroupsData);
        setSettingsState(settingsData);
        setThemeState(themeData);
        setPermissionsState(permissionsData);
        setAssessmentUnlocksState(unlocksData);

        setError(null);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load application data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // ===== DATA FETCHING FUNCTIONS =====
  // Users
  const refreshUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await getUsers();
      setUsersState(data);
      setUsersError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Courses
  const refreshCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const data = await getCourses();
      setCoursesState(data);
      setCoursesError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCoursesError('Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  // Labs
  const refreshLabs = useCallback(async () => {
    setLabsLoading(true);
    try {
      const data = await getLabs();
      setLabsState(data);
      setLabsError(null);
    } catch (err) {
      console.error('Error fetching labs:', err);
      setLabsError('Failed to load labs');
    } finally {
      setLabsLoading(false);
    }
  }, []);

  // Assessments
  const refreshAssessments = useCallback(async () => {
    setAssessmentsLoading(true);
    try {
      const data = await getAssessments();
      setAssessmentsState(data);
      setAssessmentsError(null);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setAssessmentsError('Failed to load assessments');
    } finally {
      setAssessmentsLoading(false);
    }
  }, []);

  // Results
  const refreshResults = useCallback(async () => {
    setResultsLoading(true);
    try {
      const data = await getResults();
      setResultsState(data);
      setResultsError(null);
    } catch (err) {
      console.error('Error fetching results:', err);
      setResultsError('Failed to load results');
    } finally {
      setResultsLoading(false);
    }
  }, []);

  // Attendance
  const refreshAttendance = useCallback(async () => {
    setAttendanceLoading(true);
    try {
      const data = await getAttendance();
      setAttendanceState(data);
      setAttendanceError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setAttendanceError('Failed to load attendance');
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  // Schedules
  const refreshSchedules = useCallback(async () => {
    setSchedulesLoading(true);
    try {
      const data = await getSchedules();
      setSchedulesState(data);
      setSchedulesError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setSchedulesError('Failed to load schedules');
    } finally {
      setSchedulesLoading(false);
    }
  }, []);

  // Violations
  const refreshViolations = useCallback(async () => {
    setViolationsLoading(true);
    try {
      const data = await getViolations();
      setViolationsState(data);
      setViolationsError(null);
    } catch (err) {
      console.error('Error fetching violations:', err);
      setViolationsError('Failed to load violations');
    } finally {
      setViolationsLoading(false);
    }
  }, []);

  // Notifications
  const refreshNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const data = await getNotifications();
      setNotificationsState(data);
      setNotificationsError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotificationsError('Failed to load notifications');
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  // Audit Logs
  const refreshAuditLogs = useCallback(async () => {
    setAuditLogsLoading(true);
    try {
      const data = await getAuditLogs();
      setAuditLogsState(data);
      setAuditLogsError(null);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setAuditLogsError('Failed to load audit logs');
    } finally {
      setAuditLogsLoading(false);
    }
  }, []);

  // Restrictions
  const refreshRestrictions = useCallback(async () => {
    setRestrictionsLoading(true);
    try {
      const data = await getRestrictions();
      setRestrictionsState(data);
      setRestrictionsError(null);
    } catch (err) {
      console.error('Error fetching restrictions:', err);
      setRestrictionsError('Failed to load restrictions');
    } finally {
      setRestrictionsLoading(false);
    }
  }, []);

  // Faculty
  const refreshFaculty = useCallback(async () => {
    setFacultyLoading(true);
    try {
      const data = await getFaculty();
      setFacultyState(data);
      setFacultyError(null);
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setFacultyError('Failed to load faculty');
    } finally {
      setFacultyLoading(false);
    }
  }, []);

  // Student Groups
  const refreshStudentGroups = useCallback(async () => {
    setStudentGroupsLoading(true);
    try {
      const data = await getStudentGroups();
      setStudentGroupsState(data);
      setStudentGroupsError(null);
    } catch (err) {
      console.error('Error fetching student groups:', err);
      setStudentGroupsError('Failed to load student groups');
    } finally {
      setStudentGroupsLoading(false);
    }
  }, []);

  // Settings
  const refreshSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const data = await getSettings();
      setSettingsState(data);
      setSettingsError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setSettingsError('Failed to load settings');
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  // Theme
  const refreshTheme = useCallback(async () => {
    setThemeLoading(true);
    try {
      const data = await getTheme();
      setThemeState(data);
    } catch (err) {
      console.error('Error fetching theme:', err);
    } finally {
      setThemeLoading(false);
    }
  }, []);

  // Permissions
  const refreshPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    try {
      const data = await getPermissions();
      setPermissionsState(data);
    } catch (err) {
      console.error('Error fetching permissions:', err);
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  // Assessment Unlocks
  const refreshAssessmentUnlocks = useCallback(async () => {
    setAssessmentUnlocksLoading(true);
    try {
      const data = await getAssessmentUnlocks();
      setAssessmentUnlocksState(data);
    } catch (err) {
      console.error('Error fetching assessment unlocks:', err);
    } finally {
      setAssessmentUnlocksLoading(false);
    }
  }, []);

  // ===== FILTERED DATA FOR CURRENT USER =====
  // Filter data based on user role and permissions
  const filteredUsers = useMemo(() => {
    if (!user) return [];
    if (user.role === ROLES.ADMIN) return users;

    // Faculty can see all users in their department or their students
    if (user.role === ROLES.FACULTY) {
      const facultyData = getFaculty().find(f => f.userId === user.id);
      if (!facultyData) return [];

      const studentIds = facultyData.studentGroups?.flatMap(groupId => {
        const group = studentGroups.find(g => g.id === groupId);
        return group ? group.students : [];
      }) || [];

      return users.filter(u =>
        u.department === user.department ||
        studentIds.includes(u.id) ||
        u.id === user.id
      );
    }

    // Students can only see themselves
    return users.filter(u => u.id === user.id);
  }, [users, user, studentGroups]);

  const filteredCourses = useMemo(() => {
    if (!user) return [];
    if (user.role === ROLES.ADMIN) return courses;

    // Faculty can see courses they teach
    if (user.role === ROLES.FACULTY) {
      const facultyData = faculty.find(f => f.userId === user.id);
      if (!facultyData) return [];

      return courses.filter(course =>
        facultyData.courses.includes(course.id) ||
        course.facultyId === user.id
      );
    }

    // Students can see courses they're enrolled in
    if (user.role === ROLES.STUDENT) {
      // Get student's groups
      const studentGroupsForUser = studentGroups.filter(group =>
        group.students.includes(user.id)
      );

      // Get course IDs from groups
      const groupCourseIds = studentGroupsForUser.flatMap(group =>
        group.courses || []
      );

      // Also include courses directly assigned to user
      return courses.filter(course =>
        course.students?.includes(user.id) ||
        groupCourseIds.includes(course.id)
       );
    }

    // Default return for unauthenticated users
    return [];
  }, [courses, user, faculty, studentGroups]);

  // Filtered Labs
  const filteredLabs = useMemo(() => {
    if (!user) return [];
    if (user.role === ROLES.ADMIN) return labs;

    // Faculty can see all labs
    if (user.role === ROLES.FACULTY) return labs;

    // Students can see labs they have access to
    if (user.role === ROLES.STUDENT) {
      // Get courses user is enrolled in
      const userCourses = filteredCourses.map(c => c.id);
      // Get labs from those courses
      const courseLabs = labs.filter(lab =>
        userCourses.includes(lab.courseId) ||
        lab.access === 'public' ||
        (lab.access === 'department' && lab.department === user.department)
      );
      return courseLabs;
    }

    return [];
  }, [labs, user, filteredCourses]);

  // Filtered Assessments
  const filteredAssessments = useMemo(() => {
    if (!user) return [];

    if (user.role === ROLES.ADMIN) return assessments;

    // Faculty can see assessments they created
    if (user.role === ROLES.FACULTY) {
      return assessments.filter(a =>
        a.createdBy === user.id ||
        (a.facultyIds && a.facultyIds.includes(user.id))
      );
    }

    // Students can see assessments that are:
    // 1. Unlocked for them
    // 2. For courses they're enrolled in
    // 3. Not expired
    if (user.role === ROLES.STUDENT) {
      return assessments.filter(a => {
        // Check if assessment is for a course the student is enrolled in
        const isInCourse = filteredCourses.some(c => c.id === a.courseId);

        // Check if assessment is unlocked for this student
        const isUnlocked = isAssessmentUnlockedForStudent(a.id, user.id);

        // Check if assessment is not expired
        const isNotExpired = !a.endDate || new Date(a.endDate) > new Date();

        // Check if assessment is in a valid state for student
        const isValidState = [
          ASSESSMENT_STATES.ELIGIBLE,
          ASSESSMENT_STATES.OPEN,
          ASSESSMENT_STATES.IN_PROGRESS,
          ASSESSMENT_STATES.SUBMITTED,
          ASSESSMENT_STATES.PASSED,
          ASSESSMENT_STATES.FAILED
        ].includes(a.status);

        return (isInCourse || !a.courseId) && (isUnlocked || a.status === ASSESSMENT_STATES.OPEN) && isNotExpired && isValidState;
      });
    }

    return [];
  }, [assessments, user, filteredCourses, assessmentUnlocks]);

  // Filtered Results (only for the current user unless admin/faculty)
  const filteredResults = useMemo(() => {
    if (!user) return [];

    if (user.role === ROLES.ADMIN) return results;

    // Faculty can see results for their students
    if (user.role === ROLES.FACULTY) {
      const facultyData = faculty.find(f => f.userId === user.id);
      if (!facultyData) return [];

      const studentIds = facultyData.studentGroups?.flatMap(groupId => {
        const group = studentGroups.find(g => g.id === groupId);
        return group ? group.students : [];
      }) || [];

      return results.filter(r => studentIds.includes(r.studentId));
    }

    // Students can only see their own results
    return results.filter(r => r.studentId === user.id);
  }, [results, user, faculty, studentGroups]);

  // Filtered Attendance (only for the current user unless admin/faculty)
  const filteredAttendance = useMemo(() => {
    if (!user) return [];

    if (user.role === ROLES.ADMIN) return attendance;

    // Faculty can see attendance for their students
    if (user.role === ROLES.FACULTY) {
      const facultyData = faculty.find(f => f.userId === user.id);
      if (!facultyData) return [];

      const studentIds = facultyData.studentGroups?.flatMap(groupId => {
        const group = studentGroups.find(g => g.id === groupId);
        return group ? group.students : [];
      }) || [];

      return attendance.filter(a => studentIds.includes(a.studentId));
    }

    // Students can only see their own attendance
    return attendance.filter(a => a.studentId === user.id);
  }, [attendance, user, faculty, studentGroups]);

  // Filtered Schedules
  const filteredSchedules = useMemo(() => {
    if (!user) return [];

    if (user.role === ROLES.ADMIN) return schedules;

    // Faculty can see schedules they created or are assigned to
    if (user.role === ROLES.FACULTY) {
      return schedules.filter(s =>
        s.facultyId === user.id ||
        (s.students && s.students.includes(user.id))
      );
    }

    // Students can see schedules they're assigned to
    return schedules.filter(s =>
      s.students?.includes(user.id) ||
      s.type === 'Holiday' ||
      (s.courseId && filteredCourses.some(c => c.id === s.courseId))
    );
  }, [schedules, user, filteredCourses]);

  // Filtered Violations (only for the current user unless admin/faculty)
  const filteredViolations = useMemo(() => {
    if (!user) return [];

    if (user.role === ROLES.ADMIN) return violations;

    // Faculty can see violations for their students
    if (user.role === ROLES.FACULTY) {
      const facultyData = faculty.find(f => f.userId === user.id);
      if (!facultyData) return [];

      const studentIds = facultyData.studentGroups?.flatMap(groupId => {
        const group = studentGroups.find(g => g.id === groupId);
        return group ? group.students : [];
      }) || [];

      return violations.filter(v => studentIds.includes(v.studentId));
    }

    // Students can only see their own violations
    return violations.filter(v => v.studentId === user.id);
  }, [violations, user, faculty, studentGroups]);

  // Filtered Notifications (only for the current user)
  const filteredNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter(n => n.userId === user.id);
  }, [notifications, user]);

  // ===== DATA MODIFICATION FUNCTIONS =====
  // These functions directly modify the data and update state

  // User functions
  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await addUser({
        ...userData,
        id: `USER-${Date.now()}`,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        avatar: userData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.name,
        permissions: userData.role === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
                     userData.role === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
                     STUDENT_DEFAULT_PERMISSIONS
      });
      setUsersState(prev => [...prev, newUser]);
      await refreshUsers();

      // Log action
      logAction({
        action: 'USER_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'User',
        targetId: newUser.id,
        status: 'Success',
        details: { name: newUser.name, email: newUser.email, role: newUser.role }
      });

      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }, [user, refreshUsers]);

  const modifyUser = useCallback(async (userId, updates) => {
    try {
      const oldUser = users.find(u => u.id === userId);
      const updatedUser = await updateUser(userId, updates);
      setUsersState(prev => prev.map(u => u.id === userId ? updatedUser : u));

      // Log action
      logAction({
        action: 'USER_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: {
          oldData: { name: oldUser?.name, email: oldUser?.email, role: oldUser?.role },
          newData: { name: updatedUser?.name, email: updatedUser?.email, role: updatedUser?.role }
        }
      });

      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }, [users, user, refreshUsers]);

  const removeUser = useCallback(async (userId) => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      await deleteUser(userId);
      setUsersState(prev => prev.filter(u => u.id !== userId));

      // Log action
      logAction({
        action: 'USER_DELETED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'User',
        targetId: userId,
        status: 'Success',
        details: { name: userToDelete?.name, email: userToDelete?.email }
      });

      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }, [users, user, refreshUsers]);

  // Course functions
  const createCourse = useCallback(async (courseData) => {
    try {
      const newCourse = await addCourse({
        ...courseData,
        id: `COURSE-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: courseData.isPublished || false
      });
      setCoursesState(prev => [...prev, newCourse]);
      await refreshCourses();

      // Log action
      logAction({
        action: 'COURSE_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Course',
        targetId: newCourse.id,
        status: 'Success',
        details: { title: newCourse.title, level: newCourse.level }
      });

      return newCourse;
    } catch (err) {
      console.error('Error creating course:', err);
      throw err;
    }
  }, [user, refreshCourses]);

  const modifyCourse = useCallback(async (courseId, updates) => {
    try {
      const updatedCourse = await updateCourse(courseId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setCoursesState(prev => prev.map(c => c.id === courseId ? updatedCourse : c));

      // Log action
      logAction({
        action: 'COURSE_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: { title: updatedCourse.title }
      });

      return updatedCourse;
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  }, [user, refreshCourses]);

  const removeCourse = useCallback(async (courseId) => {
    try {
      const courseToDelete = courses.find(c => c.id === courseId);
      await deleteCourse(courseId);
      setCoursesState(prev => prev.filter(c => c.id !== courseId));

      // Log action
      logAction({
        action: 'COURSE_DELETED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Course',
        targetId: courseId,
        status: 'Success',
        details: { title: courseToDelete?.title }
      });

      return true;
    } catch (err) {
      console.error('Error deleting course:', err);
      throw err;
    }
  }, [courses, user, refreshCourses]);

  // Lab functions
  const createLab = useCallback(async (labData) => {
    try {
      const newLab = await addLab({
        ...labData,
        id: `LAB-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setLabsState(prev => [...prev, newLab]);
      await refreshLabs();

      // Log action
      logAction({
        action: 'LAB_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Lab',
        targetId: newLab.id,
        status: 'Success',
        details: { title: newLab.title, domain: newLab.domain }
      });

      return newLab;
    } catch (err) {
      console.error('Error creating lab:', err);
      throw err;
    }
  }, [user, refreshLabs]);

  const modifyLab = useCallback(async (labId, updates) => {
    try {
      const updatedLab = await updateLab(labId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setLabsState(prev => prev.map(l => l.id === labId ? updatedLab : l));

      // Log action
      logAction({
        action: 'LAB_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: { title: updatedLab.title }
      });

      return updatedLab;
    } catch (err) {
      console.error('Error updating lab:', err);
      throw err;
    }
  }, [user, refreshLabs]);

  const removeLab = useCallback(async (labId) => {
    try {
      const labToDelete = labs.find(l => l.id === labId);
      await deleteLab(labId);
      setLabsState(prev => prev.filter(l => l.id !== labId));

      // Log action
      logAction({
        action: 'LAB_DELETED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Lab',
        targetId: labId,
        status: 'Success',
        details: { title: labToDelete?.title }
      });

      return true;
    } catch (err) {
      console.error('Error deleting lab:', err);
      throw err;
    }
  }, [labs, user, refreshLabs]);

  // Assessment functions
  const createAssessment = useCallback(async (assessmentData) => {
    try {
      const newAssessment = await addAssessment({
        ...assessmentData,
        id: `ASSESS-${assessmentData.type?.substring(0, 3).toUpperCase() || 'GEN'}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.id,
        status: ASSESSMENT_STATES.LOCKED,
        isPublished: assessmentData.isPublished || false
      });
      setAssessmentsState(prev => [...prev, newAssessment]);
      await refreshAssessments();

      // Log action
      logAction({
        action: 'ASSESSMENT_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Assessment',
        targetId: newAssessment.id,
        status: 'Success',
        details: { title: newAssessment.title, type: newAssessment.type }
      });

      return newAssessment;
    } catch (err) {
      console.error('Error creating assessment:', err);
      throw err;
    }
  }, [user, refreshAssessments]);

  const modifyAssessment = useCallback(async (assessmentId, updates) => {
    try {
      const updatedAssessment = await updateAssessment(assessmentId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setAssessmentsState(prev => prev.map(a => a.id === assessmentId ? updatedAssessment : a));

      // Log action
      logAction({
        action: 'ASSESSMENT_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: { title: updatedAssessment.title, status: updatedAssessment.status }
      });

      return updatedAssessment;
    } catch (err) {
      console.error('Error updating assessment:', err);
      throw err;
    }
  }, [user, refreshAssessments]);

  const removeAssessment = useCallback(async (assessmentId) => {
    try {
      const assessmentToDelete = assessments.find(a => a.id === assessmentId);
      await deleteAssessment(assessmentId);
      setAssessmentsState(prev => prev.filter(a => a.id !== assessmentId));

      // Log action
      logAction({
        action: 'ASSESSMENT_DELETED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: { title: assessmentToDelete?.title }
      });

      return true;
    } catch (err) {
      console.error('Error deleting assessment:', err);
      throw err;
    }
  }, [assessments, user, refreshAssessments]);

  // Unlock assessment for student
  const unlockAssessment = useCallback(async (assessmentId, studentId) => {
    try {
      await unlockAssessmentForStudent(assessmentId, studentId);
      await refreshAssessmentUnlocks();

      // Log action
      logAction({
        action: 'ASSESSMENT_UNLOCKED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: { studentId, assessmentId }
      });

      // Refresh assessments to show updated status
      await refreshAssessments();

      return true;
    } catch (err) {
      console.error('Error unlocking assessment:', err);
      throw err;
    }
  }, [user, refreshAssessments, refreshAssessmentUnlocks]);

  // Lock assessment for student
  const lockAssessment = useCallback(async (assessmentId, studentId) => {
    try {
      await lockAssessmentForStudent(assessmentId, studentId);
      await refreshAssessmentUnlocks();

      // Log action
      logAction({
        action: 'ASSESSMENT_LOCKED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: { studentId, assessmentId }
      });

      // Refresh assessments
      await refreshAssessments();

      return true;
    } catch (err) {
      console.error('Error locking assessment:', err);
      throw err;
    }
  }, [user, refreshAssessments, refreshAssessmentUnlocks]);

  // Reset assessment attempts
  const resetAssessmentAttempts = useCallback(async (assessmentId, studentId) => {
    try {
      // Get current results for this assessment and student
      const results = getResults();
      const studentResults = results.filter(r =>
        r.assessmentId === assessmentId && r.studentId === studentId
      );

      // Delete all attempts
      for (const result of studentResults) {
        await deleteResult(result.id);
      }

      // Lock the assessment (optional)
      await lockAssessmentForStudent(assessmentId, studentId);

      // Log action
      logAction({
        action: 'ASSESSMENT_ATTEMPTS_RESET',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Assessment',
        targetId: assessmentId,
        status: 'Success',
        details: { studentId, assessmentId, attemptsReset: studentResults.length }
      });

      // Refresh data
      await refreshResults();
      await refreshAssessmentUnlocks();
      await refreshAssessments();

      return true;
    } catch (err) {
      console.error('Error resetting assessment attempts:', err);
      throw err;
    }
  }, [user, refreshResults, refreshAssessmentUnlocks, refreshAssessments]);

  // Result functions
  const createResult = useCallback(async (resultData) => {
    try {
      const newResult = await addResult({
        ...resultData,
        id: `RESULT-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: resultData.score >= (resultData.passingScore || 70) ? 'Passed' : 'Failed'
      });
      setResultsState(prev => [...prev, newResult]);
      await refreshResults();

      // Log action
      logAction({
        action: 'ASSESSMENT_SUBMITTED',
        userId: user?.id || resultData.studentId,
        role: user?.role || ROLES.STUDENT,
        target: 'Result',
        targetId: newResult.id,
        status: 'Success',
        details: { assessmentId: resultData.assessmentId, score: resultData.score }
      });

      return newResult;
    } catch (err) {
      console.error('Error creating result:', err);
      throw err;
    }
  }, [user, refreshResults]);

  const modifyResult = useCallback(async (resultId, updates) => {
    try {
      const updatedResult = await updateResult(resultId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setResultsState(prev => prev.map(r => r.id === resultId ? updatedResult : r));

      // Log action
      logAction({
        action: 'RESULT_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Result',
        targetId: resultId,
        status: 'Success',
        details: { score: updatedResult.score, grade: updatedResult.grade }
      });

      return updatedResult;
    } catch (err) {
      console.error('Error updating result:', err);
      throw err;
    }
  }, [user, refreshResults]);

  const publishResult = useCallback(async (resultId) => {
    try {
      const result = results.find(r => r.id === resultId);
      if (!result) throw new Error('Result not found');

      const updatedResult = await updateResult(resultId, {
        published: true,
        publishedAt: new Date().toISOString(),
        publishedBy: user.id
      });

      setResultsState(prev => prev.map(r => r.id === resultId ? updatedResult : r));

      // Log action
      logAction({
        action: 'RESULT_PUBLISHED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Result',
        targetId: resultId,
        status: 'Success',
        details: { studentId: result.studentId, assessmentId: result.assessmentId }
      });

      // Create notification for student
      await addNotification({
        id: `NOTIF-${Date.now()}`,
        userId: result.studentId,
        type: 'RESULT_PUBLISHED',
        title: 'Assessment Result Published',
        message: `Your result for ${result.assessmentTitle || 'an assessment'} is now available. Score: ${result.percentage}%`,
        data: {
          resultId: result.id,
          assessmentId: result.assessmentId,
          score: result.score,
          grade: result.grade
        },
        isRead: false,
        createdAt: new Date().toISOString()
      });

      await refreshNotifications();
      await refreshResults();

      return updatedResult;
    } catch (err) {
      console.error('Error publishing result:', err);
      throw err;
    }
  }, [user, results, refreshResults, refreshNotifications]);

  // Attendance functions
  const createAttendance = useCallback(async (attendanceData) => {
    try {
      const newAttendance = await addAttendance({
        ...attendanceData,
        id: `ATT-${Date.now()}`,
        date: attendanceData.date || new Date().toISOString().split('T')[0],
        checkIn: attendanceData.checkIn || new Date().toISOString()
      });
      setAttendanceState(prev => [...prev, newAttendance]);
      await refreshAttendance();

      // Log action
      logAction({
        action: 'ATTENDANCE_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Attendance',
        targetId: newAttendance.id,
        status: 'Success',
        details: { studentId: newAttendance.studentId, status: newAttendance.status }
      });

      return newAttendance;
    } catch (err) {
      console.error('Error creating attendance:', err);
      throw err;
    }
  }, [user, refreshAttendance]);

  const modifyAttendance = useCallback(async (attendanceId, updates) => {
    try {
      const updatedAttendance = await updateAttendance(attendanceId, updates);
      setAttendanceState(prev => prev.map(a => a.id === attendanceId ? updatedAttendance : a));

      // Log action
      logAction({
        action: 'ATTENDANCE_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Attendance',
        targetId: attendanceId,
        status: 'Success',
        details: { studentId: updatedAttendance.studentId, status: updatedAttendance.status }
      });

      return updatedAttendance;
    } catch (err) {
      console.error('Error updating attendance:', err);
      throw err;
    }
  }, [user, refreshAttendance]);

  // Schedule functions
  const createSchedule = useCallback(async (scheduleData) => {
    try {
      const newSchedule = await addSchedule({
        ...scheduleData,
        id: `SCHED-${Date.now()}`,
        createdAt: new Date().toISOString(),
        createdBy: user.id
      });
      setSchedulesState(prev => [...prev, newSchedule]);
      await refreshSchedules();

      // Log action
      logAction({
        action: 'SCHEDULE_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Schedule',
        targetId: newSchedule.id,
        status: 'Success',
        details: { title: newSchedule.title, type: newSchedule.type }
      });

      // Create notifications for affected students
      if (scheduleData.students && scheduleData.students.length > 0) {
        const notificationPromises = scheduleData.students.map(studentId => {
          return addNotification({
            id: `NOTIF-${Date.now()}-${studentId}`,
            userId: studentId,
            type: 'SCHEDULE_CREATED',
            title: 'New Schedule Event',
            message: `A new ${scheduleData.type.toLowerCase()} "${scheduleData.title}" has been scheduled for ${new Date(scheduleData.startDate).toLocaleDateString()}`,
            data: {
              scheduleId: newSchedule.id,
              type: scheduleData.type,
              title: scheduleData.title,
              startDate: scheduleData.startDate
            },
            isRead: false,
            createdAt: new Date().toISOString()
          });
        });

        await Promise.all(notificationPromises);
        await refreshNotifications();
      }

      return newSchedule;
    } catch (err) {
      console.error('Error creating schedule:', err);
      throw err;
    }
  }, [user, refreshSchedules, refreshNotifications]);

  const modifySchedule = useCallback(async (scheduleId, updates) => {
    try {
      const oldSchedule = schedules.find(s => s.id === scheduleId);
      const updatedSchedule = await updateSchedule(scheduleId, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id
      });

      setSchedulesState(prev => prev.map(s => s.id === scheduleId ? updatedSchedule : s));

      // Log action
      logAction({
        action: 'SCHEDULE_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Schedule',
        targetId: scheduleId,
        status: 'Success',
        details: {
          title: updatedSchedule.title,
          oldStartDate: oldSchedule?.startDate,
          newStartDate: updatedSchedule.startDate
        }
      });

      // Create notifications for affected students if time changed
      if (updates.startDate && oldSchedule?.startDate !== updates.startDate && updatedSchedule.students) {
        const notificationPromises = updatedSchedule.students.map(studentId => {
          return addNotification({
            id: `NOTIF-${Date.now()}-${studentId}`,
            userId: studentId,
            type: 'SCHEDULE_UPDATED',
            title: 'Schedule Updated',
            message: `The ${updatedSchedule.type.toLowerCase()} "${updatedSchedule.title}" has been rescheduled to ${new Date(updates.startDate).toLocaleDateString()}`,
            data: {
              scheduleId: updatedSchedule.id,
              type: updatedSchedule.type,
              title: updatedSchedule.title,
              oldStartDate: oldSchedule.startDate,
              newStartDate: updates.startDate
            },
            isRead: false,
            createdAt: new Date().toISOString()
          });
        });

        await Promise.all(notificationPromises);
        await refreshNotifications();
      }

      return updatedSchedule;
    } catch (err) {
      console.error('Error updating schedule:', err);
      throw err;
    }
  }, [user, schedules, refreshSchedules, refreshNotifications]);

  const removeSchedule = useCallback(async (scheduleId) => {
    try {
      const scheduleToDelete = schedules.find(s => s.id === scheduleId);
      await deleteSchedule(scheduleId);
      setSchedulesState(prev => prev.filter(s => s.id !== scheduleId));

      // Log action
      logAction({
        action: 'SCHEDULE_DELETED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Schedule',
        targetId: scheduleId,
        status: 'Success',
        details: { title: scheduleToDelete?.title, type: scheduleToDelete?.type }
      });

      // Create notifications for affected students
      if (scheduleToDelete?.students && scheduleToDelete.students.length > 0) {
        const notificationPromises = scheduleToDelete.students.map(studentId => {
          return addNotification({
            id: `NOTIF-${Date.now()}-${studentId}`,
            userId: studentId,
            type: 'SCHEDULE_CANCELLED',
            title: 'Schedule Cancelled',
            message: `The ${scheduleToDelete.type.toLowerCase()} "${scheduleToDelete.title}" scheduled for ${new Date(scheduleToDelete.startDate).toLocaleDateString()} has been cancelled.`,
            data: {
              scheduleId: scheduleToDelete.id,
              type: scheduleToDelete.type,
              title: scheduleToDelete.title,
              startDate: scheduleToDelete.startDate
            },
            isRead: false,
            createdAt: new Date().toISOString()
          });
        });

        await Promise.all(notificationPromises);
        await refreshNotifications();
      }

      return true;
    } catch (err) {
      console.error('Error deleting schedule:', err);
      throw err;
    }
  }, [user, schedules, refreshSchedules, refreshNotifications]);

  // Violation functions
  const createViolation = useCallback(async (violationData) => {
    try {
      const newViolation = await addViolation({
        ...violationData,
        id: `VIO-${Date.now()}`,
        status: 'Pending',
        timestamp: violationData.timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      setViolationsState(prev => [newViolation, ...prev]);
      await refreshViolations();

      // Log action
      logAction({
        action: 'VIOLATION_CREATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Violation',
        targetId: newViolation.id,
        status: 'Success',
        details: { type: newViolation.type, severity: newViolation.severity }
      });

      // Create notification for admin/faculty
      const adminUsers = getUsers().filter(u => u.role === ROLES.ADMIN);
      const facultyUsers = getUsers().filter(u => u.role === ROLES.FACULTY);

      const notificationPromises = [...adminUsers, ...facultyUsers].map(admin => {
        return addNotification({
          id: `NOTIF-${Date.now()}-${admin.id}`,
          userId: admin.id,
          type: 'VIOLATION_DETECTED',
          title: 'Security Violation Detected',
          message: `A ${newViolation.severity.toLowerCase()} severity ${newViolation.type} violation was detected for student ${violationData.studentId}`,
          data: {
            violationId: newViolation.id,
            studentId: violationData.studentId,
            type: newViolation.type,
            severity: newViolation.severity
          },
          isRead: false,
          createdAt: new Date().toISOString()
        });
      });

      await Promise.all(notificationPromises);
      await refreshNotifications();

      return newViolation;
    } catch (err) {
      console.error('Error creating violation:', err);
      throw err;
    }
  }, [user, refreshViolations, refreshNotifications]);

  const modifyViolation = useCallback(async (violationId, updates) => {
    try {
      const oldViolation = violations.find(v => v.id === violationId);
      const updatedViolation = await updateViolation(violationId, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id
      });

      setViolationsState(prev => prev.map(v => v.id === violationId ? updatedViolation : v));

      // Log action
      logAction({
        action: 'VIOLATION_UPDATED',
        userId: user?.id || 'system',
        role: user?.role || ROLES.ADMIN,
        target: 'Violation',
        targetId: violationId,
        status: 'Success',
        details: {
          oldStatus: oldViolation?.status,
          newStatus: updatedViolation.status,
          oldSeverity: oldViolation?.severity,
          newSeverity: updatedViolation.severity
        }
      });

      return updatedViolation;
    } catch (err) {
      console.error('Error updating violation:', err);
      throw err;
    }
  }, [user, violations, refreshViolations]);

  // Restriction functions
  const createRestriction = useCallback(async (restrictionData) => {
    try {
      const newRestriction = await addRestriction({
        ...restrictionData,
        id: `REST-${Date.now()}`,
                createdAt: new Date().toISOString(),
        createdBy: user.id,
        status: 'Active'
      });
      setRestrictionsState(prev => [...prev, newRestriction]);
      await refreshRestrictions();

      // Log action
      logAction({
        action: 'RESTRICTION_CREATED',
        userId: user?.id,
        role: user?.role,
        target: 'Restriction',
        targetId: newRestriction.id,
        status: 'Success',
        details: {
          userId: restrictionData.userId,
          type: restrictionData.type,
          reason: restrictionData.reason
        }
      });

      return newRestriction;
    } catch (err) {
      console.error('Error creating restriction:', err);
      throw err;
    }
  }, [user, refreshRestrictions]);

  const modifyRestriction = useCallback(async (restrictionId, updates) => {
    try {
      const oldRestriction = restrictions.find(r => r.id === restrictionId);
      const updatedRestriction = await updateRestriction(restrictionId, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id
      });
      setRestrictionsState(prev => prev.map(r => r.id === restrictionId ? updatedRestriction : r));

      // Log action
      logAction({
        action: 'RESTRICTION_UPDATED',
        userId: user?.id,
        role: user?.role,
        target: 'Restriction',
        targetId: restrictionId,
        status: 'Success',
        details: {
          oldStatus: oldRestriction?.status,
          newStatus: updatedRestriction.status,
          oldExpiry: oldRestriction?.expiry,
          newExpiry: updatedRestriction.expiry
        }
      });

      return updatedRestriction;
    } catch (err) {
      console.error('Error updating restriction:', err);
      throw err;
    }
  }, [user, restrictions, refreshRestrictions]);

  const removeRestriction = useCallback(async (restrictionId) => {
    try {
      const restrictionToDelete = restrictions.find(r => r.id === restrictionId);
      await deleteRestriction(restrictionId);
      setRestrictionsState(prev => prev.filter(r => r.id !== restrictionId));

      // Log action
      logAction({
        action: 'RESTRICTION_DELETED',
        userId: user?.id,
        role: user?.role,
        target: 'Restriction',
        targetId: restrictionId,
        status: 'Success',
        details: {
          userId: restrictionToDelete?.userId,
          type: restrictionToDelete?.type
        }
      });

      return true;
    } catch (err) {
      console.error('Error deleting restriction:', err);
      throw err;
    }
  }, [user, restrictions, refreshRestrictions]);

  // Faculty functions
  const createFaculty = useCallback(async (facultyData) => {
    try {
      const newFaculty = await addFaculty({
        ...facultyData,
        id: `FAC-${Date.now()}`,
        joinDate: new Date().toISOString()
      });
      setFacultyState(prev => [...prev, newFaculty]);
      await refreshFaculty();

      // Log action
      logAction({
        action: 'FACULTY_CREATED',
        userId: user?.id,
        role: user?.role,
        target: 'Faculty',
        targetId: newFaculty.id,
        status: 'Success',
        details: { userId: facultyData.userId, department: facultyData.department }
      });

      return newFaculty;
    } catch (err) {
      console.error('Error creating faculty:', err);
      throw err;
    }
  }, [user, refreshFaculty]);

  const modifyFaculty = useCallback(async (facultyId, updates) => {
    try {
      const updatedFaculty = await updateFaculty(facultyId, updates);
      setFacultyState(prev => prev.map(f => f.id === facultyId ? updatedFaculty : f));

      // Log action
      logAction({
        action: 'FACULTY_UPDATED',
        userId: user?.id,
        role: user?.role,
        target: 'Faculty',
        targetId: facultyId,
        status: 'Success',
        details: { userId: updatedFaculty.userId }
      });

      return updatedFaculty;
    } catch (err) {
      console.error('Error updating faculty:', err);
      throw err;
    }
  }, [user, refreshFaculty]);

  const removeFaculty = useCallback(async (facultyId) => {
    try {
      const facultyToDelete = faculty.find(f => f.id === facultyId);
      await deleteFaculty(facultyId);
      setFacultyState(prev => prev.filter(f => f.id !== facultyId));

      // Log action
      logAction({
        action: 'FACULTY_DELETED',
        userId: user?.id,
        role: user?.role,
        target: 'Faculty',
        targetId: facultyId,
        status: 'Success',
        details: { userId: facultyToDelete?.userId }
      });

      return true;
    } catch (err) {
      console.error('Error deleting faculty:', err);
      throw err;
    }
  }, [user, faculty, refreshFaculty]);

  // Student Group functions
  const createStudentGroup = useCallback(async (groupData) => {
    try {
      const newGroup = await addStudentGroup({
        ...groupData,
        id: `GROUP-${Date.now()}`,
        createdAt: new Date().toISOString(),
        createdBy: user.id
      });
      setStudentGroupsState(prev => [...prev, newGroup]);
      await refreshStudentGroups();

      // Log action
      logAction({
        action: 'GROUP_CREATED',
        userId: user?.id,
        role: user?.role,
        target: 'StudentGroup',
        targetId: newGroup.id,
        status: 'Success',
        details: { name: newGroup.name, students: newGroup.students?.length || 0 }
      });

      return newGroup;
    } catch (err) {
      console.error('Error creating student group:', err);
      throw err;
    }
  }, [user, refreshStudentGroups]);

  const modifyStudentGroup = useCallback(async (groupId, updates) => {
    try {
      const updatedGroup = await updateStudentGroup(groupId, {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id
      });
      setStudentGroupsState(prev => prev.map(g => g.id === groupId ? updatedGroup : g));

      // Log action
      logAction({
        action: 'GROUP_UPDATED',
        userId: user?.id,
        role: user?.role,
        target: 'StudentGroup',
        targetId: groupId,
        status: 'Success',
        details: { name: updatedGroup.name }
      });

      return updatedGroup;
    } catch (err) {
      console.error('Error updating student group:', err);
      throw err;
    }
  }, [user, refreshStudentGroups]);

  const removeStudentGroup = useCallback(async (groupId) => {
    try {
      const groupToDelete = studentGroups.find(g => g.id === groupId);
      await deleteStudentGroup(groupId);
      setStudentGroupsState(prev => prev.filter(g => g.id !== groupId));

      // Log action
      logAction({
        action: 'GROUP_DELETED',
        userId: user?.id,
        role: user?.role,
        target: 'StudentGroup',
        targetId: groupId,
        status: 'Success',
        details: { name: groupToDelete?.name }
      });

      return true;
    } catch (err) {
      console.error('Error deleting student group:', err);
      throw err;
    }
  }, [user, studentGroups, refreshStudentGroups]);

  // Settings functions
  const updateSettings = useCallback(async (updates) => {
    try {
      const currentSettings = getSettings();
      const updatedSettings = await updateSettings(updates);
      setSettingsState(updatedSettings);

      // Log action
      logAction({
        action: 'SETTINGS_UPDATED',
        userId: user?.id,
        role: user?.role,
        target: 'Settings',
        status: 'Success',
        details: { ...updates }
      });

      return updatedSettings;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }, [user]);

  // Theme functions
  const setTheme = useCallback(async (newTheme) => {
    try {
      await setTheme(newTheme);
      setThemeState(newTheme);

      // Log action
      logAction({
        action: 'THEME_UPDATED',
        userId: user?.id,
        role: user?.role,
        target: 'Settings',
        status: 'Success',
        details: { theme: newTheme }
      });

      return newTheme;
    } catch (err) {
      console.error('Error setting theme:', err);
      throw err;
    }
  }, [user]);

  // Permission functions
  const updatePermissions = useCallback(async (role, permissions) => {
    try {
      const updated = await updateRolePermissions(role, permissions);
      setPermissionsState(updated);

      // Log action
      logAction({
        action: 'PERMISSIONS_UPDATED',
        userId: user?.id,
        role: user?.role,
        target: 'Permissions',
        targetId: role,
        status: 'Success',
        details: { permissions: permissions.length }
      });

      return updated;
    } catch (err) {
      console.error('Error updating permissions:', err);
      throw err;
    }
  }, [user]);

  // Backup functions
  const createBackup = useCallback(async (options = {}) => {
    try {
      const backup = await createBackup({
        createdBy: user?.id,
        ...options
      });

      // Log action
      logAction({
        action: 'BACKUP_CREATED',
        userId: user?.id,
        role: user?.role,
        target: 'Backup',
        targetId: backup.id,
        status: 'Success',
        details: { size: backup.size, fileCount: backup.fileCount }
      });

      await refreshBackups();
      return backup;
    } catch (err) {
      console.error('Error creating backup:', err);
      throw err;
    }
  }, [user, refreshBackups]);

  const restoreBackup = useCallback(async (backup, verifyVersion = true) => {
    try {
      const result = await restoreBackup(backup, verifyVersion);

      // Log action
      logAction({
        action: 'BACKUP_RESTORED',
        userId: user?.id,
        role: user?.role,
        target: 'Backup',
        targetId: backup.id,
        status: result.success ? 'Success' : 'Failure',
        details: { version: backup.version }
      });

      // Refresh all data after restore
      await Promise.all([
        refreshUsers(),
        refreshCourses(),
        refreshLabs(),
        refreshAssessments(),
        refreshResults(),
        refreshAttendance(),
        refreshSchedules(),
        refreshViolations(),
        refreshNotifications(),
        refreshAuditLogs(),
        refreshRestrictions(),
        refreshFaculty(),
        refreshStudentGroups(),
        refreshSettings(),
        refreshTheme(),
        refreshPermissions(),
        refreshAssessmentUnlocks()
      ]);

      return result;
    } catch (err) {
      console.error('Error restoring backup:', err);
      throw err;
    }
  }, [
    user, refreshUsers, refreshCourses, refreshLabs, refreshAssessments,
    refreshResults, refreshAttendance, refreshSchedules, refreshViolations,
    refreshNotifications, refreshAuditLogs, refreshRestrictions, refreshFaculty,
    refreshStudentGroups, refreshSettings, refreshTheme, refreshPermissions,
    refreshAssessmentUnlocks
  ]);

  const downloadBackup = useCallback((backup) => {
    downloadBackup(backup);
  }, []);

  const importBackupFromFile = useCallback(async (file) => {
    return await importBackupFromFile(file);
  }, []);

  // Student Progress functions
  const getStudentProgress = useCallback((studentId) => {
    return getStudentProgress(studentId);
  }, []);

  const updateStudentProgress = useCallback(async (studentId, updates) => {
    try {
      const updatedProgress = await updateStudentProgress(studentId, updates);

      // Log action if this is the current user
      if (studentId === user?.id) {
        logAction({
          action: 'PROGRESS_UPDATED',
          userId: user?.id,
          role: user?.role,
          target: 'Progress',
          targetId: studentId,
          status: 'Success',
          details: updates
        });
      }

      return updatedProgress;
    } catch (err) {
      console.error('Error updating student progress:', err);
      throw err;
    }
  }, [user]);

  // ===== CONTEXT VALUE =====
  const value = useMemo(() => ({
    // State
    isLoading,
    error,
    users,
    courses,
    labs,
    assessments,
    results,
    attendance,
    schedules,
    violations,
    notifications,
    auditLogs,
    restrictions,
    faculty,
    studentGroups,
    settings,
    theme,
    permissions,
    assessmentUnlocks,

    // Loading states
    usersLoading,
    coursesLoading,
    labsLoading,
    assessmentsLoading,
    resultsLoading,
    attendanceLoading,
    schedulesLoading,
    violationsLoading,
    notificationsLoading,
    auditLogsLoading,
    restrictionsLoading,
    facultyLoading,
    studentGroupsLoading,
    settingsLoading,
    themeLoading,
    permissionsLoading,
    assessmentUnlocksLoading,

    // Filtered data
    filteredUsers,
    filteredCourses,
    filteredLabs,
    filteredAssessments,
    filteredResults,
    filteredAttendance,
    filteredSchedules,
    filteredViolations,
    filteredNotifications,

    // Refresh functions
    refreshUsers,
    refreshCourses,
    refreshLabs,
    refreshAssessments,
    refreshResults,
    refreshAttendance,
    refreshSchedules,
    refreshViolations,
    refreshNotifications,
    refreshAuditLogs,
    refreshRestrictions,
    refreshFaculty,
    refreshStudentGroups,
    refreshSettings,
    refreshTheme,
    refreshPermissions,
    refreshAssessmentUnlocks,

    // User CRUD
    createUser,
    modifyUser,
    removeUser,

    // Course CRUD
    createCourse,
    modifyCourse,
    removeCourse,

    // Lab CRUD
    createLab,
    modifyLab,
    removeLab,

    // Assessment CRUD
    createAssessment,
    modifyAssessment,
    removeAssessment,
    unlockAssessment,
    lockAssessment,
    resetAssessmentAttempts,

    // Result CRUD
    createResult,
    modifyResult,
    publishResult,

    // Attendance CRUD
    createAttendance,
    modifyAttendance,

    // Schedule CRUD
    createSchedule,
    modifySchedule,
    removeSchedule,

    // Violation CRUD
    createViolation,
    modifyViolation,

    // Restriction CRUD
    createRestriction,
    modifyRestriction,
    removeRestriction,

    // Faculty CRUD
    createFaculty,
    modifyFaculty,
    removeFaculty,

    // Student Group CRUD
    createStudentGroup,
    modifyStudentGroup,
    removeStudentGroup,

    // Settings
    updateSettings,

    // Theme
    setTheme,

    // Permissions
    updatePermissions,

    // Backup
    createBackup,
    restoreBackup,
    downloadBackup,
    importBackupFromFile,

    // Student Progress
    getStudentProgress,
    updateStudentProgress,

    // Direct data access (for advanced use cases)
    getUsers,
    getCourses,
    getLabs,
    getAssessments,
    getResults,
    getAttendance,
    getSchedules,
    getViolations,
    getNotifications,
    getAuditLogs,
    getRestrictions,
    getFaculty,
    getStudentGroups,
    getSettings,
    getTheme,
    getPermissions,
    getAssessmentUnlocks,
    getStudentProgress: getStudentProgress
  }), [
    // State
    isLoading, error, users, courses, labs, assessments, results, attendance,
    schedules, violations, notifications, auditLogs, restrictions, faculty,
    studentGroups, settings, theme, permissions, assessmentUnlocks,

    // Loading states
    usersLoading, coursesLoading, labsLoading, assessmentsLoading, resultsLoading,
    attendanceLoading, schedulesLoading, violationsLoading, notificationsLoading,
    auditLogsLoading, restrictionsLoading, facultyLoading, studentGroupsLoading,
    settingsLoading, themeLoading, permissionsLoading, assessmentUnlocksLoading,

    // Filtered data
    filteredUsers, filteredCourses, filteredLabs, filteredAssessments,
    filteredResults, filteredAttendance, filteredSchedules, filteredViolations,
    filteredNotifications,

    // Refresh functions
    refreshUsers, refreshCourses, refreshLabs, refreshAssessments,
    refreshResults, refreshAttendance, refreshSchedules, refreshViolations,
    refreshNotifications, refreshAuditLogs, refreshRestrictions, refreshFaculty,
    refreshStudentGroups, refreshSettings, refreshTheme, refreshPermissions,
    refreshAssessmentUnlocks,

    // CRUD functions
    createUser, modifyUser, removeUser,
    createCourse, modifyCourse, removeCourse,
    createLab, modifyLab, removeLab,
    createAssessment, modifyAssessment, removeAssessment,
    unlockAssessment, lockAssessment, resetAssessmentAttempts,
    createResult, modifyResult, publishResult,
    createAttendance, modifyAttendance,
    createSchedule, modifySchedule, removeSchedule,
    createViolation, modifyViolation,
    createRestriction, modifyRestriction, removeRestriction,
    createFaculty, modifyFaculty, removeFaculty,
    createStudentGroup, modifyStudentGroup, removeStudentGroup,
    updateSettings, setTheme, updatePermissions,
    createBackup, restoreBackup, downloadBackup, importBackupFromFile,
    getStudentProgress, updateStudentProgress
  ]);

  // ===== RENDER =====
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// ===== CUSTOM HOOK =====
/**
 * Custom hook to use the DataContext
 * @returns {object} - Data context value
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// ===== EXPORT =====
export default DataContext;
export { DataProvider, useData }; 