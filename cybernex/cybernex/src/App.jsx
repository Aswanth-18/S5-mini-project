import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';
import SharedLayout from './layouts/SharedLayout';

// Pages
import Login from './pages/auth/Login';
import AccessDenied from './pages/auth/AccessDenied';

// Shared Pages
import Dashboard from './pages/shared/Dashboard';
import Profile from './pages/shared/Profile';
import Notifications from './pages/shared/Notifications';
import Settings from './pages/shared/Settings';
import Help from './pages/shared/Help';
import SearchResults from './pages/shared/SearchResults';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Learning from './pages/student/Learning';
import LearningDetail from './pages/student/LearningDetail';
import PracticeLabs from './pages/student/PracticeLabs';
import PracticeLabDetail from './pages/student/PracticeLabDetail';
import StudentAssessments from './pages/student/Assessments';
import AssessmentDetail from './pages/student/AssessmentDetail';
import AssessmentTaking from './pages/student/AssessmentTaking';
import StudentProgress from './pages/student/Progress';
import StudentResults from './pages/student/Results';
import ResultDetail from './pages/student/ResultDetail';
import StudentAttendance from './pages/student/Attendance';
import StudentSchedule from './pages/student/Schedule';
import Certificates from './pages/student/Certificates';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyStudents from './pages/faculty/Students';
import FacultyCourses from './pages/faculty/Courses';
import FacultyPractice from './pages/faculty/Practice';
import FacultyAssessments from './pages/faculty/Assessments';
import FacultyResults from './pages/faculty/Results';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultySchedule from './pages/faculty/Schedule';
import FacultyViolations from './pages/faculty/Violations';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import UserForm from './pages/admin/UserForm';
import Courses from './pages/admin/Courses';
import CourseForm from './pages/admin/CourseForm';
import Attendance from './pages/admin/Attendance';
import Schedule from './pages/admin/Schedule';
import Faculty from './pages/admin/Faculty';
import FacultyForm from './pages/admin/FacultyForm';
import Results from './pages/admin/Results';
import Restrictions from './pages/admin/Restrictions';
import RestrictionForm from './pages/admin/RestrictionForm';
import Reset from './pages/admin/Reset';
import Levels from './pages/admin/Levels';
import LevelForm from './pages/admin/LevelForm';
import Assets from './pages/admin/Assets';
import AssetForm from './pages/admin/AssetForm';
import BulkUnlock from './pages/admin/BulkUnlock';
import Violations from './pages/admin/Violations';
import ViolationDetail from './pages/admin/ViolationDetail';
import Backups from './pages/admin/Backups';
import BackupForm from './pages/admin/BackupForm';
import AccessControl from './pages/admin/AccessControl';
import AuditLogs from './pages/admin/AuditLogs';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Shared Routes (available to all authenticated users) */}
              <Route element={<SharedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/search" element={<SearchResults />} />
              </Route>

              {/* Student Routes */}
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/learning" element={<Learning />} />
                <Route path="/student/learning/:courseId" element={<LearningDetail />} />
                <Route path="/student/practice" element={<PracticeLabs />} />
                <Route path="/student/practice/:labId" element={<PracticeLabDetail />} />
                <Route path="/student/assessments" element={<StudentAssessments />} />
                <Route path="/student/assessment/:assessmentId" element={<AssessmentDetail />} />
                <Route path="/student/assessment/:assessmentId/take" element={<AssessmentTaking />} />
                <Route path="/student/progress" element={<StudentProgress />} />
                <Route path="/student/results" element={<StudentResults />} />
                <Route path="/student/results/:resultId" element={<ResultDetail />} />
                <Route path="/student/attendance" element={<StudentAttendance />} />
                <Route path="/student/schedule" element={<StudentSchedule />} />
                <Route path="/student/certificates" element={<Certificates />} />
              </Route>

              {/* Faculty Routes */}
              <Route element={<FacultyLayout />}>
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                <Route path="/faculty/students" element={<FacultyStudents />} />
                <Route path="/faculty/courses" element={<FacultyCourses />} />
                <Route path="/faculty/practice" element={<FacultyPractice />} />
                <Route path="/faculty/assessments" element={<FacultyAssessments />} />
                <Route path="/faculty/results" element={<FacultyResults />} />
                <Route path="/faculty/attendance" element={<FacultyAttendance />} />
                <Route path="/faculty/schedule" element={<FacultySchedule />} />
                <Route path="/faculty/violations" element={<FacultyViolations />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/users/new" element={<UserForm />} />
                <Route path="/admin/users/:userId/edit" element={<UserForm />} />
                <Route path="/admin/courses" element={<Courses />} />
                <Route path="/admin/courses/new" element={<CourseForm />} />
                <Route path="/admin/courses/:courseId/edit" element={<CourseForm />} />
                <Route path="/admin/attendance" element={<Attendance />} />
                <Route path="/admin/schedule" element={<Schedule />} />
                <Route path="/admin/faculty" element={<Faculty />} />
                <Route path="/admin/faculty/new" element={<FacultyForm />} />
                <Route path="/admin/faculty/:facultyId/edit" element={<FacultyForm />} />
                <Route path="/admin/results" element={<Results />} />
                <Route path="/admin/restrictions" element={<Restrictions />} />
                <Route path="/admin/restrictions/new" element={<RestrictionForm />} />
                              <Route path="/admin/restrictions/:restrictionId/edit" element={<RestrictionForm />} />
                <Route path="/admin/reset" element={<Reset />} />
                <Route path="/admin/levels" element={<Levels />} />
                <Route path="/admin/levels/new" element={<LevelForm />} />
                <Route path="/admin/levels/:levelId/edit" element={<LevelForm />} />
                <Route path="/admin/assets" element={<Assets />} />
                <Route path="/admin/assets/new" element={<AssetForm />} />
                <Route path="/admin/assets/:assetId/edit" element={<AssetForm />} />
                <Route path="/admin/bulk-unlock" element={<BulkUnlock />} />
                <Route path="/admin/violations" element={<Violations />} />
                <Route path="/admin/violations/:violationId" element={<ViolationDetail />} />
                <Route path="/admin/backups" element={<Backups />} />
                <Route path="/admin/backups/new" element={<BackupForm />} />
                <Route path="/admin/backups/:backupId/restore" element={<BackupForm />} />
                <Route path="/admin/access-control" element={<AccessControl />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;