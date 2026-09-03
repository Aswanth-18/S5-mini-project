import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, BookOpen, Users, BarChart3, Shield, Clock, Filter, X } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const { filteredCourses, filteredLabs, filteredAssessments, filteredUsers, isLoading } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({ courses: [], labs: [], assessments: [], users: [] });

  // Extract search query from URL or use default
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    // Perform search
    performSearch(query);
  }, [location.search, filteredCourses, filteredLabs, filteredAssessments, filteredUsers]);

  const performSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Search courses
    const courseResults = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description?.toLowerCase().includes(lowerQuery) ||
      course.domain?.toLowerCase().includes(lowerQuery) ||
      course.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    // Search labs
    const labResults = filteredLabs.filter(lab => 
      lab.title.toLowerCase().includes(lowerQuery) ||
      lab.description?.toLowerCase().includes(lowerQuery) ||
      lab.domain?.toLowerCase().includes(lowerQuery) ||
      lab.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    // Search assessments
    const assessmentResults = filteredAssessments.filter(assessment => 
      assessment.title.toLowerCase().includes(lowerQuery) ||
      assessment.description?.toLowerCase().includes(lowerQuery) ||
      assessment.domain?.toLowerCase().includes(lowerQuery) ||
      assessment.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    // Search users (only for faculty and admin)
    let userResults = [];
    if (user && (user.role === ROLES.FACULTY || user.role === ROLES.ADMIN)) {
      userResults = filteredUsers.filter(userItem => 
        userItem.name.toLowerCase().includes(lowerQuery) ||
        userItem.email.toLowerCase().includes(lowerQuery) ||
        userItem.department?.toLowerCase().includes(lowerQuery) ||
        userItem.role.toLowerCase().includes(lowerQuery)
      );
    }

    setResults({
      courses: courseResults,
      labs: labResults,
      assessments: assessmentResults,
      users: userResults
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search query
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    // Navigate to new search URL
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
    performSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults({ courses: [], labs: [], assessments: [], users: [] });
    window.history.pushState({}, '', location.pathname);
  };

  const totalResults = results.courses.length + results.labs.length + results.assessments.length + results.users.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h1>

      {/* Search Bar */}
      <Card>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, labs, assessments, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-primary w-full pl-10"
            />
          </div>
          <Button type="submit" variant="primary" startIcon={<Search size={16} />}>
            Search
          </Button>
          {searchQuery && (
            <Button onClick={clearSearch} variant="outline" startIcon={<X size={16} />}>
              Clear
            </Button>
          )}
        </form>
        
        {searchQuery && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Showing results for: <span className="font-semibold text-primary">{searchQuery}</span>
            {totalResults > 0 && (
              <span className="ml-2">({totalResults} results found)</span>
            )}
          </div>
        )}
      </Card>

      {/* Category Tabs */}
      <Card>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'courses' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <BookOpen size={14} /> Courses ({results.courses.length})
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'labs' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Shield size={14} /> Practice Labs ({results.labs.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'assessments' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={14} /> Assessments ({results.assessments.length})
          </button>
          {(user?.role === ROLES.FACULTY || user?.role === ROLES.ADMIN) && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'users' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Users size={14} /> Users ({results.users.length})
            </button>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {totalResults === 0 && searchQuery ? (
        <Card>
          <div className="text-center py-12">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try using different keywords or check your spelling.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Courses */}
          {(activeTab === 'all' || activeTab === 'courses') && results.courses.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" /> Courses ({results.courses.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.courses.slice(0, 6).map(course => (
                  <Card key={course.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                        <Badge className={course.level === 'Advanced' ? 'bg-purple-100 text-purple-800' : 
                                          course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-green-100 text-green-800'}>
                          {course.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Shield size={12} /> {course.domain}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {course.duration || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {results.courses.length > 6 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Show all {results.courses.length} courses
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Labs */}
          {(activeTab === 'all' || activeTab === 'labs') && results.labs.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-green-600" /> Practice Labs ({results.labs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.labs.slice(0, 6).map(lab => (
                  <Card key={lab.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{lab.title}</h4>
                        <Badge className={lab.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : 
                                          lab.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-green-100 text-green-800'}>
                          {lab.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {lab.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BarChart3 size={12} /> {lab.domain}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {lab.estimatedTime || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {results.labs.length > 6 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Show all {results.labs.length} labs
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Assessments */}
          {(activeTab === 'all' || activeTab === 'assessments') && results.assessments.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-purple-600" /> Assessments ({results.assessments.length})
              </h3>
              <div className="space-y-3">
                {results.assessments.slice(0, 8).map(assessment => (
                  <Card key={assessment.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{assessment.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{assessment.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} /> {assessment.domain}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {assessment.duration || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield size={12} /> {assessment.difficulty || 'N/A'}
                          </span>
                          <Badge className={assessment.type === 'Practical' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                            {assessment.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {results.assessments.length > 8 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Show all {results.assessments.length} assessments
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Users */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && 
            (user?.role === ROLES.FACULTY || user?.role === ROLES.ADMIN) && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-orange-600" /> Users ({results.users.length})
              </h3>
              <div className="space-y-3">
                {results.users.slice(0, 8).map(userItem => (
                  <Card key={userItem.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <img 
                        src={userItem.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userItem.name}`}
                        alt={userItem.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{userItem.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{userItem.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={userItem.role === ROLES.ADMIN ? 'bg-red-100 text-red-800' : 
                                            userItem.role === ROLES.FACULTY ? 'bg-blue-100 text-blue-800' : 
                                            'bg-green-100 text-green-800'}>
                            {userItem.role}
                          </Badge>
                          {userItem.department && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">{userItem.department}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {results.users.length > 8 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Show all {results.users.length} users
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Empty State for No Query */}
      {!searchQuery && totalResults === 0 && (
        <Card>
          <div className="text-center py-12">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Search for content
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Use the search bar above to find courses, practice labs, assessments, and other content in the CyberNex platform.
            </p>
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              <Button variant="outline" onClick={() => setActiveTab('courses')}>
                Browse Courses
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('labs')}>
                Browse Labs
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('assessments')}>
                Browse Assessments
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;