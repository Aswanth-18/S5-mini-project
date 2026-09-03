import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ASSESSMENT_STATES, ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressBar from '../../components/common/ProgressBar';
import { 
  Users, BookOpen, BarChart3, Clock, TrendingUp, TrendingDown, 
  CheckCircle, XCircle, ShieldCheck, Calendar, AlertTriangle,
  Settings, Activity, FileText, Database, Lock, UserCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, courses, assessments, labs, results, violations, auditLogs, isLoading } = useData();
  const [stats, setStats] = useState({
    users: 0,
    students: 0,
    faculty: 0,
    courses: 0,
    assessments: 0,
    labs: 0,
    avgScore: 0,
    passRate: 0,
    violations: 0,
    activity: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    userActivity: 0,
    systemHealth: 'Excellent',
    storageUsage: 0,
    backupStatus: 'Current'
  });

  useEffect(() => {
    if (users.length > 0 && courses.length > 0 && assessments.length > 0 && results.length > 0) {
      // Calculate user statistics
      const studentCount = users.filter(u => u.role === ROLES.STUDENT).length;
      const facultyCount = users.filter(u => u.role === ROLES.FACULTY).length;
      const adminCount = users.filter(u => u.role === ROLES.ADMIN).length;
      
      // Calculate average score
      const avgScore = results.length > 0 ? 
        Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0;
      
      // Calculate pass rate
      const passedResults = results.filter(r => r.status === ASSESSMENT_STATES.PASSED);
      const passRate = results.length > 0 ? Math.round((passedResults.length / results.length) * 100) : 0;
      
      // Recent activity from audit logs
      const recentLogs = auditLogs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      
      setStats({
        users: users.length,
        students: studentCount,
        faculty: facultyCount,
        courses: courses.length,
        assessments: assessments.length,
        labs: labs.length,
        avgScore,
        passRate,
        violations: violations.length,
        activity: recentLogs.length
      });
      
      setRecentActivity(recentLogs);
      
      // Simulate system status (in a real app, this would come from actual system monitoring)
      const activeUsers = users.filter(u => u.status === 'active').length;
      const userActivity = Math.round((activeUsers / users.length) * 100);
      const systemHealth = violations.length < 10 ? 'Excellent' : 
                          violations.length < 20 ? 'Good' : 'Fair';
      const storageUsage = Math.floor(Math.random() * 80) + 20; // Simulated storage usage
      
      setSystemStatus({
        userActivity,
        systemHealth,
        storageUsage,
        backupStatus: 'Current'
      });
    }
  }, [users, courses, assessments, labs, results, violations, auditLogs]);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'LOGIN': return <UserCheck size={18} className="text-green-600" />;
      case 'LOGOUT': return <XCircle size={18} className="text-red-600" />;
      case 'USER_CREATED': return <Users size={18} className="text-blue-600" />;
      case 'ASSESSMENT_CREATED': return <BarChart3 size={18} className="text-purple-600" />;
      case 'RESULT_PUBLISHED': return <CheckCircle size={18} className="text-green-600" />;
      case 'VIOLATION_DETECTED': return <AlertTriangle size={18} className="text-red-600" />;
      default: return <Activity size={18} className="text-gray-600" />;
    }
  };

  const getSystemHealthColor = (health) => {
    switch (health) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.name || 'Admin'}
        </h1>
        <p className="text-purple-100">
          Here's an overview of your CyberNex system. Manage users, courses, assessments, and monitor platform activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Users</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.faculty}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Faculty</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.courses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.assessments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Assessments</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck size={24} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-600">{stats.labs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Practice Labs</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.avgScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-teal-600">{stats.passRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pass Rate</div>
          </div>
        </Card>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Status
              </span>
              <Badge className={getSystemHealthColor(systemStatus.systemHealth)}>
                {systemStatus.systemHealth}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                User Activity
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white">{systemStatus.userActivity}%</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Storage Usage
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white">{systemStatus.storageUsage}%</span>
                <Badge variant={systemStatus.storageUsage > 70 ? 'danger' : 'success'}>
                  {systemStatus.storageUsage > 70 ? 'Warning' : 'Good'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Backup Status
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  {systemStatus.backupStatus}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Last: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Status
              </div>
              <ProgressBar
                value={systemStatus.userActivity}
                maxValue={100}
                className="h-3"
                variant="success"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Violations Detected
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-red-600">{stats.violations}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Last 30 days
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assessment Integrity
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">{stats.passRate}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Pass Rate
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent Activity
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{stats.activity}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Today
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                {systemStatus.systemHealth === 'Excellent' ? 'All systems operating normally' : 
                 systemStatus.systemHealth === 'Good' ? 'Minor issues detected' : 
                 'Attention required'}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<Users size={16} />}>
              Users
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<BookOpen size={16} />}>
              Courses
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<BarChart3 size={16} />}>
              Assessments
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<ShieldCheck size={16} />}>
              Practice Labs
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<AlertTriangle size={16} />}>
              Violations
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<FileText size={16} />}>
              Reports
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<Settings size={16} />}>
              Settings
            </Button>
            <Button variant="outline" className="h-full flex flex-col items-center justify-center p-3" startIcon={<Database size={16} />}>
              Backups
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-300">
                No recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((log) => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getActivityIcon(log.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {log.action.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {user?.name || log.userId} ({log.role})
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {log.target} - {log.status}
                        </div>
                        {log.details && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {JSON.stringify(log.details).substring(0, 50)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* System Stats */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Platform Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Users</div>
              <ProgressBar value={stats.users} maxValue={1000} className="h-2 mt-2" variant="primary" />
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.courses}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Total Courses</div>
              <ProgressBar value={stats.courses} maxValue={100} className="h-2 mt-2" variant="success" />
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.assessments}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Total Assessments</div>
              <ProgressBar value={stats.assessments} maxValue={500} className="h-2 mt-2" variant="primary" />
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.labs}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Total Labs</div>
              <ProgressBar value={stats.labs} maxValue={200} className="h-2 mt-2" variant="warning" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assessment Performance
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats.avgScore}% Avg
              </span>
            </div>
            <ProgressBar
              value={stats.avgScore}
              maxValue={100}
              className="h-3"
              variant={stats.avgScore >= 70 ? 'success' : stats.avgScore >= 50 ? 'warning' : 'danger'}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Distribution
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{stats.students}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Students</div>
              <div className="mt-2">
                <Badge variant="primary" className="text-xs">
                  {Math.round((stats.students / stats.users) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{stats.faculty}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Faculty</div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  {Math.round((stats.faculty / stats.users) * 100)}%
                </Badge>
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{users.filter(u => u.role === ROLES.ADMIN).length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Admins</div>
              <div className="mt-2">
                <Badge variant="success" className="text-xs">
                  {Math.round(((users.filter(u => u.role === ROLES.ADMIN).length) / stats.users) * 100)}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Content Overview
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{stats.courses}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Courses</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">{stats.assessments}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Assessments</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-indigo-600">{stats.labs}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Practice Labs</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Administrative Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/users/new">
            <Button variant="primary" startIcon={<Users size={16} />}>
              Add User
            </Button>
          </Link>
          <Link to="/admin/courses/new">
            <Button variant="primary" startIcon={<BookOpen size={16} />}>
              Create Course
            </Button>
          </Link>
          <Link to="/admin/assessments/new">
            <Button variant="primary" startIcon={<BarChart3 size={16} />}>
              Create Assessment
            </Button>
          </Link>
          <Link to="/admin/backups/new">
            <Button variant="outline" startIcon={<Database size={16} />}>
              Create Backup
            </Button>
          </Link>
          <Link to="/admin/audit-logs">
            <Button variant="outline" startIcon={<FileText size={16} />}>
              View Audit Logs
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" startIcon={<Settings size={16} />}>
              System Settings
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;