import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { CheckCircle, XCircle, AlertCircle, ShieldCheck, Lock, BookOpen, Target } from 'lucide-react';

/**
 * PrerequisiteChecker Component
 * Checks and displays prerequisites for a course or module
 */
const PrerequisiteChecker = ({
  courseId = '',
  courseTitle = 'Course',
  prerequisites = [],
  completedPrerequisites = [],
  onEnroll = () => {},
  canEnroll = false
}) => {
  const { isDarkMode } = useTheme();

  // Calculate completion status
  const totalPrerequisites = prerequisites.length;
  const completedCount = completedPrerequisites.length;
  const completionPercentage = totalPrerequisites > 0 ? Math.round((completedCount / totalPrerequisites) * 100) : 100;
  const allCompleted = totalPrerequisites === 0 || completedCount >= totalPrerequisites;

  const getPrerequisiteStatus = (prerequisiteId) => {
    if (completedPrerequisites.includes(prerequisiteId)) return 'completed';
    return 'incomplete';
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Prerequisites for {courseTitle}
          </h2>
        </div>

        {/* Status Overview */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
          <div className="mb-2">
            {allCompleted ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={24} />
                <span className="font-medium">All prerequisites completed!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <AlertCircle size={24} />
                <span className="font-medium">Complete {totalPrerequisites - completedCount} more prerequisites</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Progress</span>
              <span>{completedCount}/{totalPrerequisites}</span>
            </div>
            <ProgressBar
              value={completionPercentage}
              max={100}
              className="h-3"
            />
          </div>
        </div>

        {/* Prerequisites List */}
        <div className="flex-1 overflow-y-auto">
          {totalPrerequisites === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>No prerequisites required</p>
              <p className="text-sm mt-2">You can enroll directly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prerequisites.map((prerequisite, index) => {
                const status = getPrerequisiteStatus(prerequisite.id);
                const isCompleted = status === 'completed';

                return (
                  <div
                    key={prerequisite.id}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isCompleted ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
                      'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : (
                            <Lock size={16} className="text-gray-600" />
                          )}
                        </div>
                        
                        <div className="min-w-0">
                          <h4 className={`font-medium truncate ${
                            isCompleted ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'
                          }`}>
                            {prerequisite.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {prerequisite.type || 'Course'} • {prerequisite.duration || 0} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isCompleted ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                            <CheckCircle size={12} className="inline mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            <XCircle size={12} className="inline mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enrollment Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant={allCompleted ? 'primary' : 'outline'}
            className="w-full"
            disabled={!allCompleted && !canEnroll}
            onClick={onEnroll}
            startIcon={allCompleted ? <BookOpen size={16} /> : <Lock size={16} />}
          >
            {allCompleted ? 'Enroll Now' : `Complete Prerequisites (${totalPrerequisites - completedCount} remaining)`}
          </Button>
          
          {!allCompleted && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Finish all prerequisites to unlock enrollment
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

PrerequisiteChecker.defaultProps = {
  courseId: '',
  courseTitle: 'Course',
  prerequisites: [],
  completedPrerequisites: [],
  onEnroll: () => {},
  canEnroll: false
};

export default PrerequisiteChecker;