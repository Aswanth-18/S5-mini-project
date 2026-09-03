import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ROLES, LEVELS, PAGINATION_DEFAULT } from '../../utils/constants';
import WelcomeMessage from '../../components/dashboard/WelcomeMessage';
import StatsCard from '../../components/dashboard/StatsCard';
import SecurityScore from '../../components/dashboard/SecurityScore';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivity from '../../components/dashboard/RecentActivity';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';
import { BookOpen, Users, BarChart3, ShieldCheck, Calendar, Clock } from 'lucide-react';

const SharedDashboard = () => {
  const { user } = useAuth();
  const { filteredCourses, filteredLabs, filteredAssessments, filteredResults, auditLogs, isLoading } = useData();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    courses: 0,
    labs: 0,
    assessments: 0,
    securityScore: 0,
    completionRate: 0
  });

  // Calculate user-specific stats
  useEffect(() => {
    if (!user) return;

    // For students
    if (user.role === ROLES.STUDENT) {
      const userResults = filteredResults.filter(r => r.studentId === user.id);
      const completedLabs = filteredLabs.filter(lab => {
        // Check if user has completed this lab
        return user.progress?.labs?.completed?.includes(lab.id);
      });

      const totalPossible = filteredCourses.length + filteredLabs.length + filteredAssessments.length;
      const totalCompleted = (user.progress?.courses?.completed?.length || 0) +
                           (user.progress?.labs?.completed?.length || 0) +
                           (user.progress?.assessments?.completed?.length || 0);

      const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

      setStats({
        courses: user.progress?.courses?.completed?.length || 0,
        labs: completedLabs.length,
        assessments: userResults.length,
        securityScore: user.securityScore || 0,
        completionRate
      });
    }
    // For faculty
    else if (user.role === ROLES.FACULTY) {
      const facultyCourses = filteredCourses.filter(c => c.createdBy === user.id);
      const facultyLabs = filteredLabs.filter(l => l.createdBy === user.id);
      const facultyAssessments = filteredAssessments.filter(a => a.createdBy === user.id);

      setStats({
        courses: facultyCourses.length,
        labs: facultyLabs.length,
        assessments: facultyAssessments.length,
        securityScore: 85,
        completionRate: 75
      });
    }
    // For admin
    else if (user.role === ROLES.ADMIN) {
      setStats({
        courses: filteredCourses.length,
        labs: filteredLabs.length,
        assessments: filteredAssessments.length,
        securityScore: 95,
        completionRate: 85
      });
    }
  }, [user, filteredCourses, filteredLabs, filteredAssessments, filteredResults]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get recent activity from audit logs
  const recentActivity = auditLogs
    .filter(log => log.userId === user?.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
    .map(log => ({
      id: log.id,
      userId: log.userId,
      userName: user?.name || 'User',
      action: log.action,
      target: log.target,
      timestamp: log.timestamp,
      status: log.status
    }));

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <WelcomeMessage />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My Courses"
          value={stats.courses}
          icon={BookOpen}
          color="blue"
          period="Total"
        />
        <StatsCard
          title="Practice Labs"
          value={stats.labs}
          icon={ShieldCheck}
          color="green"
          period="Completed"
        />
        <StatsCard
          title="Assessments"
          value={stats.assessments}
          icon={BarChart3}
          color="purple"
          period="Attempted"
        />
        <StatsCard
          title="Security Score"
          value={stats.securityScore}
          icon={Users}
          color="yellow"
          period="Current"
          change={stats.securityScore > 80 ? 5 : -3}
          isIncrease={stats.securityScore > 80}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <div className="lg:col-span-1">
          <SecurityScore
            score={stats.securityScore}
            completionRate={stats.completionRate}
            practiceScore={75}
            assessmentScore={80}
            domainScores={[
              { name: 'Web Security', score: 85 },
              { name: 'Network Security', score: 75 },
              { name: 'Linux', score: 65 },
              { name: 'Windows', score: 70 },
              { name: 'Active Directory', score: 55 }
            ]}
            showTrend
            trend={2}
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />

          <RecentActivity
            activities={recentActivity}
            title="My Recent Activity"
            showMore={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedDashboard;