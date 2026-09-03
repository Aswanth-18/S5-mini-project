import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ASSESSMENT_STATES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ProgressBar from '../../components/common/ProgressBar';
import { 
  BarChart3, Users, Clock, Edit2, Trash2, Plus, Eye, PlayCircle, 
  CheckCircle, XCircle, ShieldCheck, Calendar, TrendingUp 
} from 'lucide-react';

const FacultyAssessments = () => {
  const { user } = useAuth();
  const { assessments, results, isLoading } = useData();
  const [facultyAssessments, setFacultyAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    published: 0,
    avgScore: 0,
    passRate: 0
  });

  useEffect(() => {
    if (user && assessments.length > 0 && results.length > 0) {
      const userAssessments = assessments.filter(a => a.createdBy === user.id);
      setFacultyAssessments(userAssessments);
      
      const activeAssessments = userAssessments.filter(a => a.status === 'active').length;
      const publishedAssessments = userAssessments.filter(a => a.published).length;
      
      const assessmentResults = results.filter(r => 
        userAssessments.some(a => a.id === r.assessmentId)
      );
      
      const avgScore = assessmentResults.length > 0 ? 
        Math.round(assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length) : 0;
      
      const passedResults = assessmentResults.filter(r => r.status === ASSESSMENT_STATES.PASSED);
      const passRate = assessmentResults.length > 0 ? 
        Math.round((passedResults.length / assessmentResults.length) * 100) : 0;
      
      setStats({
        total: userAssessments.length,
        active: activeAssessments,
        published: publishedAssessments,
        avgScore,
        passRate
      });
    }
  }, [user, assessments, results]);

  const filteredAssessments = facultyAssessments.filter(assessment => {
    const query = searchQuery.toLowerCase();
    return (
      assessment.title.toLowerCase().includes(query) ||
      assessment.description?.toLowerCase().includes(query) ||
      (assessment.domain && assessment.domain.toLowerCase().includes(query)) ||
      (assessment.tags && assessment.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Hard': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttemptCount = (assessmentId) => {
    return results.filter(r => r.assessmentId === assessmentId).length;
  };

  const getPassCount = (assessmentId) => {
    return results.filter(r => 
      r.assessmentId === assessmentId && r.status === ASSESSMENT_STATES.PASSED
    ).length;
  };

  const getAverageScore = (assessmentId) => {
    const assessmentResults = results.filter(r => r.assessmentId === assessmentId);
    if (assessmentResults.length === 0) return 0;
    return Math.round(assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length);
  };

  const columns = [
    {
      header: 'Assessment',
      accessor: 'title',
      render: (assessment) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{assessment.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{assessment.code || assessment.id}</div>
        </div>
      )
    },
    {
      header: 'Domain',
      accessor: 'domain',
      render: (assessment) => (
        <Badge variant="secondary">{assessment.domain || 'General'}</Badge>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (assessment) => (
        <Badge variant="secondary">{assessment.type || 'Multiple Choice'}</Badge>
      )
    },
    {
      header: 'Difficulty',
      accessor: 'difficulty',
      render: (assessment) => (
        <Badge className={getDifficultyColor(assessment.difficulty)}>
          {assessment.difficulty || 'Medium'}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (assessment) => (
        <Badge className={getStatusColor(assessment.status)}>
          {assessment.published ? 'Published' : assessment.status}
        </Badge>
      )
    },
    {
      header: 'Attempts',
      accessor: 'attempts',
      render: (assessment) => (
        <span className="font-medium">{getAttemptCount(assessment.id)}</span>
      )
    },
    {
      header: 'Avg Score',
      accessor: 'avgScore',
      render: (assessment) => (
        <span className="font-medium">{getAverageScore(assessment.id)}%</span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (assessment) => (
        <div className="flex gap-2">
          <Link to={`/student/assessment/${assessment.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <Link to={`/admin/assessments/${assessment.id}/edit`}>
            <Button variant="primary" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" startIcon={<Trash2 size={14} />}>
            Delete
          </Button>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Assessments
        </h1>
        <Link to="/admin/assessments/new">
          <Button variant="primary" startIcon={<Plus size={16} />}>
            Create Assessment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Assessments</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <PlayCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.published}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Published</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.avgScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.passRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pass Rate</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assessment List
          </h3>
          <SearchBar
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredAssessments.length} of {facultyAssessments.length} assessments
        </div>

        {facultyAssessments.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No assessments found
            </p>
            <Link to="/admin/assessments/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Create Your First Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredAssessments}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Best Performing Assessments
          </h3>
          {facultyAssessments.length > 0 ? (
            <div className="space-y-4">
              {facultyAssessments
                .filter(a => getAttemptCount(a.id) > 0)
                .sort((a, b) => getAverageScore(b.id) - getAverageScore(a.id))
                .slice(0, 5)
                .map(assessment => (
                  <div key={assessment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white truncate">{assessment.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{assessment.domain}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{getAverageScore(assessment.id)}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{getPassCount(assessment.id)}/{getAttemptCount(assessment.id)} passed</div>
                      </div>
                    </div>
                    <ProgressBar
                      value={getAverageScore(assessment.id)}
                      maxValue={100}
                      className="h-2 mt-2"
                      variant="success"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No assessment data available
            </p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Needs Attention
          </h3>
          {facultyAssessments.length > 0 ? (
            <div className="space-y-4">
              {facultyAssessments
                .filter(a => getAttemptCount(a.id) > 0)
                .sort((a, b) => getAverageScore(a.id) - getAverageScore(b.id))
                .slice(0, 5)
                .map(assessment => (
                  <div key={assessment.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white truncate">{assessment.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{assessment.domain}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{getAverageScore(assessment.id)}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{getPassCount(assessment.id)}/{getAttemptCount(assessment.id)} passed</div>
                      </div>
                    </div>
                    <ProgressBar
                      value={getAverageScore(assessment.id)}
                      maxValue={100}
                      className="h-2 mt-2"
                      variant="danger"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No assessments need attention
            </p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Assessment Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Theory', 'Practical', 'Scenario-Based', 'Timeline'].map(type => {
            const count = facultyAssessments.filter(a => a.type === type).length;
            return (
              <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{type}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/assessments/new">
            <Button variant="primary" startIcon={<Plus size={16} />}>
              Create Assessment
            </Button>
          </Link>
          <Button variant="outline" startIcon={<BarChart3 size={16} />}>
            Assessment Analytics
          </Button>
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            Schedule Assessment
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Assign to Students
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FacultyAssessments;