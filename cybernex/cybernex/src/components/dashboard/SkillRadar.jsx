import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Skill Radar Chart component
 *
 * @param {object} props - Component props
 * @param {Array} props.data - Radar chart data
 * @param {string} props.title - Chart title
 * @param {string} props.subtitle - Chart subtitle
 * @param {number} props.height - Chart height
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Skill Radar Chart component
 */
const SkillRadar = ({
  data = [],
  title = 'Skill Distribution',
  subtitle,
  height = 300,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Theme-specific configurations
  const themeConfig = {
    text: isDarkMode ? '#E5E7EB' : '#374151',
    grid: isDarkMode ? '#4B5563' : '#E5E7EB',
    axis: isDarkMode ? '#6B7280' : '#9CA3AF'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <div className="mb-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ height }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid
                gridType="polygon"
                stroke={themeConfig.grid}
              />
              <PolarAngleAxis
                dataKey="name"
                stroke={themeConfig.text}
                tick={{ fill: themeConfig.text, fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                stroke={themeConfig.axis}
                tick={{ fill: themeConfig.text, fontSize: 10 }}
                tickCount={5}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillRadar;