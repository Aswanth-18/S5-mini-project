import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useForm } from '../../hooks/useForm';
import { LEVELS, CYBER_DOMAINS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { ArrowLeft, Layers, BookOpen, Hash, Calendar, Check, X, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const LevelForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, isLoading } = useData();
  const { hasPermission } = usePermissions();
  const { levelId } = useParams();
  
  const isEditMode = Boolean(levelId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Get level if editing
  const level = LEVELS[levelId];
  
  // Get courses for this level
  const levelCourses = courses.filter(c => c.level === parseInt(levelId));

  // Form initial values
  const initialValues = {
    id: levelId || '',
    name: level || '',
    description: getDefaultDescription(parseInt(levelId)) || '',
    levelNumber: parseInt(levelId) || Object.keys(LEVELS).length + 1,
    difficulty: getDefaultDifficulty(parseInt(levelId)) || 'Medium',
    prerequisites: getDefaultPrerequisites(parseInt(levelId)) || [],
    estimatedHours: getDefaultHours(parseInt(levelId)) || 40,
    isActive: true
  };

  // Form validation
  const validators = {
    name: (value) => {
      if (!value) return 'Level name is required';
      if (value.length < 3) return 'Name must be at least 3 characters';
      if (value.length > 100) return 'Name must be less than 100 characters';
      return '';
    },
    levelNumber: (value) => {
      if (!value) return 'Level number is required';
      if (isNaN(value)) return 'Level number must be a number';
      if (value < 1) return 'Level number must be positive';
      if (value > 20) return 'Level number must be less than 20';
      return '';
    },
    description: (value) => {
      if (!value) return 'Description is required';
      if (value.length < 10) return 'Description must be at least 10 characters';
      if (value.length > 500) return 'Description must be less than 500 characters';
      return '';
    },
    estimatedHours: (value) => {
      if (!value) return 'Estimated hours is required';
      if (isNaN(value)) return 'Estimated hours must be a number';
      if (value < 1) return 'Estimated hours must be positive';
      if (value > 500) return 'Estimated hours must be less than 500';
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
      // In a real app, this would call a service to save the level
      console.log('Saving level:', formValues);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Navigate back to levels list after a short delay
      setTimeout(() => {
        navigate('/admin/levels');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to save level');
    } finally {
      setIsSubmitting(false);
    }
  });

  // Set form values when level changes (for edit mode)
  useEffect(() => {
    if (isEditMode && level) {
      setFormValues({
        id: levelId,
        name: level,
        description: getDefaultDescription(parseInt(levelId)),
        levelNumber: parseInt(levelId),
        difficulty: getDefaultDifficulty(parseInt(levelId)),
        prerequisites: getDefaultPrerequisites(parseInt(levelId)),
        estimatedHours: getDefaultHours(parseInt(levelId)),
        isActive: true
      });
    }
  }, [isEditMode, levelId, level, setFormValues]);

  const getDefaultDescription = (levelId) => {
    const descriptions = {
      1: 'Foundational cybersecurity concepts and basics',
      2: 'Core security fundamentals and principles',
      3: 'Web application security and vulnerabilities',
      4: 'Network security protocols and defense mechanisms',
      5: 'Linux system administration and security',
      6: 'Windows system administration and security',
      7: 'Active Directory configuration and management',
      8: 'Penetration testing methodologies and tools',
      9: 'Security Operations Center monitoring and analysis',
      10: 'Digital forensics investigation and analysis',
      11: 'Cloud computing and DevSecOps security',
      12: 'AI engineering and AI security specialization'
    };
    return descriptions[levelId] || '';
  };

  const getDefaultDifficulty = (levelId) => {
    if (!levelId) return 'Medium';
    if (levelId <= 2) return 'Beginner';
    if (levelId <= 5) return 'Easy';
    if (levelId <= 8) return 'Medium';
    if (levelId <= 10) return 'Hard';
    return 'Expert';
  };

  const getDefaultPrerequisites = (levelId) => {
    if (!levelId) return [];
    const prerequisites = [];
    for (let i = 1; i < levelId; i++) {
      if (LEVELS[i]) {
        prerequisites.push({ id: i, name: LEVELS[i] });
      }
    }
    return prerequisites;
  };

  const getDefaultHours = (levelId) => {
    const hours = {
      1: 20, 2: 20, 3: 40, 4: 40, 5: 60, 6: 60,
      7: 60, 8: 80, 9: 80, 10: 100, 11: 100, 12: 100
    };
    return hours[levelId] || 40;
  };

  const handleCancel = () => {
    navigate('/admin/levels');
  };

  const handlePrerequisiteToggle = (prereqId) => {
    const currentPrereqs = values.prerequisites || [];
    const newPrereqs = currentPrereqs.some(p => p.id === prereqId)
      ? currentPrereqs.filter(p => p.id !== prereqId)
      : [...currentPrereqs, { id: prereqId, name: LEVELS[prereqId] || `Level ${prereqId}` }];
    
    setFormValues({ prerequisites: newPrereqs });
  };

  const availablePrerequisites = [];
  for (let i = 1; i < (values.levelNumber || 1); i++) {
    if (LEVELS[i]) {
      availablePrerequisites.push({ id: i, name: LEVELS[i] });
    }
  }

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
              {isEditMode ? `Edit Level ${levelId}` : 'Add New Learning Level'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditMode ? `Editing ${level || 'level'}` : 'Create a new learning level in the curriculum'}
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
            {isSubmitting ? 'Saving...' : 'Save Level'}
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
            <span>Level saved successfully!</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Level Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Level Information
            </h3>
            
            <div className="space-y-4">
              {/* Level Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Hash size={16} className="inline mr-2" />
                  Level Number *
                </label>
                <input
                  type="number"
                  name="levelNumber"
                  value={values.levelNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter level number"
                  min="1"
                  max="20"
                  className={`input input-primary w-full ${touched.levelNumber && errors.levelNumber ? 'input-error' : ''}`}
                />
                {touched.levelNumber && errors.levelNumber && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.levelNumber}</p>
                )}
              </div>

              {/* Level Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Layers size={16} className="inline mr-2" />
                  Level Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter level name"
                  className={`input input-primary w-full ${touched.name && errors.name ? 'input-error' : ''}`}
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <BookOpen size={16} className="inline mr-2" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter a detailed description of this level"
                  rows={4}
                  className={`textarea textarea-primary w-full ${touched.description && errors.description ? 'textarea-error' : ''}`}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Level Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Level Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={values.difficulty}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="select select-primary w-full"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Clock size={16} className="inline mr-2" />
                  Estimated Hours *
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={values.estimatedHours}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter estimated hours"
                  min="1"
                  max="500"
                  className={`input input-primary w-full ${touched.estimatedHours && errors.estimatedHours ? 'input-error' : ''}`}
                />
                {touched.estimatedHours && errors.estimatedHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.estimatedHours}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Prerequisites */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Prerequisites
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select which levels must be completed before this level can be accessed.
              </p>
              
              {availablePrerequisites.length > 0 ? (
                <div className="space-y-3">
                  {availablePrerequisites.map(prereq => {
                    const isSelected = values.prerequisites?.some(p => p.id === prereq.id);
                    return (
                      <div 
                        key={prereq.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handlePrerequisiteToggle(prereq.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handlePrerequisiteToggle(prereq.id)}
                          className="checkbox checkbox-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {prereq.name} (Level {prereq.id})
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Must be completed first
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Required
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No previous levels available as prerequisites.
                </p>
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
              {isSubmitting ? 'Saving...' : 'Save Level'}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Level Preview */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Level Preview</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl">
                  {values.levelNumber || '?'}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-center">
                  {values.name || 'New Level'}
                </h4>
                <Badge className={`bg-${values.difficulty === 'Expert' ? 'red' : values.difficulty === 'Hard' ? 'orange' : values.difficulty === 'Medium' ? 'yellow' : 'green'}-100 text-${values.difficulty === 'Expert' ? 'red' : values.difficulty === 'Hard' ? 'orange' : values.difficulty === 'Medium' ? 'yellow' : 'green'}-800`}>
                  {values.difficulty || 'Medium'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Estimated Time</span>
                  <span className="font-medium text-gray-900 dark:text-white">{values.estimatedHours || 0} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Prerequisites</span>
                  <span className="font-medium text-gray-900 dark:text-white">{values.prerequisites?.length || 0}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Level Statistics */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Level Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Courses</span>
                <span className="font-bold text-blue-600">{levelCourses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                <Badge className={values.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {values.isActive ? 'Active' : 'Inactive'}
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

export default LevelForm;