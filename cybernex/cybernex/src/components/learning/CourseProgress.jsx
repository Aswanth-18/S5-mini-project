import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { TrendingUp, Clock, CheckCircle, Target, BookOpen, Users, Award } from 'lucide-react';

/**
 * CourseProgress Component
 * Displays detailed progress for a course including completion status, time tracking, and achievements
 *
 * @param {object} props - Component props
 * @param {string} props.courseId - Course ID
 * @param {string} props.courseTitle - Course title
 * @param {number} props.completedLessons - Number of completed lessons
 * @param {number} props.totalLessons - Total number of lessons
 * @param {number} props.score - Current score
 * @param {number} props.maxScore - Maximum possible score
 * @param {number} props.timeSpent - Time spent in minutes
 * @param {number} props.estimatedTime - Estimated completion time in minutes
 * @param {Array} props.completedModules - Array of completed module IDs
 * @param {Array} props.modules - Array of all module objects
 * @param {Array} props.achievements - Array of achievement objects
 * @returns {JSX.Element} - Course progress component
 */
const CourseProgress = ({
  courseId = '',
  courseTitle = 'Course Progress',
  completedLessons = 0,
  totalLessons = 10,
  score = 0,
  maxScore = 100,
  timeSpent = 0,
  estimatedTime = 60,
  completedModules = [],
  modules = [],
  achievements = []
}) => {
  const { isDarkMode } = useTheme();

  // Calculate metrics
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const timeRemaining = Math.max(0, estimatedTime - timeSpent);
  const pace = timeSpent > 0 ? Math.round((completedLessons / timeSpent) * estimatedTime) : 0;

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getPaceColor = () => {
    if (pace >= 100) return 'text-green-600';
    if (pace >= 75) return 'text-blue-600';
    if (pace >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'text-green-600';
    if (scorePercentage >= 70) return 'text-blue-600';
    if (scorePercentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Module progress
  const moduleProgress = modules.map(module => ({
    ...module,
    isCompleted: completedModules.includes(module.id)
  }));

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {courseTitle}
          </h2>
        </div>

        {/* Overall Progress */}
        <div className="space-y-4">
          {/* Main Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Course Completion
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {completedLessons}/{totalLessons} Lessons
              </span>
            </div>
            <ProgressBar
              value={completionPercentage}
              max={100}
              className="h-4"
              barClassName={completionPercentage >= 90 ? 'bg-green-600' :
                             completionPercentage >= 70 ? 'bg-blue-600' :
                             completionPercentage >= 50 ? 'bg-yellow-600' :
                             completionPercentage >= 30 ? 'bg-orange-600' : 'bg-red-600'}
            />
          </div>

          {/* Score and Time */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<Award size={20} className={getScoreColor()} />}
              label="Score"
              value={`${scorePercentage}%`}
              color={scorePercentage >= 90 ? 'green' : scorePercentage >= 70 ? 'blue' : 'yellow'}
            />
            <StatCard
              icon={<Clock size={20} className="text-blue-600" />}
              label="Time"
              value={formatTime(timeSpent)}
              color="blue"
            />
          </div>
        </div>

        {/* Module Progress */}
        {modules.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Module Progress
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {moduleProgress.map((module, index) => (
                <div
                  key={module.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    module.isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      module.isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium truncate ${
                      module.isCompleted ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'
                    }`}>
                      {module.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {module.lessons || 0} lessons • {module.duration || 0} min
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {module.isCompleted ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <Target size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              * Complete modules in order to progress
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Achievements Earned
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award size={14} className="text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      +{achievement.points} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Efficiency */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Learning Pace
            </span>
            <span className={`text-sm font-semibold ${getPaceColor()}`}>
              {pace}% of expected
            </span>
          </div>
          <ProgressBar
            value={Math.min(100, pace)}
            max={100}
            className="h-2"
          />
        </div>
      </div>
    </Card>
  );
};

// Stat Card Subcomponent
const StatCard = ({ icon, label, value, color = 'gray' }) => {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    gray: 'bg-gray-50 dark:bg-gray-800 text-gray-600'
  };

  return (
    <div className={`text-center p-3 rounded-lg ${colorClasses[color] || colorClasses.gray}`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
};

CourseProgress.defaultProps = {
  courseId: '',
  courseTitle: 'Course Progress',
  completedLessons: 0,
  totalLessons: 10,
  score: 0,
  maxScore: 100,
  timeSpent: 0,
  estimatedTime: 60,
  completedModules: [],
  modules: [],
  achievements: []
};

export default CourseProgress;