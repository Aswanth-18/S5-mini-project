import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { TrendingUp, Clock, CheckCircle, Target, Award, BarChart3, Trophy } from 'lucide-react';

/**
 * LabProgress Component
 * Displays progress tracking for a practice lab
 *
 * @param {object} props - Component props
 * @param {number} props.completedTasks - Number of completed tasks
 * @param {number} props.totalTasks - Total number of tasks
 * @param {number} props.score - Current score
 * @param {number} props.maxScore - Maximum possible score
 * @param {number} props.timeSpent - Time spent in seconds
 * @param {number} props.estimatedTime - Estimated time to complete
 * @param {Array} props.achievements - Array of unlocked achievements
 * @returns {JSX.Element} - Lab progress component
 */
const LabProgress = ({
  completedTasks = 0,
  totalTasks = 10,
  score = 0,
  maxScore = 100,
  timeSpent = 0,
  estimatedTime = 30 * 60, // 30 minutes in seconds
  achievements = []
}) => {
  const { isDarkMode } = useTheme();

  // Calculate metrics
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const timeRemaining = Math.max(0, estimatedTime - timeSpent);
  const timeEfficiency = timeSpent > 0 ? Math.round((completedTasks / timeSpent) * estimatedTime * 100) : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeEfficiencyColor = () => {
    if (timeEfficiency >= 120) return 'text-green-600';
    if (timeEfficiency >= 80) return 'text-blue-600';
    if (timeEfficiency >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'text-green-600';
    if (scorePercentage >= 70) return 'text-blue-600';
    if (scorePercentage >= 50) return 'text-yellow-600';
    if (scorePercentage >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lab Progress
          </h2>
        </div>

        {/* Progress Overview */}
        <div className="space-y-4">
          {/* Task Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Completion
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <ProgressBar
              value={progressPercentage}
              max={100}
              className="h-3"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {progressPercentage}% complete
            </p>
          </div>

          {/* Score Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Score
              </span>
              <span className={`text-sm font-semibold ${getScoreColor()}`}>
                {score}/{maxScore} ({scorePercentage}%)
              </span>
            </div>
            <ProgressBar
              value={scorePercentage}
              max={100}
              className="h-3"
              barClassName={scorePercentage >= 90 ? 'bg-green-600' : 
                           scorePercentage >= 70 ? 'bg-blue-600' :
                           scorePercentage >= 50 ? 'bg-yellow-600' :
                           scorePercentage >= 30 ? 'bg-orange-600' : 'bg-red-600'}
            />
          </div>
        </div>

        {/* Time Tracking */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock size={16} className="text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeSpent)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Time Spent
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target size={16} className="text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Time Remaining
            </p>
          </div>
        </div>

        {/* Efficiency Score */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Efficiency
            </span>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
              {timeEfficiency}%
            </Badge>
          </div>
          <ProgressBar
            value={Math.min(100, timeEfficiency)}
            max={100}
            className="h-2"
            barClassName={timeEfficiency >= 80 ? 'bg-purple-600' : 
                           timeEfficiency >= 50 ? 'bg-blue-600' : 'bg-gray-600'}
          />
          <p className={`text-xs mt-1 ${getTimeEfficiencyColor()}`}>
            {timeEfficiency >= 100 ? 'Excellent pace!' : 
             timeEfficiency >= 80 ? 'Great job!' :
             timeEfficiency >= 50 ? 'Keep going!' : 'Pick up the pace'}
          </p>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Achievements
              </h3>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                {achievements.length} unlocked
              </Badge>
            </div>
            
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy size={16} className="text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-600">
                      +{achievement.points} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <StatCard
            icon={<CheckCircle size={18} className="text-green-600" />}
            label="Tasks Left"
            value={totalTasks - completedTasks}
            color="green"
          />
          <StatCard
            icon={<Award size={18} className="text-yellow-600" />}
            label="Score"
            value={`${scorePercentage}%`}
            color="yellow"
          />
          <StatCard
            icon={<BarChart3 size={18} className="text-purple-600" />}
            label="Efficiency"
            value={`${timeEfficiency}%`}
            color="purple"
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
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    gray: 'bg-gray-50 dark:bg-gray-800 text-gray-600'
  };

  return (
    <div className={`text-center p-2 rounded-lg ${colorClasses[color] || colorClasses.gray}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
};

LabProgress.defaultProps = {
  completedTasks: 0,
  totalTasks: 10,
  score: 0,
  maxScore: 100,
  timeSpent: 0,
  estimatedTime: 30 * 60,
  achievements: []
};

export default LabProgress;