import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { Flag, CheckCircle, XCircle, Clipboard, AlertCircle, Eye, EyeOff } from 'lucide-react';

/**
 * FlagChecker Component
 * Allows users to check if they found the correct flag for a lab task
 *
 * @param {object} props - Component props
 * @param {string} props.taskId - Current task ID
 * @param {string} props.expectedFlag - The correct flag to check against
 * @param {Array} props.submittedFlags - Array of previously submitted flags
 * @param {function} props.onFlagSubmit - Callback when flag is submitted
 * @param {boolean} props.isLoading - Whether flag checking is in progress
 * @param {boolean} props.showFlag - Whether to show the expected flag (for debugging)
 * @returns {JSX.Element} - Flag checker component
 */
const FlagChecker = ({
  taskId = '',
  expectedFlag = '',
  submittedFlags = [],
  onFlagSubmit = () => {},
  isLoading = false,
  showFlag = false
}) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [flagInput, setFlagInput] = useState('');
  const [showExpectedFlag, setShowExpectedFlag] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleFlagChange = (e) => {
    setFlagInput(e.target.value.trim());
    setValidationResult(null);
  };

  const handleSubmit = () => {
    if (flagInput === '') return;
    
    onFlagSubmit(flagInput);
    
    // Local validation
    if (flagInput === expectedFlag) {
      setValidationResult({ success: true, message: 'Correct flag!' });
    } else {
      setValidationResult({ success: false, message: 'Incorrect flag. Try again.' });
    }
    setFlagInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFlagFormatDescription = () => {
    if (expectedFlag) {
      const format = detectFlagFormat(expectedFlag);
      return format;
    }
    return 'Common formats: FLAG{...}, flag{...}, CTF{...}';
  };

  const detectFlagFormat = (flag) => {
    if (flag.startsWith('FLAG{')) return 'Format: FLAG{content}';
    if (flag.startsWith('flag{')) return 'Format: flag{content}';
    if (flag.startsWith('CTF{')) return 'Format: CTF{content}';
    if (/^[a-f0-9]{32}$/.test(flag)) return 'Format: MD5 hash';
    if (/^[a-f0-9]{40}$/.test(flag)) return 'Format: SHA1 hash';
    if (/^[a-f0-9]{64}$/.test(flag)) return 'Format: SHA256 hash';
    return 'Format: Custom flag';
  };

  // Count attempts
  const totalAttempts = submittedFlags.length;
  const successfulAttempts = submittedFlags.filter(flag => flag.success).length;

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flag size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Flag Checker
            </h2>
          </div>
          
          {totalAttempts > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                {successfulAttempts} correct
              </Badge>
              {totalAttempts - successfulAttempts > 0 && (
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {totalAttempts - successfulAttempts} incorrect
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <Flag size={14} className="inline mr-1" />
            {getFlagFormatDescription()}
          </p>
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
                onChange={handleFlagChange}
                onKeyDown={handleKeyDown}
                placeholder={`e.g., FLAG{${user?.id || 'your_flag_here'}}`}
                className="flex-1 input input-primary font-mono"
                disabled={isLoading}
                autoComplete="off"
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || flagInput === ''}
                startIcon={isLoading ? null : <CheckCircle size={16} />}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Check Flag'}
              </Button>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={`p-3 rounded-lg border ${validationResult.success ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
              <div className="flex items-center gap-2">
                {validationResult.success ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
                <p className={`font-medium ${validationResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {validationResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Expected Flag (Debug) */}
        {showFlag && expectedFlag && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Expected Flag
              </span>
              <button
                onClick={() => setShowExpectedFlag(!showExpectedFlag)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showExpectedFlag ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {showExpectedFlag && (
              <div className="flex items-center gap-2 p-2 bg-gray-900 rounded text-green-400 font-mono">
                <span>{expectedFlag}</span>
                <Button
                  variant="ghost"
                  onClick={() => copyToClipboard(expectedFlag)}
                  className="text-green-400 hover:text-green-300"
                >
                  <Clipboard size={14} />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Submission History */}
        {submittedFlags.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex-1 overflow-y-auto">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Recent Attempts
            </h4>
            <div className="space-y-2">
              {submittedFlags.slice().reverse().map((attempt, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${attempt.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
                >
                  <div className="flex items-center gap-2">
                    {attempt.success ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                    <code className="font-mono text-sm">
                      {attempt.flag}
                    </code>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(attempt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Tips
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Check for hidden files and directories</li>
            <li>• Look for unusual permissions or ownership</li>
            <li>• Examine running processes and network connections</li>
            <li>• Review configuration files and environment variables</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

FlagChecker.defaultProps = {
  taskId: '',
  expectedFlag: '',
  submittedFlags: [],
  onFlagSubmit: () => {},
  isLoading: false,
  showFlag: false
};

export default FlagChecker;