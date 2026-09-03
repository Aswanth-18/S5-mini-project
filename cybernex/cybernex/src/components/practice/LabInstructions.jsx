import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { BookOpen, CheckCircle, Eye, EyeOff, Clock } from 'lucide-react';

/**
 * LabInstructions Component
 * Displays instructions for a practice lab with expandable sections
 *
 * @param {object} props - Component props
 * @param {string} props.title - Lab title
 * @param {string} props.description - Lab description
 * @param {Array} props.objectives - Learning objectives
 * @param {Array} props.steps - Step-by-step instructions
 * @param {string} props.difficulty - Difficulty level
 * @param {number} props.estimatedTime - Estimated completion time in minutes
 * @param {boolean} props.showObjectiveChecklist - Whether to show objective checklist
 * @returns {JSX.Element} - Lab instructions component
 */
const LabInstructions = ({
  title = 'Lab Instructions',
  description = 'Follow these instructions to complete the lab.',
  objectives = [],
  steps = [],
  difficulty = 'medium',
  estimatedTime = 30,
  showObjectiveChecklist = true
}) => {
  const { isDarkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    objectives: true,
    overview: true,
    steps: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
              {difficulty}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <Clock size={14} className="inline mr-1" />
              {estimatedTime} min
            </span>
          </div>
        </div>

        {/* Overview Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <button
            onClick={() => toggleSection('overview')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Overview
            </h3>
            {expandedSections.overview ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {expandedSections.overview && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>

        {/* Objectives Section */}
        {showObjectiveChecklist && objectives.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
              onClick={() => toggleSection('objectives')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Learning Objectives
              </h3>
              {expandedSections.objectives ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {expandedSections.objectives && (
              <ul className="mt-3 space-y-2">
                {objectives.map((objective, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Steps Section */}
        {steps.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('steps')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Step-by-Step Instructions
              </h3>
              {expandedSections.steps ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {expandedSections.steps && (
              <div className="mt-3 space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        {step.title && (
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {step.title}
                          </h4>
                        )}
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {step.description || step}
                        </p>
                        {step.code && (
                          <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto font-mono">
                            {step.code}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Default props for easier usage
LabInstructions.defaultProps = {
  title: 'Lab Instructions',
  description: 'Follow these instructions to complete the lab.',
  objectives: [],
  steps: [],
  difficulty: 'medium',
  estimatedTime: 30,
  showObjectiveChecklist: true
};

export default LabInstructions;