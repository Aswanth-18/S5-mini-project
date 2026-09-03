import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Download, Upload, Database, Clock, Calendar, Filter, CheckCircle, X, AlertTriangle, Archive, Restore } from 'lucide-react';

const Backups = () => {
  const { user } = useAuth();
  const { isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredBackups, setFilteredBackups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    automatic: 0,
    manual: 0,
    totalSize: 0
  });

  // Mock data for backups
  const mockBackups = [
    {
      id: 'BACKUP-20240315-143000',
      name: 'Automatic Backup - Mar 15, 2024',
      type: 'automatic',
      createdAt: new Date('2024-03-15T14:30:00').toISOString(),
      size: 245.5,
      createdBy: 'system',
      status: 'available',
      description: 'Daily automatic backup',
      components: ['users', 'courses', 'assessments', 'results', 'settings'],
      isEncrypted: true
    },
    {
      id: 'BACKUP-20240314-090000',
      name: 'Manual Backup - Before Assessment Update',
      type: 'manual',
      createdAt: new Date('2024-03-14T09:00:00').toISOString(),
      size: 238.2,
      createdBy: 'admin',
      status: 'available',
      description: 'Backup created before major assessment update',
      components: ['users', 'courses', 'assessments', 'results'],
      isEncrypted: true
    },
    {
      id: 'BACKUP-20240310-164500',
      name: 'Automatic Backup - Mar 10, 2024',
      type: 'automatic',
      createdAt: new Date('2024-03-10T16:45:00').toISOString(),
      size: 235.8,
      createdBy: 'system',
      status: 'available',
      description: 'Daily automatic backup',
      components: ['users', 'courses', 'assessments', 'results', 'settings'],
      isEncrypted: true
    },
    {
      id: 'BACKUP-20240301-000000',
      name: 'Monthly Archive - March 2024',
      type: 'archive',
      createdAt: new Date('2024-03-01T00:00:00').toISOString(),
      size: 450.3,
      createdBy: 'system',
      status: 'archived',
      description: 'Monthly archive backup',
      components: ['all'],
      isEncrypted: true
    }
  ];

  useEffect(() => {
    if (mockBackups.length > 0) {
      setFilteredBackups(mockBackups);
      
      const automatic = mockBackups.filter(b => b.type === 'automatic').length;
      const manual = mockBackups.filter(b => b.type === 'manual').length;
      const totalSize = mockBackups.reduce((sum, b) => sum + b.size, 0);
      
      setStats({
        total: mockBackups.length,
        automatic,
        manual,
        totalSize
      });
    }
  }, []);

  useEffect(() => {
    let filtered = [...mockBackups];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(backup =>
        backup.name.toLowerCase().includes(lowerQuery) ||
        backup.description.toLowerCase().includes(lowerQuery) ||
        backup.id.toLowerCase().includes(lowerQuery) ||
        (backup.createdBy || '').toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(backup => backup.type === filterType);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(backup => backup.status === filterStatus);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredBackups(filtered);
  }, [searchQuery, filterType, filterStatus]);

  const handleDelete = (backup) => {
    setSelectedBackup(backup);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedBackup) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to delete the backup
      console.log('Deleting backup:', selectedBackup.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove from list
      setFilteredBackups(prev => prev.filter(b => b.id !== selectedBackup.id));
      
      setSuccess(true);
      setShowDeleteModal(false);
      setSelectedBackup(null);
      
    } catch (err) {
      setError(err.message || 'Failed to delete backup');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = (backup) => {
    if (!window.confirm(`Are you sure you want to restore backup "${backup.name}"? This will overwrite current data.`)) {
      return;
    }
    
    // In a real app, this would call a service to restore the backup
    console.log('Restoring backup:', backup.id);
  };

  const handleCreateBackup = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to create a backup
      console.log('Creating new backup');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to list (mock)
      const newBackup = {
        id: `BACKUP-${new Date().toISOString().replace(/[:.]/g, '')}`,
        name: `Manual Backup - ${new Date().toLocaleDateString()}`,
        type: 'manual',
        createdAt: new Date().toISOString(),
        size: 240.0,
        createdBy: user?.id || 'current_user',
        status: 'available',
        description: 'Manual backup created by administrator',
        components: ['users', 'courses', 'assessments', 'results', 'settings'],
        isEncrypted: true
      };
      
      setFilteredBackups(prev => [newBackup, ...prev]);
      
      setSuccess(true);
      
    } catch (err) {
      setError(err.message || 'Failed to create backup');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'automatic': return 'bg-blue-100 text-blue-800';
      case 'manual': return 'bg-green-100 text-green-800';
      case 'archive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'corrupted': return 'bg-red-100 text-red-800';
      case 'restoring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'Backup',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{row.id}</div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className={getTypeColor(row.type)}>
          {row.type.replace('_', ' ')}
        </Badge>
      )
    },
    {
      header: 'Size',
      accessor: 'size',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{row.size} MB</div>
        </div>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(row.createdAt).toLocaleString()}
        </div>
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
      header: 'Components',
      accessor: 'components',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.components.map(component => (
            <Badge key={component} className="bg-gray-100 text-gray-800 text-xs">
              {component}
            </Badge>
          ))}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            startIcon={<Restore size={14} />} 
            onClick={() => handleRestore(row)}
          >
            Restore
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            startIcon={<Download size={14} />}
          >
            Download
          </Button>
          {hasPermission('system.manage') && row.status === 'available' && (
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

  if (!hasPermission('system.manage') && !hasPermission('backup.create') && !hasPermission('backup.restore')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backup Management</h1>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>You do not have permission to access backup management. Please contact an administrator.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backup Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Create, restore, and manage system backups</p>
        </div>
        
        {hasPermission('backup.create') && (
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              startIcon={<Plus size={18} />} 
              onClick={handleCreateBackup}
              disabled={isProcessing}
            >
              {isProcessing ? 'Creating...' : 'Create Backup'}
            </Button>
            <Link to="/admin/backups/new">
              <Button variant="outline" startIcon={<Upload size={18} />}>
                Upload Backup
              </Button>
            </Link>
          </div>
        )}
      </div>

      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {success && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle size={20} />
            <span>Backup operation completed successfully!</span>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Database size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Backups</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.automatic}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Automatic</div>
        </Card>
        <Card className="text-center">
          <Upload size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.manual}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Manual</div>
        </Card>
        <Card className="text-center">
          <Archive size={24} className="mx-auto mb-2 text-gray-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalSize.toFixed(1)} GB</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Size</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search backups by name, ID, or description..."
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
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="archive">Archive</option>
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
              <option value="available">Available</option>
              <option value="archived">Archived</option>
              <option value="corrupted">Corrupted</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setFilterStatus('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Backups Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredBackups}
          keyExtractor={(row) => row.id}
          emptyMessage="No backups found"
          emptyIcon={<Database size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Backup Schedule */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup Schedule</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Clock size={24} className="mx-auto mb-2 text-blue-600" />
              <div className="font-medium text-gray-900 dark:text-white">Daily Backup</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">02:00 AM</div>
            </div>
            <div className="text-center">
              <Calendar size={24} className="mx-auto mb-2 text-green-600" />
              <div className="font-medium text-gray-900 dark:text-white">Weekly Backup</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Sunday 03:00 AM</div>
            </div>
            <div className="text-center">
              <Archive size={24} className="mx-auto mb-2 text-purple-600" />
              <div className="font-medium text-gray-900 dark:text-white">Monthly Backup</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">1st of Month 04:00 AM</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Retention Policy:</strong> Daily backups kept for 30 days, weekly backups for 90 days, monthly backups for 1 year.
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Backup"
        message={`Are you sure you want to delete backup "${selectedBackup?.name || ''}"? This action cannot be undone and the backup file will be permanently deleted.`}
        confirmText="Delete Backup"
        confirmVariant="danger"
        cancelText="Cancel"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default Backups;