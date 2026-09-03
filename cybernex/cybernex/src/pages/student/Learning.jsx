import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CourseCard from '../../components/learning/CourseCard';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Calendar,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';

const Learning = () => {
  const { user } = useAuth();
  const { filteredCourses, isLoading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get user's progress
  const userCourses = user?.progress?.courses || {};
  const completedCourses = userCourses.completed || [];
  const inProgressCourses = userCourses.inProgress || [];

  // Filter courses
  const getFilteredCourses = () => {
    let courses = [...filteredCourses];
    
    // Filter by tab
    if (activeTab === 'in-progress') {
      courses = courses.filter(course => inProgressCourses.includes(course.id));
    } else if (activeTab === 'completed') {
      courses = courses.filter(course => completedCourses.includes(course.id));
    } else if (activeTab === 'recommended') {
      courses = courses.filter(course => !completedCourses.includes(course.id) && !inProgressCourses.includes(course.id));
    }

    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description?.toLowerCase().includes(lowerQuery) ||
        course.domain?.toLowerCase().includes(lowerQuery) ||
        course.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by domain
    if (selectedDomain !== 'all') {
      courses = courses.filter(course => course.domain === selectedDomain);
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      courses = courses.filter(course => course.level === selectedLevel);
    }

    return courses;
  };

  const filteredCoursesList = getFilteredCourses();
  const totalPages = Math.ceil(filteredCoursesList.length / itemsPerPage);
  const currentCourses = filteredCoursesList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique domains and levels
  const domains = [...new Set(filteredCoursesList.map(course => course.domain).filter(Boolean))];
  const levels = [...new Set(filteredCoursesList.map(course => course.level).filter(Boolean))];

  const getCourseStatus = (courseId) => {
    if (completedCourses.includes(courseId)) return 'completed';
    if (inProgressCourses.includes(courseId)) return 'in-progress';
    return 'not-started';
  };

  const getProgressPercentage = (courseId) => {
    // This would be more sophisticated in a real app
    // For now, return 100% for completed, 50% for in-progress, 0% for not started
    const status = getCourseStatus(courseId);
    if (status === 'completed') return 100;
    if (status === 'in-progress') return 50;
    return 0;
  };

  const getStatusBadge = (course) => {
    const status = getCourseStatus(course.id);
    const statusLabels = {
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800' }
    };
    return statusLabels[status] || statusLabels['not-started'];
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Learning</h1>
        <Button variant="primary" startIcon={<BookOpen size={16} />}>
          Browse All Courses
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <BookOpen size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{filteredCoursesList.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Courses</div>
        </Card>
        <Card className="text-center">
          <Shield size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{completedCourses.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
        </Card>
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{inProgressCourses.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {filteredCoursesList.length > 0 ? 
              Math.round((completedCourses.length / filteredCoursesList.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="input input-primary w-full pl-10"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => { setActiveTab('in-progress'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'in-progress' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => { setActiveTab('completed'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => { setActiveTab('recommended'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'recommended' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Recommended
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              title="Grid view"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {(domains.length > 0 || levels.length > 0) && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Domain:</span>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-primary select-sm"
                >
                  <option value="all">All Domains</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-primary select-sm"
                >
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Courses Grid/List */}
      {currentCourses.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {currentCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={getProgressPercentage(course.id)}
              status={getCourseStatus(course.id)}
              showDomain
              showLevel
              showTags
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {activeTab === 'completed' ? 'You have not completed any courses yet.' :
               activeTab === 'in-progress' ? 'You are not currently enrolled in any courses.' :
               activeTab === 'recommended' ? 'No courses available for recommendation.' :
               'Try adjusting your filters or search query.'}
            </p>
            {activeTab !== 'all' && (
              <Button onClick={() => setActiveTab('all')} variant="outline" className="mt-4">
                Browse All Courses
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCoursesList.length)} 
              of {filteredCoursesList.length} courses
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                startIcon={<ChevronLeft size={16} />}
              >
                Previous
              </Button>
              <div className="flex items-center">
                Page <span className="font-semibold mx-1">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </div>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                endIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Access */}
      {activeTab === 'all' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="#" className="block p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Shield size={24} className="mx-auto mb-2 text-green-600" />
              <span className="font-medium text-gray-900 dark:text-white">Web Security</span>
            </Link>
            <Link to="#" className="block p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Shield size={24} className="mx-auto mb-2 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">Network Security</span>
            </Link>
            <Link to="#" className="block p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Shield size={24} className="mx-auto mb-2 text-purple-600" />
              <span className="font-medium text-gray-900 dark:text-white">Linux Security</span>
            </Link>
            <Link to="#" className="block p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Shield size={24} className="mx-auto mb-2 text-orange-600" />
              <span className="font-medium text-gray-900 dark:text-white">Active Directory</span>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Learning;