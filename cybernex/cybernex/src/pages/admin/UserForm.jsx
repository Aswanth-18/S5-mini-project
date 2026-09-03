import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useForm } from '../../hooks/useForm';
import { ROLES, LEVELS, DEPARTMENTS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, ArrowLeft, Save, X, Eye, EyeOff, Shield, Mail, User, Building, Calendar } from 'lucide-react';

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, createUser, updateUser, isLoading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  // Form validation
  const validators = {
    name: (value) => {
      if (!value || value.trim() === '') return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      if (value.length > 50) return 'Name must be less than 50 characters';
      return '';
    },
    email: (value) => {
      if (!value || value.trim() === '') return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      // Check if email already exists (for new users)
      if (!userId && users.some(u => u.email === value)) {
        return 'Email already exists';
      }
      return '';
    },
    password: (value, values) => {
      if (userId && !value) return ''; // Password not required for updates
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    },
    confirmPassword: (value, values) => {
      if (userId && !value) return ''; // Password not required for updates
      if (!value) return 'Please confirm your password';
      if (value !== values.password) return 'Passwords do not match';
      return '';
    },
    role: (value) => {
      if (!value) return 'Role is required';
      return '';
    }
  };

  // Form initial values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.STUDENT,
    department: '',
    phone: '',
    bio: '',
    avatar: '',
    status: 'active',
    level: 1,
    xp: 0,
    securityScore: 0
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, setFormValues, resetForm, isValid } = useForm(
    initialValues,
    validators,
    async (formValues) => {
      setIsSubmitting(true);
      
      try {
        // Prepare user data
        const userData = {
          name: formValues.name,
          email: formValues.email,
          role: formValues.role,
          department: formValues.department || null,
          phone: formValues.phone || null,
          bio: formValues.bio || null,
          avatar: formValues.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formValues.name}`,
          status: formValues.status,
          level: parseInt(formValues.level) || 1,
          xp: parseInt(formValues.xp) || 0,
          securityScore: parseInt(formValues.securityScore) || 0,
          joinDate: userId ? existingUser?.joinDate || new Date().toISOString() : new Date().toISOString(),
          lastActive: new Date().toISOString(),
          progress: {
            overall: 0,
            courses: { completed: [], inProgress: [], grades: {} },
            labs: { completed: [], inProgress: [] },
            assessments: { completed: [], inProgress: [] }
          },
          certificates: [],
          achievements: [],
          enrolledCourses: [],
          permissions: []
        };
        
        // Only include password for new users
        if (!userId) {
          userData.password = formValues.password;
        }
        
        // Add createdBy for new users
        if (!userId) {
          userData.createdBy = user?.id || 'system';
        }
        
        // Update or create user
        if (userId) {
          await updateUser(userId, userData);
        } else {
          await createUser(userData);
        }
        
        // Redirect to users list
        navigate('/admin/users');
        
      } catch (error) {
        console.error('Error saving user:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  // Load existing user data
  useEffect(() => {
    if (userId && users.length > 0) {
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setExistingUser(foundUser);
        setFormValues({
          name: foundUser.name || '',
          email: foundUser.email || '',
          password: '',
          confirmPassword: '',
          role: foundUser.role || ROLES.STUDENT,
          department: foundUser.department || '',
          phone: foundUser.phone || '',
          bio: foundUser.bio || '',
          avatar: foundUser.avatar || '',
          status: foundUser.status || 'active',
          level: foundUser.level || 1,
          xp: foundUser.xp || 0,
          securityScore: foundUser.securityScore || 0
        });
      } else {
        // User not found, redirect to 404 or users list
        navigate('/admin/users');
      }
    }
  }, [userId, users, setFormValues, navigate]);

  if (isLoading && userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="outline" startIcon={<ArrowLeft size={16} />}>
              Back to Users
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userId ? 'Edit User' : 'Add New User'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {userId ? `Editing user: ${existingUser?.name}` : 'Create a new user account'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter full name"
                  className={`input input-primary w-full ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter email address"
                  className={`input input-primary w-full ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${errors.role ? 'select-error' : ''}`}
                >
                  <option value="">Select Role</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                  <option value={ROLES.FACULTY}>Faculty</option>
                  <option value={ROLES.STUDENT}>Student</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          </div>

          {/* Authentication */}
          {!userId && (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Authentication
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter password"
                      className={`input input-primary w-full pr-12 ${errors.password ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm password"
                      className={`input input-primary w-full pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter phone number"
                  className="input input-primary w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                placeholder="Enter a short bio..."
                className="input input-primary w-full"
              />
            </div>
          </div>

          {/* Progress & Settings */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progress & Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={values.level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  {Array.from({ length: Object.keys(LEVELS).length }, (_, i) => i + 1).map(level => (
                    <option key={level} value={level}>{LEVELS[level] || `Level ${level}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  XP
                </label>
                <input
                  type="number"
                  name="xp"
                  value={values.xp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="XP"
                  className="input input-primary w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Security Score
                </label>
                <input
                  type="number"
                  name="securityScore"
                  value={values.securityScore}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  max="100"
                  placeholder="0-100"
                  className="input input-primary w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={values.avatar}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter avatar URL or leave blank for auto-generated"
                className="input input-primary w-full"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/users')}
              startIcon={<X size={16} />}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting || !isValid}
              startIcon={<Save size={16} />}
              isLoading={isSubmitting}
            >
              {userId ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Creation Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <User size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">User Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                All fields marked with * are required. Provide accurate information for proper user management.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Email Guidelines</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use valid email addresses. Each email must be unique across all users.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Password Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Passwords must be at least 8 characters long. Students will use these to access the platform.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserForm;