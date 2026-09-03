import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useForm } from '../../hooks/useForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { ArrowLeft, Upload, Database, Archive, Calendar, Clock, Check, X, AlertTriangle, FileText, Tag, ShieldCheck } from 'lucide-react';

const BackupForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading } = useData();
  const { hasPermission } = usePermissions();
  const { backupId } = useParams();
  
  const isEditMode = Boolean(backupId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form initial values
  const initialValues = {
    name: '',
    description: '',
    type: 'manual',
    components: ['users', 'courses', 'assessments', 'results', 'settings'],
    isEncrypted: true,
    encryptionPassword: '',
    compressionLevel: 'medium'
  };

  // Form validation
  const validators = {
    name: (value) => {
      if (!value) return 'Backup name is required';
      if (value.length < 3) return 'Name must be at least 3 characters';
      if (value.length > 100) return 'Name must be less than 100 characters';
      return '';
    },
    description: (value) => {
      if (!value) return 'Description is required';
      if (value.length < 10) return 'Description must be at least 10 characters';
      if (value.length > 500) return 'Description must be less than 500 characters';
      return '';
    },
    encryptionPassword: (value) => {
      if (values.isEncrypted && !value) return 'Encryption password is required';
      if (values.isEncrypted && value.length < 8) return 'Password must be at least 8 characters';
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
      // In a real app, this would call a service to save the backup metadata
      console.log('Saving backup:', formValues);
      
      // If file is present, handle upload
      if (file && !isEditMode) {
        await handleFileUpload();
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Navigate back to backups list after a short delay
      setTimeout(() => {
        navigate('/admin/backups');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to save backup');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  });

  const handleCancel = () => {
    navigate('/admin/backups');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file extension
    const validExtensions = ['.zip', '.tar', '.gz', '.backup'];
    const fileName = selectedFile.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      setError('Please upload a valid backup file (ZIP, TAR, GZ, BACKUP)');
      return;
    }
    
    // Check file size (max 2GB for demo)
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (selectedFile.size > maxSize) {
      setError('File size exceeds maximum limit of 2GB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Update name if not set
    if (!values.name) {
      const nameWithoutExtension = selectedFile.name.replace(/\.[^\.]+$/, '');
      setFormValues({ name: nameWithoutExtension });
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
  };

  const handleComponentToggle = (component) => {
    const currentComponents = values.components || [];
    const newComponents = currentComponents.includes(component)
      ? currentComponents.filter(c => c !== component)
      : [...currentComponents, component];
    
    setFormValues({ components: newComponents });
  };

  const componentOptions = [
    { value: 'users', label: 'Users', description: 'User accounts and profiles' },
    { value: 'courses', label: 'Courses', description: 'Course content and structure' },
    { value: 'assessments', label: 'Assessments', description: 'Assessment questions and settings' },
    { value: 'results', label: 'Results', description: 'Assessment results and grades' },
    { value: 'attendance', label: 'Attendance', description: 'Attendance records' },
    { value: 'violations', label: 'Violations', description: 'Violation and restriction data' },
    { value: 'settings', label: 'Settings', description: 'System settings and configuration' },
    { value: 'audit_logs', label: 'Audit Logs', description: 'Audit log history' },
    { value: 'all', label: 'All Data', description: 'Complete system backup' }
  ];

  const handleSelectAllComponents = () => {
    setFormValues({ components: ['all'] });
  };

  const handleDeselectAllComponents = () => {
    setFormValues({ components: [] });
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Backup' : 'Upload Backup'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditMode ? 'Edit backup metadata' : 'Upload a backup file to the system'}
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
            disabled={!isValid || isSubmitting || (!isEditMode && !file) || isUploading}
            startIcon={isSubmitting ? <LoadingSpinner size="sm" /> : (isUploading ? <Clock size={16} /> : <Upload size={16} />)}
          >
            {isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : isEditMode ? 'Save Changes' : 'Upload Backup'}
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
            <span>Backup uploaded successfully!</span>
          </div>
        </Card>
      )}

      {isUploading && (
        <Card>
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-blue-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">Uploading Backup</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{file?.name}</div>
            </div>
            <div className="w-64">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-center mt-1">{uploadProgress}%</div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* File Upload */}
          {!isEditMode && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Upload</h3>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {file ? (
                  <div className="mb-4">
                    <Database size={48} className="mx-auto text-blue-600" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                      Drag & drop backup file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Supported formats: .zip, .tar, .gz, .backup
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".zip,.tar,.gz,.backup"
                />
                
                <label htmlFor="file-upload">
                  <Button 
                    variant="primary" 
                    startIcon={<Upload size={16} />} 
                    className="cursor-pointer"
                  >
                    {file ? 'Change File' : 'Select Backup File'}
                  </Button>
                </label>
                
                {file && (
                  <div className="mt-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      startIcon={<X size={16} />} 
                      onClick={() => setFile(null)}
                      className="text-red-600"
                    >
                      Remove File
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Backup Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Backup Information
            </h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText size={16} className="inline mr-2" />
                  Backup Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter backup name (e.g., 'Pre-Assessment Update Backup')"
                  className={`input input-primary w-full ${touched.name && errors.name ? 'input-error' : ''}`}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Backup Type
                </label>
                <select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                  disabled={isEditMode}
                >
                  <option value="manual">Manual Backup</option>
                  <option value="automatic">Automatic Backup</option>
                  <option value="archive">Archive Backup</option>
                  <option value="full">Full System Backup</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe the purpose and contents of this backup"
                  rows={4}
                  className={`textarea textarea-primary w-full ${touched.description && errors.description ? 'textarea-error' : ''}`}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Components to Backup */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Components to Include
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select which data components to include in this backup
              </p>
              
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  startIcon={<Check size={14} />} 
                  onClick={handleSelectAllComponents}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  startIcon={<X size={14} />} 
                  onClick={handleDeselectAllComponents}
                >
                  Clear Selection
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {componentOptions.map(option => {
                  const isSelected = values.components.includes(option.value);
                  const isAllSelected = values.components.includes('all');
                  
                  return (
                    <div 
                      key={option.value}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected || isAllSelected
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleComponentToggle(option.value)}
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected || isAllSelected}
                          onChange={() => {}}
                          className="checkbox checkbox-primary"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Encryption Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Encryption & Security
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.isEncrypted}
                    onChange={(e) => setFormValues({ isEncrypted: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Encryption
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable encryption for enhanced security. Encrypted backups require a password to restore.
              </p>

              {values.isEncrypted && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <ShieldCheck size={16} className="inline mr-2" />
                    Encryption Password *
                  </label>
                  <input
                    type="password"
                    name="encryptionPassword"
                    value={values.encryptionPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter encryption password"
                    className={`input input-primary w-full ${touched.encryptionPassword && errors.encryptionPassword ? 'input-error' : ''}`}
                  />
                  {touched.encryptionPassword && errors.encryptionPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.encryptionPassword}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Compression Level
                </label>
                <select
                  name="compressionLevel"
                  value={values.compressionLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  <option value="none">No Compression</option>
                  <option value="low">Low Compression (Fast)</option>
                  <option value="medium">Medium Compression (Balanced)</option>
                  <option value="high">High Compression (Slow)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting || (!isEditMode && !file) || isUploading}
              startIcon={isSubmitting ? <LoadingSpinner size="sm" /> : (isUploading ? <Clock size={16} /> : <Upload size={16} />)}
              size="lg"
            >
              {isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : isEditMode ? 'Save Changes' : 'Upload Backup'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Backup Preview */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup Preview</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                {file ? (
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                    <Archive size={32} className="text-blue-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Database size={32} className="text-gray-500" />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Name</span>
                  <span className="font-medium text-gray-900 dark:text-white truncate max-w-40">{values.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Type</span>
                  <Badge className="bg-blue-100 text-blue-800">{values.type.replace('_', ' ')}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Components</span>
                  <span className="font-medium text-gray-900 dark:text-white">{values.components.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Encryption</span>
                  <Badge className={values.isEncrypted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {values.isEncrypted ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                {file && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">File Size</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Backup Statistics */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Components Selected</span>
                <span className="font-bold text-blue-600">{values.components.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Estimated Size</span>
                <span className="font-bold text-green-600">~{values.components.length * 50} MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Security Level</span>
                <Badge className={values.isEncrypted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {values.isEncrypted ? 'Secure' : 'Standard'}
                </Badge>
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
                Save & Create Another
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
                Backup files will be stored securely in the system.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For large databases, consider using compression to reduce file size.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackupForm;