import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CourseProgress from '../../components/learning/CourseProgress';
import LessonViewer from '../../components/learning/LessonViewer';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Shield, 
  Users, 
  Award, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight,
  ListCheck,
  FileText,
  Video,
  Code2
} from 'lucide-react';

const LearningDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filteredCourses, filteredLabs, filteredLessons, isLoading } = useData();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [completionStatus, setCompletionStatus] = useState('not-started');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Find the course
    const foundCourse = filteredCourses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Check user's progress with this course
      const userCourses = user?.progress?.courses || {};
      if (userCourses.completed?.includes(courseId)) {
        setCompletionStatus('completed');
        setCourseProgress(100);
      } else if (userCourses.inProgress?.includes(courseId)) {
        setCompletionStatus('in-progress');
        // Calculate progress based on completed lessons
        const courseLessons = filteredLessons.filter(l => l.courseId === courseId);
        const completedLessons = userCourses.lessons?.completed || [];
        const progress = courseLessons.length > 0 
          ? Math.round((completedLessons.filter(id => courseLessons.map(l => l.id).includes(id)).length / courseLessons.length) * 100)
          : 0;
        setCourseProgress(progress);
      }
      
      // Set first lesson as active by default
      const courseLessons = filteredLessons.filter(l => l.courseId === courseId);
      if (courseLessons.length > 0) {
        setActiveLesson(courseLessons[0]);
      }
    } else {
      // Course not found, redirect to learning page
      navigate('/student/learning');
    }
  }, [courseId, filteredCourses, filteredLessons, user, navigate]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const markAsComplete = () => {
    // This would update the user's progress
    // For demo purposes, just simulate completion
    setCompletionStatus('completed');
    setCourseProgress(100);
    // In a real app, you would call an API to update the user's progress
  };

  const startCourse = () => {
    // Mark course as in progress
    setCompletionStatus('in-progress');
    // In a real app, you would call an API
  };

  const getStatusBadge = () => {
    const statusLabels = {
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: PlayCircle },
      'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800', icon: BookOpen }
    };
    const status = statusLabels[completionStatus] || statusLabels['not-started'];
    const Icon = status.icon;
    return (
      <Badge className={`px-3 py-1 ${status.color} flex items-center gap-1`}>
        <Icon size={14} /> {status.label}
      </Badge>
    );
  };

  const getLevelColor = (level) => {
    const levelColors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'Expert': 'bg-orange-100 text-orange-800'
    };
    return levelColors[level] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get course lessons
  const courseLessons = filteredLessons.filter(l => l.courseId === courseId);
  const courseLabs = filteredLabs.filter(l => l.courseId === courseId);
  
  // Group lessons by section/module
  const groupedLessons = courseLessons.reduce((acc, lesson) => {
    const section = lesson.section || 'Introduction';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(lesson);
    return acc;
  }, {});

  // Calculate estimated time
  const estimatedTime = courseLessons.reduce((total, lesson) => 
    total + (lesson.duration || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/student/learning" className="hover:text-primary transition-colors">
          My Learning
        </Link>
        <ArrowRight size={14} />
        <span className="text-gray-900 dark:text-white font-medium">{course.title}</span>
      </div>

      {/* Course Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 rounded-xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 max-w-2xl">{course.description}</p>
              
              <div className="flex gap-4 mt-6">
                {getStatusBadge()}
                <Badge className={`px-3 py-1 ${getLevelColor(course.level)}`}>
                  {course.level}
                </Badge>
                <Badge className="px-3 py-1 bg-white/20 text-white">
                  {course.domain}
                </Badge>
              </div>
              
              <div className="flex gap-6 mt-4 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {estimatedTime} minutes
                </div>
                <div className="flex items-center gap-2">
                  <ListCheck size={16} /> {courseLessons.length} lessons
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} /> {courseLabs.length} labs
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} /> {course.xp || 100} XP
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {completionStatus === 'not-started' ? (
                <Button onClick={startCourse} variant="white" startIcon={<PlayCircle size={16} />}>
                  Start Course
                </Button>
              ) : completionStatus === 'in-progress' ? (
                <Button variant="white" startIcon={<PlayCircle size={16} />}>
                  Continue Learning
                </Button>
              ) : (
                <Button variant="outline-white" startIcon={<CheckCircle size={16} />}>
                  Course Completed
                </Button>
              )}
              
              {completionStatus === 'in-progress' && (
                <Button onClick={markAsComplete} variant="outline-white" startIcon={<CheckCircle size={16} />}>
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')] bg-cover bg-center"></div>
        </div>
      </div>

      {/* Progress Bar */}
      {completionStatus !== 'not-started' && (
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Course Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {courseLessons.length} lessons • {courseLabs.length} labs
              </p>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {courseProgress}%
            </div>
          </div>
          <ProgressBar value={courseProgress} max={100} className="mt-2 h-3" />
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Course Curriculum */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Curriculum</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {Object.keys(groupedLessons).length} sections • {courseLessons.length} lessons
              </div>
            </div>

            {/* Course Sections */}
            <div className="space-y-4">
              {Object.entries(groupedLessons).map(([section, lessons], sectionIndex) => (
                <div key={section} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Section {sectionIndex + 1}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{section}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {lessons.length} lessons • 
                        {lessons.reduce((total, l) => total + (l.duration || 0), 0)} min
                      </span>
                    </div>
                    <span className={`transform transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}>
                      <ArrowRight size={18} className="text-gray-500" />
                    </span>
                  </button>

                  {expandedSections[section] && (
                    <div className="p-4 space-y-3">
                      {lessons.map((lesson, lessonIndex) => {
                        const isActive = activeLesson?.id === lesson.id;
                        const userCourses = user?.progress?.courses || {};
                        const isCompleted = userCourses.lessons?.completed?.includes(lesson.id);
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                              isActive 
                                ? 'bg-primary text-white' 
                                : isCompleted 
                                  ? 'bg-green-50 dark:bg-green-900/20' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {lesson.type === 'video' ? (
                                <Video size={20} />
                              ) : lesson.type === 'reading' ? (
                                <FileText size={20} />
                              ) : lesson.type === 'coding' ? (
                                <Code2 size={20} />
                              ) : (
                                <BookOpen size={20} />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {lesson.type} • {lesson.duration || '5'} min
                              </p>
                            </div>
                            {isCompleted && !isActive && (
                              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Labs Section */}
              {courseLabs.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
                  <button
                    onClick={() => toggleSection('labs')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Practice Labs</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Hands-on Exercises</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {courseLabs.length} labs
                      </span>
                    </div>
                    <span className={`transform transition-transform ${expandedSections['labs'] ? 'rotate-180' : ''}`}>
                      <ArrowRight size={18} className="text-gray-500" />
                    </span>
                  </button>

                  {expandedSections['labs'] && (
                    <div className="p-4 space-y-3">
                      {courseLabs.map((lab) => {
                        const isActive = activeLesson?.id === lab.id;
                        const userLabs = user?.progress?.labs || {};
                        const isCompleted = userLabs.completed?.includes(lab.id);
                        
                        return (
                          <button
                            key={lab.id}
                            onClick={() => setActiveLesson(lab)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                              isActive 
                                ? 'bg-primary text-white' 
                                : isCompleted 
                                  ? 'bg-green-50 dark:bg-green-900/20' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <Shield size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{lab.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Practice Lab • {lab.estimatedTime || '30'} min
                              </p>
                            </div>
                            {isCompleted && !isActive && (
                              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Lesson Viewer */}
          {activeLesson && (
            <Card className="mt-6">
              <LessonViewer 
                lesson={activeLesson} 
                course={course}
                isCompleted={user?.progress?.courses?.lessons?.completed?.includes(activeLesson.id)}
              />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Course Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'Self-paced'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {estimatedTime} minutes total
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ListCheck size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {courseLessons.length} lessons
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {courseLabs.length} labs
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Award size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {course.xp || 100} XP available
                </span>
              </div>
            </div>
          </Card>

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prerequisites</h3>
              <div className="space-y-3">
                {course.prerequisites.map(prereq => {
                  const prereqCourse = filteredCourses.find(c => c.id === prereq);
                  const isCompleted = user?.progress?.courses?.completed?.includes(prereq);
                  
                  return (
                    <div key={prereq} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <BookOpen size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {prereqCourse?.title || prereq}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {isCompleted ? 'Completed' : 'Required'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Outcomes</h3>
              <ul className="space-y-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{outcome}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Course Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-3">
              {completionStatus === 'not-started' ? (
                <Button onClick={startCourse} variant="primary" className="w-full" startIcon={<PlayCircle size={16} />}>
                  Start Course
                </Button>
              ) : completionStatus === 'in-progress' ? (
                <>
                  <Button variant="primary" className="w-full" startIcon={<PlayCircle size={16} />}>
                    Continue Learning
                  </Button>
                  <Button onClick={markAsComplete} variant="outline" className="w-full" startIcon={<CheckCircle size={16} />}>
                    Mark as Complete
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full" startIcon={<CheckCircle size={16} />}>
                  Course Completed
                </Button>
              )}
              
              <Button variant="outline" className="w-full" startIcon={<ArrowLeft size={16} />}>
                Back to Courses
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningDetail;