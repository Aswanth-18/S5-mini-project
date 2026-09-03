import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { ListOrdered, Grid3X3, ChevronLeft, ChevronRight, CheckCircle, XCircle, Flag, Clock } from 'lucide-react';

/**
 * QuestionNavigation Component
 * Provides navigation between assessment questions with visual progress
 */
const QuestionNavigation = ({
  questions = [],
  currentQuestionIndex = 0,
  answeredQuestions = [],
  flaggedQuestions = [],
  onQuestionSelect = () => {},
  onPrevious = () => {},
  onNext = () => {},
  showGrid = false,
  timePerQuestion = 0
}) => {
  const [viewMode, setViewMode] = useState(showGrid ? 'grid' : 'list');
  
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0;

  const handleQuestionClick = (index) => {
    onQuestionSelect(index);
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return 'current';
    if (answeredQuestions.includes(index)) return 'answered';
    if (flaggedQuestions.includes(index)) return 'flagged';
    return 'unanswered';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Header and Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              startIcon={<ChevronLeft size={16} />}
            >
              Previous
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onNext}
              disabled={currentQuestionIndex >= totalQuestions - 1}
              endIcon={<ChevronRight size={16} />}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <ListOrdered size={14} /> : <Grid3X3 size={14} />}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <StatChip
            label="Answered"
            value={answeredQuestions.length}
            icon={<CheckCircle size={12} className="text-green-600" />}
            color="green"
          />
          <StatChip
            label="Flagged"
            value={flaggedQuestions.length}
            icon={<Flag size={12} className="text-orange-600" />}
            color="orange"
          />
          <StatChip
            label="Remaining"
            value={totalQuestions - answeredQuestions.length}
            icon={<XCircle size={12} className="text-gray-600" />}
            color="gray"
          />
          {timePerQuestion > 0 && (
            <StatChip
              label="Time/Question"
              value={formatTime(timePerQuestion)}
              icon={<Clock size={12} className="text-blue-600" />}
              color="blue"
            />
          )}
        </div>

        {/* Question List */}
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-6 md:grid-cols-10' : 'grid-cols-5 md:grid-cols-8'} gap-2`}>
          {questions.map((question, index) => {
            const status = getQuestionStatus(index);
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  isCurrent ? 'ring-2 ring-blue-500 bg-blue-100 dark:ring-blue-500 dark:bg-blue-900/30' :
                  status === 'answered' ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40' :
                  status === 'flagged' ? 'bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800/40' :
                  'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={`Question ${index + 1}${status === 'answered' ? ' (Answered)' : status === 'flagged' ? ' (Flagged)' : ''}`}
              >
                {index + 1}
                {status === 'flagged' && <Flag size={12} className="absolute top-1 right-1 text-orange-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

// Stat Chip Component
const StatChip = ({ label, value, icon, color = 'gray' }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-${color}-100 dark:bg-${color}-900/30`}>
    {icon}
    <span className="text-xs font-medium">{value}</span>
    <span className="text-xs text-gray-600 dark:text-gray-300 hidden sm:inline">{label}</span>
  </div>
);

QuestionNavigation.defaultProps = {
  questions: [],
  currentQuestionIndex: 0,
  answeredQuestions: [],
  flaggedQuestions: [],
  onQuestionSelect: () => {},
  onPrevious: () => {},
  onNext: () => {},
  showGrid: false,
  timePerQuestion: 0
};

export default QuestionNavigation;