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
  BookOpen, 
  ShieldCheck, 
  BarChart3, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Users,
  ArrowRight,
  PlayCircle,
  CheckCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { filteredCourses, filteredLabs, filteredAssessments, filteredResults, isLoading } = useData();
  const [stats, setStats] = useState({
    courses: { total: 0, completed: 0, inProgress: 0 },
    labs: { total: 0, completed: 0, inProgress: 0 },
    assessments: { total: 0, passed: 0, failed: 0 },
    securityScore: 0,
    xp: 0,
    streak: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Calculate student stats
    const userCourses = user.progress?.courses || {};
    const userLabs = user.progress?.labs || {};
    const userAssessments = user.progress?.assessments || {};
    
    // Get user's results
    const userResults = filteredResults.filter(r => r.studentId === user.id);
    const completedCourses = userCourses.completed?.length || 0;
    const inProgressCourses = userCourses.inProgress?.length || 0;
    const completedLabs = userLabs.completed?.length || 0;
    const inProgressLabs = userLabs.inProgress?.length || 0;
    const passedAssessments = userResults.filter(r => r.status === 'passed').length;
    const failedAssessments = userResults.filter(r => r.status === 'failed').length;

    setStats({
      courses: {
        total: filteredCourses.length,
        completed: completedCourses,
        inProgress: inProgressCourses
      },
      labs: {
        total: filteredLabs.length,
        completed: completedLabs,
        inProgress: inProgressLabs
      },
      assessments: {
        total: userResults.length,
        passed: passedAssessments,
        failed: failedAssessments
      },
      securityScore: user.securityScore || 0,
      xp: user.xp || 0,
      streak: user.progress?.streak || 0
    });

    // Recent activity
    const recentResults = userResults
      .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
      .slice(0, 5)
      .map(result => ({
        type: 'assessment',
        id: result.id,
        title: result.assessmentTitle || result.assessmentId,
        status: result.status,
        score: result.percentage,
        date: result.submittedAt || result.createdAt
      }));

    // Add recent lab completions if available
    const recentLabs = (userLabs.completed || [])
      .slice(-3)
      .reverse()
      .map(labId => {
        const lab = filteredLabs.find(l => l.id === labId);
        return lab ? {
          type: 'lab',
          id: lab.id,
          title: lab.title,
          status: 'completed',
          date: lab.updatedAt || lab.createdAt
        } : null;
      })
      .filter(Boolean);

    setRecentActivity([...recentResults, ...recentLabs].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ).slice(0, 5));

    // Recommended items (courses and labs not yet completed)
    const uncompletedCourses = filteredCourses.filter(course => 
      !userCourses.completed?.includes(course.id) && 
      !userCourses.inProgress?.includes(course.id)
    );
    
    const uncompletedLabs = filteredLabs.filter(lab => 
      !userLabs.completed?.includes(lab.id) && 
      !userLabs.inProgress?.includes(lab.id)
    );

    // Get the first few uncompleted items
    const recommended = [
      ...uncompletedCourses.slice(0, 3).map(course => ({ ...course, type: 'course' })),
      ...uncompletedLabs.slice(0, 2).map(lab => ({ ...lab, type: 'lab' }))
    ].sort(() => Math.random() - 0.5); // Shuffle for variety

    setRecommendedItems(recommended.slice(0, 4));

  }, [user, filteredCourses, filteredLabs, filteredAssessments, filteredResults]);

  const getCourseProgress = (courseId) => {
    if (!user?.progress?.courses?.completed?.includes(courseId)) {
      return 0;
    }
    return 100;
  };

  const getOverallProgress = () => {
    const totalItems = stats.courses.total + stats.labs.total;
    const completedItems = stats.courses.completed + stats.labs.completed;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 rounded-xl p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-lg opacity-90">Continue your cybersecurity learning journey</p>
          <div className="flex gap-4 mt-6">
            <Link to="/student/learning">
              <Button variant="white" startIcon={<BookOpen size={16} />}>
                Continue Learning
              </Button>
            </Link>
            <Link to="/student/practice">
              <Button variant="outline-white" startIcon={<ShieldCheck size={16} />}>
                Practice Labs
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] bg-cover bg-center"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.securityScore}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Security Score</div>
          <ProgressBar value={stats.securityScore} max={100} className="h-2" />
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.xp}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Total XP</div>
          <div className="flex justify-center">
            <Award size={20} className="text-yellow-500" />
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Day Streak</div>
          <div className="flex justify-center">
            <TrendingUp size={20} className="text-green-500" />
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{getOverallProgress()}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Overall Progress</div>
          <ProgressBar value={getOverallProgress()} max={100} className="h-2" />
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Progress</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Courses</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {stats.courses.completed}/{stats.courses.total} completed
                  </span>
                  <Badge className={stats.courses.total > 0 ? 
                    `bg-${stats.courses.completed === stats.courses.total ? 'green' : 'blue'}-100 
                     text-${stats.courses.completed === stats.courses.total ? 'green' : 'blue'}-800` : 
                    'bg-gray-100 text-gray-800'}
                  >
                    {stats.courses.total > 0 ? 
                      `${Math.round((stats.courses.completed / stats.courses.total) * 100)}%` : 
                      '0%'}
                  </Badge>
                </div>
              </div>
              <ProgressBar 
                value={stats.courses.total > 0 ? (stats.courses.completed / stats.courses.total) * 100 : 0} 
                max={100} 
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Practice Labs</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {stats.labs.completed}/{stats.labs.total} completed
                  </span>
                  <Badge className={stats.labs.total > 0 ? 
                    `bg-${stats.labs.completed === stats.labs.total ? 'green' : 'purple'}-100 
                     text-${stats.labs.completed === stats.labs.total ? 'green' : 'purple'}-800` : 
                    'bg-gray-100 text-gray-800'}
                  >
                    {stats.labs.total > 0 ? 
                      `${Math.round((stats.labs.completed / stats.labs.total) * 100)}%` : 
                      '0%'}
                  </Badge>
                </div>
              </div>
              <ProgressBar 
                value={stats.labs.total > 0 ? (stats.labs.completed / stats.labs.total) * 100 : 0} 
                max={100} 
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="text-purple-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Assessments</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {stats.assessments.passed} passed, {stats.assessments.failed} failed
                  </span>
                  <Badge className={stats.assessments.total > 0 ? 
                    `bg-${stats.assessments.passed >= stats.assessments.failed ? 'green' : 'orange'}-100 
                     text-${stats.assessments.passed >= stats.assessments.failed ? 'green' : 'orange'}-800` : 
                    'bg-gray-100 text-gray-800'}
                  >
                    {stats.assessments.total > 0 ? 
                      `${Math.round((stats.assessments.passed / stats.assessments.total) * 100)}% pass rate` : 
                      '0%'}
                  </Badge>
                </div>
              </div>
              <ProgressBar 
                value={stats.assessments.total > 0 ? (stats.assessments.passed / stats.assessments.total) * 100 : 0} 
                max={100} 
              />
            </div>
          </Card>
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <Link to="/student/progress">
                <Button variant="ghost" size="sm" endIcon={<ArrowRight size={14} />}>
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'assessment' ? (
                        <BarChart3 size={24} className={activity.status === 'passed' ? 'text-green-600' : 
                                                              activity.status === 'failed' ? 'text-red-600' : 'text-blue-600'} />
                      ) : (
                        <ShieldCheck size={24} className="text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {activity.type === 'assessment' ? 'Assessment' : 'Practice Lab'} 
                        • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.type === 'assessment' ? (
                        <Badge className={activity.status === 'passed' ? 'bg-green-100 text-green-800' : 
                                          activity.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                          'bg-blue-100 text-blue-800'}
                        >
                          {activity.status === 'passed' ? 'Passed' : 
                           activity.status === 'failed' ? 'Failed' : 'Submitted'}
                          {activity.score && ` - ${activity.score}%`}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                  <p>No recent activity found</p>
                  <p className="text-sm mt-1">Start learning to see your progress here</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recommended For You */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended For You</h3>
              <Link to="/student/learning">
                <Button variant="ghost" size="sm" endIcon={<ArrowRight size={14} />}>
                  Browse All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {recommendedItems.length > 0 ? (
                recommendedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      {item.type === 'course' ? (
                        <BookOpen size={24} className="text-blue-600" />
                      ) : (
                        <ShieldCheck size={24} className="text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.type === 'course' ? 'Course' : 'Practice Lab'} • {item.domain || 'N/A'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {item.type === 'course' ? (
                        <Link to={`/student/learning/${item.id}`}>
                          <Button variant="outline" size="sm" startIcon={<PlayCircle size={14} />}>
                            Start
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/student/practice/${item.id}`}>
                          <Button variant="outline" size="sm" startIcon={<PlayCircle size={14} />}>
                            Practice
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                  <p>No recommendations available</p>
                  <p className="text-sm mt-1">Complete more courses to get personalized recommendations</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link to="/student/learning">
            <Button variant="outline" className="w-full justify-start" startIcon={<BookOpen size={16} />}>
              My Courses
            </Button>
          </Link>
          <Link to="/student/practice">
            <Button variant="outline" className="w-full justify-start" startIcon={<ShieldCheck size={16} />}>
              Practice Labs
            </Button>
          </Link>
          <Link to="/student/assessments">
            <Button variant="outline" className="w-full justify-start" startIcon={<BarChart3 size={16} />}>
              Assessments
            </Button>
          </Link>
          <Link to="/student/progress">
            <Button variant="outline" className="w-full justify-start" startIcon={<TrendingUp size={16} />}>
              My Progress
            </Button>
          </Link>
          <Link to="/student/results">
            <Button variant="outline" className="w-full justify-start" startIcon={<Award size={16} />}>
              Results
            </Button>
          </Link>
          <Link to="/student/schedule">
            <Button variant="outline" className="w-full justify-start" startIcon={<Calendar size={16} />}>
              Schedule
            </Button>
          </Link>
        </div>
      </Card>

      {/* Upcoming Assessments */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Assessments</h3>
          <Link to="/student/assessments">
            <Button variant="ghost" size="sm" endIcon={<ArrowRight size={14} />}>
              View All
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {filteredAssessments
            .filter(assessment => new Date(assessment.dueDate || assessment.endDate) > new Date())
            .slice(0, 3)
            .map(assessment => (
              <div key={assessment.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  <BarChart3 size={24} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{assessment.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Due: {new Date(assessment.dueDate || assessment.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link to={`/student/assessment/${assessment.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          
          {filteredAssessments.filter(assessment => new Date(assessment.dueDate || assessment.endDate) > new Date()).length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <p>No upcoming assessments</p>
              <p className="text-sm mt-1">Check back later for new assessments</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;