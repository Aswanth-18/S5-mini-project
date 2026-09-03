import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useForm } from '../../hooks/useForm';
import { ROLES, CYBER_DOMAINS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, User, Mail, ShieldCheck, Calendar, Hash, AlertTriangle, Check, X } from 'lucide-react';

const FacultyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { faculty, isLoading } = useData();
  const { hasPermission } = usePermissions();
  const { facultyId } = useParams();
  
  const isEditMode = Boolean(facultyId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get faculty member if editing
  const facultyMember = faculty.find(f => f.id === facultyId);

  // Form initial values
  const initialValues = {
    name: facultyMember?.name || '',
    email: facultyMember?.email || '',
    domain: facultyMember?.domain || '',
    department: facultyMember?.department || '',
    bio: facultyMember?.bio || '',
    phone: facultyMember?.phone || '',
    status: facultyMember?.status || 'active',
    role: facultyMember?.role || ROLES.FACULTY,
    permissions: facultyMember?.permissions || []
  };

  // Form validation
  const validators = {
    name: (value) => {
      if (!value) return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      if (value.length > 100) return 'Name must be less than 100 characters';
      return '';
    },
    email: (value) => {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
      return '';
    },
    domain: (value) => {
      if (!value) return 'Domain is required';
      if (!CYBER_DOMAINS.includes(value)) return 'Please select a valid domain';
      return '';
    },
    phone: (value) => {
      if (value && !/^[\d\s\-\+\(\)]{10,20}$/.test(value)) {
        return 'Please enter a valid phone number';
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
      // In a real app, this would call a service to save the faculty member
      // For now, we'll simulate the API call
      console.log('Saving faculty member:', formValues);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Navigate back to faculty list after a short delay
      setTimeout(() => {
        navigate('/admin/faculty');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to save faculty member');
    } finally {
      setIsSubmitting(false);
    }
  });

  // Set form values when faculty member changes (for edit mode)
  useEffect(() => {
    if (facultyMember && isEditMode) {
      setFormValues({
        name: facultyMember.name || '',
        email: facultyMember.email || '',
        domain: facultyMember.domain || '',
        department: facultyMember.department || '',
        bio: facultyMember.bio || '',
        phone: facultyMember.phone || '',
        status: facultyMember.status || 'active',
        role: facultyMember.role || ROLES.FACULTY,
        permissions: facultyMember.permissions || []
      });
    }
  }, [facultyMember, isEditMode, setFormValues]);

  const handleCancel = () => {
    navigate('/admin/faculty');
  };

  const handlePermissionToggle = (permission) => {
    const currentPermissions = values.permissions || [];
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    
    setFormValues({ permissions: newPermissions });
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Available permissions for faculty
  const facultyPermissions = [
    'courses.view',
    'courses.create', 
    'courses.edit',
    'courses.delete',
    'practice.view',
    'practice.manage',
    'assessment.view',
    'assessment.create',
    'assessment.manage',
    'assessment.review',
    'results.view',
    'results.manage',
    'attendance.view',
    'attendance.manage',
    'schedule.view',
    'schedule.manage',
    'violations.view',
    'violations.manage'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Faculty Member' : 'Add New Faculty Member'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditMode ? `Editing ${facultyMember?.name || 'faculty member'}` : 'Create a new faculty member account'}
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
            {isSubmitting ? 'Saving...' : 'Save Faculty'}
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
            <span>Faculty member saved successfully!</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={16} className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter full name"
                  className={`input input-primary w-full ${touched.name && errors.name ? 'input-error' : ''}`}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail size={16} className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter email address"
                  className={`input input-primary w-full ${touched.email && errors.email ? 'input-error' : ''}`}
                />
                {touched.email && errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter phone number"
                  className={`input input-primary w-full ${touched.phone && errors.phone ? 'input-error' : ''}`}
                />
                {touched.phone && errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Biography
                </label>
                <textarea
                  name="bio"
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter a brief biography"
                  rows={3}
                  className="textarea textarea-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optional description of the faculty member</p>
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Information</h3>
            
            <div className="space-y-4">
              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <ShieldCheck size={16} className="inline mr-2" />
                  Cybersecurity Domain *
                </label>
                <select
                  name="domain"
                  value={values.domain}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${touched.domain && errors.domain ? 'select-error' : ''}`}
                >
                  <option value="">Select a domain</option>
                  {CYBER_DOMAINS.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                {touched.domain && errors.domain && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.domain}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter department name"
                  className="input input-primary w-full"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={16} className="inline mr-2" />
                  Status *
                </label>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
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
              {isSubmitting ? 'Saving...' : 'Save Faculty'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Role */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role & Access</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Role
                </label>
                <select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className="select select-primary w-full"
                >
                  <option value={ROLES.FACULTY}>Faculty</option>
                  <option value={ROLES.ADMIN}>Administrator</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Permissions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permissions</h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {facultyPermissions.map(permission => {
                const isEnabled = values.permissions?.includes(permission);
                return (
                  <div 
                    key={permission} 
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isEnabled ? 'bg-primary/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handlePermissionToggle(permission)}
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handlePermissionToggle(permission)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {permission.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                );
              })}
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
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;