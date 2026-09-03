import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BarChart3, 
  BookOpen, 
  Clock, 
  Calendar, 
  Award, 
  PlayCircle, 
  CheckCircle, 
  Shield, 
  ArrowLeft, 
  ArrowRight,
  ListCheck,
  Flag,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filteredAssessments, filteredResults, filteredCourses, isLoading } = useData();
  const [assessment, setAssessment] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const [canAttempt, setCanAttempt] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Find the assessment
    const foundAssessment = filteredAssessments.find(a => a.id === assessmentId);
    if (foundAssessment) {
      setAssessment(foundAssessment);
      
      // Check if user has already attempted this assessment
      const result = filteredResults.find(r => 
        r.studentId === user?.id && r.assessmentId === assessmentId
      );
      setUserResult(result || null);
      
      // Check if user can attempt
      if (!result) {
        setCanAttempt(true);
      } else if (result.status === 'failed' && foundAssessment.retakeable) {
        setCanAttempt(true);
      } else if (result.status === 'in-progress') {
        setCanAttempt(true);
      }
      
      // Calculate time left if there's a due date
      if (foundAssessment.dueDate) {
        const dueDate = new Date(foundAssessment.dueDate);
        const now = new Date();
        const diff = dueDate - now;
        if (diff > 0) {
          setTimeLeft(Math.floor(diff / 1000));
        }
      }
    } else {
      // Assessment not found, redirect to assessments page
      navigate('/student/assessments');
    }
  }, [assessmentId, filteredAssessments, filteredResults, user, navigate]);

  // Update time left every second
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && assessment?.dueDate) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, assessment]);

  const formatTime = (seconds) => {
    if (seconds === null) return 'No time limit';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    result.push(`${secs}s`);
    return result.join(' ');
  };

  const getStatusBadge = () => {
    if (!userResult) {
      return (
        <Badge className="px-3 py-1 bg-gray-100 text-gray-800 flex items-center gap-1">
          <BarChart3 size={14} /> Not Attempted
        </Badge>
      );
    }
    
    const statusColors = {
      'passed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'submitted': 'bg-yellow-100 text-yellow-800'
    };
    
    const statusIcons = {
      'passed': CheckCircle,
      'failed': AlertCircle,
      'in-progress': PlayCircle,
      'submitted': Calendar
    };
    
    const Icon = statusIcons[userResult.status] || BarChart3;
    const color = statusColors[userResult.status] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={`px-3 py-1 ${color} flex items-center gap-1`}>
        <Icon size={14} /> {userResult.status.replace('-', ' ')}
      </Badge>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const difficultyColors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Easy': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-orange-100 text-orange-800',
      'Expert': 'bg-red-100 text-red-800'
    };
    return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading || !assessment) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Find related course
  const relatedCourse = assessment.courseId ? filteredCourses.find(c => c.id === assessment.courseId) : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/student/assessments" className="hover:text-primary transition-colors">
          Assessments
        </Link>
        <ArrowRight size={14} />
        <span className="text-gray-900 dark:text-white font-medium">{assessment.title}</span>
      </div>

      {/* Assessment Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{assessment.title}</h1>
              <p className="text-lg opacity-90 max-w-2xl">{assessment.description}</p>
              
              <div className="flex gap-4 mt-6">
                {getStatusBadge()}
                <Badge className={`px-3 py-1 ${getDifficultyColor(assessment.difficulty)}`}>
                  {assessment.difficulty || 'Medium'}
                </Badge>
                <Badge className="px-3 py-1 bg-white/20 text-white">
                  {assessment.domain}
                </Badge>
                <Badge className="px-3 py-1 bg-white/20 text-white">
                  {assessment.type || 'Multiple Choice'}
                </Badge>
              </div>
              
              <div className="flex gap-6 mt-4 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {assessment.duration || '60'} minutes
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} /> {assessment.passingScore || 70}% passing score
                </div>
                <div className="flex items-center gap-2">
                  <ListCheck size={16} /> {assessment.totalQuestions || '20'} questions
                </div>
                {timeLeft !== null && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> Due: {formatTime(timeLeft)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {canAttempt && !userResult ? (
                <Link to={`/student/assessment/${assessmentId}/take`}>
                  <Button variant="white" startIcon={<PlayCircle size={16} />}>
                    Start Assessment
                  </Button>
                </Link>
              ) : canAttempt && userResult?.status === 'failed' ? (
                <Link to={`/student/assessment/${assessmentId}/take`}>
                  <Button variant="white" startIcon={<PlayCircle size={16} />}>
                    Retake Assessment
                  </Button>
                </Link>
              ) : canAttempt && userResult?.status === 'in-progress' ? (
                <Link to={`/student/assessment/${assessmentId}/take`}>
                  <Button variant="white" startIcon={<PlayCircle size={16} />}>
                    Resume Assessment
                  </Button>
                </Link>
              ) : userResult ? (
                <Link to={`/student/results/${userResult.id}`}>
                  <Button variant="outline-white" startIcon={<ArrowRight size={16} />}>
                    View Results
                  </Button>
                </Link>
              ) : (
                <Button variant="outline-white" disabled startIcon={<PlayCircle size={16} />}>
                  Not Available
                </Button>
              )}
              
              <Link to="/student/assessments">
                <Button variant="outline-white" startIcon={<ArrowLeft size={16} />}>
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvc3ZnPg==')] bg-cover bg-center"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Assessment Overview */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assessment Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{assessment.detailedDescription || assessment.description}</p>
            
            {assessment.objectives && assessment.objectives.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Learning Objectives</h3>
                <ul className="space-y-2">
                  {assessment.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {assessment.topics && assessment.topics.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Topics Covered</h3>
                <div className="flex gap-2 flex-wrap">
                  {assessment.topics.map((topic, index) => (
                    <Badge key={index} className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Assessment Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <BarChart3 size={24} className="mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.totalQuestions || '20'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Questions</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock size={24} className="mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.duration || '60'} min</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Duration</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Award size={24} className="mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.passingScore || '70'}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Passing Score</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <ListCheck size={24} className="mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.attemptsAllowed || '1'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Attempts</div>
              </div>
            </div>
          </Card>

          {/* Assessment Instructions */}
          <Card className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Read all questions carefully.</strong> Each question may have different requirements and constraints.
              </p>
              <p>
                <strong>Manage your time effectively.</strong> You have {assessment.duration || '60'} minutes to complete this assessment.
              </p>
              <p>
                <strong>Answer all questions.</strong> Partial submissions may not be saved or graded.
              </p>
              <p>
                <strong>Review your answers.</strong> Once submitted, you may not be able to make changes.
              </p>
              {assessment.allowNotes === false && (
                <p className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <AlertCircle size={16} className="inline mr-1 text-yellow-600" />
                  Note-taking is not allowed during this assessment.
                </p>
              )}
              {assessment.openBook === true && (
                <p className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle size={16} className="inline mr-1 text-green-600" />
                  This is an open-book assessment. You may use your notes and course materials.
                </p>
              )}
            </div>
          </Card>

          {/* Assessment Preview */}
          {(!userResult || userResult.status === 'failed') && canAttempt && (
            <Card className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Questions</h2>
                <Link to={`/student/assessment/${assessmentId}/take`}>
                  <Button variant="primary" size="sm" startIcon={<PlayCircle size={14} />}>
                    Start Assessment
                  </Button>
                </Link>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Here are some sample questions to help you prepare:
              </p>
              <div className="space-y-4">
                {assessment.sampleQuestions?.map((question, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Question {index + 1}: {question.text}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Type: {question.type} • Points: {question.points || 1}
                    </p>
                    {question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`preview-${index}`}
                              className="radio radio-primary"
                              disabled
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )) || (
                  <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                    No preview questions available for this assessment.
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* User's Previous Result */}
          {userResult && userResult.status !== 'in-progress' && (
            <Card className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Previous Result</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {userResult.percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(userResult.percentage || 0)}`}>
                    {userResult.status === 'passed' ? 'PASSED' : 'FAILED'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Status</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {userResult.score || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Points Earned</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {userResult.timeSpent || 0} min
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Time Spent</div>
                </div>
              </div>
              
              {assessment.retakeable && userResult.status === 'failed' && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You can retake this assessment to improve your score.
                  </p>
                  <Link to={`/student/assessment/${assessmentId}/take`}>
                    <Button variant="primary" startIcon={<PlayCircle size={16} />}>
                      Retake Assessment
                    </Button>
                  </Link>
                </div>
              )}
              
              {userResult.status === 'passed' && (
                <div className="mt-6 text-center">
                  <p className="text-green-600 dark:text-green-400 mb-4">
                    Congratulations! You have passed this assessment.
                  </p>
                  <Link to={`/student/results/${userResult.id}`}>
                    <Button variant="outline" startIcon={<ArrowRight size={16} />}>
                      View Detailed Results
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Assessment Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assessment Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {assessment.type || 'Multiple Choice'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {assessment.domain}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {assessment.duration || '60'} minutes
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Award size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {assessment.passingScore || 70}% passing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ListCheck size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {assessment.totalQuestions || '20'} questions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'No due date'}
                </span>
              </div>
            </div>
          </Card>

          {/* Related Course */}
          {relatedCourse && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Course</h3>
              <Link to={`/student/learning/${relatedCourse.id}`} className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{relatedCourse.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{relatedCourse.domain}</p>
                  </div>
                </div>
              </Link>
            </Card>
          )}

          {/* Assessment Policies */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assessment Policies</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {assessment.retakeable ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <X size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Retakeable</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {assessment.retakeable ? 'You can retake this assessment' : 'Only one attempt allowed'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {assessment.timed ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <X size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Timed</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {assessment.timed ? 'This assessment has a time limit' : 'No time limit'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {assessment.randomized ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <X size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Randomized</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {assessment.randomized ? 'Questions are randomized' : 'Questions appear in fixed order'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {assessment.showResults ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <X size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Results</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {assessment.showResults ? 'Results shown after submission' : 'Results not shown'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Assessment Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-3">
              {canAttempt && !userResult ? (
                <Link to={`/student/assessment/${assessmentId}/take`} className="block">
                  <Button variant="primary" className="w-full" startIcon={<PlayCircle size={16} />}>
                    Start Assessment
                  </Button>
                </Link>
              ) : canAttempt && userResult?.status === 'failed' ? (
                <Link to={`/student/assessment/${assessmentId}/take`} className="block">
                  <Button variant="primary" className="w-full" startIcon={<PlayCircle size={16} />}>
                    Retake Assessment
                  </Button>
                </Link>
              ) : canAttempt && userResult?.status === 'in-progress' ? (
                <Link to={`/student/assessment/${assessmentId}/take`} className="block">
                  <Button variant="primary" className="w-full" startIcon={<PlayCircle size={16} />}>
                    Resume Assessment
                  </Button>
                </Link>
              ) : userResult ? (
                <Link to={`/student/results/${userResult.id}`} className="block">
                  <Button variant="outline" className="w-full" startIcon={<ArrowRight size={16} />}>
                    View Results
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled startIcon={<PlayCircle size={16} />}>
                  Not Available
                </Button>
              )}
              
              <Link to="/student/assessments" className="block">
                <Button variant="outline" className="w-full" startIcon={<ArrowLeft size={16} />}>
                  Back to Assessments
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;