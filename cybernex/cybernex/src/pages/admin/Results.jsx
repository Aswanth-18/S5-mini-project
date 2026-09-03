import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, ASSESSMENT_STATES, CYBER_DOMAINS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { BarChart3, Search, Filter, Eye, Download, Edit2, Trash2, Plus, CheckCircle, X, Clock, Award, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';

const Results = () => {
  const { user } = useAuth();
  const { results, assessments, users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    averageScore: 0,
    published: 0,
    unpublished: 0
  });

  useEffect(() => {
    if (results.length > 0) {
      setFilteredResults(results);
      
      const passed = results.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
      const failed = results.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;
      const pending = results.filter(r => 
        r.status === ASSESSMENT_STATES.SUBMITTED || 
        r.status === ASSESSMENT_STATES.UNDER_REVIEW
      ).length;
      
      const published = results.filter(r => r.published).length;
      const unpublished = results.filter(r => !r.published).length;
      
      const totalScore = results.reduce((sum, r) => sum + (r.percentage || 0), 0);
      const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
      
      setStats({
        total: results.length,
        passed,
        failed,
        pending,
        published,
        unpublished,
        averageScore
      });
    }
  }, [results]);

  useEffect(() => {
    let filtered = [...results];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const assessment = assessments.find(a => a.id === r.assessmentId);
        const student = allUsers.find(u => u.id === r.studentId);
        return (
          (r.assessmentTitle || '').toLowerCase().includes(lowerQuery) ||
          (assessment?.title || '').toLowerCase().includes(lowerQuery) ||
          (student?.name || '').toLowerCase().includes(lowerQuery) ||
          (student?.email || '').toLowerCase().includes(lowerQuery) ||
          r.id.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }
    
    // Filter by domain
    if (filterDomain !== 'all') {
      filtered = filtered.filter(r => {
        const assessment = assessments.find(a => a.id === r.assessmentId);
        return assessment?.domain === filterDomain;
      });
    }
    
    // Filter by published status
    if (filterPublished !== 'all') {
      const isPublished = filterPublished === 'published';
      filtered = filtered.filter(r => r.published === isPublished);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt));
    
    setFilteredResults(filtered);
  }, [searchQuery, filterStatus, filterDomain, filterPublished, results, assessments, allUsers]);

  const handleDelete = (result) => {
    setSelectedResult(result);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedResult) return;
    
    try {
      // In a real app, this would call a service to delete the result
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setSelectedResult(null);
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ASSESSMENT_STATES.PASSED: return 'bg-green-100 text-green-800';
      case ASSESSMENT_STATES.FAILED: return 'bg-red-100 text-red-800';
      case ASSESSMENT_STATES.SUBMITTED:
      case ASSESSMENT_STATES.UNDER_REVIEW: return 'bg-yellow-100 text-yellow-800';
      case ASSESSMENT_STATES.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  const columns = [
    {
      header: 'Assessment',
      accessor: 'assessmentTitle',
      render: (row) => {
        const assessment = assessments.find(a => a.id === row.assessmentId);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {row.assessmentTitle || assessment?.title || row.assessmentId}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {assessment?.domain || 'General'}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Student',
      accessor: 'studentId',
      render: (row) => {
        const student = allUsers.find(u => u.id === row.studentId);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {student?.name || row.studentId}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {student?.email}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Score',
      accessor: 'percentage',
      render: (row) => (
        <div className="text-center">
          <div className={`text-xl font-bold ${getScoreTextColor(row.percentage || 0)}`}>
            {row.percentage || 0}%
          </div>
          <Badge className={getScoreColor(row.percentage || 0)}>
            {row.score || 0}/{row.totalPoints || 100}
          </Badge>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div className="text-center">
          <Badge className={getStatusColor(row.status)}>
            {row.status.replace('-', ' ')}
          </Badge>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {row.published ? 'Published' : 'Unpublished'}
          </div>
        </div>
      )
    },
    {
      header: 'Submitted',
      accessor: 'submittedAt',
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(row.submittedAt || row.createdAt).toLocaleDateString()}
          <br />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.submittedAt || row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <Link to={`/admin/results/${row.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <Button variant="outline" size="sm" startIcon={<Download size={14} />}>
            Export
          </Button>
          {hasPermission('results.manage') && (
            <Button 
              variant="outline" 
              size="sm" 
              startIcon={<Trash2 size={14} />} 
              onClick={() => handleDelete(row)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get unique domains from assessments
  const domains = [...new Set(assessments.map(a => a.domain).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Results</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and review all assessment results</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Results</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.passed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
        </Card>
        <Card className="text-center">
          <X size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.failed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
        </Card>
        <Card className="text-center">
          <Award size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.published}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Published</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-gray-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.unpublished}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Unpublished</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search results by assessment, student, or ID..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-[250px]"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Statuses</option>
              <option value={ASSESSMENT_STATES.PASSED}>Passed</option>
              <option value={ASSESSMENT_STATES.FAILED}>Failed</option>
              <option value={ASSESSMENT_STATES.SUBMITTED}>Submitted</option>
              <option value={ASSESSMENT_STATES.UNDER_REVIEW}>Under Review</option>
              <option value={ASSESSMENT_STATES.IN_PROGRESS}>In Progress</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Domain:</span>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published:</span>
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All</option>
              <option value="published">Published Only</option>
              <option value="unpublished">Unpublished Only</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterDomain('all');
              setFilterPublished('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredResults}
          keyExtractor={(row) => row.id}
          emptyMessage="No assessment results found"
          emptyIcon={<BarChart3 size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Result"
        message={`Are you sure you want to delete this result? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Results;