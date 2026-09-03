import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, CYBER_DOMAINS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import RoleBadge from '../../components/common/RoleBadge';
import { Plus, Edit2, Trash2, Eye, Users, Mail, Calendar, ShieldCheck, Filter, X, CheckCircle, Clock } from 'lucide-react';

const Faculty = () => {
  const { user } = useAuth();
  const { faculty, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    domains: {}
  });

  useEffect(() => {
    if (faculty.length > 0) {
      setFilteredFaculty(faculty);
      
      const active = faculty.filter(f => f.status === 'active').length;
      const inactive = faculty.filter(f => f.status !== 'active').length;
      
      // Count by domain
      const domains = {};
      faculty.forEach(f => {
        if (f.domain) {
          domains[f.domain] = (domains[f.domain] || 0) + 1;
        }
      });
      
      setStats({
        total: faculty.length,
        active,
        inactive,
        domains
      });
    }
  }, [faculty]);

  useEffect(() => {
    let results = [...faculty];
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter(f =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.email.toLowerCase().includes(lowerQuery) ||
        (f.domain && f.domain.toLowerCase().includes(lowerQuery)) ||
        f.id.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by domain
    if (filterDomain !== 'all') {
      results = results.filter(f => f.domain === filterDomain);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      results = results.filter(f => f.status === filterStatus);
    }
    
    setFilteredFaculty(results);
  }, [searchQuery, filterDomain, filterStatus, faculty]);

  const handleDelete = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedFaculty) return;
    
    try {
      // In a real app, this would call a service to delete the faculty member
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error('Error deleting faculty member:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <div className="text-gray-900 dark:text-white">{row.email}</div>
      )
    },
    {
      header: 'Domain',
      accessor: 'domain',
      render: (row) => (
        <Badge className="bg-blue-100 text-blue-800">
          {row.domain || 'General'}
        </Badge>
      )
    },
    {
      header: 'Courses',
      accessor: 'coursesCount',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{row.coursesCount || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">courses</div>
        </div>
      )
    },
    {
      header: 'Students',
      accessor: 'studentsCount',
      render: (row) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{row.studentsCount || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">students</div>
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
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/faculty/${row.id}/edit`}>
            <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          {hasPermission('faculty.manage') && (
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage faculty members and their assignments</p>
        </div>
        
        {hasPermission('faculty.manage') && (
          <Link to="/admin/faculty/new">
            <Button variant="primary" startIcon={<Plus size={18} />}>
              Add Faculty
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Faculty</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.inactive}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Inactive</div>
        </Card>
        <Card className="text-center">
          <ShieldCheck size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{Object.keys(stats.domains).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Domains</div>
        </Card>
        <Card className="text-center">
          <Mail size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search faculty..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-[200px]"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Domain:</span>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Domains</option>
              {CYBER_DOMAINS.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
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
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterDomain('all');
              setFilterStatus('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Faculty Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredFaculty}
          keyExtractor={(row) => row.id}
          emptyMessage="No faculty members found"
          emptyIcon={<Users size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Faculty Member"
        message={`Are you sure you want to delete ${selectedFaculty?.name || 'this faculty member'}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Faculty;