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
  CheckCircle, XCircle, ShieldCheck, Calendar, UserCheck 
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { courses, assessments, labs, results, users, isLoading } = useData();
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    assessments: 0,
    labs: 0,
    avgScore: 0,
    passRate: 0
  });

  const [recentAssessments, setRecentAssessments] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);

  useEffect(() => {
    if (user && courses.length > 0 && assessments.length > 0 && results.length > 0 && users.length > 0) {
      const facultyCourses = courses.filter(c => c.createdBy === user.id);
      const facultyAssessments = assessments.filter(a => a.createdBy === user.id);
      const facultyLabs = labs.filter(l => l.createdBy === user.id);
      
      const allStudents = users.filter(u => u.role === ROLES.STUDENT);
      const facultyStudents = allStudents.filter(student => 
        student.enrolledCourses?.some(courseId => facultyCourses.some(c => c.id === courseId))
      );
      
      const facultyResults = results.filter(r => 
        facultyAssessments.some(a => a.id === r.assessmentId)
      );
      
      const avgScore = facultyResults.length > 0 ? 
        Math.round(facultyResults.reduce((sum, r) => sum + r.percentage, 0) / facultyResults.length) : 0;
      
      const passedResults = facultyResults.filter(r => r.status === ASSESSMENT_STATES.PASSED);
      const passRate = facultyResults.length > 0 ? 
        Math.round((passedResults.length / facultyResults.length) * 100) : 0;
      
      const recentAssessments = [...facultyAssessments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      const pendingReviews = facultyResults.filter(r => r.status === ASSESSMENT_STATES.SUBMITTED);
      
      setStats({
        students: facultyStudents.length,
        courses: facultyCourses.length,
        assessments: facultyAssessments.length,
        labs: facultyLabs.length,
        avgScore,
        passRate
      });
      
      setRecentAssessments(recentAssessments);
      setPendingReviews(pendingReviews);
    }
  }, [user, courses, assessments, labs, results, users]);

  const getDomainStats = () => {
    const domainMap = {};
    
    if (assessments.length > 0) {
      assessments.forEach(assessment => {
        if (assessment.createdBy === user?.id) {
          const domain = assessment.domain || 'General';
          if (!domainMap[domain]) {
            domainMap[domain] = { total: 0, passed: 0, attempts: 0 };
          }
          domainMap[domain].total++;
          
          const domainResults = results.filter(r => r.assessmentId === assessment.id);
          domainMap[domain].attempts += domainResults.length;
          const passed = domainResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
          domainMap[domain].passed += passed;
        }
      });
    }
    
    return Object.entries(domainMap).map(([domain, data]) => ({
      domain,
      assessments: data.total,
      attempts: data.attempts,
      passed: data.passed,
      passRate: data.attempts > 0 ? Math.round((data.passed / data.attempts) * 100) : 0
    }));
  };

  const domainStats = getDomainStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'Faculty'}
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your courses and assessments today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.courses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.assessments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Assessments</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.labs}</div>
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
              <CheckCircle size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.passRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pass Rate</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Reviews
            </h3>
            <Badge variant={pendingReviews.length > 0 ? 'warning' : 'success'}>
              {pendingReviews.length}
            </Badge>
          </div>
          
          {pendingReviews.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
              <p className="text-gray-600 dark:text-gray-300">No assessments pending review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.slice(0, 5).map((result) => {
                const assessment = assessments.find(a => a.id === result.assessmentId);
                const student = users.find(u => u.id === result.studentId);
                
                return (
                  <div key={result.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {assessment?.title || 'Untitled Assessment'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {student?.name || 'Unknown Student'} - {result.percentage}%
                        </div>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Assessments
            </h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          {recentAssessments.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-300">No recent assessments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAssessments.map((assessment) => {
                const assessmentResults = results.filter(r => r.assessmentId === assessment.id);
                const attemptCount = assessmentResults.length;
                const passedCount = assessmentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
                const avgScore = attemptCount > 0 ? 
                  Math.round(assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / attemptCount) : 0;
                
                return (
                  <div key={assessment.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{assessment.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{assessment.domain} - {assessment.difficulty}</div>
                      </div>
                      <Badge variant={attemptCount > 0 ? 'success' : 'secondary'}>{attemptCount} attempts</Badge>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={avgScore} maxValue={100} className="h-2" variant={avgScore >= 70 ? 'success' : avgScore >= 50 ? 'warning' : 'danger'} />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Avg: {avgScore}%</span>
                        <span>Pass: {passedCount}/{attemptCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Domain Performance
        </h3>
        
        {domainStats.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">No domain data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domainStats.map((stat) => (
              <div key={stat.domain} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{stat.domain}</span>
                  <Badge variant={stat.passRate >= 70 ? 'success' : stat.passRate >= 50 ? 'warning' : 'danger'}>{stat.passRate}%</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Assessments:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stat.assessments}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Attempts:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stat.attempts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Passed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stat.passed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-full flex flex-col items-center justify-center p-4">
            <BookOpen size={24} className="mb-2 text-blue-600" />
            <span>Create Course</span>
          </Button>
          <Button variant="outline" className="h-full flex flex-col items-center justify-center p-4">
            <BarChart3 size={24} className="mb-2 text-green-600" />
            <span>Create Assessment</span>
          </Button>
          <Button variant="outline" className="h-full flex flex-col items-center justify-center p-4">
            <ShieldCheck size={24} className="mb-2 text-purple-600" />
            <span>Create Lab</span>
          </Button>
          <Button variant="outline" className="h-full flex flex-col items-center justify-center p-4">
            <Users size={24} className="mb-2 text-orange-600" />
            <span>View Students</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FacultyDashboard;