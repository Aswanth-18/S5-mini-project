import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { VIOLATION_TYPES, VIOLATION_SEVERITY, ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Eye, Trash2, Plus, Filter, AlertTriangle, CheckCircle, X, Users, Calendar, Clock, ShieldAlert, TrendingUp, TrendingDown } from 'lucide-react';

const Violations = () => {
  const { user } = useAuth();
  const { violations, users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0,
    unresolved: 0
  });

  // Mock data for violations if none exists
  const mockViolations = [
    {
      id: 'VIO-001',
      userId: 'STUDENT-001',
      type: 'TAB_SWITCH',
      severity: 'MEDIUM',
      description: 'User switched browser tabs during assessment',
      assessmentId: 'ASSESSMENT-001',
      assessmentTitle: 'Web Security Fundamentals',
      timestamp: new Date('2024-03-15T14:30:00').toISOString(),
      status: 'unresolved',
      resolvedBy: null,
      resolvedAt: null,
      evidence: 'Browser API detected tab switch',
      actionTaken: null
    },
    {
      id: 'VIO-002',
      userId: 'STUDENT-002',
      type: 'COPY_ATTEMPT',
      severity: 'HIGH',
      description: 'User attempted to copy text from the assessment',
      assessmentId: 'ASSESSMENT-002',
      assessmentTitle: 'Network Security Assessment',
      timestamp: new Date('2024-03-10T10:15:00').toISOString(),
      status: 'resolved',
      resolvedBy: 'FACULTY-001',
      resolvedAt: new Date('2024-03-10T12:45:00').toISOString(),
      evidence: 'Clipboard API detected copy operation',
      actionTaken: 'Warning issued'
    },
    {
      id: 'VIO-003',
      userId: 'STUDENT-003',
      type: 'WINDOW_BLUR',
      severity: 'LOW',
      description: 'User switched away from assessment window',
      assessmentId: 'ASSESSMENT-003',
      assessmentTitle: 'Linux Security Lab',
      timestamp: new Date('2024-02-28T16:20:00').toISOString(),
      status: 'unresolved',
      resolvedBy: null,
      resolvedAt: null,
      evidence: 'Window blur event detected',
      actionTaken: null
    },
    {
      id: 'VIO-004',
      userId: 'STUDENT-001',
      type: 'MULTIPLE_LOGIN',
      severity: 'CRITICAL',
      description: 'Multiple login attempts from different locations',
      assessmentId: null,
      assessmentTitle: null,
      timestamp: new Date('2024-03-01T09:00:00').toISOString(),
      status: 'unresolved',
      resolvedBy: null,
      resolvedAt: null,
      evidence: 'Simultaneous sessions detected',
      actionTaken: null
    }
  ];

  const displayViolations = violations.length > 0 ? violations : mockViolations;

  useEffect(() => {
    if (displayViolations.length > 0) {
      setFilteredViolations(displayViolations);
      
      const critical = displayViolations.filter(v => v.severity === VIOLATION_SEVERITY.CRITICAL).length;
      const high = displayViolations.filter(v => v.severity === VIOLATION_SEVERITY.HIGH).length;
      const medium = displayViolations.filter(v => v.severity === VIOLATION_SEVERITY.MEDIUM).length;
      const low = displayViolations.filter(v => v.severity === VIOLATION_SEVERITY.LOW).length;
      const resolved = displayViolations.filter(v => v.status === 'resolved').length;
      const unresolved = displayViolations.filter(v => v.status === 'unresolved').length;
      
      setStats({
        total: displayViolations.length,
        critical,
        high,
        medium,
        low,
        resolved,
        unresolved
      });
    }
  }, [displayViolations]);

  useEffect(() => {
    let filtered = [...displayViolations];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(v => {
        const user = allUsers.find(u => u.id === v.userId);
        return (
          (v.type || '').toLowerCase().includes(lowerQuery) ||
          (v.description || '').toLowerCase().includes(lowerQuery) ||
          (v.assessmentTitle || '').toLowerCase().includes(lowerQuery) ||
          (user?.name || '').toLowerCase().includes(lowerQuery) ||
          (user?.email || '').toLowerCase().includes(lowerQuery) ||
          v.id.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(v => v.type === filterType);
    }
    
    // Filter by severity
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(v => v.severity === filterSeverity);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredViolations(filtered);
  }, [searchQuery, filterType, filterSeverity, filterStatus, displayViolations, allUsers]);

  const handleDelete = (violation) => {
    setSelectedViolation(violation);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedViolation) return;
    
    try {
      // In a real app, this would call a service to delete the violation
      setShowDeleteModal(false);
      setSelectedViolation(null);
    } catch (error) {
      console.error('Error deleting violation:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case VIOLATION_SEVERITY.CRITICAL: return 'bg-red-100 text-red-800';
      case VIOLATION_SEVERITY.HIGH: return 'bg-orange-100 text-orange-800';
      case VIOLATION_SEVERITY.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case VIOLATION_SEVERITY.LOW: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getTypeLabel = (type) => {
    return VIOLATION_TYPES[type] || type.replace('_', ' ');
  };

  const columns = [
    {
      header: 'User',
      accessor: 'userId',
      render: (row) => {
        const user = allUsers.find(u => u.id === row.userId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{user?.name || row.userId}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{user?.email || ''}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Violation',
      accessor: 'type',
      render: (row) => (
        <div>
          <Badge className="bg-purple-100 text-purple-800 mb-1">
            {getTypeLabel(row.type)}
          </Badge>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-40">
            {row.description}
          </div>
        </div>
      )
    },
    {
      header: 'Assessment',
      accessor: 'assessmentTitle',
      render: (row) => (
        <div className="text-sm">
          {row.assessmentTitle || 'General'}
        </div>
      )
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (row) => (
        <Badge className={getSeverityColor(row.severity)}>
          {row.severity.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={getStatusColor(row.status)}>
          {row.status.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(row.timestamp).toLocaleString()}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/violations/${row.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          {hasPermission('violations.manage') && (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Violation Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage all assessment violations and security incidents</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="text-center">
          <ShieldAlert size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Violations</div>
        </Card>
        <Card className="text-center">
          <AlertTriangle size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.critical}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Critical</div>
        </Card>
        <Card className="text-center">
          <AlertTriangle size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.high}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">High</div>
        </Card>
        <Card className="text-center">
          <AlertTriangle size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.medium}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Medium</div>
        </Card>
        <Card className="text-center">
          <AlertTriangle size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.low}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Low</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.resolved}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Resolved</div>
        </Card>
        <Card className="text-center">
          <X size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.unresolved}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Unresolved</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search violations by user, type, or assessment..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-[250px]"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Types</option>
              {Object.entries(VIOLATION_TYPES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Severities</option>
              {Object.entries(VIOLATION_SEVERITY).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Statuses</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setFilterSeverity('all');
              setFilterStatus('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Violations Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredViolations}
          keyExtractor={(row) => row.id}
          emptyMessage="No violations found"
          emptyIcon={<ShieldAlert size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Perform bulk actions on violations
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" startIcon={<CheckCircle size={16} />}>
              Mark All Resolved
            </Button>
            <Button variant="outline" startIcon={<Trash2 size={16} />} className="text-red-600">
              Delete All
            </Button>
            {hasPermission('violations.manage') && (
              <Button variant="primary" startIcon={<Plus size={16} />}>
                Add Violation
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Recent Trends */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Trends</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <TrendingUp size={24} className="mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">+12%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Violations This Month</div>
          </div>
          <div className="text-center">
            <TrendingDown size={24} className="mx-auto mb-2 text-red-600" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">-5%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Resolution Rate</div>
          </div>
          <div className="text-center">
            <Users size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Repeat Offenders</div>
          </div>
          <div className="text-center">
            <AlertTriangle size={24} className="mx-auto mb-2 text-orange-600" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">CRITICAL</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Highest Severity</div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Violation Record"
        message={`Are you sure you want to delete this violation record? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Violations;