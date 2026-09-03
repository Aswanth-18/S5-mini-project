import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useForm } from '../../hooks/useForm';
import { ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { AlertTriangle, Check, X, RotateCcw, User, Layers, Database, ShieldCheck, Clock, Warning } from 'lucide-react';

const Reset = () => {
  const { user } = useAuth();
  const { isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [isResetting, setIsResetting] = useState(false);
  const [resetType, setResetType] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetOptions = [
    {
      id: 'user_progress',
      title: 'Reset User Progress',
      description: 'Reset learning progress for a specific user',
      impact: 'User will lose all progress data',
      severity: 'medium',
      icon: <User size={24} />
    },
    {
      id: 'course_progress',
      title: 'Reset Course Progress',
      description: 'Reset progress for all users in specific courses',
      impact: 'Affects multiple users in selected courses',
      severity: 'high',
      icon: <Layers size={24} />
    },
    {
      id: 'assessment_results',
      title: 'Reset Assessment Results',
      description: 'Remove all assessment results and attempts',
      impact: 'All assessment data will be permanently deleted',
      severity: 'critical',
      icon: <Database size={24} />
    },
    {
      id: 'attendance_data',
      title: 'Reset Attendance Data',
      description: 'Clear all attendance records',
      impact: 'All attendance history will be lost',
      severity: 'medium',
      icon: <Clock size={24} />
    },
    {
      id: 'violation_records',
      title: 'Reset Violation Records',
      description: 'Clear all violation and restriction data',
      impact: 'All violation history and restrictions will be removed',
      severity: 'high',
      icon: <ShieldCheck size={24} />
    },
    {
      id: 'full_system',
      title: 'Full System Reset',
      description: 'Reset all data except users and settings',
      impact: 'This will clear all content, progress, and activity data',
      severity: 'critical',
      icon: <RotateCcw size={24} />
    }
  ];

  const getSelectedOption = () => {
    return resetOptions.find(option => option.id === resetType);
  };

  const handleResetSelect = (type) => {
    setResetType(type);
  };

  const handleResetConfirm = () => {
    setShowConfirmation(true);
  };

  const handleResetExecute = async () => {
    if (!resetType) return;
    
    setIsResetting(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to perform the reset
      console.log('Executing reset:', resetType);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setShowConfirmation(false);
      setResetType('');
      
    } catch (err) {
      setError(err.message || 'Failed to execute reset');
    } finally {
      setIsResetting(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasPermission('system.manage')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Reset</h1>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>You do not have permission to perform system resets. Please contact an administrator.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Reset</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Reset various system data and configurations</p>
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {success && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <Check size={20} />
            <span>System reset completed successfully!</span>
          </div>
        </Card>
      )}

      {/* Warning Banner */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-3">
          <Warning size={24} className="text-yellow-600" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Warning</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              System reset operations are irreversible. Please ensure you have backups before proceeding.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resetOptions.map((option) => {
          const isSelected = resetType === option.id;
          const isDisabled = isResetting;
          
          return (
            <Card 
              key={option.id} 
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-lg hover:transform hover:scale-[1.02]'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isDisabled && handleResetSelect(option.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {option.description}
                    </p>
                    <div className="space-y-2">
                      <Badge className={getSeverityColor(option.severity)}>
                        {option.severity.toUpperCase()} IMPACT
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.impact}
                      </p>
                    </div>
                  </div>
                </div>
                
                {isSelected && !isDisabled && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="danger" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetConfirm();
                      }}
                      className="w-full"
                      startIcon={<RotateCcw size={16} />}
                    >
                      Confirm Reset
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleResetExecute}
        title={`Confirm ${getSelectedOption()?.title || 'Reset'}`}
        message={
          <div className="space-y-4">
            <p>Are you absolutely sure you want to perform this reset?</p>
            <p className="text-red-600 dark:text-red-400">
              <strong>This action cannot be undone.</strong>
            </p>
            {getSelectedOption() && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Reset Details:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {getSelectedOption().description}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Impact: {getSelectedOption().impact}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please ensure you have a recent backup before proceeding.
            </p>
          </div>
        }
        confirmText="Execute Reset"
        confirmVariant="danger"
        cancelText="Cancel"
        isLoading={isResetting}
        confirmButtonText={isResetting ? 'Resetting...' : 'Execute Reset'}
      />
    </div>
  );
};

export default Reset;