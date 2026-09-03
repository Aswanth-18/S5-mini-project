import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Calendar, 
  Award, 
  TrendingUp,
  CheckCircle,
  X,
  ArrowRight,
  Eye,
  Download,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const StudentResults = () => {
  const { user } = useAuth();
  const { filteredResults, filteredAssessments, isLoading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get user's results
  const userResults = filteredResults.filter(r => r.studentId === user?.id);

  // Filter results
  const getFilteredResults = () => {
    let results = [...userResults];
    
    // Filter by tab
    if (activeTab === 'passed') {
      results = results.filter(r => r.status === 'passed');
    } else if (activeTab === 'failed') {
      results = results.filter(r => r.status === 'failed');
    } else if (activeTab === 'recent') {
      results = results.sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt));
    }

    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(result => {
        const assessment = filteredAssessments.find(a => a.id === result.assessmentId);
        return (assessment?.title?.toLowerCase().includes(lowerQuery) ||
                assessment?.domain?.toLowerCase().includes(lowerQuery) ||
                result.assessmentTitle?.toLowerCase().includes(lowerQuery) ||
                result.id.toLowerCase().includes(lowerQuery));
      });
    }

    // Filter by domain
    if (selectedDomain !== 'all') {
      results = results.filter(result => {
        const assessment = filteredAssessments.find(a => a.id === result.assessmentId);
        return assessment?.domain === selectedDomain;
      });
    }

    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt));

    return results;
  };

  const filteredResultsList = getFilteredResults();
  const totalPages = Math.ceil(filteredResultsList.length / itemsPerPage);
  const currentResults = filteredResultsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique domains from user's assessments
  const domains = [...new Set(
    filteredResultsList
      .map(result => {
        const assessment = filteredAssessments.find(a => a.id === result.assessmentId);
        return assessment?.domain;
      })
      .filter(Boolean)
  )];

  // Calculate statistics
  const totalResults = userResults.length;
  const passedResults = userResults.filter(r => r.status === 'passed').length;
  const failedResults = userResults.filter(r => r.status === 'failed').length;
  const averageScore = totalResults > 0 
    ? Math.round(userResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalResults)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreTextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Results</h1>
        <Link to="/student/dashboard">
          <Button variant="outline" startIcon={<ArrowRight size={16} />}>Back to Dashboard</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{totalResults}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Attempts</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{passedResults}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
        </Card>
        <Card className="text-center">
          <X size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{failedResults}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
        </Card>
        <Card className="text-center">
          <Award size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{averageScore}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Average Score</div>
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
              placeholder="Search results..."
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
              All ({totalResults})
            </button>
            <button
              onClick={() => { setActiveTab('passed'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'passed' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Passed ({passedResults})
            </button>
            <button
              onClick={() => { setActiveTab('failed'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'failed' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Failed ({failedResults})
            </button>
            <button
              onClick={() => { setActiveTab('recent'); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'recent' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Recent
            </button>
          </div>

          {/* Domain Filter */}
          {domains.length > 0 && (
            <div className="flex items-center gap-2">
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
          )}
        </div>
      </Card>

      {/* Results Table */}
      {currentResults.length > 0 ? (
        <div className="space-y-4">
          {currentResults.map((result, index) => {
            const assessment = filteredAssessments.find(a => a.id === result.assessmentId);
            const scoreColor = getScoreColor(result.percentage || 0);
            const scoreTextColor = getScoreTextColor(result.percentage || 0);

            return (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Link to={`/student/results/${result.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors">
                      {result.assessmentTitle || assessment?.title || result.assessmentId}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {assessment?.domain || 'General'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${scoreTextColor}`}>
                      {result.percentage || 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Score
                    </div>
                    <Badge className={`mt-2 ${scoreColor}`}>
                      {result.score || 0} / {result.totalPoints || 100} points
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {result.status === 'passed' ? 'PASSED' : 'FAILED'}
                    </div>
                    <Badge className={`mt-2 ${
                      result.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {new Date(result.submittedAt || result.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 justify-center md:justify-end">
                      <Link to={`/student/results/${result.id}`}>
                        <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" startIcon={<Download size={14} />}>
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredResultsList.length)} 
                  of {filteredResultsList.length} results
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
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {activeTab === 'passed' ? 'You have not passed any assessments yet.' :
               activeTab === 'failed' ? 'You have not failed any assessments yet.' :
               'You have not attempted any assessments yet.'}
            </p>
            <Link to="/student/assessments">
              <Button variant="outline" className="mt-4">
                Browse Assessments
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Score Distribution Chart */}
      {userResults.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { range: '90-100%', count: userResults.filter(r => (r.percentage || 0) >= 90).length, color: 'bg-green-500' },
              { range: '70-89%', count: userResults.filter(r => (r.percentage || 0) >= 70 && (r.percentage || 0) < 90).length, color: 'bg-blue-500' },
              { range: '50-69%', count: userResults.filter(r => (r.percentage || 0) >= 50 && (r.percentage || 0) < 70).length, color: 'bg-yellow-500' },
              { range: '0-49%', count: userResults.filter(r => (r.percentage || 0) < 50).length, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{item.range}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</span>
                </div>
                <div className={`w-full h-8 rounded-lg ${item.color} opacity-80`}></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Best Performances */}
      {passedResults > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Performances</h3>
            <Link to="#" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {userResults
              .filter(r => r.status === 'passed')
              .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
              .slice(0, 5)
              .map((result, index) => {
                const assessment = filteredAssessments.find(a => a.id === result.assessmentId);
                return (
                  <Link 
                    key={index} 
                    to={`/student/results/${result.id}`}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="text-2xl font-bold text-green-600">{index + 1}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {result.assessmentTitle || assessment?.title || result.assessmentId}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {result.percentage || 0}% • {new Date(result.submittedAt || result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.percentage || 0}%
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

export default StudentResults;