import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { 
  ShieldAlert, Users, Calendar, Clock, Edit2, Eye, Filter, 
  Download, AlertTriangle, TrendingUp, TrendingDown, CheckCircle 
} from 'lucide-react';

const FacultyViolations = () => {
  const { user } = useAuth();
  const { violations, users, courses, assessments, isLoading } = useData();
  const [facultyViolations, setFacultyViolations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0,
    pending: 0
  });

  useEffect(() => {
    if (user && violations.length > 0) {
      // Get courses taught by this faculty
      const facultyCourses = courses.filter(c => c.createdBy === user.id);
      const courseIds = facultyCourses.map(c => c.id);
      
      // Get assessments created by this faculty
      const facultyAssessments = assessments.filter(a => a.createdBy === user.id);
      const assessmentIds = facultyAssessments.map(a => a.id);
      
      // Filter violations for faculty's content
      const userViolations = violations.filter(v => 
        courseIds.includes(v.courseId) || 
        assessmentIds.includes(v.assessmentId) ||
        (v.createdBy === user.id)
      );
      
      setFacultyViolations(userViolations);
      
      // Calculate statistics
      const high = userViolations.filter(v => v.severity === 'high').length;
      const medium = userViolations.filter(v => v.severity === 'medium').length;
      const low = userViolations.filter(v => v.severity === 'low').length;
      const resolved = userViolations.filter(v => v.status === 'resolved').length;
      const pending = userViolations.filter(v => v.status !== 'resolved').length;
      
      setStats({
        total: userViolations.length,
        high,
        medium,
        low,
        resolved,
        pending
      });
    }
  }, [user, violations, courses, assessments]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle size={16} className="text-red-600" />;
      case 'medium': return <ShieldAlert size={16} className="text-yellow-600" />;
      case 'low': return <CheckCircle size={16} className="text-green-600" />;
      default: return <ShieldAlert size={16} className="text-gray-600" />;
    }
  };

  const getStudentName = (studentId) => {
    const student = users.find(u => u.id === studentId);
    return student?.name || studentId || 'Unknown';
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || courseId || 'N/A';
  };

  const getAssessmentTitle = (assessmentId) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    return assessment?.title || assessmentId || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredViolations = facultyViolations.filter(violation => {
    const query = searchQuery.toLowerCase();
    return (
      getStudentName(violation.studentId).toLowerCase().includes(query) ||
      getCourseTitle(violation.courseId).toLowerCase().includes(query) ||
      getAssessmentTitle(violation.assessmentId).toLowerCase().includes(query) ||
      violation.type?.toLowerCase().includes(query) ||
      violation.description?.toLowerCase().includes(query) ||
      violation.severity?.toLowerCase().includes(query) ||
      violation.status?.toLowerCase().includes(query) ||
      violation.id.toLowerCase().includes(query)
    );
  }).filter(violation => {
    if (filterSeverity === 'all') return true;
    return violation.severity === filterSeverity;
  }).filter(violation => {
    if (filterStatus === 'all') return true;
    return violation.status === filterStatus;
  });

  const columns = [
    {
      header: 'Violation',
      accessor: 'violation',
      render: (violation) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{violation.type || 'Unknown'}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {violation.description || 'No description'}
          </div>
        </div>
      )
    },
    {
      header: 'Student',
      accessor: 'student',
      render: (violation) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{getStudentName(violation.studentId)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{violation.studentId}</div>
        </div>
      )
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (violation) => (
        <div className="flex items-center gap-2">
          {getSeverityIcon(violation.severity)}
          <Badge className={getSeverityColor(violation.severity)}>
            {violation.severity?.charAt(0).toUpperCase() + violation.severity?.slice(1) || 'Unknown'}
          </Badge>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (violation) => (
        <Badge className={getStatusColor(violation.status)}>
          {violation.status?.charAt(0).toUpperCase() + violation.status?.slice(1) || 'Unknown'}
        </Badge>
      )
    },
    {
      header: 'Context',
      accessor: 'context',
      render: (violation) => (
        <div>
          {violation.courseId && (
            <Badge variant="secondary" className="mb-1">
              {getCourseTitle(violation.courseId)}
            </Badge>
          )}
          {violation.assessmentId && (
            <Badge variant="secondary">
              {getAssessmentTitle(violation.assessmentId)}
            </Badge>
          )}
        </div>
      )
    },
    {
      header: 'Detected',
      accessor: 'detectedAt',
      render: (violation) => (
        <div>
          <div className="text-sm font-medium">{formatDate(violation.detectedAt)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">{formatTime(violation.detectedAt)}</div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (violation) => (
        <div className="flex gap-2">
          <Link to={`/admin/violations/${violation.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <Link to={`/admin/violations/${violation.id}/edit`}>
            <Button variant="primary" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
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
          Violation Monitoring
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldAlert size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Violations</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">High Severity</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldAlert size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Medium Severity</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Low Severity</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Resolved</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Violations List
          </h3>
          <div className="flex flex-wrap gap-2">
            <SearchBar
              placeholder="Search violations..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="min-w-[200px]"
            />
            <div className="flex gap-1">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="select select-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select select-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All Statuses</option>
                <option value="resolved">Resolved</option>
                <option value="investigating">Investigating</option>
                <option value="pending">Pending</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredViolations.length} of {facultyViolations.length} violations
        </div>

        {facultyViolations.length === 0 ? (
          <div className="text-center py-12">
            <ShieldAlert size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No violations detected
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This is a good sign! Your students are following the guidelines.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredViolations}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Violations
          </h3>
          {facultyViolations.length > 0 ? (
            <div className="space-y-4">
              {facultyViolations
                .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt))
                .slice(0, 5)
                .map(violation => (
                  <div key={violation.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getSeverityIcon(violation.severity)}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {violation.type || 'Unknown Violation'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {getStudentName(violation.studentId)} - {getCourseTitle(violation.courseId)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(violation.detectedAt)}
                        </div>
                      </div>
                      <Badge className={getStatusColor(violation.status)}>
                        {violation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No recent violations
            </p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Violation Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'Multiple Attempts', count: facultyViolations.filter(v => v.type === 'Multiple Attempts').length },
              { type: 'Time Exceeded', count: facultyViolations.filter(v => v.type === 'Time Exceeded').length },
              { type: 'Unauthorized Access', count: facultyViolations.filter(v => v.type === 'Unauthorized Access').length },
              { type: 'Copy-Paste Detected', count: facultyViolations.filter(v => v.type === 'Copy-Paste Detected').length },
              { type: 'IP Change', count: facultyViolations.filter(v => v.type === 'IP Change').length }
            ].map(item => (
              <div key={item.type} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">{item.type}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" startIcon={<Filter size={16} />}>
            Advanced Filters
          </Button>
          <Button variant="outline" startIcon={<Download size={16} />}>
            Export Violations
          </Button>
          <Button variant="outline" startIcon={<ShieldAlert size={16} />}>
            Generate Report
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Notify Students
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Violation Trends
        </h3>
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <ShieldAlert size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Violation trend chart will be available in the full version
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Prevention Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ShieldAlert size={24} className="mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Set Clear Rules
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Establish assessment guidelines and consequences
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Users size={24} className="mx-auto mb-2 text-green-600" />
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
              Monitor Activity
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Keep track of student behavior patterns
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <TrendingUp size={24} className="mx-auto mb-2 text-purple-600" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
              Educate Students
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Teach academic integrity and ethical behavior
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultyViolations;