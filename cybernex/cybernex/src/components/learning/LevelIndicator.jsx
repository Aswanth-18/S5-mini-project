import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { Trophy, Star, TrendingUp, Clock, CheckCircle, Target, Shield } from 'lucide-react';

/**
 * LevelIndicator Component
 * Displays user level, XP, progress to next level, and achievements
 */
const LevelIndicator = ({
  level = 1,
  xp = 0,
  xpRequired = 1000,
  title = 'Your Level',
  showProgress = true,
  showAchievements = true,
  achievements = []
}) => {
  const { isDarkMode } = useTheme();
  
  const progressPercentage = xpRequired > 0 ? Math.round((xp / xpRequired) * 100) : 0;
  const xpRemaining = Math.max(0, xpRequired - xp);

  const getLevelColor = () => {
    const colors = [
      'bg-gray-200 text-gray-800', // Level 1
      'bg-blue-200 text-blue-800',  // Level 2
      'bg-green-200 text-green-800', // Level 3
      'bg-yellow-200 text-yellow-800', // Level 4
      'bg-orange-200 text-orange-800', // Level 5
      'bg-red-200 text-red-800',    // Level 6
      'bg-purple-200 text-purple-800',// Level 7
      'bg-pink-200 text-pink-800',   // Level 8
      'bg-indigo-200 text-indigo-800',// Level 9
      'bg-cyan-200 text-cyan-800'    // Level 10+
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  const getLevelIcon = () => {
    if (level >= 10) return <Shield size={32} className="text-cyan-600" />;
    if (level >= 7) return <Trophy size={32} className="text-purple-600" />;
    if (level >= 4) return <Star size={32} className="text-yellow-600" />;
    return <TrendingUp size={32} className="text-blue-600" />;
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <Card className="text-center">
      <div className="space-y-4">
        {/* Level Badge */}
        <div className="relative inline-block">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${getLevelColor()}`}>
            {getLevelIcon()}
            <span className="absolute">{level}</span>
          </div>
          <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs">
            <Star size={10} className="fill-yellow-900" />
          </Badge>
        </div>

        {/* Level Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        
        {/* XP Progress */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{formatNumber(xp)} XP</span>
              <span>{formatNumber(xpRemaining)} to next level</span>
            </div>
            <ProgressBar
              value={progressPercentage}
              max={100}
              className="h-3"
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">{level}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Level</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(xp)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total XP</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">{progressPercentage}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Progress</p>
          </div>
        </div>

        {/* Achievements */}
        {showAchievements && achievements.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Recent Achievements
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center"
                  title={achievement.title}
                >
                  <Trophy size={18} className="text-yellow-600" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Level Info */}
        <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
          Keep learning to reach Level {level + 1}!
        </div>
      </div>
    </Card>
  );
};

LevelIndicator.defaultProps = {
  level: 1,
  xp: 0,
  xpRequired: 1000,
  title: 'Your Level',
  showProgress: true,
  showAchievements: true,
  achievements: []
};

export default LevelIndicator;