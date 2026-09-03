import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { VIOLATION_TYPES, VIOLATION_SEVERITY, ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, User, Calendar, Clock, AlertTriangle, ShieldAlert, FileText, Check, X, Eye, Edit2, Trash2, ExternalLink } from 'lucide-react';

const ViolationDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  const { violationId } = useParams();
  
  const [violation, setViolation] = useState(null);
  const [relatedUser, setRelatedUser] = useState(null);
  const [relatedAssessment, setRelatedAssessment] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Mock data for violation - in a real app this would come from context/data
  const mockViolations = {
    'VIO-001': {
      id: 'VIO-001',
      userId: 'STUDENT-001',
      type: 'TAB_SWITCH',
      severity: 'MEDIUM',
      description: 'User switched browser tabs during assessment',
      assessmentId: 'ASSESSMENT-001',
      assessmentTitle: 'Web Security Fundamentals',
      timestamp: new Date('2024-03-15T14:30:00').toISOString(),
      status: 'unresolved',
      resolvedBy: null,
      resolvedAt: null,
      evidence: 'Browser API detected tab switch at 14:30:45. User switched to a tab with title "Google" for 45 seconds before returning to the assessment.',
      actionTaken: null,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      additionalData: {
        duration: '45 seconds',
        previousTab: 'Google',
        timestamp: '2024-03-15T14:30:45.123Z'
      }
    },
    'VIO-002': {
      id: 'VIO-002',
      userId: 'STUDENT-002',
      type: 'COPY_ATTEMPT',
      severity: 'HIGH',
      description: 'User attempted to copy text from the assessment',
      assessmentId: 'ASSESSMENT-002',
      assessmentTitle: 'Network Security Assessment',
      timestamp: new Date('2024-03-10T10:15:00').toISOString(),
      status: 'resolved',
      resolvedBy: 'FACULTY-001',
      resolvedAt: new Date('2024-03-10T12:45:00').toISOString(),
      evidence: 'Clipboard API detected copy operation. User attempted to copy the assessment question text.',
      actionTaken: 'Warning issued to student via email',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      additionalData: {
        copiedText: 'What is the purpose of a firewall?',
        timestamp: '2024-03-10T10:15:22.456Z'
      }
    }
  };

  useEffect(() => {
    if (violationId && mockViolations[violationId]) {
      setViolation(mockViolations[violationId]);
      
      // Find related user
      const user = allUsers.find(u => u.id === mockViolations[violationId].userId);
      setRelatedUser(user);
      
      // In a real app, we would also fetch the related assessment
      setRelatedAssessment({
        id: mockViolations[violationId].assessmentId,
        title: mockViolations[violationId].assessmentTitle,
        domain: 'Network Security'
      });
    }
  }, [violationId, allUsers]);

  const handleGoBack = () => {
    navigate('/admin/violations');
  };

  const handleResolve = async () => {
    if (!resolutionNotes) {
      setError('Please provide resolution notes');
      return;
    }
    
    setIsResolving(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to resolve the violation
      console.log('Resolving violation with notes:', resolutionNotes, 'Action:', actionTaken);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update violation status
      setViolation(prev => ({
        ...prev,
        status: 'resolved',
        resolvedBy: user?.id || 'current_user',
        resolvedAt: new Date().toISOString(),
        actionTaken: actionTaken || resolutionNotes
      }));
      
      setSuccess(true);
      setResolutionNotes('');
      setActionTaken('');
      
    } catch (err) {
      setError(err.message || 'Failed to resolve violation');
    } finally {
      setIsResolving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this violation record? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to delete the violation
      console.log('Deleting violation:', violationId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Navigate back after deletion
      setTimeout(() => {
        navigate('/admin/violations');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to delete violation');
    } finally {
      setIsDeleting(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case VIOLATION_SEVERITY.CRITICAL: return 'bg-red-100 text-red-800';
      case VIOLATION_SEVERITY.HIGH: return 'bg-orange-100 text-orange-800';
      case VIOLATION_SEVERITY.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case VIOLATION_SEVERITY.LOW: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getTypeLabel = (type) => {
    return VIOLATION_TYPES[type] || type.replace('_', ' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Violation Details</h1>
        </div>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="text-center py-12">
            <ShieldAlert size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Violation Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              The requested violation record could not be found.
            </p>
            <Button onClick={handleGoBack} variant="outline" className="mt-4">
              Back to Violations
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={handleGoBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Violation Details</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Detailed view of violation {violation.id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {violation.status === 'unresolved' && (
            <Button 
              variant="primary" 
              startIcon={<Check size={16} />} 
              onClick={handleResolve}
              disabled={isResolving}
            >
              {isResolving ? 'Resolving...' : 'Resolve Violation'}
            </Button>
          )}
          {hasPermission('violations.manage') && (
            <Button 
              variant="outline" 
              startIcon={<Trash2 size={16} />} 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
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
            <span>Violation resolved successfully!</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Violation Overview */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Violation Overview</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Basic information about this violation
                </p>
              </div>
              
              <div className="flex gap-2">
                <Badge className={getSeverityColor(violation.severity)}>
                  {violation.severity.replace('_', ' ')}
                </Badge>
                <Badge className={getStatusColor(violation.status)}>
                  {violation.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <ShieldAlert size={16} className="inline mr-2" />
                    Violation Type
                  </label>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {getTypeLabel(violation.type)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar size={16} className="inline mr-2" />
                    Violation Time
                  </label>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {new Date(violation.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText size={16} className="inline mr-2" />
                  Description
                </label>
                <div className="text-gray-900 dark:text-white">
                  {violation.description}
                </div>
              </div>
            </div>
          </Card>

          {/* User Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h3>
            
            {relatedUser ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
                  {relatedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <User size={16} className="inline mr-2" />
                        Name
                      </label>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {relatedUser.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {relatedUser.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <Badge className="bg-blue-100 text-blue-800">
                        {relatedUser.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        User ID
                      </label>
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {relatedUser.id}
                      </code>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Status
                      </label>
                      <Badge className={relatedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {relatedUser.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                User information not available
              </div>
            )}
          </Card>

          {/* Assessment Information */}
          {violation.assessmentId && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assessment Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assessment Title
                  </label>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {violation.assessmentTitle}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assessment ID
                  </label>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {violation.assessmentId}
                  </code>
                </div>
              </div>
              
              {relatedAssessment && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Domain
                  </label>
                  <Badge className="bg-purple-100 text-purple-800">
                    {relatedAssessment.domain}
                  </Badge>
                </div>
              )}
            </Card>
          )}

          {/* Evidence */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Evidence & Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Eye size={16} className="inline mr-2" />
                  Evidence
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  {violation.evidence}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    IP Address
                  </label>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {violation.ipAddress || 'Not available'}
                  </code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User Agent
                  </label>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded truncate">
                    {violation.userAgent || 'Not available'}
                  </code>
                </div>
              </div>

              {violation.additionalData && Object.keys(violation.additionalData).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Data
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
                    {Object.entries(violation.additionalData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">{key}:</span>
                        <span className="text-gray-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Resolution Section (only show for unresolved violations) */}
          {violation.status === 'unresolved' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resolve Violation
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resolution Notes *
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Describe the resolution and any actions taken"
                    rows={4}
                    className="textarea textarea-primary w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action Taken
                  </label>
                  <select
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    className="select select-primary w-full"
                  >
                    <option value="">Select an action</option>
                    <option value="Warning issued">Warning issued</option>
                    <option value="Assessment locked">Assessment locked for user</option>
                    <option value="Restriction applied">Restriction applied</option>
                    <option value="Account suspended">Account suspended</option>
                    <option value="Investigation required">Investigation required</option>
                    <option value="False positive">False positive - dismissed</option>
                    <option value="Other">Other action taken</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="primary" 
                    startIcon={<Check size={16} />} 
                    onClick={handleResolve}
                    disabled={isResolving || !resolutionNotes}
                  >
                    {isResolving ? 'Resolving...' : 'Resolve Violation'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Resolution History (only show for resolved violations) */}
          {violation.status === 'resolved' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resolution History
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resolved By
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {violation.resolvedBy || 'System'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resolved At
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {violation.resolvedAt ? new Date(violation.resolvedAt).toLocaleString() : 'Not specified'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action Taken
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {violation.actionTaken || 'No action specified'}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Violation ID</span>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 p-1 rounded">{violation.id}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Severity</span>
                <Badge className={getSeverityColor(violation.severity)}>
                  {violation.severity.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                <Badge className={getStatusColor(violation.status)}>
                  {violation.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {getTypeLabel(violation.type)}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Related Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Actions</h3>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" startIcon={<User size={16} />}>
                View User Profile
              </Button>
              {relatedAssessment && (
                <Button variant="outline" className="w-full justify-start" startIcon={<FileText size={16} />}>
                View Assessment
              </Button>
              )}
              <Button variant="outline" className="w-full justify-start" startIcon={<ExternalLink size={16} />}>
                View Evidence Files
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                startIcon={<Edit2 size={16} />}
              >
                Edit Details
              </Button>
              {violation.status === 'unresolved' && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-green-600"
                  startIcon={<Check size={16} />}
                  onClick={handleResolve}
                >
                  Resolve Now
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleGoBack}
                startIcon={<ArrowLeft size={16} />}
              >
                Back to List
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetail;