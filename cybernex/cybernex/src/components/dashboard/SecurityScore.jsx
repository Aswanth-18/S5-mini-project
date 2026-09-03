import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Security Score Circular Gauge Component
 */
const SecurityGauge = ({ score = 0, size = 120 }) => {
  const { isDarkMode } = useTheme();

  // Calculate gauge properties
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine score color
  const getScoreColor = () => {
    if (score >= 80) return isDarkMode ? '#10B981' : '#10B981'; // emerald-500
    if (score >= 60) return isDarkMode ? '#F59E0B' : '#F59E0B'; // yellow-500
    if (score >= 40) return isDarkMode ? '#F97316' : '#F97316'; // orange-500
    return isDarkMode ? '#EF4444' : '#EF4444'; // red-500
  };

  const scoreColor = getScoreColor();
  const trackColor = isDarkMode ? '#4B5563' : '#E5E7EB';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <svg className="absolute top-0 left-0 -rotate-90" style={{ width: size, height: size }}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 8}
          fill="none"
          stroke={trackColor}
          strokeWidth={16}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - 8}
          fill="none"
          stroke={scoreColor}
          strokeWidth={16}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Inner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <text
          x={radius}
          y={radius - 15}
          textAnchor="middle"
          className={`text-2xl font-bold ${isDarkMode ? 'fill-white' : 'fill-gray-900'}`}
        >
          {score}
        </text>
        <text
          x={radius}
          y={radius + 5}
          textAnchor="middle"
          className={`text-xs ${isDarkMode ? 'fill-gray-400' : 'fill-gray-600'}`}
        >
          /100
        </text>
      </div>
    </div>
  );
};

/**
 * Security Score component for displaying user security metrics
 *
 * @param {object} props - Component props
 * @param {number} props.score - Security score (0-100)
 * @param {number} props.completionRate - Completion rate percentage
 * @param {number} props.practiceScore - Practice score percentage
 * @param {number} props.assessmentScore - Assessment score percentage
 * @param {Array} props DomainScores - Array of domain score objects
 * @param {boolean} props.showTrend - Whether to show trend indicator
 * @param {number} props.trend - Trend value (-1, 0, 1)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Security Score component
 */
const SecurityScore = ({
  score = 0,
  completionRate = 0,
  practiceScore = 0,
  assessmentScore = 0,
  domainScores = [],
  showTrend = true,
  trend = 0,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Get security level
  const getSecurityLevel = () => {
    if (score >= 90) return { label: 'Excellent', color: 'success' };
    if (score >= 80) return { label: 'Good', color: 'success' };
    if (score >= 70) return { label: 'Fair', color: 'warning' };
    if (score >= 60) return { label: 'Needs Improvement', color: 'warning' };
    if (score >= 40) return { label: 'Poor', color: 'danger' };
    return { label: 'Critical', color: 'danger' };
  };

  const securityLevel = getSecurityLevel();

  // Get trend icon and color
  const getTrendInfo = () => {
    if (trend > 0) return {
      icon: TrendingUp,
      color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
      label: `${trend}% increase`
    };
    if (trend < 0) return {
      icon: TrendingDown,
      color: isDarkMode ? 'text-red-400' : 'text-red-600',
      label: `${Math.abs(trend)}% decrease`
    };
    return {
      icon: null,
      color: 'text-gray-400',
      label: 'No change'
    };
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  // Domain scores for display
  const displayDomainScores = domainScores.slice(0, 5);

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Security Score
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your overall cybersecurity proficiency
          </p>
        </div>

        {showTrend && TrendIcon && (
          <div className={`flex items-center gap-1 p-1.5 rounded-lg ${
            trend > 0
              ? 'bg-emerald-100 dark:bg-emerald-900/20'
              : trend < 0
                ? 'bg-red-100 dark:bg-red-900/20'
                : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <TrendIcon className={`w-4 h-4 ${trendInfo.color}`} />
            <span className={`text-xs font-medium ${trendInfo.color}`}>
              {trendInfo.label}
            </span>
          </div>
        )}
      </div>

      {/* Main gauge and info */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-shrink-0">
          <SecurityGauge score={score} size={110} />
        </div>

        <div className="flex-1">
          <div className="flex items-end gap-2 mb-1">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {score}
            </p>
            <span className="text-gray-500 dark:text-gray-400 pb-1">/100</span>
          </div>

          <Badge variant={securityLevel.color} size="md" className="mb-3">
            {securityLevel.label}
          </Badge>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Completion</p>
              <div className="flex items-center gap-2 mt-1">
                <ProgressBar
                  value={completionRate}
                  max={100}
                  size="sm"
                  variant="primary"
                />
                <span className="text-xs">{completionRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Practice</p>
              <div className="flex items-center gap-2 mt-1">
                <ProgressBar
                  value={practiceScore}
                  max={100}
                  size="sm"
                  variant="success"
                />
                <span className="text-xs">{practiceScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component scores */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className={`text-2xl font-bold ${
            assessmentScore >= 80
              ? 'text-emerald-600 dark:text-emerald-400'
              : assessmentScore >= 60
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
          }`}>
            {assessmentScore}%
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Assessments
          </p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${
            practiceScore >= 80
              ? 'text-emerald-600 dark:text-emerald-400'
              : practiceScore >= 60
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
          }`}>
            {practiceScore}%
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Practice
          </p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${
            completionRate >= 80
              ? 'text-emerald-600 dark:text-emerald-400'
              : completionRate >= 60
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
          }`}>
            {completionRate}%
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Completion
          </p>
        </div>
      </div>

      {/* Domain breakdown */}
      {displayDomainScores.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Domain Scores
          </h4>
          <div className="space-y-2">
            {displayDomainScores.map((domain, index) => (
              <div key={domain.name || index} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {domain.name}
                  </p>
                </div>
                <div className="w-24 flex-shrink-0">
                  <ProgressBar
                    value={domain.score}
                    max={100}
                    size="sm"
                    variant={
                      domain.score >= 80 ? 'success' :
                      domain.score >= 60 ? 'warning' :
                      'danger'
                    }
                  />
                </div>
                <span className={`text-xs font-medium w-12 text-right ${
                  domain.score >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : domain.score >= 60
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {domain.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

// Default props
SecurityScore.defaultProps = {
  score: 0,
  completionRate: 0,
  practiceScore: 0,
  assessmentScore: 0,
  domainScores: [],
  showTrend: true,
  trend: 0
};

export default SecurityScore;