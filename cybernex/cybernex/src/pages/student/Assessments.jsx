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
  BarChart3, 
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
  Shield,
  ArrowRight,
  X
} from 'lucide-react';

const StudentAssessments = () => {
  const { user } = useAuth();
  const { filteredAssessments, filteredResults, isLoading } = useData();
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Get user's results
  const userResults = filteredResults.filter(r => r.studentId === user?.id);
  
  // Get completed assessment IDs
  const completedAssessmentIds = userResults.map(r => r.assessmentId);
  
  // Filter assessments
  const getFilteredAssessments = () => {
    let assessments = [...filteredAssessments];
    
    // Filter by tab
    if (activeTab === 'available') {
      assessments = assessments.filter(assessment => 
        !completedAssessmentIds.includes(assessment.id)
      );
    } else if (activeTab === 'completed') {
      assessments = assessments.filter(assessment => 
        completedAssessmentIds.includes(assessment.id)
      );
    } else if (activeTab === 'in-progress') {
      assessments = assessments.filter(assessment => {
        const result = userResults.find(r => r.assessmentId === assessment.id);
        return result && result.status === 'in-progress';
      });
    }

    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      assessments = assessments.filter(assessment => 
        assessment.title.toLowerCase().includes(lowerQuery) ||
        assessment.description?.toLowerCase().includes(lowerQuery) ||
        assessment.domain?.toLowerCase().includes(lowerQuery) ||
        assessment.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by domain
    if (selectedDomain !== 'all') {
      assessments = assessments.filter(assessment => assessment.domain === selectedDomain);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      assessments = assessments.filter(assessment => assessment.difficulty === selectedDifficulty);
    }

    // Sort by date (newest first for available, most recent completion for others)
    if (activeTab === 'available') {
      assessments.sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate));
    } else {
      assessments.sort((a, b) => {
        const aResult = userResults.find(r => r.assessmentId === a.id);
        const bResult = userResults.find(r => r.assessmentId === b.id);
        const aDate = aResult ? new Date(aResult.submittedAt || aResult.createdAt) : new Date(0);
        const bDate = bResult ? new Date(bResult.submittedAt || bResult.createdAt) : new Date(0);
        return bDate - aDate;
      });
    }

    return assessments;
  };

  const filteredAssessmentsList = getFilteredAssessments();
  const totalPages = Math.ceil(filteredAssessmentsList.length / itemsPerPage);
  const currentAssessments = filteredAssessmentsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique domains and difficulties
  const domains = [...new Set(filteredAssessmentsList.map(assessment => assessment.domain).filter(Boolean))];
  const difficulties = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];

  const getAssessmentStatus = (assessmentId) => {
    const result = userResults.find(r => r.assessmentId === assessmentId);
    if (!result) return 'not-started';
    if (result.status === 'completed' || result.status === 'passed' || result.status === 'failed') {
      return 'completed';
    }
    return 'in-progress';
  };

  const getAssessmentResult = (assessmentId) => {
    const result = userResults.find(r => r.assessmentId === assessmentId);
    return result || null;
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

  const getStatusColor = (status) => {
    const statusColors = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'passed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
        <Button variant="primary" startIcon={<BarChart3 size={16} />}>
          View All Assessments
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{filteredAssessmentsList.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Available</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {userResults.filter(r => r.status === 'passed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
        </Card>
        <Card className="text-center">
          <PlayCircle size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {userResults.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Attempted</div>
        </Card>
        <Card className="text-center">
          <Award size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {userResults.length > 0 ? 
              Math.round(userResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / userResults.length) : 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
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
              placeholder="Search assessments..."
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
              onClick={() => { setActiveTab('available'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'available' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Available
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

      {/* Assessments Grid/List */}
      {currentAssessments.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
          {currentAssessments.map(assessment => {
            const status = getAssessmentStatus(assessment.id);
            const result = getAssessmentResult(assessment.id);
            
            return (
              <Card 
                key={assessment.id} 
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  status === 'completed' ? 'border-l-4 border-green-500' : 
                  status === 'in-progress' ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {assessment.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      <span className="text-gray-600 dark:text-gray-300">{assessment.domain}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span className="text-gray-600 dark:text-gray-300">{assessment.duration || '60'} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 size={14} />
                      <span className="text-gray-600 dark:text-gray-300">{assessment.type || 'Multiple Choice'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={14} />
                      <span className="text-gray-600 dark:text-gray-300">{assessment.passingScore || 70}% passing</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <Badge className={`px-2 py-1 ${getDifficultyColor(assessment.difficulty)}`}>
                        {assessment.difficulty || 'Medium'}
                      </Badge>
                      {status === 'completed' && result && (
                        <Badge className={`px-2 py-1 ${result.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {result.percentage || 0}%
                        </Badge>
                      )}
                      {status === 'in-progress' && (
                        <Badge className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                      )}
                      {status === 'not-started' && assessment.dueDate && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                    
                    {status === 'not-started' ? (
                      <Link to={`/student/assessment/${assessment.id}`} className="flex-shrink-0">
                        <Button variant="primary" size="sm" startIcon={<PlayCircle size={14} />}>
                          Start
                        </Button>
                      </Link>
                    ) : status === 'in-progress' ? (
                      <Link to={`/student/assessment/${assessment.id}/take`} className="flex-shrink-0">
                        <Button variant="primary" size="sm" startIcon={<PlayCircle size={14} />}>
                          Resume
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/student/results/${result?.id}`} className="flex-shrink-0">
                        <Button variant="outline" size="sm" startIcon={<ArrowRight size={14} />}>
                          View Results
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Progress for in-progress assessments */}
                  {status === 'in-progress' && (
                    <ProgressBar value={result?.progress || 25} max={100} className="h-2" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No assessments found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {activeTab === 'available' ? 'No assessments available at this time.' :
               activeTab === 'in-progress' ? 'You have no assessments currently in progress.' :
               activeTab === 'completed' ? 'You have not completed any assessments yet.' :
               'Try adjusting your filters or search query.'}
            </p>
            {activeTab !== 'available' && (
              <Button onClick={() => setActiveTab('available')} variant="outline" className="mt-4">
                Browse Available Assessments
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
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAssessmentsList.length)} 
              of {filteredAssessmentsList.length} assessments
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
      {activeTab === 'available' && domains.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browse by Domain</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {domains.slice(0, 8).map(domain => {
              const domainAssessments = filteredAssessmentsList.filter(a => a.domain === domain);
              return (
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
                    {domainAssessments.length} assessments
                  </p>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      {/* Upcoming Assessments */}
      {activeTab === 'available' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Assessments</h3>
            <Link to="#" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {filteredAssessmentsList
              .filter(assessment => assessment.dueDate && new Date(assessment.dueDate) > new Date())
              .slice(0, 3)
              .map(assessment => (
                <div key={assessment.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{assessment.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Due: {new Date(assessment.dueDate).toLocaleDateString()} • 
                      {assessment.duration || '60'} minutes
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link to={`/student/assessment/${assessment.id}`}>
                      <Button variant="primary" size="sm">
                        Start
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            
            {filteredAssessmentsList.filter(a => a.dueDate && new Date(a.dueDate) > new Date()).length === 0 && (
              <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                <p>No upcoming assessments</p>
                <p className="text-sm mt-1">Check back later for new assessments</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Recent Results */}
      {activeTab === 'completed' && userResults.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Results</h3>
            <Link to="/student/results" className="text-sm text-primary hover:underline">
              View all results
            </Link>
          </div>
          <div className="space-y-3">
            {userResults
              .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
              .slice(0, 5)
              .map(result => {
                const assessment = filteredAssessments.find(a => a.id === result.assessmentId);
                return (
                  <Link 
                    key={result.id} 
                    to={`/student/results/${result.id}`}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {result.status === 'passed' ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : result.status === 'failed' ? (
                        <X size={20} className="text-red-600" />
                      ) : (
                        <BarChart3 size={20} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {assessment?.title || result.assessmentId}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Score: {result.percentage || 0}% • 
                        {result.status} • 
                        {new Date(result.submittedAt || result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <ArrowRight size={16} className="text-gray-500" />
                    </div>
                  </Link>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentAssessments;