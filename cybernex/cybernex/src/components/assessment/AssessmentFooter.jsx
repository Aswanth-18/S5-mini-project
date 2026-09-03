import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { Flag, BookOpen, Clock, Award, Save, XCircle, CheckCircle } from 'lucide-react';

/**
 * AssessmentFooter Component
 * Footer for assessment with submit, save, and navigation buttons
 */
const AssessmentFooter = ({
  assessmentId = '',
  currentQuestion = 1,
  totalQuestions = 10,
  canSubmit = false,
  canSave = true,
  canSkip = false,
  isSubmitting = false,
  onSubmit = () => {},
  onSave = () => {},
  onPrevious = () => {},
  onNext = () => {}
}) => {
  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if (canSubmit && !isSubmitting) {
      onSubmit();
    }
  };

  const handleSave = () => {
    if (canSave) {
      onSave();
    }
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Question Navigation Info */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>

        {/* Navigation and Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Previous Button */}
          {currentQuestion > 1 && (
            <Button 
              variant="outline" 
              onClick={onPrevious}
              startIcon={<Flag size={16} />}
            >
              Previous
            </Button>
          )}

          {/* Save Button */}
          {canSave && (
            <Button 
              variant="ghost" 
              onClick={handleSave}
              startIcon={<Save size={16} />}
            >
              Save Draft
            </Button>
          )}

          {/* Next Button */}
          {canSkip && currentQuestion < totalQuestions && (
            <Button 
              variant="outline" 
              onClick={onNext}
              endIcon={<Flag size={16} />}
            >
              Skip
            </Button>
          )}

          {/* Submit Button */}
          {currentQuestion === totalQuestions && (
            <Button
              variant={canSubmit ? 'primary' : 'outline'}
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              startIcon={isSubmitting ? null : <CheckCircle size={16} />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          )}

          {/* Next Question Button */}
          {currentQuestion < totalQuestions && !canSkip && (
            <Button 
              variant="primary" 
              onClick={onNext}
              endIcon={<Flag size={16} />}
            >
              Next Question
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Award size={14} className="text-yellow-600" />
            <span>Final Step</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={14} className="text-blue-600" />
            <span>Time: Remaining</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <BookOpen size={14} className="text-purple-600" />
            <span>Review: Available</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

AssessmentFooter.defaultProps = {
  assessmentId: '',
  currentQuestion: 1,
  totalQuestions: 10,
  canSubmit: false,
  canSave: true,
  canSkip: false,
  isSubmitting: false,
  onSubmit: () => {},
  onSave: () => {},
  onPrevious: () => {},
  onNext: () => {}
};

export default AssessmentFooter;