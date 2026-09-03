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
import Badge from '../../components/common/Badge';
import { ArrowLeft, Upload, FileText, Image, Database, Code, Folder, Hash, Tag, User, AlertTriangle, Check, X } from 'lucide-react';

const AssetForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading } = useData();
  const { hasPermission } = usePermissions();
  const { assetId } = useParams();
  
  const isEditMode = Boolean(assetId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Mock existing asset for edit mode
  const mockAssets = {
    'ASSET-001': {
      name: 'Cybersecurity Fundamentals PDF',
      type: 'document',
      category: 'course_material',
      extension: 'pdf',
      size: 2.5,
      description: 'Comprehensive guide to cybersecurity fundamentals',
      tags: ['cybersecurity', 'fundamentals', 'beginner'],
      uploadedBy: 'admin',
      isActive: true
    },
    'ASSET-002': {
      name: 'Network Security Diagram',
      type: 'image',
      category: 'diagram',
      extension: 'png',
      size: 1.2,
      description: 'Network security architecture diagram',
      tags: ['network', 'security', 'diagram'],
      uploadedBy: 'faculty-001',
      isActive: true
    }
  };

  const existingAsset = assetId ? mockAssets[assetId] : null;

  // Form initial values
  const initialValues = {
    name: existingAsset?.name || '',
    type: existingAsset?.type || 'document',
    category: existingAsset?.category || 'course_material',
    extension: existingAsset?.extension || '',
    description: existingAsset?.description || '',
    tags: existingAsset?.tags || [],
    domain: existingAsset?.domain || '',
    uploadedBy: user?.id || '',
    isActive: existingAsset?.isActive || true,
    accessLevel: existingAsset?.accessLevel || 'all'
  };

  // Form validation
  const validators = {
    name: (value) => {
      if (!value) return 'Asset name is required';
      if (value.length < 3) return 'Name must be at least 3 characters';
      if (value.length > 100) return 'Name must be less than 100 characters';
      return '';
    },
    type: (value) => {
      if (!value) return 'Asset type is required';
      return '';
    },
    category: (value) => {
      if (!value) return 'Category is required';
      return '';
    },
    description: (value) => {
      if (!value) return 'Description is required';
      if (value.length < 10) return 'Description must be at least 10 characters';
      if (value.length > 500) return 'Description must be less than 500 characters';
      return '';
    },
    file: (value) => {
      if (!isEditMode && !value) return 'Please upload a file';
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
      // In a real app, this would call a service to save the asset
      console.log('Saving asset:', formValues, file);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Navigate back to assets list after a short delay
      setTimeout(() => {
        navigate('/admin/assets');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to save asset');
    } finally {
      setIsSubmitting(false);
    }
  });

  // Set form values when asset changes (for edit mode)
  useEffect(() => {
    if (existingAsset) {
      setFormValues({
        name: existingAsset.name,
        type: existingAsset.type,
        category: existingAsset.category,
        extension: existingAsset.extension,
        description: existingAsset.description,
        tags: existingAsset.tags,
        domain: existingAsset.domain,
        uploadedBy: user?.id || '',
        isActive: existingAsset.isActive,
        accessLevel: existingAsset.accessLevel || 'all'
      });
    }
  }, [existingAsset, setFormValues, user?.id]);

  const handleCancel = () => {
    navigate('/admin/assets');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Update extension
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    setFormValues({ 
      extension,
      name: selectedFile.name.replace('.' + extension, '') // Remove extension from name
    });
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleTagAdd = (tag) => {
    if (!tag || values.tags.includes(tag)) return;
    setFormValues({ tags: [...values.tags, tag] });
  };

  const handleTagRemove = (tagToRemove) => {
    setFormValues({ 
      tags: values.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = e.target.value.trim().toLowerCase();
      if (tag && !values.tags.includes(tag)) {
        handleTagAdd(tag);
        e.target.value = '';
      }
    }
  };

  const assetTypes = [
    { value: 'document', label: 'Document (PDF, DOCX, etc.)' },
    { value: 'image', label: 'Image (PNG, JPG, SVG, etc.)' },
    { value: 'video', label: 'Video (MP4, MOV, etc.)' },
    { value: 'lab', label: 'Lab Environment (ZIP, etc.)' },
    { value: 'code', label: 'Code/Script' },
    { value: 'other', label: 'Other' }
  ];

  const assetCategories = [
    { value: 'course_material', label: 'Course Material' },
    { value: 'practice', label: 'Practice Lab' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'template', label: 'Template' },
    { value: 'diagram', label: 'Diagram' },
    { value: 'assessment', label: 'Assessment Resource' },
    { value: 'reference', label: 'Reference Material' }
  ];

  const accessLevels = [
    { value: 'all', label: 'All Users' },
    { value: 'students', label: 'Students Only' },
    { value: 'faculty', label: 'Faculty Only' },
    { value: 'admin', label: 'Administrators Only' }
  ];

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
              {isEditMode ? 'Edit Asset' : 'Upload New Asset'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditMode ? `Editing ${existingAsset?.name || 'asset'}` : 'Upload a new learning resource or file'}
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
            disabled={!isValid || isSubmitting || (!isEditMode && !file)}
            startIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <Upload size={16} />}
          >
            {isSubmitting ? 'Uploading...' : isEditMode ? 'Save Changes' : 'Upload Asset'}
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
            <span>Asset saved successfully!</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* File Upload */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Upload</h3>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              {filePreview ? (
                <div className="mb-4">
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  {getUploadIcon()}
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                    {file ? file.name : 'Drag & drop file here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Supported formats: PDF, DOCX, PNG, JPG, MP4, ZIP, etc.
                  </p>
                </div>
              )}
              
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.svg,.mp4,.mov,.zip,.rar"
              />
              
              <label htmlFor="file-upload">
                <Button 
                  variant="primary" 
                  startIcon={<Upload size={16} />}
                  className="cursor-pointer"
                >
                  {file ? 'Change File' : 'Select File'}
                </Button>
              </label>
              
              {file && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{file.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      startIcon={<X size={14} />} 
                      onClick={() => {
                        setFile(null);
                        setFilePreview(null);
                        setFormValues({ extension: '', name: values.name });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Asset Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asset Details</h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText size={16} className="inline mr-2" />
                  Asset Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter asset name"
                  className={`input input-primary w-full ${touched.name && errors.name ? 'input-error' : ''}`}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Asset Type *
                  </label>
                  <select
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`select select-primary w-full ${touched.type && errors.type ? 'select-error' : ''}`}
                  >
                    {assetTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {touched.type && errors.type && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`select select-primary w-full ${touched.category && errors.category ? 'select-error' : ''}`}
                  >
                    {assetCategories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                  {touched.category && errors.category && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cybersecurity Domain
                </label>
                <select
                  name="domain"
                  value={values.domain}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  <option value="">All Domains</option>
                  {CYBER_DOMAINS.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
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
                  placeholder="Enter a detailed description of this asset"
                  rows={3}
                  className={`textarea textarea-primary w-full ${touched.description && errors.description ? 'textarea-error' : ''}`}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Tag size={16} className="inline mr-2" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {values.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      className="bg-primary text-white flex items-center gap-1"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleTagRemove(tag)}
                        className="hover:text-white/80 transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags and press Enter or comma"
                  onKeyDown={handleTagInputKeyDown}
                  className="input input-primary w-full mt-2"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Separate tags with commas or press Enter
                </p>
              </div>
            </div>
          </Card>

          {/* Access Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={16} className="inline mr-2" />
                  Uploaded By
                </label>
                <input
                  type="text"
                  name="uploadedBy"
                  value={values.uploadedBy}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="User ID"
                  className="input input-primary w-full"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Access Level *
                </label>
                <select
                  name="accessLevel"
                  value={values.accessLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  {accessLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(e) => setFormValues({ isActive: e.target.checked })}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Asset is active and available for download
                </span>
              </label>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting || (!isEditMode && !file)}
              startIcon={isSubmitting ? <LoadingSpinner size="sm" /> : <Upload size={16} />}
              size="lg"
            >
              {isSubmitting ? 'Uploading...' : isEditMode ? 'Save Changes' : 'Upload Asset'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Asset Preview */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asset Preview</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                {filePreview ? (
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    className="w-32 h-32 mx-auto object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    {getUploadIcon(40)}
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
                  <Badge className={getTypeColor()}>{getTypeLabel()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Category</span>
                  <Badge className="bg-blue-100 text-blue-800">{getCategoryLabel()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Size</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Not set'}
                  </span>
                </div>
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
                Supported file types: PDF, DOCX, images, videos, and compressed files.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Maximum file size: 500MB
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  function getUploadIcon(size = 24) {
    switch (values.type) {
      case 'document': return <FileText size={size} className="text-blue-500" />;
      case 'image': return <Image size={size} className="text-purple-500" />;
      case 'video': return <Database size={size} className="text-orange-500" />;
      case 'lab': return <Code size={size} className="text-green-500" />;
      default: return <Upload size={size} className="text-gray-500" />;
    }
  }

  function getTypeColor() {
    switch (values.type) {
      case 'image': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-orange-100 text-orange-800';
      case 'lab': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getTypeLabel() {
    const type = assetTypes.find(t => t.value === values.type);
    return type ? type.label.split(' ')[0] : 'Unknown';
  }

  function getCategoryLabel() {
    const category = assetCategories.find(c => c.value === values.category);
    return category ? category.label : 'Unknown';
  }
};

export default AssetForm;