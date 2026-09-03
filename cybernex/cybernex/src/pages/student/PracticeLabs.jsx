import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Shield, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Clock, 
  Calendar, 
  Award, 
  TrendingUp,
  PlayCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const PracticeLabs = () => {
  const { user } = useAuth();
  const { filteredLabs, filteredCourses, isLoading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get user's progress
  const userLabs = user?.progress?.labs || {};
  const completedLabs = userLabs.completed || [];
  const inProgressLabs = userLabs.inProgress || [];

  // Filter labs
  const getFilteredLabs = () => {
    let labs = [...filteredLabs];
    
    // Filter by tab
    if (activeTab === 'in-progress') {
      labs = labs.filter(lab => inProgressLabs.includes(lab.id));
    } else if (activeTab === 'completed') {
      labs = labs.filter(lab => completedLabs.includes(lab.id));
    } else if (activeTab === 'recommended') {
      labs = labs.filter(lab => !completedLabs.includes(lab.id) && !inProgressLabs.includes(lab.id));
    } else if (activeTab === 'course-labs') {
      // Filter by labs that belong to user's courses
      const userCourses = user?.progress?.courses?.inProgress || [];
      labs = labs.filter(lab => userCourses.some(courseId => lab.courseId === courseId));
    }

    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      labs = labs.filter(lab => 
        lab.title.toLowerCase().includes(lowerQuery) ||
        lab.description?.toLowerCase().includes(lowerQuery) ||
        lab.domain?.toLowerCase().includes(lowerQuery) ||
        lab.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by domain
    if (selectedDomain !== 'all') {
      labs = labs.filter(lab => lab.domain === selectedDomain);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      labs = labs.filter(lab => lab.difficulty === selectedDifficulty);
    }

    return labs;
  };

  const filteredLabsList = getFilteredLabs();
  const totalPages = Math.ceil(filteredLabsList.length / itemsPerPage);
  const currentLabs = filteredLabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique domains and difficulties
  const domains = [...new Set(filteredLabsList.map(lab => lab.domain).filter(Boolean))];
  const difficulties = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];

  const getLabStatus = (labId) => {
    if (completedLabs.includes(labId)) return 'completed';
    if (inProgressLabs.includes(labId)) return 'in-progress';
    return 'not-started';
  };

  const getDifficultyColor = (difficulty) => {
    const difficultyColors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Easy': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-orange-100 text-orange-800',
      'Expert': 'bg-red-100 text-red-800'
    };
    return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Labs</h1>
        <Button variant="primary" startIcon={<Shield size={16} />}>
          Start New Lab
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Shield size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{filteredLabsList.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Labs</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{completedLabs.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
        </Card>
        <Card className="text-center">
          <PlayCircle size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{inProgressLabs.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
        </Card>
        <Card className="text-center">
          <Award size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {filteredLabsList.length > 0 ? 
              Math.round((completedLabs.length / filteredLabsList.length) * 100) : 0}%
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
              placeholder="Search labs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
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
              All Labs
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
            <button
              onClick={() => { setActiveTab('course-labs'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'course-labs' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              My Course Labs
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
        {(domains.length > 0 || difficulties.length > 0) && (
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-primary select-sm"
                >
                  <option value="all">All Levels</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Labs Grid/List */}
      {currentLabs.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {currentLabs.map(lab => (
            <Card 
              key={lab.id} 
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                getLabStatus(lab.id) === 'completed' ? 'border-l-4 border-green-500' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lab.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {lab.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <span className="text-gray-600 dark:text-gray-300">{lab.domain}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span className="text-gray-600 dark:text-gray-300">{lab.estimatedTime || '30'} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={14} />
                    <span className="text-gray-600 dark:text-gray-300">{lab.xp || 50} XP</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Badge className={`px-2 py-1 ${getDifficultyColor(lab.difficulty)}`}>
                      {lab.difficulty || 'Medium'}
                    </Badge>
                    {getLabStatus(lab.id) === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    )}
                    {getLabStatus(lab.id) === 'in-progress' && (
                      <Badge className="bg-blue-100 text-blue-800">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  
                  <Link to={`/student/practice/${lab.id}`} className="flex-shrink-0">
                    <Button variant="primary" size="sm" startIcon={<PlayCircle size={14} />}>
                      {getLabStatus(lab.id) === 'completed' ? 'Review' : 'Start'}
                    </Button>
                  </Link>
                </div>

                {/* Progress for in-progress labs */}
                {getLabStatus(lab.id) === 'in-progress' && (
                  <ProgressBar value={50} max={100} className="h-2" />
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No labs found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {activeTab === 'completed' ? 'You have not completed any labs yet.' :
               activeTab === 'in-progress' ? 'You have no labs currently in progress.' :
               activeTab === 'course-labs' ? 'You have no course labs available.' :
               activeTab === 'recommended' ? 'No labs available for recommendation.' :
               'Try adjusting your filters or search query.'}
            </p>
            {activeTab !== 'all' && (
              <Button onClick={() => setActiveTab('all')} variant="outline" className="mt-4">
                Browse All Labs
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
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredLabsList.length)} 
              of {filteredLabsList.length} labs
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

      {/* Quick Access by Domain */}
      {activeTab === 'all' && domains.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browse by Domain</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {domains.slice(0, 8).map(domain => (
              <Link 
                key={domain} 
                to="#" 
                onClick={() => {
                  setSelectedDomain(domain);
                  setCurrentPage(1);
                }}
                className="block p-4 text-center bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Shield size={24} className="mx-auto mb-2 text-primary" />
                <span className="font-medium text-gray-900 dark:text-white">{domain}</span>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {filteredLabsList.filter(lab => lab.domain === domain).length} labs
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Featured Labs */}
      {activeTab === 'all' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Labs</h3>
            <Link to="#" className="text-sm text-primary hover:underline">
              View all featured labs
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLabs
              .filter(lab => lab.featured || lab.popular)
              .slice(0, 3)
              .map(lab => (
                <div key={lab.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{lab.title}</h4>
                    {lab.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
                    )}
                    {lab.popular && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {lab.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {lab.estimatedTime || '30'} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={12} /> {lab.xp || 50} XP
                    </span>
                  </div>
                  <Link to={`/student/practice/${lab.id}`}>
                    <Button variant="primary" size="sm" className="w-full" startIcon={<PlayCircle size={14} />}>
                      Start Lab
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PracticeLabs;