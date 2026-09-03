import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { FileText, Clock, Target, ShieldCheck, BarChart3, Award } from 'lucide-react';

/**
 * AssessmentHeader Component
 * Displays assessment title, description, metadata, and overall progress
 */
const AssessmentHeader = ({
  title = 'Assessment Title',
  description = 'Assessment description',
  difficulty = 'medium',
  domain = 'General',
  timeLimit = 0,
  totalQuestions = 0,
  currentQuestion = 1,
  score = 0,
  maxScore = 0,
  passingScore = 70,
  timeRemaining = null
}) => {
  const progressPercentage = totalQuestions > 0 ? Math.round(((currentQuestion - 1) / totalQuestions) * 100) : 0;
  const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Title and Metadata */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={24} className="text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{description}</p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getDifficultyColor()}>
                {difficulty}
              </Badge>
              {domain && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  {domain}
                </Badge>
              )}
              {timeLimit > 0 && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                  <Clock size={12} className="inline mr-1" />
                  {formatTime(timeLimit)} Time Limit
                </Badge>
              )}
              {passingScore > 0 && (
                <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200">
                  <Target size={12} className="inline mr-1" />
                  {passingScore}% to Pass
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BarChart3 size={16} className="text-orange-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {currentQuestion}/{totalQuestions}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Questions
            </p>
            <ProgressBar value={progressPercentage} max={100} className="h-1 mt-2" />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-green-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {score}/{maxScore}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Score ({scorePercentage}%)
            </p>
          </div>

          {timeLimit > 0 && timeRemaining !== null && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock size={16} className="text-blue-600" />
                <span className={`text-lg font-bold ${timeRemaining <= 60 ? 'text-red-600 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {timeRemaining <= 60 ? 'Hurry Up!' : 'Time Remaining'}
              </p>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award size={16} className="text-yellow-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {scorePercentage >= passingScore ? 'Passing' : 'Keep Going'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Status
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

AssessmentHeader.defaultProps = {
  title: 'Assessment Title',
  description: 'Assessment description',
  difficulty: 'medium',
  domain: 'General',
  timeLimit: 0,
  totalQuestions: 0,
  currentQuestion: 1,
  score: 0,
  maxScore: 0,
  passingScore: 70,
  timeRemaining: null
};

export default AssessmentHeader;