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
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Eye, Mail, Calendar, ShieldAlert, Filter } from 'lucide-react';

const Users = () => {
  const { user } = useAuth();
  const { users, isLoading } = useData();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    students: 0,
    faculty: 0,
    admins: 0
  });

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(users);
      
      const active = users.filter(u => u.status === 'active').length;
      const inactive = users.filter(u => u.status !== 'active').length;
      const students = users.filter(u => u.role === ROLES.STUDENT).length;
      const faculty = users.filter(u => u.role === ROLES.FACULTY).length;
      const admins = users.filter(u => u.role === ROLES.ADMIN).length;
      
      setStats({
        total: users.length,
        active,
        inactive,
        students,
        faculty,
        admins
      });
    }
  }, [users]);

  const filteredData = filteredUsers
    .filter(user => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.id && user.id.toLowerCase().includes(query)) ||
        (user.department && user.department.toLowerCase().includes(query))
      );
    })
    .filter(user => {
      if (filterRole === 'all') return true;
      return user.role === filterRole;
    })
    .filter(user => {
      if (filterStatus === 'all') return true;
      return user.status === filterStatus;
    });

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN: return 'bg-red-100 text-red-800';
      case ROLES.FACULTY: return 'bg-blue-100 text-blue-800';
      case ROLES.STUDENT: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleDeleteUser = (userToDelete) => {
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      // In a real implementation, this would call an API
      console.log('Deleting user:', selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300 font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{user.id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => (
        <Badge className={getRoleColor(user.role)}>
          {user.role}
        </Badge>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (user) => (
        <span className="text-sm">{user.department || 'N/A'}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (user) => (
        <Badge className={getStatusColor(user.status)}>
          {user.status}
        </Badge>
      )
    },
    {
      header: 'Join Date',
      accessor: 'joinDate',
      render: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(user.joinDate).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Last Active',
      accessor: 'lastActive',
      render: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (user) => (
        <div className="flex gap-2">
          <Link to={`/admin/users/${user.id}/edit`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <Link to={`/admin/users/${user.id}/edit`}>
            <Button variant="primary" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            startIcon={<Trash2 size={14} />} 
            onClick={() => handleDeleteUser(user)}
          >
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
          User Management
        </h1>
        <Link to="/admin/users/new">
          <Button variant="primary" startIcon={<Plus size={16} />}>
            Add User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Users</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Inactive</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldAlert size={24} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Admins</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.faculty}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Faculty</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User List
          </h3>
          <div className="flex flex-wrap gap-2">
            <SearchBar
              placeholder="Search users..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="min-w-[200px]"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="select select-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Roles</option>
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.FACULTY}>Faculty</option>
              <option value={ROLES.STUDENT}>Student</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredData.length} of {users.length} users
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No users found
            </p>
            <Link to="/admin/users/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Add Your First User
              </Button>
            </Link>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Bulk Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" startIcon={<Mail size={16} />}>
            Email All Users
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Export User List
          </Button>
          <Button variant="outline" startIcon={<Filter size={16} />}>
            Advanced Filters
          </Button>
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            Activity Report
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Analytics
        </h3>
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <Users size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              User analytics chart will be available in the full version
            </p>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
        title="Confirm User Deletion"
        message={`Are you sure you want to delete user "${selectedUser?.name}" (${selectedUser?.email})? This action cannot be undone.`}
        confirmButtonText="Delete User"
        confirmButtonVariant="danger"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default Users;