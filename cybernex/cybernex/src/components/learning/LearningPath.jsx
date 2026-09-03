import React from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { Road, Target, Flag, CheckCircle, Lock } from 'lucide-react';

/**
 * LearningPath Component
 * Displays a visual learning path with modules and progress tracking
 */
const LearningPath = ({
  title = 'Learning Path',
  modules = [],
  currentModuleId = null,
  completedModules = [],
  showTimeEstimates = true
}) => {
  const totalModules = modules.length;
  const completedCount = completedModules.length;
  const progressPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Road size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount}/{totalModules} modules
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>Overall Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <ProgressBar value={progressPercentage} max={100} className="h-3" />
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {modules.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Target size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No modules available</p>
            </div>
          ) : (
            modules.map((module, index) => {
              const isCompleted = completedModules.includes(module.id);
              const isCurrent = module.id === currentModuleId;
              const isLocked = module.requires && !completedModules.includes(module.requires);
              const isNext = modules.findIndex(m => m.id === currentModuleId) + 1 === index;

              return (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isCompleted ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
                    isCurrent ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 ring-2 ring-blue-500' :
                    isLocked ? 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/20 opacity-60' :
                    isNext ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' :
                    'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{index + 1}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium truncate ${
                          isCompleted ? 'text-green-700 dark:text-green-300 line-through' :
                          isLocked ? 'text-gray-500 dark:text-gray-400' :
                          'text-gray-900 dark:text-white'
                        }`}>
                          {module.title}
                        </p>
                        {showTimeEstimates && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {module.lessons || 0} lessons • {module.duration || 0} min
                          </p>
                        )}
                      </div>
                    </div>

                    {isLocked && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        <Lock size={12} className="inline" /> Requires previous
                      </span>
                    )}

                    {isCurrent && <Flag size={14} className="text-blue-600 flex-shrink-0" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span><CheckCircle size={12} className="text-green-600 inline" /> Completed</span>
            <span><Flag size={12} className="text-blue-600 inline" /> Current</span>
            <span><Lock size={12} className="text-gray-600 inline" /> Locked</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

LearningPath.defaultProps = {
  title: 'Learning Path',
  modules: [],
  currentModuleId: null,
  completedModules: [],
  showTimeEstimates: true
};

export default LearningPath;