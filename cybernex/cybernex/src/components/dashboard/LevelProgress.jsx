import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { ROLES, LEVELS } from '../../utils/constants';
import { Trophy, ArrowRight, Lock } from 'lucide-react';

/**
 * Level Progress component for displaying user level and progression
 *
 * @param {object} props - Component props
 * @param {number} props.currentLevel - Current user level
 * @param {number} props.xp - Current XP
 * @param {number} props.requiredXP - XP required for next level
 * @param {Array} props.completedRequirements - Completed level requirements
 * @param {Array} props.totalRequirements - Total level requirements
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Level Progress component
 */
const LevelProgress = ({
  currentLevel = 1,
  xp = 0,
  requiredXP = 1000,
  completedRequirements = [],
  totalRequirements = [],
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  // Calculate progress percentage
  const progressPercentage = Math.min(Math.max((xp / requiredXP) * 100, 0), 100);

  // Get level info
  const levelInfo = LEVELS[currentLevel] || LEVELS[1];
  const nextLevel = currentLevel < 12 ? currentLevel + 1 : currentLevel;
  const nextLevelInfo = LEVELS[nextLevel] || LEVELS[12];

  // Check if next level is locked
  const isNextLevelLocked = currentLevel >= 12;

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Level {currentLevel}: {levelInfo}
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {completedRequirements.length}/{totalRequirements.length} requirements completed
          </p>
        </div>
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            XP: {xp}/{requiredXP}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <ProgressBar value={xp} max={requiredXP} variant="primary" size="md" showLabel />
      </div>

      {/* Requirement Progress */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Requirements
        </h4>
        <div className="space-y-2">
          {totalRequirements.map((requirement, index) => {
            const isCompleted = completedRequirements.includes(requirement.id);
            const isLast = index === totalRequirements.length - 1;

            return (
              <div
                key={requirement.id}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : isDarkMode
                      ? 'bg-gray-700/50'
                      : 'bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                </div>
                <span className={`flex-1 text-sm ${
                  isCompleted
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {requirement.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Level */}
      {!isNextLevelLocked && (
        <div className={`
          flex items-center justify-between p-3 rounded-lg
          ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              {isNextLevelLocked ? <Lock className="w-4 h-4" /> : nextLevel}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                Next: Level {nextLevel}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nextLevelInfo}
              </p>
            </div>
          </div>
          {!isNextLevelLocked && (
            <Link
              to="/student/progress"
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View requirements <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {isNextLevelLocked && (
        <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            Maximum level achieved!
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            You've reached the highest level in this program.
          </p>
        </div>
      )}
    </Card>
  );
};

// Default props
LevelProgress.defaultProps = {
  currentLevel: 1,
  xp: 0,
  requiredXP: 1000,
  completedRequirements: [],
  totalRequirements: []
};

export default LevelProgress;