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
  BarChart3, Users, Clock, CheckCircle, XCircle, TrendingUp, 
  Eye, ShieldCheck, Calendar, Filter, Download, Edit2 
} from 'lucide-react';

const FacultyResults = () => {
  const { user } = useAuth();
  const { results, assessments, users, isLoading } = useData();
  const [facultyResults, setFacultyResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    avgScore: 0
  });

  useEffect(() => {
    if (user && results.length > 0 && assessments.length > 0) {
      // Get assessments created by this faculty
      const facultyAssessments = assessments.filter(a => a.createdBy === user.id);
      const assessmentIds = facultyAssessments.map(a => a.id);
      
      // Filter results for faculty's assessments
      const userResults = results.filter(r => assessmentIds.includes(r.assessmentId));
      setFacultyResults(userResults);
      
      // Calculate statistics
      const passed = userResults.filter(r => r.status === ASSESSMENT_STATES.PASSED).length;
      const failed = userResults.filter(r => r.status === ASSESSMENT_STATES.FAILED).length;
      const pending = userResults.filter(r => r.status === ASSESSMENT_STATES.SUBMITTED).length;
      
      const avgScore = userResults.length > 0 ? 
        Math.round(userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length) : 0;
      
      setStats({
        total: userResults.length,
        passed,
        failed,
        pending,
        avgScore
      });
    }
  }, [user, results, assessments]);

  const filteredResults = facultyResults.filter(result => {
    const query = searchQuery.toLowerCase();
    const assessment = assessments.find(a => a.id === result.assessmentId);
    const student = users.find(u => u.id === result.studentId);
    
    return (
      (assessment?.title.toLowerCase().includes(query) ||
      assessment?.code?.toLowerCase().includes(query) ||
      (student?.name.toLowerCase().includes(query) ||
      student?.email.toLowerCase().includes(query)) ||
      result.id.toLowerCase().includes(query))
    );
  }).filter(result => {
    if (filterStatus === 'all') return true;
    return result.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case ASSESSMENT_STATES.PASSED: return 'bg-green-100 text-green-800';
      case ASSESSMENT_STATES.FAILED: return 'bg-red-100 text-red-800';
      case ASSESSMENT_STATES.SUBMITTED: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ASSESSMENT_STATES.PASSED: return <CheckCircle size={16} className="text-green-600" />;
      case ASSESSMENT_STATES.FAILED: return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const columns = [
    {
      header: 'Assessment',
      accessor: 'assessment',
      render: (result) => {
        const assessment = assessments.find(a => a.id === result.assessmentId);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{assessment?.title || 'Unknown'}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{assessment?.code || result.assessmentId}</div>
          </div>
        );
      }
    },
    {
      header: 'Student',
      accessor: 'student',
      render: (result) => {
        const student = users.find(u => u.id === result.studentId);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{student?.name || 'Unknown'}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{student?.email || result.studentId}</div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (result) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(result.status)}
          <Badge className={getStatusColor(result.status)}>
            {result.status}
          </Badge>
        </div>
      )
    },
    {
      header: 'Score',
      accessor: 'score',
      render: (result) => (
        <span className="font-bold text-gray-900 dark:text-white">{result.percentage}%</span>
      )
    },
    {
      header: 'Score Breakdown',
      accessor: 'scoreBreakdown',
      render: (result) => {
        const assessment = assessments.find(a => a.id === result.assessmentId);
        const totalQuestions = assessment?.totalScore || assessment?.questions?.length || 0;
        return (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {result.score || 0}/{totalQuestions}
          </span>
        );
      }
    },
    {
      header: 'Time Taken',
      accessor: 'timeTaken',
      render: (result) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {result.timeTaken || 'N/A'}
        </span>
      )
    },
    {
      header: 'Submitted At',
      accessor: 'submittedAt',
      render: (result) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(result.submittedAt || result.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (result) => (
        <div className="flex gap-2">
          <Link to={`/student/results/${result.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          {result.status === ASSESSMENT_STATES.SUBMITTED && (
            <Link to={`/admin/results/${result.id}/grade`}>
              <Button variant="primary" size="sm" startIcon={<Edit2 size={14} />}>
                Grade
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" startIcon={<Download size={14} />}>
            Export
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
          Assessment Results
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Results</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pending Review</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.avgScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Results List
          </h3>
          <div className="flex flex-wrap gap-2">
            <SearchBar
              placeholder="Search results..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="min-w-[200px]"
            />
            <div className="flex gap-1">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === ASSESSMENT_STATES.PASSED ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(ASSESSMENT_STATES.PASSED)}
              >
                Passed
              </Button>
              <Button
                variant={filterStatus === ASSESSMENT_STATES.FAILED ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(ASSESSMENT_STATES.FAILED)}
              >
                Failed
              </Button>
              <Button
                variant={filterStatus === ASSESSMENT_STATES.SUBMITTED ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(ASSESSMENT_STATES.SUBMITTED)}
              >
                Pending
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredResults.length} of {facultyResults.length} results
        </div>

        {facultyResults.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No assessment results found
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredResults}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Score Distribution
          </h3>
          <div className="space-y-3">
            {[
              { range: '90-100%', count: facultyResults.filter(r => r.percentage >= 90).length, color: 'bg-green-200' },
              { range: '80-89%', count: facultyResults.filter(r => r.percentage >= 80 && r.percentage < 90).length, color: 'bg-blue-200' },
              { range: '70-79%', count: facultyResults.filter(r => r.percentage >= 70 && r.percentage < 80).length, color: 'bg-purple-200' },
              { range: '60-69%', count: facultyResults.filter(r => r.percentage >= 60 && r.percentage < 70).length, color: 'bg-yellow-200' },
              { range: 'Below 60%', count: facultyResults.filter(r => r.percentage < 60).length, color: 'bg-red-200' }
            ].map(item => (
              <div key={item.range} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.range}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
                <ProgressBar
                  value={facultyResults.length > 0 ? (item.count / facultyResults.length) * 100 : 0}
                  maxValue={100}
                  className={`h-3 ${item.color} dark:opacity-30`}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Results
          </h3>
          {facultyResults.length > 0 ? (
            <div className="space-y-4">
              {facultyResults
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                .slice(0, 5)
                .map(result => {
                  const assessment = assessments.find(a => a.id === result.assessmentId);
                  const student = users.find(u => u.id === result.studentId);
                  return (
                    <div key={result.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {student?.name || 'Unknown'} - {assessment?.title || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(result.status)}
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">{result.percentage}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No recent results
            </p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" startIcon={<Download size={16} />}>
            Export All Results
          </Button>
          <Button variant="outline" startIcon={<BarChart3 size={16} />}>
            Results Analytics
          </Button>
          <Button variant="outline" startIcon={<ShieldCheck size={16} />}>
            Certificates
          </Button>
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            Schedule Reports
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FacultyResults;