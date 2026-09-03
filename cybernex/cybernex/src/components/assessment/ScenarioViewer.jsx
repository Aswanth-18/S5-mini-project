import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { PlayCircle, PauseCircle, Eye, BookOpen, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

/**
 * ScenarioViewer Component
 * Displays assessment scenarios with interactive storytelling
 */
const ScenarioViewer = ({
  title = 'Scenario',
  description = '',
  steps = [],
  currentStep = 0,
  difficulty = 'medium',
  domain = 'General',
  onStepChange = () => {},
  autoPlay = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStepChange = (direction) => {
    const newStep = currentStep + direction;
    if (newStep >= 0 && newStep < steps.length) {
      onStepChange(newStep);
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
    }
  };

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
            <Badge className={getDifficultyColor()}>{difficulty}</Badge>
            {domain && <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">{domain}</Badge>}
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Eye size={18} /> : <Eye size={18} />}
          </Button>
        </div>

        {/* Description */}
        {description && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
          </div>
        )}

        {/* Scenario Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrent ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 ring-2 ring-blue-500' :
                  isCompleted ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
                  'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{step.title}</h4>
                    {isExpanded && step.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    )}
                    
                    {step.details && isCurrent && (
                      <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-purple-800 dark:text-purple-200">{step.details}</p>
                      </div>
                    )}
                  </div>
                </div>

                {step.image && isCurrent && (
                  <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full max-h-48 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        {steps.length > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={() => handleStepChange(-1)}
              disabled={currentStep === 0}
              startIcon={<PlayCircle size={14} className="transform rotate-180" />}
            >
              Previous Step
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <Button 
              variant="primary" 
              onClick={() => handleStepChange(1)}
              disabled={currentStep >= steps.length - 1}
              endIcon={<PlayCircle size={14} />}
            >
              Next Step
            </Button>
          </div>
        )}

        {/* Auto Play Controls */}
        {autoPlay && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPlaying(!isPlaying)}
              startIcon={isPlaying ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
            >
              {isPlaying ? 'Pause' : 'Play Scenario'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

ScenarioViewer.defaultProps = {
  title: 'Scenario',
  description: '',
  steps: [],
  currentStep: 0,
  difficulty: 'medium',
  domain: 'General',
  onStepChange: () => {},
  autoPlay: false
};

export default ScenarioViewer;