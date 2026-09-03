import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award, 
  BarChart3, 
  Shield, 
  BookOpen,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';

const StudentProgress = () => {
  const { user } = useAuth();
  const { filteredCourses, filteredLabs, filteredAssessments, filteredResults, isLoading } = useData();
  const [progressData, setProgressData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) return;

    // Calculate comprehensive progress data
    const userCourses = user.progress?.courses || {};
    const userLabs = user.progress?.labs || {};
    const userResults = filteredResults.filter(r => r.studentId === user.id);

    const completedCourses = userCourses.completed?.length || 0;
    const inProgressCourses = userCourses.inProgress?.length || 0;
    const totalCourses = filteredCourses.length;

    const completedLabs = userLabs.completed?.length || 0;
    const inProgressLabs = userLabs.inProgress?.length || 0;
    const totalLabs = filteredLabs.length;

    const totalAssessments = userResults.length;
    const passedAssessments = userResults.filter(r => r.status === 'passed').length;
    const failedAssessments = userResults.filter(r => r.status === 'failed').length;

    const courseProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
    const labProgress = totalLabs > 0 ? Math.round((completedLabs / totalLabs) * 100) : 0;
    const assessmentPassRate = totalAssessments > 0 ? Math.round((passedAssessments / totalAssessments) * 100) : 0;
    const overallProgress = Math.round((courseProgress + labProgress) / 2);

    // Calculate XP and streak
    const totalXP = user.xp || 0;
    const streak = user.progress?.streak || 0;
    const securityScore = user.securityScore || 0;

    // Calculate time spent
    const totalTimeSpent = userResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

    // Get recent activity
    const recentActivity = [
      ...userResults
        .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
        .slice(0, 3)
        .map(r => ({
          type: 'assessment',
          id: r.id,
          title: r.assessmentTitle || r.assessmentId,
          status: r.status,
          score: r.percentage,
          date: r.submittedAt || r.createdAt
        })),
      ...(userCourses.completed || [])
        .slice(-2)
        .reverse()
        .map(courseId => {
          const course = filteredCourses.find(c => c.id === courseId);
          return course ? {
            type: 'course',
            id: course.id,
            title: course.title,
            status: 'completed',
            date: course.updatedAt || course.createdAt
          } : null;
        })
        .filter(Boolean)
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Domain progress
    const domainProgress = {};
    filteredCourses.forEach(course => {
      const domain = course.domain || 'General';
      const isCompleted = userCourses.completed?.includes(course.id);
      domainProgress[domain] = domainProgress[domain] || { completed: 0, total: 0 };
      domainProgress[domain].total++;
      if (isCompleted) domainProgress[domain].completed++;
    });

    setProgressData({
      courses: {
        total: totalCourses,
        completed: completedCourses,
        inProgress: inProgressCourses,
        progress: courseProgress
      },
      labs: {
        total: totalLabs,
        completed: completedLabs,
        inProgress: inProgressLabs,
        progress: labProgress
      },
      assessments: {
        total: totalAssessments,
        passed: passedAssessments,
        failed: failedAssessments,
        passRate: assessmentPassRate
      },
      overall: {
        progress: overallProgress,
        xp: totalXP,
        streak: streak,
        securityScore: securityScore,
        timeSpent: totalTimeSpent
      },
      recentActivity: recentActivity,
      domainProgress: domainProgress
    });
  }, [user, filteredCourses, filteredLabs, filteredAssessments, filteredResults]);

  if (isLoading || !progressData) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Progress</h1>
        <Link to="/student/dashboard">
          <Button variant="outline" startIcon={<ArrowRight size={16} />}>Back to Dashboard</Button>
        </Link>
      </div>

      {/* Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.overall.progress}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</div>
          <ProgressBar value={progressData.overall.progress} max={100} className="h-2 mt-2" />
        </Card>
        <Card className="text-center">
          <Award size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.overall.xp}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total XP</div>
        </Card>
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.overall.streak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
        </Card>
        <Card className="text-center">
          <Shield size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{progressData.overall.securityScore}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Security Score</div>
          <ProgressBar value={progressData.overall.securityScore} max={100} className="h-2 mt-2" />
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'courses' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'labs' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
            }`}
          >
            Labs
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'assessments' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
            }`}
          >
            Assessments
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Summary</h3>
            
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Course Progress</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {progressData.courses.completed} / {progressData.courses.total}
                    </span>
                  </div>
                  <ProgressBar 
                    value={progressData.courses.progress} 
                    max={100} 
                    className="h-3"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Practice Labs</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {progressData.labs.completed} / {progressData.labs.total}
                    </span>
                  </div>
                  <ProgressBar 
                    value={progressData.labs.progress} 
                    max={100} 
                    className="h-3"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Summary */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Assessment Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <BarChart3 size={20} className="mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{progressData.assessments.total}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Attempted</div>
                </Card>
                <Card className="text-center">
                  <CheckCircle size={20} className="mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{progressData.assessments.passed}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Passed</div>
                </Card>
                <Card className="text-center">
                  <X size={20} className="mx-auto mb-2 text-red-600" />
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{progressData.assessments.failed}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Failed</div>
                </Card>
                <Card className="text-center">
                  <TrendingUp size={20} className="mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{progressData.assessments.passRate}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Pass Rate</div>
                </Card>
              </div>
            </div>

            {/* Domain Progress */}
            {Object.keys(progressData.domainProgress).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Progress by Domain</h4>
                <div className="space-y-3">
                  {Object.entries(progressData.domainProgress).map(([domain, data]) => (
                    <div key={domain} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{domain}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {data.completed} / {data.total} completed
                        </span>
                      </div>
                      <ProgressBar 
                        value={(data.completed / data.total) * 100} 
                        max={100} 
                        className="h-2 mt-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Progress</h3>
              <Badge className={`px-3 py-1 ${
                progressData.courses.progress >= 75 ? 'bg-green-100 text-green-800' :
                progressData.courses.progress >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {progressData.courses.progress}% Complete
              </Badge>
            </div>
            
            <div className="space-y-3">
              {filteredCourses.map(course => {
                const userCourses = user.progress?.courses || {};
                const isCompleted = userCourses.completed?.includes(course.id);
                const isInProgress = userCourses.inProgress?.includes(course.id);
                const status = isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'not-started';
                
                return (
                  <Link 
                    key={course.id} 
                    to={`/student/learning/${course.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{course.domain}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-1 text-xs ${
                          status === 'completed' ? 'bg-green-100 text-green-800' :
                          status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status.replace('-', ' ')}
                        </Badge>
                        <ArrowRight size={16} className="text-gray-500" />
                      </div>
                    </div>
                    <ProgressBar 
                      value={status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0} 
                      max={100} 
                      className="h-1 mt-3"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practice Lab Progress</h3>
              <Badge className={`px-3 py-1 ${
                progressData.labs.progress >= 75 ? 'bg-green-100 text-green-800' :
                progressData.labs.progress >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {progressData.labs.progress}% Complete
              </Badge>
            </div>
            
            <div className="space-y-3">
              {filteredLabs.map(lab => {
                const userLabs = user.progress?.labs || {};
                const isCompleted = userLabs.completed?.includes(lab.id);
                const isInProgress = userLabs.inProgress?.includes(lab.id);
                const status = isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'not-started';
                
                return (
                  <Link 
                    key={lab.id} 
                    to={`/student/practice/${lab.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{lab.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{lab.domain}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-1 text-xs ${
                          status === 'completed' ? 'bg-green-100 text-green-800' :
                          status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status.replace('-', ' ')}
                        </Badge>
                        <ArrowRight size={16} className="text-gray-500" />
                      </div>
                    </div>
                    <ProgressBar 
                      value={status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0} 
                      max={100} 
                      className="h-1 mt-3"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assessment Results</h3>
              <Link to="/student/results">
                <Button variant="outline" size="sm" startIcon={<ArrowRight size={14} />}>
                  View All Results
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {progressData.recentActivity
                .filter(activity => activity.type === 'assessment')
                .map((activity, index) => (
                  <Link 
                    key={index} 
                    to={`/student/results/${activity.id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.status} • {activity.score || 0}% • 
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-gray-500" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <Link to="/student/dashboard">
            <Button variant="ghost" size="sm" startIcon={<ArrowRight size={14} />}>
              View More
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {progressData.recentActivity.length > 0 ? (
            progressData.recentActivity.map((activity, index) => {
              const Icon = activity.type === 'assessment' ? BarChart3 : BookOpen;
              const statusColor = activity.status === 'passed' ? 'text-green-600' :
                                activity.status === 'failed' ? 'text-red-600' :
                                activity.status === 'completed' ? 'text-green-600' : 'text-blue-600';
              
              return (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <Icon size={24} className={statusColor} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.type === 'assessment' ? 'Assessment' : 'Course'} • 
                      {activity.status} • 
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.score && (
                    <div className="flex-shrink-0">
                      <Badge className={`px-2 py-1 ${
                        activity.score >= 70 ? 'bg-green-100 text-green-800' :
                        activity.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.score}%
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <p>No recent activity found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Time Spent */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time Spent Learning</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {Math.floor(progressData.overall.timeSpent / 60)} hrs
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Time</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BookOpen size={24} className="mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {progressData.courses.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Shield size={24} className="mx-auto mb-2 text-purple-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {progressData.labs.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Labs</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BarChart3 size={24} className="mx-auto mb-2 text-orange-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {progressData.assessments.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Assessments</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProgress;