import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { Flag, CheckCircle, XCircle, Clipboard, Info, Eye } from 'lucide-react';

/**
 * FlagSubmission Component
 * Handles flag submission for assessment questions
 */
const FlagSubmission = ({
  questionId = '',
  expectedFlag = '',
  onSubmit = () => {},
  isLoading = false,
  lastSubmission = null,
  maxAttempts = 3,
  attemptsUsed = 0
}) => {
  const [flagInput, setFlagInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleSubmit = () => {
    if (flagInput.trim() === '') return;
    
    setSubmissionResult(null);
    onSubmit(flagInput.trim());
    
    // Simulate result (in real app, this would come from API)
    if (expectedFlag && flagInput.trim() === expectedFlag) {
      setSubmissionResult({ success: true, message: 'Correct flag!' });
    } else {
      setSubmissionResult({ success: false, message: 'Incorrect flag. Try again.' });
    }
    setFlagInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  const copyToClipboard = async () => {
    try {
      if (lastSubmission && lastSubmission.flag) {
        await navigator.clipboard.writeText(lastSubmission.flag);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const canSubmit = !isLoading && flagInput.trim() !== '' && attemptsUsed < maxAttempts;
  const remainingAttempts = Math.max(0, maxAttempts - attemptsUsed);

  const detectFlagFormat = () => {
    if (!expectedFlag) return 'Format: Any valid flag';
    if (expectedFlag.startsWith('FLAG{')) return 'Format: FLAG{content}';
    if (expectedFlag.startsWith('flag{')) return 'Format: flag{content}';
    if (expectedFlag.startsWith('CTF{')) return 'Format: CTF{content}';
    if (/^[a-f0-9]{32}$/.test(expectedFlag)) return 'Format: MD5 hash';
    if (/^[a-f0-9]{64}$/.test(expectedFlag)) return 'Format: SHA256 hash';
    return 'Format: Custom flag';
  };

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Flag size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Flag Submission
          </h2>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {detectFlagFormat()}
              </p>
              {remainingAttempts < maxAttempts && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  {remainingAttempts} attempts remaining
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enter Flag
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., FLAG{secret_code_123}"
                className="flex-1 input input-primary font-mono"
                disabled={isLoading || attemptsUsed >= maxAttempts}
                autoComplete="off"
              />
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                startIcon={isLoading ? null : <CheckCircle size={16} />}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Submit Flag'}
              </Button>
            </div>
          </div>

          {/* Result */}
          {submissionResult && (
            <div className={`p-3 rounded-lg border ${submissionResult.success ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
              <div className="flex items-center gap-2">
                {submissionResult.success ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
                <p className={`font-medium ${submissionResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {submissionResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Last Submission */}
        {lastSubmission && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Last submission
              </span>
              <button
                onClick={copyToClipboard}
                className="text-xs text-blue-600 hover:underline"
              >
                Copy
              </button>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded mt-2">
              <code className="font-mono text-gray-700 dark:text-gray-300">
                {lastSubmission.flag}
              </code>
              <div className="flex items-center justify-end gap-2 mt-1">
                {lastSubmission.correct ? (
                  <CheckCircle size={14} className="text-green-600" />
                ) : (
                  <XCircle size={14} className="text-red-600" />
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(lastSubmission.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-gray-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Tips</h4>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Check for hidden files and directories</li>
            <li>• Look for unusual permissions or ownership</li>
            <li>• Examine running processes and network connections</li>
            <li>• Review configuration files and environment variables</li>
          </ul>
          
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-1"
          >
            {showHint ? <Eye size={12} /> : <Eye size={12} />}
            {showHint ? 'Hide Hint' : 'Need a hint?'}
          </button>
          
          {showHint && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Focus on the specific domain mentioned in the question and look for common patterns.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

FlagSubmission.defaultProps = {
  questionId: '',
  expectedFlag: '',
  onSubmit: () => {},
  isLoading: false,
  lastSubmission: null,
  maxAttempts: 3,
  attemptsUsed: 0
};

export default FlagSubmission;