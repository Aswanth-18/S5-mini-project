import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ASSESSMENT_STATES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressBar from '../../components/common/ProgressBar';
import { CheckCircle, XCircle, Clock, BarChart3, Trophy, FileText, ArrowLeft } from 'lucide-react';

const ResultDetail = () => {
  const { resultId } = useParams();
  const { user } = useAuth();
  const { results, assessments, isLoading } = useData();
  const [result, setResult] = useState(null);
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    if (resultId && results.length > 0) {
      const foundResult = results.find(r => r.id === resultId && r.studentId === user?.id);
      setResult(foundResult || null);
      
      if (foundResult) {
        const foundAssessment = assessments.find(a => a.id === foundResult.assessmentId);
        setAssessment(foundAssessment || null);
      }
    }
  }, [resultId, results, assessments, user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case ASSESSMENT_STATES.PASSED:
        return 'bg-green-100 text-green-800';
      case ASSESSMENT_STATES.FAILED:
        return 'bg-red-100 text-red-800';
      case ASSESSMENT_STATES.SUBMITTED:
        return 'bg-yellow-100 text-yellow-800';
      case ASSESSMENT_STATES.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ASSESSMENT_STATES.PASSED:
        return <CheckCircle size={20} className="text-green-600" />;
      case ASSESSMENT_STATES.FAILED:
        return <XCircle size={20} className="text-red-600" />;
      case ASSESSMENT_STATES.SUBMITTED:
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return <BarChart3 size={20} className="text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!result || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText size={64} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Result Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The result you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/student/results">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Results
          </Button>
        </Link>
      </div>
    );
  }

  const totalQuestions = result.answers?.length || assessment.questions?.length || 0;
  const correctAnswers = result.score || 0;
  const wrongAnswers = totalQuestions - correctAnswers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link to="/student/results">
          <Button variant="outline" startIcon={<ArrowLeft size={16} />}>
            Back to Results
          </Button>
        </Link>
      </div>

      {/* Result Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {assessment.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {assessment.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Domain:
                    </span>
                    <Badge variant="secondary">{assessment.domain || 'General'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Difficulty:
                    </span>
                    <Badge variant={assessment.difficulty === 'Hard' ? 'danger' : assessment.difficulty === 'Medium' ? 'warning' : 'success'}>
                      {assessment.difficulty || 'Medium'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                    {result.percentage}%
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {getStatusIcon(result.status)}
                    <Badge className={`px-4 py-2 ${getStatusColor(result.status)}`}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Result Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Score
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {result.score} / {assessment.totalScore || totalQuestions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Percentage
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {result.percentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Time Taken
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {result.timeTaken || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Submitted At
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(result.submittedAt || result.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Passing Score
                </div>
                <ProgressBar 
                  value={result.percentage} 
                  maxValue={100} 
                  className="h-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {assessment.passingScore || 70}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Question Breakdown
            </h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Correct Answers
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-600">{correctAnswers}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.round((correctAnswers / totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle size={20} className="text-red-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Wrong Answers
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-600">{wrongAnswers}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.round((wrongAnswers / totalQuestions) * 100)}%
                  </span>
                </div>
              </div>

              {result.penalty && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-yellow-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Time Penalty
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-yellow-600">{result.penalty} points</span>
                  </div>
                </div>
              )}
            </div>

            {result.feedback && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Instructor Feedback
                </h4>
                <p className="text-blue-700 dark:text-blue-300">{result.feedback}</p>
              </div>
            )}

            {result.gradedBy && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Graded By
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {result.gradedBy}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Graded At
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {result.gradedAt ? new Date(result.gradedAt).toLocaleString() : 'Not graded yet'}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overall Score
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {result.percentage}%
                  </span>
                </div>
                <ProgressBar 
                  value={result.percentage} 
                  maxValue={100} 
                  className="h-3"
                  variant={result.percentage >= (assessment.passingScore || 70) ? 'success' : 'danger'}
                />
              </div>

              {result.domainScores && Object.entries(result.domainScores).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Domain Performance
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(result.domainScores).map(([domain, score]) => (
                      <div key={domain}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {domain}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {score}%
                          </span>
                        </div>
                        <ProgressBar 
                          value={score} 
                          maxValue={100} 
                          className="h-2"
                          variant={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'danger'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  {result.status === ASSESSMENT_STATES.PASSED && (
                    <div className="text-green-600">
                      <Trophy size={48} className="mx-auto mb-2" />
                      <p className="font-semibold">Congratulations!</p>
                      <p className="text-sm">You passed this assessment</p>
                    </div>
                  )}
                  {result.status === ASSESSMENT_STATES.FAILED && (
                    <div className="text-orange-600">
                      <BarChart3 size={48} className="mx-auto mb-2" />
                      <p className="font-semibold">Keep Trying!</p>
                      <p className="text-sm">Review the material and retake</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Answer Review Section */}
      {result.showDetailedReview && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Answer Review
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            Detailed answer review will be available once the assessment is graded and published.
          </p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Link to="/student/results">
          <Button variant="outline">
            Back to Results
          </Button>
        </Link>
        {result.status === ASSESSMENT_STATES.FAILED && (
          <Link to={`/student/assessment/${assessment.id}/take`}>
            <Button variant="primary">
              Retake Assessment
            </Button>
          </Link>
        )}
        <Button variant="outline" onClick={() => window.print()}>
          Print Result
        </Button>
      </div>
    </div>
  );
};

export default ResultDetail;