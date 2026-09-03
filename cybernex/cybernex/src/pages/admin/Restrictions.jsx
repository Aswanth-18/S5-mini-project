import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { RESTRICTION_TYPES, RESTRICTION_SEVERITY, ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Eye, ShieldAlert, Clock, Calendar, User, AlertTriangle, CheckCircle, X, Filter, Search } from 'lucide-react';

const Restrictions = () => {
  const { user } = useAuth();
  const { restrictions, users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredRestrictions, setFilteredRestrictions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRestriction, setSelectedRestriction] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    byType: {}
  });

  useEffect(() => {
    if (restrictions.length > 0) {
      setFilteredRestrictions(restrictions);
      
      const active = restrictions.filter(r => {
        if (r.expiresAt) {
          return new Date(r.expiresAt) > new Date();
        }
        return true; // No expiry date means active
      }).length;
      
      const expired = restrictions.filter(r => {
        return r.expiresAt && new Date(r.expiresAt) <= new Date();
      }).length;
      
      // Count by type
      const byType = {};
      restrictions.forEach(r => {
        byType[r.type] = (byType[r.type] || 0) + 1;
      });
      
      setStats({
        total: restrictions.length,
        active,
        expired,
        byType
      });
    }
  }, [restrictions]);

  useEffect(() => {
    let filtered = [...restrictions];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const user = allUsers.find(u => u.id === r.userId);
        return (
          (r.type || '').toLowerCase().includes(lowerQuery) ||
          (r.reason || '').toLowerCase().includes(lowerQuery) ||
          (user?.name || '').toLowerCase().includes(lowerQuery) ||
          (user?.email || '').toLowerCase().includes(lowerQuery) ||
          r.id.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    // Filter by severity
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(r => r.severity === filterSeverity);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(r => {
          if (r.expiresAt) {
            return new Date(r.expiresAt) > new Date();
          }
          return true;
        });
      } else if (filterStatus === 'expired') {
        filtered = filtered.filter(r => {
          return r.expiresAt && new Date(r.expiresAt) <= new Date();
        });
      }
    }
    
    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredRestrictions(filtered);
  }, [searchQuery, filterType, filterSeverity, filterStatus, restrictions, allUsers]);

  const handleDelete = (restriction) => {
    setSelectedRestriction(restriction);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRestriction) return;
    
    try {
      // In a real app, this would call a service to delete the restriction
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setSelectedRestriction(null);
    } catch (error) {
      console.error('Error deleting restriction:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case RESTRICTION_SEVERITY.CRITICAL: return 'bg-red-100 text-red-800';
      case RESTRICTION_SEVERITY.HIGH: return 'bg-orange-100 text-orange-800';
      case RESTRICTION_SEVERITY.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case RESTRICTION_SEVERITY.LOW: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (restriction) => {
    if (restriction.expiresAt && new Date(restriction.expiresAt) <= new Date()) {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (restriction) => {
    if (restriction.expiresAt && new Date(restriction.expiresAt) <= new Date()) {
      return 'Expired';
    }
    return 'Active';
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
              <div className="font-medium text-gray-900 dark:text-white">
                {user?.name || row.userId}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email || ''}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className="bg-purple-100 text-purple-800">
          {row.type.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (row) => (
        <Badge className={getSeverityColor(row.severity || RESTRICTION_SEVERITY.MEDIUM)}>
          {row.severity || RESTRICTION_SEVERITY.MEDIUM}
        </Badge>
      )
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => (
        <div className="max-w-40 truncate text-sm">
          {row.reason || 'No reason provided'}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={getStatusColor(row)}>
          {getStatusText(row)}
        </Badge>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(row.createdAt).toLocaleDateString()}
          <br />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )
    },
    {
      header: 'Expires',
      accessor: 'expiresAt',
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {row.expiresAt 
            ? new Date(row.expiresAt).toLocaleDateString()
            : 'Never'}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/restrictions/${row.id}/edit`}>
            <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          {hasPermission('restrictions.manage') && (
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Restrictions</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage user access restrictions and penalties</p>
        </div>
        
        {hasPermission('restrictions.manage') && (
          <Link to="/admin/restrictions/new">
            <Button variant="primary" startIcon={<Plus size={18} />}>
              Add Restriction
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <ShieldAlert size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Restrictions</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
        </Card>
        <Card className="text-center">
          <X size={24} className="mx-auto mb-2 text-gray-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.expired}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Expired</div>
        </Card>
        <Card className="text-center">
          <AlertTriangle size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{Object.keys(stats.byType).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Restriction Types</div>
        </Card>
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Expiring Soon</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Permanent</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search restrictions by user, type, or reason..."
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
              {Object.entries(RESTRICTION_TYPES).map(([key, value]) => (
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
              {Object.entries(RESTRICTION_SEVERITY).map(([key, value]) => (
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
              <option value="active">Active</option>
              <option value="expired">Expired</option>
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

      {/* Restrictions Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredRestrictions}
          keyExtractor={(row) => row.id}
          emptyMessage="No access restrictions found"
          emptyIcon={<ShieldAlert size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Remove Restriction"
        message={`Are you sure you want to remove this restriction from ${selectedRestriction?.userId || 'this user'}? This action cannot be undone.`}
        confirmText="Remove"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Restrictions;