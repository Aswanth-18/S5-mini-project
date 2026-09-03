import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { FileText, Search, Filter, Calendar, Clock, User, ShieldCheck, AlertTriangle, CheckCircle, X, Download, Trash2, Eye } from 'lucide-react';

const AuditLogs = () => {
  const { user } = useAuth();
  const { auditLogs, users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    successful: 0,
    failed: 0
  });

  // Mock data for audit logs if none exists
  const mockAuditLogs = [
    {
      id: 'AUDIT-001',
      userId: 'admin',
      userName: 'Administrator',
      role: ROLES.ADMIN,
      action: 'USER_CREATED',
      target: 'User',
      targetId: 'STUDENT-001',
      targetDetails: { name: 'John Doe', email: 'john@example.com' },
      status: 'Success',
      timestamp: new Date('2024-03-15T10:30:00').toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Created new student user account'
    },
    {
      id: 'AUDIT-002',
      userId: 'FACULTY-001',
      userName: 'Professor Smith',
      role: ROLES.FACULTY,
      action: 'ASSESSMENT_STARTED',
      target: 'Assessment',
      targetId: 'ASSESSMENT-001',
      targetDetails: { title: 'Web Security Fundamentals' },
      status: 'Success',
      timestamp: new Date('2024-03-15T09:15:00').toISOString(),
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'Student started assessment attempt'
    },
    {
      id: 'AUDIT-003',
      userId: 'STUDENT-001',
      userName: 'John Doe',
      role: ROLES.STUDENT,
      action: 'RESULT_SUBMITTED',
      target: 'Result',
      targetId: 'RESULT-001',
      targetDetails: { assessment: 'Web Security Fundamentals', score: 85 },
      status: 'Success',
      timestamp: new Date('2024-03-15T11:45:00').toISOString(),
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Student submitted assessment with score of 85%'
    },
    {
      id: 'AUDIT-004',
      userId: 'admin',
      userName: 'Administrator',
      role: ROLES.ADMIN,
      action: 'BACKUP_CREATED',
      target: 'Backup',
      targetId: 'BACKUP-20240314',
      targetDetails: { name: 'Manual Backup', type: 'manual' },
      status: 'Success',
      timestamp: new Date('2024-03-14T14:00:00').toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Created manual backup of all data'
    },
    {
      id: 'AUDIT-005',
      userId: 'FACULTY-002',
      userName: 'Dr. Johnson',
      role: ROLES.FACULTY,
      action: 'RESTRICTION_APPLIED',
      target: 'Restriction',
      targetId: 'RESTRICTION-001',
      targetDetails: { userId: 'STUDENT-002', type: 'ASSESSMENT_DISABLED' },
      status: 'Success',
      timestamp: new Date('2024-03-10T16:20:00').toISOString(),
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Linux; x86_64)',
      details: 'Applied assessment restriction to student for violation'
    },
    {
      id: 'AUDIT-006',
      userId: 'STUDENT-003',
      userName: 'Jane Smith',
      role: ROLES.STUDENT,
      action: 'LOGIN_FAILED',
      target: 'Authentication',
      targetId: null,
      targetDetails: { attempts: 3, reason: 'Incorrect password' },
      status: 'Failed',
      timestamp: new Date('2024-03-08T08:45:00').toISOString(),
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      details: 'Failed login attempt due to incorrect password'
    }
  ];

  const displayLogs = auditLogs.length > 0 ? auditLogs : mockAuditLogs;

  useEffect(() => {
    if (displayLogs.length > 0) {
      setFilteredLogs(displayLogs);
      
      // Count today's logs
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = displayLogs.filter(log => log.timestamp.split('T')[0] === today);
      
      // Count this week's logs
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const weekLogs = displayLogs.filter(log => {
        const logDate = log.timestamp.split('T')[0];
        return logDate >= weekAgoStr && logDate <= today;
      });
      
      // Count this month's logs
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthAgoStr = monthAgo.toISOString().split('T')[0];
      const monthLogs = displayLogs.filter(log => {
        const logDate = log.timestamp.split('T')[0];
        return logDate >= monthAgoStr && logDate <= today;
      });
      
      const successful = displayLogs.filter(log => log.status === 'Success').length;
      const failed = displayLogs.filter(log => log.status === 'Failed').length;
      
      setStats({
        total: displayLogs.length,
        today: todayLogs.length,
        thisWeek: weekLogs.length,
        thisMonth: monthLogs.length,
        successful,
        failed
      });
    }
  }, [displayLogs]);

  useEffect(() => {
    let filtered = [...displayLogs];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(log => {
        const user = allUsers.find(u => u.id === log.userId);
        return (
          (log.action || '').toLowerCase().includes(lowerQuery) ||
          (log.target || '').toLowerCase().includes(lowerQuery) ||
          (user?.name || '').toLowerCase().includes(lowerQuery) ||
          (user?.email || '').toLowerCase().includes(lowerQuery) ||
          (log.details || '').toLowerCase().includes(lowerQuery) ||
          log.id.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Filter by action
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }
    
    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(log => log.role === filterRole);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }
    
    // Filter by date
    if (filterDate !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthAgoStr = monthAgo.toISOString().split('T')[0];
      
      if (filterDate === 'today') {
        filtered = filtered.filter(log => log.timestamp.split('T')[0] === today);
      } else if (filterDate === 'this_week') {
        filtered = filtered.filter(log => {
          const logDate = log.timestamp.split('T')[0];
          return logDate >= weekAgoStr && logDate <= today;
        });
      } else if (filterDate === 'this_month') {
        filtered = filtered.filter(log => {
          const logDate = log.timestamp.split('T')[0];
          return logDate >= monthAgoStr && logDate <= today;
        });
      }
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredLogs(filtered);
  }, [searchQuery, filterAction, filterRole, filterStatus, filterDate, displayLogs, allUsers]);

  const handleDelete = (log) => {
    setSelectedLog(log);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLog) return;
    
    try {
      // In a real app, this would call a service to delete the audit log
      setShowDeleteModal(false);
      setSelectedLog(null);
    } catch (error) {
      console.error('Error deleting audit log:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE') || action.includes('START')) return 'bg-green-100 text-green-800';
    if (action.includes('UPDATE') || action.includes('MODIFY') || action.includes('EDIT')) return 'bg-blue-100 text-blue-800';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'bg-red-100 text-red-800';
    if (action.includes('LOGIN') || action.includes('AUTH')) return 'bg-purple-100 text-purple-800';
    if (action.includes('FAIL') || action.includes('ERROR')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatAction = (action) => {
    return action.replace(/(_|\.)/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const columns = [
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
      header: 'User',
      accessor: 'userId',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            {row.userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.userName || row.userId}</div>
            <Badge className={`bg-${row.role === ROLES.ADMIN ? 'red' : row.role === ROLES.FACULTY ? 'green' : 'blue'}-100 text-${row.role === ROLES.ADMIN ? 'red' : row.role === ROLES.FACULTY ? 'green' : 'blue'}-800 text-xs`}>
              {row.role.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      )
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <div>
          <Badge className={getActionColor(row.action)}>
            {formatAction(row.action)}
          </Badge>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {row.target}
          </div>
        </div>
      )
    },
    {
      header: 'Target',
      accessor: 'targetId',
      render: (row) => (
        <div className="text-sm">
          {row.targetDetails?.name || row.targetDetails?.title || row.targetId || 'N/A'}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      render: (row) => (
        <code className="text-sm bg-gray-100 dark:bg-gray-800 p-1 rounded">
          {row.ipAddress || 'N/A'}
        </code>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/audit-logs/${row.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          {hasPermission('system.manage') && (
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track all system activities and user actions</p>
        </div>
        
        {hasPermission('system.manage') && (
          <Button variant="outline" startIcon={<Download size={18} />}>
            Export Logs
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <FileText size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Logs</div>
        </Card>
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.today}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Today</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.thisWeek}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">This Week</div>
        </Card>
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.thisMonth}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">This Month</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.successful}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Successful</div>
        </Card>
        <Card className="text-center">
          <X size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.failed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search logs by user, action, target, or details..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-[250px]"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Actions</option>
              <option value="USER_CREATED">User Created</option>
              <option value="USER_UPDATED">User Updated</option>
              <option value="USER_DELETED">User Deleted</option>
              <option value="ASSESSMENT_STARTED">Assessment Started</option>
              <option value="ASSESSMENT_SUBMITTED">Assessment Submitted</option>
              <option value="RESULT_PUBLISHED">Result Published</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILED">Login Failed</option>
              <option value="BACKUP_CREATED">Backup Created</option>
              <option value="RESTRICTION_APPLIED">Restriction Applied</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Roles</option>
              {Object.values(ROLES).map(role => (
                <option key={role} value={role}>{role.replace('_', ' ')}</option>
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
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterAction('all');
              setFilterRole('all');
              setFilterStatus('all');
              setFilterDate('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredLogs}
          keyExtractor={(row) => row.id}
          emptyMessage="No audit logs found"
          emptyIcon={<FileText size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage audit logs
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" startIcon={<Download size={16} />}>
              Export All Logs
            </Button>
            <Button variant="outline" startIcon={<Calendar size={16} />}>
              Export Date Range
            </Button>
            {hasPermission('system.manage') && (
              <Button variant="outline" startIcon={<Trash2 size={16} />} className="text-red-600">
                Clear Old Logs
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <User size={24} className="mx-auto mb-2 text-purple-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active Users Today</div>
          </div>
          <div className="text-center">
            <ShieldCheck size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Actions Today</div>
          </div>
          <div className="text-center">
            <AlertTriangle size={24} className="mx-auto mb-2 text-orange-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Security Events</div>
          </div>
          <div className="text-center">
            <Clock size={24} className="mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">02:45:32</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Audit Log"
        message={`Are you sure you want to delete this audit log entry? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AuditLogs;