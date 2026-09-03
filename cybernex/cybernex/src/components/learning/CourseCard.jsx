import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { BookOpen, Clock, Users, Star, Lock, PlayCircle, CheckCircle } from 'lucide-react';

/**
 * CourseCard Component
 * Displays a course card with title, description, progress, and metadata
 *
 * @param {object} props - Component props
 * @param {string} props.id - Course ID
 * @param {string} props.title - Course title
 * @param {string} props.description - Course description
 * @param {string} props.category - Course category
 * @param {string} props.difficulty - Difficulty level
 * @param {string} props.instructor - Instructor name
 * @param {number} props.lessons - Number of lessons
 * @param {number} props.duration - Duration in minutes
 * @param {number} props.enrolled - Number of enrolled students
 * @param {number} props.rating - Course rating (1-5)
 * @param {number} props.progress - User's progress percentage (0-100)
 * @param {boolean} props.isLocked - Whether course is locked
 * @param {boolean} props.isEnrolled - Whether user is enrolled
 * @param {string} props.to - Link URL for the course
 * @returns {JSX.Element} - Course card component
 */
const CourseCard = ({
  id = '',
  title = 'Course Title',
  description = 'Course description goes here.',
  category = 'General',
  difficulty = 'beginner',
  instructor = 'Instructor Name',
  lessons = 10,
  duration = 60,
  enrolled = 0,
  rating = 0,
  progress = 0,
  isLocked = false,
  isEnrolled = false,
  to = '#'
}) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRatingStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <Star key="half" size={14} className="text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-gray-300" />
        ))}
      </>
    );
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card 
      className={`h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow ${isLocked ? 'opacity-75 cursor-not-allowed' : ''}`}
      as={Link}
      to={isLocked ? '#' : to}
    >
      <div className="flex-1 flex flex-col">
        {/* Header with Icon and Badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={20} className="text-blue-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
              {description}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor()}>
                {difficulty}
              </Badge>
              <span className="text-gray-600 dark:text-gray-300">
                <CategoryIcon category={category} /> {category}
              </span>
            </div>
          </div>

          {/* Progress and Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <Clock size={14} />
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <Users size={14} />
                <span>{enrolled}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-yellow-600">{getRatingStars()}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
              <span>Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <ProgressBar 
              value={progress} 
              max={100} 
              className="h-2"
            />
            {progress >= 100 && (
              <div className="flex items-center justify-end mt-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs text-green-600 ml-1">Completed</span>
              </div>
            )}
          </div>
        )}

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
            <div className="text-center">
              <Lock size={24} className="text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Complete prerequisites to unlock
              </p>
            </div>
          </div>
        )}

        {/* Enroll Button (if not enrolled and not locked) */}
        {!isLocked && !isEnrolled && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full"
              startIcon={<PlayCircle size={14} />}
            >
              Enroll Now
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Category Icon Component
const CategoryIcon = ({ category }) => {
  const icons = {
    'Web Security': '🌐',
    'Network Security': '🔒',
    'Cybersecurity': '🛡️',
    'Penetration Testing': '🎯',
    'Forensics': '🔍',
    'Cryptography': '🔑',
    'Malware Analysis': '🦠',
    'General': '📚'
  };
  
  return <span>{icons[category] || '📚'}</span>;
};

CourseCard.defaultProps = {
  id: '',
  title: 'Course Title',
  description: 'Course description goes here.',
  category: 'General',
  difficulty: 'beginner',
  instructor: 'Instructor Name',
  lessons: 10,
  duration: 60,
  enrolled: 0,
  rating: 0,
  progress: 0,
  isLocked: false,
  isEnrolled: false,
  to: '#'
};

export default CourseCard;