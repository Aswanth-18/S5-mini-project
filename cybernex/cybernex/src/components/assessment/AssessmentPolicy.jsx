import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { FileText, Info, Clock, ShieldCheck, Eye, EyeOff, CheckCircle } from 'lucide-react';

/**
 * AssessmentPolicy Component
 * Displays assessment policies, rules, and guidelines
 */
const AssessmentPolicy = ({
  policies = [],
  passingScore = 70,
  timeLimit = 0,
  maxAttempts = 1,
  allowsReview = true,
  showScoresImmediately = false,
  onAcknowledge = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  const formatTime = (seconds) => {
    if (seconds <= 0) return 'No time limit';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge();
  };

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Info size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assessment Policy & Guidelines
            </h3>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Quick Rules Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PolicyItem
                icon={<Target size={18} className="text-blue-600" />}
                title="Passing Score"
                value={`${passingScore}%`}
                description="Minimum score to pass"
              />
              <PolicyItem
                icon={<Clock size={18} className="text-purple-600" />}
                title="Time Limit"
                value={formatTime(timeLimit)}
                description="Total allowed time"
              />
              <PolicyItem
                icon={<ShieldCheck size={18} className="text-green-600" />}
                title="Attempts"
                value={maxAttempts === -1 ? 'Unlimited' : maxAttempts}
                description="Number of attempts"
              />
              <PolicyItem
                icon={<CheckCircle size={18} className="text-yellow-600" />}
                title="Review"
                value={allowsReview ? 'Yes' : 'No'}
                description="Result review allowed"
              />
            </div>

            {/* Detailed Policies */}
            <div className="space-y-3">
              {policies.map((policy, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{policy.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{policy.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Acknowledgment */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <input
                type="checkbox"
                id="policy-acknowledge"
                checked={acknowledged}
                onChange={handleAcknowledge}
                className="w-5 h-5 text-yellow-600 rounded"
              />
              <label htmlFor="policy-acknowledge" className="text-sm text-yellow-800 dark:text-yellow-200 cursor-pointer">
                I have read and understood the assessment policies and agree to abide by them.
              </label>
            </div>

            {/* Important Notes */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>IMPORTANT:</strong> By starting this assessment, you agree to:
                <ul className="list-disc list-inside mt-1 ml-2 space-y-0.5">
                  <li>Complete the assessment independently without assistance</li>
                  <li>Not to share or discuss questions with others</li>
                  <li>Respect the time limits and attempt restrictions</li>
                  <li>Follow all academic integrity guidelines</li>
                </ul>
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Policy Item Subcomponent
const PolicyItem = ({ icon, title, value, description }) => (
  <div className="text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
    <p className="text-xl font-bold text-purple-600">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

AssessmentPolicy.defaultProps = {
  policies: [
    {
      title: 'Time Management',
      description: 'Manage your time wisely. The assessment will auto-submit when time expires.'
    },
    {
      title: 'No Backtracking',
      description: 'You can review previous questions but cannot change your answers.'
    },
    {
      title: 'Auto Save',
      description: 'Your progress is automatically saved as you go through the assessment.'
    },
    {
      title: 'Result Policy',
      description: 'Results will be available immediately after submission.'
    }
  ],
  passingScore: 70,
  timeLimit: 0,
  maxAttempts: 1,
  allowsReview: true,
  showScoresImmediately: false,
  onAcknowledge: () => {}
};

export default AssessmentPolicy;