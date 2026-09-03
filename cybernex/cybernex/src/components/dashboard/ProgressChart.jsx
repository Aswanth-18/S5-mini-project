import React from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Progress Chart component for displaying data trends
 *
 * @param {object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 * @param {string} props.type - Chart type (line, area)
 * @param {Array} props.lines - Array of line configurations
 * @param {boolean} props.showLegend - Whether to show legend
 * @param {boolean} props.showGrid - Whether to show grid
 * @param {string} props.height - Chart height
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Progress Chart component
 */
const ProgressChart = ({
  data = [],
  title,
  type = 'line',
  lines = [],
  showLegend = true,
  showGrid = true,
  height = '300px',
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  // Default colors for lines
  const defaultColors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // yellow-500
    '#EF4444', // red-500
    '#8B5CF6'  // purple-500
  ];

  // Default line configurations if not provided
  const chartLines = lines.length > 0 ? lines : [
    {
      key: 'value',
      name: 'Progress',
      stroke: defaultColors[0],
      fill: defaultColors[0],
      type: 'monotone'
    }
  ];

  // Theme-specific configurations
  const themeConfig = {
    text: isDarkMode ? '#E5E7EB' : '#374151',
    grid: isDarkMode ? '#374151' : '#E5E7EB',
    background: isDarkMode ? '#1F2937' : '#FFFFFF'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}

      <div style={{ height }}>
        {type === 'line' ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              {showGrid && (
                <CartesianGrid
                  stroke={themeConfig.grid}
                  strokeDasharray="3 3"
                />
              )}
              <XAxis
                dataKey="name"
                stroke={themeConfig.text}
                tickLine={false}
                axisLine={{ stroke: themeConfig.text }}
                tick={{ fill: themeConfig.text, fontSize: 12 }}
              />
              <YAxis
                stroke={themeConfig.text}
                tickLine={false}
                axisLine={{ stroke: themeConfig.text }}
                tick={{ fill: themeConfig.text, fontSize: 12 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperClassName="recharts-tooltip-wrapper"
              />
              {showLegend && (
                <Legend
                  wrapperStyle={{
                    color: themeConfig.text,
                    fontSize: '12px'
                  }}
                />
              )}
              {chartLines.map((line, index) => (
                <Line
                  key={`line-${line.key || index}`}
                  type={line.type || 'monotone'}
                  dataKey={line.key || 'value'}
                  name={line.name}
                  stroke={line.stroke || defaultColors[index]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              {showGrid && (
                <CartesianGrid
                  stroke={themeConfig.grid}
                  strokeDasharray="3 3"
                />
              )}
              <XAxis
                dataKey="name"
                stroke={themeConfig.text}
                tickLine={false}
                axisLine={{ stroke: themeConfig.text }}
                tick={{ fill: themeConfig.text, fontSize: 12 }}
              />
              <YAxis
                stroke={themeConfig.text}
                tickLine={false}
                axisLine={{ stroke: themeConfig.text }}
                tick={{ fill: themeConfig.text, fontSize: 12 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperClassName="recharts-tooltip-wrapper"
              />
              {showLegend && (
                <Legend
                  wrapperStyle={{
                    color: themeConfig.text,
                    fontSize: '12px'
                  }}
                />
              )}
              {chartLines.map((line, index) => (
                <Area
                  key={`area-${line.key || index}`}
                  type={line.type || 'monotone'}
                  dataKey={line.key || 'value'}
                  name={line.name}
                  stroke={line.stroke || defaultColors[index]}
                  strokeWidth={2}
                  fill={line.fill || defaultColors[index]}
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </Card>
  );
};

export default ProgressChart;