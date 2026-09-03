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
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  Search, 
  Filter, 
  Users, 
  BarChart3,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const { filteredAttendance, filteredUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter attendance data
  const getFilteredAttendance = () => {
    let attendance = [...filteredAttendance];
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      attendance = attendance.filter(a => 
        a.userId.toLowerCase().includes(lowerQuery) ||
        a.userName?.toLowerCase().includes(lowerQuery) ||
        a.date.toLowerCase().includes(lowerQuery) ||
        a.status.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by date
    if (selectedDate) {
      attendance = attendance.filter(a => a.date === selectedDate);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      attendance = attendance.filter(a => a.status === selectedStatus);
    }

    // Filter by user
    if (selectedUser !== 'all') {
      attendance = attendance.filter(a => a.userId === selectedUser);
    }

    // Sort by date (newest first) then by time
    attendance.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

    return attendance;
  };

  const filteredAttendanceList = getFilteredAttendance();
  const totalPages = Math.ceil(filteredAttendanceList.length / itemsPerPage);
  const currentAttendance = filteredAttendanceList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique dates and users for filters
  const uniqueDates = [...new Set(filteredAttendanceList.map(a => a.date))].sort((a, b) => new Date(b) - new Date(a));
  const studentUsers = filteredUsers.filter(u => u.role === 'STUDENT');

  // Calculate statistics
  const totalAttendance = filteredAttendanceList.length;
  const presentCount = filteredAttendanceList.filter(a => a.status === 'present').length;
  const absentCount = filteredAttendanceList.filter(a => a.status === 'absent').length;
  const lateCount = filteredAttendanceList.filter(a => a.status === 'late').length;
  const excusedCount = filteredAttendanceList.filter(a => a.status === 'excused').length;

  const presentPercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      present: { label: 'Present', color: 'bg-green-100 text-green-800' },
      absent: { label: 'Absent', color: 'bg-red-100 text-red-800' },
      late: { label: 'Late', color: 'bg-yellow-100 text-yellow-800' },
      excused: { label: 'Excused', color: 'bg-blue-100 text-blue-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Student',
      accessor: 'userName',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.userName || row.userId}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{row.userId}</div>
        </div>
      )
    },
    {
      header: 'Time',
      accessor: 'time',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span>{row.time}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge className={getStatusBadge(row.status).color}>
          {getStatusBadge(row.status).label}
        </Badge>
      )
    },
    {
      header: 'Marked By',
      accessor: 'markedBy',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.markedBy || 'System'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
            View
          </Button>
          {hasPermission('attendance.edit') && (
            <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
        {hasPermission('attendance.create') && (
          <Button startIcon={<Plus size={16} />}>
            Mark Attendance
          </Button>
        )}
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{presentCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Present</div>
          <div className="text-xs text-green-600 mt-1">{presentPercentage}% of total</div>
        </Card>
        <Card className="text-center">
          <X size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{absentCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Absent</div>
        </Card>
        <Card className="text-center">
          <Clock size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{lateCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Late</div>
        </Card>
        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{totalAttendance}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Records</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search attendance..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-primary w-full pl-10"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-primary select-sm"
            >
              <option value="">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-primary select-sm"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>

          {/* User Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student:</span>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-primary select-sm"
            >
              <option value="all">All Students</option>
              {studentUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.id})</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      {currentAttendance.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={currentAttendance}
            keyExtractor={(row) => row.id}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage
            }}
          />

          {/* Bulk Actions */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAttendanceList.length)} 
                of {filteredAttendanceList.length} records
              </div>
              <Button variant="outline" size="sm" startIcon={<Download size={14} />}>
                Export CSV
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No attendance records found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery || selectedDate || selectedStatus !== 'all' || selectedUser !== 'all' 
                ? 'Try adjusting your filters.' 
                : 'There are no attendance records yet.'}
            </p>
            {hasPermission('attendance.create') && (
              <Button startIcon={<Plus size={16} />} className="mt-4">
                Mark Attendance
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      {totalAttendance > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trends</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{presentPercentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Attendance Rate</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {Math.round((absentCount / totalAttendance) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Absence Rate</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((lateCount / totalAttendance) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Late Rate</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((excusedCount / totalAttendance) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Excused Rate</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Attendance;