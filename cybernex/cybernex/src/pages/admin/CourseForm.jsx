import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useForm } from '../../hooks/useForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Save, X, BookOpen, Code, Clock, Shield, Tag, Edit2, Trash2, Plus, Minus } from 'lucide-react';

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, users, createCourse, updateCourse, isLoading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCourse, setExistingCourse] = useState(null);
  const [lessons, setLessons] = useState([{ id: '1', title: '', duration: 0, description: '' }]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Form validation
  const validators = {
    title: (value) => {
      if (!value || value.trim() === '') return 'Title is required';
      if (value.length < 3) return 'Title must be at least 3 characters';
      if (value.length > 100) return 'Title must be less than 100 characters';
      return '';
    },
    code: (value) => {
      if (!value || value.trim() === '') return 'Course code is required';
      if (value.length > 20) return 'Code must be less than 20 characters';
      // Check if code already exists (for new courses)
      if (!courseId && courses.some(c => c.code === value)) {
        return 'Course code already exists';
      }
      return '';
    },
    description: (value) => {
      if (!value || value.trim() === '') return 'Description is required';
      if (value.length < 10) return 'Description must be at least 10 characters';
      return '';
    },
    domain: (value) => {
      if (!value) return 'Domain is required';
      return '';
    },
    difficulty: (value) => {
      if (!value) return 'Difficulty level is required';
      return '';
    },
    duration: (value) => {
      if (!value) return 'Duration is required';
      if (isNaN(value) || parseFloat(value) <= 0) return 'Duration must be a positive number';
      return '';
    },
    credits: (value) => {
      if (!value) return 'Credits are required';
      if (isNaN(value) || parseInt(value) <= 0) return 'Credits must be a positive number';
      return '';
    }
  };

  // Form initial values
  const initialValues = {
    title: '',
    code: '',
    description: '',
    domain: '',
    difficulty: 'Beginner',
    duration: 0,
    credits: 3,
    prerequisites: [],
    learningObjectives: [],
    status: 'draft',
    featured: false,
    passingScore: 70,
    maxAttempts: 3,
    timeLimit: 0
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, setFormValues, isValid } = useForm(
    initialValues,
    validators,
    async (formValues) => {
      setIsSubmitting(true);
      
      try {
        // Prepare course data
        const courseData = {
          ...formValues,
          id: courseId || `COURSE-${Date.now()}`,
          createdBy: user?.id || 'system',
          createdAt: courseId ? existingCourse?.createdAt || new Date().toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lessons: lessons,
          tags: tags,
          prerequisites: formValues.prerequisites || [],
          learningObjectives: formValues.learningObjectives || [],
          status: formValues.status || 'draft',
          featured: formValues.featured || false,
          passingScore: parseFloat(formValues.passingScore) || 70,
          maxAttempts: parseInt(formValues.maxAttempts) || 3,
          timeLimit: parseInt(formValues.timeLimit) || 0,
          domain: formValues.domain || 'General',
          difficulty: formValues.difficulty || 'Beginner',
          duration: parseFloat(formValues.duration) || 0,
          credits: parseInt(formValues.credits) || 3
        };
        
        // Update or create course
        if (courseId) {
          await updateCourse(courseId, courseData);
        } else {
          await createCourse(courseData);
        }
        
        // Redirect to courses list
        navigate('/admin/courses');
        
      } catch (error) {
        console.error('Error saving course:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  // Load existing course data
  useEffect(() => {
    if (courseId && courses.length > 0) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setExistingCourse(foundCourse);
        setFormValues({
          title: foundCourse.title || '',
          code: foundCourse.code || '',
          description: foundCourse.description || '',
          domain: foundCourse.domain || '',
          difficulty: foundCourse.difficulty || 'Beginner',
          duration: foundCourse.duration || 0,
          credits: foundCourse.credits || 3,
          prerequisites: foundCourse.prerequisites || [],
          learningObjectives: foundCourse.learningObjectives || [],
          status: foundCourse.status || 'draft',
          featured: foundCourse.featured || false,
          passingScore: foundCourse.passingScore || 70,
          maxAttempts: foundCourse.maxAttempts || 3,
          timeLimit: foundCourse.timeLimit || 0
        });
        setLessons(foundCourse.lessons || [{ id: '1', title: '', duration: 0, description: '' }]);
        setTags(foundCourse.tags || []);
      } else {
        // Course not found, redirect to 404 or courses list
        navigate('/admin/courses');
      }
    }
  }, [courseId, courses, setFormValues, navigate]);

  // Handle lesson changes
  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = field === 'duration' ? parseFloat(value) || 0 : value;
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { id: Date.now().toString(), title: '', duration: 0, description: '' }]);
  };

  const removeLesson = (id) => {
    if (lessons.length <= 1) return;
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  // Handle tags
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Domain options
  const domainOptions = [
    'Web Security',
    'Network Security', 
    'Linux',
    'Windows',
    'Active Directory',
    'Forensics',
    'Malware Analysis',
    'Cyber Threat Intelligence',
    'Cloud Security',
    'General'
  ];

  // Difficulty options
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Status options
  const statusOptions = ['draft', 'active', 'archived'];

  if (isLoading && courseId) {
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
        <Link to="/admin/courses">
          <Button variant="outline" startIcon={<ArrowLeft size={16} />}>
            Back to Courses
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {courseId ? 'Edit Course' : 'Create Course'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {courseId ? `Editing course: ${existingCourse?.title}` : 'Create a new course for your platform'}
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
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter course title"
                  className={`input input-primary w-full ${errors.title ? 'input-error' : ''}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., CS-101"
                  className={`input input-primary w-full ${errors.code ? 'input-error' : ''}`}
                />
                {errors.code && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.code}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                placeholder="Enter a detailed description of the course..."
                className={`input input-primary w-full ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Course Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Domain *
                </label>
                <select
                  name="domain"
                  value={values.domain}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${errors.domain ? 'select-error' : ''}`}
                >
                  <option value="">Select Domain</option>
                  {domainOptions.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                {errors.domain && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.domain}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficulty"
                  value={values.difficulty}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`select select-primary w-full ${errors.difficulty ? 'select-error' : ''}`}
                >
                  <option value="">Select Difficulty</option>
                  {difficultyOptions.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.difficulty}</p>
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
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  step="0.5"
                  min="0"
                  className={`input input-primary w-full ${errors.duration ? 'input-error' : ''}`}
                />
                {errors.duration && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credits *
                </label>
                <input
                  type="number"
                  name="credits"
                  value={values.credits}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min="1"
                  max="10"
                  className={`input input-primary w-full ${errors.credits ? 'input-error' : ''}`}
                />
                {errors.credits && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.credits}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={values.passingScore}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="70"
                  min="0"
                  max="100"
                  className="input input-primary w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Attempts
                </label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={values.maxAttempts}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="3"
                  min="1"
                  className="input input-primary w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Limit (minutes) - 0 for no limit
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={values.timeLimit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min="0"
                  className="input input-primary w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={values.featured}
                  onChange={(e) => setFormValues({ ...values, featured: e.target.checked })}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured Course
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tags
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
                className="input input-primary flex-1"
              />
              <Button onClick={addTag} variant="primary" startIcon={<Plus size={16} />}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No tags added</p>
              )}
            </div>
          </div>

          {/* Lessons */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lessons
            </h3>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Lesson {index + 1}
                    </h4>
                    {lessons.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLesson(lesson.id)}
                        startIcon={<Trash2 size={14} />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                        placeholder="Lesson title"
                        className="input input-primary w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                        placeholder="0"
                        step="0.5"
                        min="0"
                        className="input input-primary w-full"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={lesson.description}
                        onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                        placeholder="Lesson description"
                        rows={2}
                        className="input input-primary w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addLesson}
                startIcon={<Plus size={16} />}
              >
                Add Lesson
              </Button>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Learning Objectives
            </h3>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={values.learningObjectives?.[index] || ''}
                  onChange={(e) => {
                    const objectives = [...(values.learningObjectives || [])];
                    objectives[index] = e.target.value;
                    setFormValues({ ...values, learningObjectives: objectives });
                  }}
                  placeholder={`Learning objective ${index + 1}`}
                  className="input input-primary w-full"
                />
              ))}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add key learning objectives for this course
              </p>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Prerequisites
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Select courses that must be completed before taking this course
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(3)].map((_, index) => (
                <select
                  key={index}
                  name={`prerequisite-${index}`}
                  value={values.prerequisites?.[index] || ''}
                  onChange={(e) => {
                    const prerequisites = [...(values.prerequisites || [])];
                    prerequisites[index] = e.target.value;
                    setFormValues({ ...values, prerequisites });
                  }}
                  className="select select-primary w-full"
                >
                  <option value="">Select prerequisite course</option>
                  {courses
                    .filter(c => c.id !== courseId) // Don't allow selecting self
                    .map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.code})
                      </option>
                    ))}
                </select>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/courses')}
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
              {courseId ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Card */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Course Creation Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <BookOpen size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Course Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Provide clear and detailed information. Use descriptive titles and comprehensive descriptions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Code size={20} className="text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Course Code</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use a unique, memorable code. Students will use this to identify the course.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Course Settings</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Set appropriate difficulty, duration, and requirements for your target audience.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseForm;