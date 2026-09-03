import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useForm } from '../../hooks/useForm';
import { ROLES, RESTRICTION_TYPES, RESTRICTION_SEVERITY } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { ArrowLeft, User, ShieldAlert, AlertTriangle, Calendar, Clock, Check, X, Hash, FileText, Clock as ClockIcon } from 'lucide-react';

const RestrictionForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { restrictions, users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  const { restrictionId } = useParams();
  
  const isEditMode = Boolean(restrictionId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get restriction if editing
  const restriction = restrictions.find(r => r.id === restrictionId);

  // Form initial values
  const initialValues = {
    userId: restriction?.userId || '',
    type: restriction?.type || '',
    severity: restriction?.severity || RESTRICTION_SEVERITY.MEDIUM,
    reason: restriction?.reason || '',
    details: restriction?.details || '',
    expiresAt: restriction?.expiresAt || '',
    permanent: restriction?.permanent || false,
    createdBy: restriction?.createdBy || user?.id || ''
  };

  // Form validation
  const validators = {
    userId: (value) => {
      if (!value) return 'User is required';
      return '';
    },
    type: (value) => {
      if (!value) return 'Restriction type is required';
      if (!Object.keys(RESTRICTION_TYPES).includes(value)) return 'Please select a valid restriction type';
      return '';
    },
    severity: (value) => {
      if (!value) return 'Severity is required';
      if (!Object.keys(RESTRICTION_SEVERITY).includes(value)) return 'Please select a valid severity';
      return '';
    },
    reason: (value) => {
      if (!value) return 'Reason is required';
      if (value.length < 10) return 'Reason must be at least 10 characters';
      if (value.length > 500) return 'Reason must be less than 500 characters';
      return '';
    },
    expiresAt: (value) => {
      if (value && !isEditMode) {
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Please enter a valid date';
        if (date <= new Date()) return 'Expiration date must be in the future';
      }
      return '';
    }
  };

  const { 
    values, 
    errors, 
    touched, 
    isValid,
    handleChange, 
    handleBlur, 
    handleSubmit,
    setFormValues,
    resetForm 
  } = useForm(initialValues, validators, async (formValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to save the restriction
      // For now, we'll simulate the API call
      console.log('Saving restriction:', formValues);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Navigate back to restrictions list after a short delay
      setTimeout(() => {
        navigate('/admin/restrictions');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to save restriction');
    } finally {
      setIsSubmitting(false);
    }
  });

  // Set form values when restriction changes (for edit mode)
  useEffect(() => {
    if (restriction && isEditMode) {
      setFormValues({
        userId: restriction.userId || '',
        type: restriction.type || '',
        severity: restriction.severity || RESTRICTION_SEVERITY.MEDIUM,
        reason: restriction.reason || '',
        details: restriction.details || '',
        expiresAt: restriction.expiresAt || '',
        permanent: restriction.permanent || false,
        createdBy: restriction.createdBy || user?.id || ''
      });
    }
  }, [restriction, isEditMode, setFormValues, user?.id]);

  const handleCancel = () => {
    navigate('/admin/restrictions');
  };

  const handlePermanentToggle = () => {
    const newPermanent = !values.permanent;
    setFormValues({
      permanent: newPermanent,
      expiresAt: newPermanent ? '' : values.expiresAt
    });
  };

  // Get user info for display
  const selectedUser = allUsers.find(u => u.id === values.userId);

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Filter out admin users for restriction targets
  const restrictedUsers = allUsers.filter(u => u.role !== ROLES.ADMIN);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Restriction' : 'Add New Restriction'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditMode ? `Editing restriction #${restriction?.id || ''}` : 'Create a new access restriction'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            startIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <Check size={16} />}
          >
            {isSubmitting ? 'Saving...' : 'Save Restriction'}
          </Button>
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
            <span>Restriction saved successfully!</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* User Selection */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Target User
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={16} className="inline mr-2" />
                  Select User *
                </label>
                <select
                  name="userId"
                  value={values.userId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${touched.userId && errors.userId ? 'select-error' : ''}`}
                >
                  <option value="">Select a user</option>
                  {restrictedUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
                {touched.userId && errors.userId && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.userId}</p>
                )}
              </div>

              {/* User Info Display */}
              {selectedUser && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{selectedUser.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.email}</div>
                    </div>
                    <Badge className={`bg-${selectedUser.role === ROLES.STUDENT ? 'blue' : 'green'}-100 text-${selectedUser.role === ROLES.STUDENT ? 'blue' : 'green'}-800`}>
                      {selectedUser.role.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Restriction Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Restriction Details
            </h3>
            
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <ShieldAlert size={16} className="inline mr-2" />
                  Restriction Type *
                </label>
                <select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${touched.type && errors.type ? 'select-error' : ''}`}
                >
                  <option value="">Select restriction type</option>
                  {Object.entries(RESTRICTION_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {touched.type && errors.type && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.type}</p>
                )}
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <AlertTriangle size={16} className="inline mr-2" />
                  Severity Level *
                </label>
                <select
                  name="severity"
                  value={values.severity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${touched.severity && errors.severity ? 'select-error' : ''}`}
                >
                  {Object.entries(RESTRICTION_SEVERITY).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {touched.severity && errors.severity && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.severity}</p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText size={16} className="inline mr-2" />
                  Reason *
                </label>
                <textarea
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Explain why this restriction is being applied"
                  rows={3}
                  className={`textarea textarea-primary w-full ${touched.reason && errors.reason ? 'textarea-error' : ''}`}
                />
                {touched.reason && errors.reason && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Details
                </label>
                <textarea
                  name="details"
                  value={values.details}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Any additional information about this restriction"
                  rows={3}
                  className="textarea textarea-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optional</p>
              </div>
            </div>
          </Card>

          {/* Duration */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Duration
            </h3>
            
            <div className="space-y-4">
              {/* Permanent Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.permanent}
                    onChange={handlePermanentToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permanent Restriction
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check this if the restriction should never expire
              </p>

              {/* Expiration Date */}
              {!values.permanent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar size={16} className="inline mr-2" />
                    Expiration Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={values.expiresAt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`input input-primary w-full ${touched.expiresAt && errors.expiresAt ? 'input-error' : ''}`}
                  />
                  {touched.expiresAt && errors.expiresAt && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.expiresAt}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Leave blank to set as permanent
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              startIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <Check size={16} />}
              size="lg"
            >
              {isSubmitting ? 'Saving...' : 'Save Restriction'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Restriction Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Restriction Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {values.type ? RESTRICTION_TYPES[values.type] : 'Not selected'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Severity</span>
                <Badge className={`{
                  values.severity === RESTRICTION_SEVERITY.CRITICAL ? 'bg-red-100 text-red-800' :
                  values.severity === RESTRICTION_SEVERITY.HIGH ? 'bg-orange-100 text-orange-800' :
                  values.severity === RESTRICTION_SEVERITY.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {values.severity || 'Not selected'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Duration</span>
                <span className="text-sm font-medium">
                  {values.permanent ? 'Permanent' : (values.expiresAt ? new Date(values.expiresAt).toLocaleDateString() : 'Not set')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">User</span>
                <span className="text-sm font-medium truncate max-w-32">
                  {selectedUser?.name || 'Not selected'}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                startIcon={<Check size={16} />}
              >
                Save & Continue
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleCancel}
                startIcon={<X size={16} />}
              >
                Discard Changes
              </Button>
            </div>
          </Card>

          {/* Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information</h3>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Restrictions limit user access to certain features or content.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use restrictions for violations, temporary limitations, or permanent access revocations.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RestrictionForm;