import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Lightbulb, Eye, EyeOff, Zap, Key, BookOpen, ArrowRight, Lock } from 'lucide-react';

/**
 * HintSystem Component
 * Provides progressive hints for practice lab tasks
 *
 * @param {object} props - Component props
 * @param {string} props.taskId - Current task ID
 * @param {Array} props.hints - Array of hint objects with different levels
 * @param {number} props.maxHints - Maximum number of hints allowed
 * @param {number} props.hintsUsed - Number of hints already used
 * @param {function} props.onHintUsed - Callback when a hint is used
 * @param {boolean} props.showSolution - Whether to show the solution
 * @returns {JSX.Element} - Hint system component
 */
const HintSystem = ({
  taskId = '',
  hints = [],
  maxHints = 3,
  hintsUsed = 0,
  onHintUsed = () => {},
  showSolution = false
}) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [expandedHint, setExpandedHint] = useState(null);
  const [showAllHints, setShowAllHints] = useState(false);

  // Sort hints by level (1 = easiest, 3 = hardest)
  const sortedHints = [...hints].sort((a, b) => a.level - b.level);
  
  // Get available hints based on hints used
  const availableHints = sortedHints.slice(0, Math.min(maxHints, hintsUsed + 1));
  const canUseMoreHints = hintsUsed < maxHints && hintsUsed < hints.length;
  const remainingHints = Math.max(0, maxHints - hintsUsed);

  const toggleHint = (hintIndex) => {
    setExpandedHint(expandedHint === hintIndex ? null : hintIndex);
  };

  const useHint = () => {
    if (canUseMoreHints) {
      onHintUsed();
    }
  };

  const getHintLevelColor = (level) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 2: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 3: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getHintLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Basic Hint';
      case 2: return 'Guided Hint';
      case 3: return 'Detailed Hint';
      default: return 'Hint';
    }
  };

  const getHintIcon = (level) => {
    switch (level) {
      case 1: return <Lightbulb size={16} />;
      case 2: return <BookOpen size={16} />;
      case 3: return <Key size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb size={24} className="text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hint System
            </h2>
          </div>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            {remainingHints} hints remaining
          </Badge>
        </div>

        {/* Hint Usage Instructions */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <Zap size={14} className="inline mr-1" />
            Use hints wisely! Each hint provides progressive guidance. Try to solve the problem yourself first.
          </p>
        </div>

        {/* Hints List */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {availableHints.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hints available for this task</p>
              <p className="text-sm mt-2">Try your best to solve it!</p>
            </div>
          ) : (
            availableHints.map((hint, index) => {
              const isAvailable = index < hintsUsed + 1 || showAllHints;
              const isExpanded = expandedHint === index;
              const isLocked = index >= hintsUsed + 1 && !showAllHints;

              return (
                <div
                  key={index}
                  className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${isLocked ? 'opacity-60' : ''}`}
                >
                  {/* Hint Header */}
                  <div
                    className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLocked ? 'cursor-not-allowed' : ''}`}
                    onClick={() => !isLocked && toggleHint(index)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{hint.title || `Hint ${index + 1}`}</h4>
                        <Badge className={getHintLevelColor(hint.level || 1)}>
                          {getHintLevelLabel(hint.level || 1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isLocked ? (
                        <Lock size={16} className="text-gray-400" />
                      ) : (
                        isExpanded ? <EyeOff size={16} /> : <Eye size={16} />
                      )}
                      {index + 1 <= hintsUsed && !isLocked && (
                        <ArrowRight size={16} className="text-green-600" />
                      )}
                    </div>
                  </div>

                  {/* Hint Content */}
                  {isAvailable && isExpanded && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      {hint.content && (
                        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap mb-3">
                          {hint.content}
                        </p>
                      )}
                      
                      {hint.code && (
                        <pre className="p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto font-mono mb-3">
                          {hint.code}
                        </pre>
                      )}
                      
                      {hint.command && (
                        <div className="p-2 bg-gray-900 rounded text-green-400 font-mono text-sm">
                          <span className="text-gray-500">$ </span>
                          {hint.command}
                        </div>
                      )}
                      
                      {hint.steps && hint.steps.length > 0 && (
                        <div className="mt-3">
                          <p className="font-medium text-gray-900 dark:text-white mb-2">Steps:</p>
                          <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-200">
                            {hint.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}

                  {isLocked && !showAllHints && index === hintsUsed && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          useHint();
                        }}
                        className="w-full"
                        startIcon={<Zap size={14} />}
                      >
                        Use Hint ({remainingHints} remaining)
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Solution Section */}
        {showSolution && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Solution
              </h3>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                Final Answer
              </Badge>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              {sortedHints.find(h => h.type === 'solution')?.content || (
                <p className="text-gray-700 dark:text-gray-200">
                  Solution content will appear here when available.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Show All Hints Option */}
        {hintsUsed < hints.length && !showAllHints && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAllHints(true)}
              className="w-full"
              startIcon={<Eye size={14} />}
            >
              Show All Hints
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

HintSystem.defaultProps = {
  taskId: '',
  hints: [],
  maxHints: 3,
  hintsUsed: 0,
  onHintUsed: () => {},
  showSolution: false
};

export default HintSystem;