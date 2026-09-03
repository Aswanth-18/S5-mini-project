import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import { Calendar, Clock, User, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

const StudentAttendance = () => {
  const { user } = useAuth();
  const { attendance, isLoading } = useData();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (user && attendance.length > 0) {
      const studentAttendance = attendance.filter(a => a.studentId === user.id);
      setAttendanceRecords(studentAttendance);
      
      // Calculate stats
      const present = studentAttendance.filter(a => a.status === 'present').length;
      const absent = studentAttendance.filter(a => a.status === 'absent').length;
      const late = studentAttendance.filter(a => a.status === 'late').length;
      const excused = studentAttendance.filter(a => a.status === 'excused').length;
      const total = studentAttendance.length;
      
      setStats({
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
      });
    }
  }, [user, attendance]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'absent':
        return <XCircle size={16} className="text-red-600" />;
      case 'late':
        return <Clock size={16} className="text-yellow-600" />;
      case 'excused':
        return <User size={16} className="text-blue-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
    }
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
      header: 'Day',
      accessor: 'day',
      render: (row) => (
        <span className="font-medium">
          {new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <Badge className={getStatusColor(row.status)}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        </div>
      )
    },
    {
      header: 'Time',
      accessor: 'time',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : 'N/A'}
        </span>
      )
    },
    {
      header: 'Session',
      accessor: 'session',
      render: (row) => (
        <span className="text-sm font-medium">
          {row.sessionType || row.courseName || 'Regular'}
        </span>
      )
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {row.remarks || '-'}
        </span>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Attendance
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Sessions
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.present}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Present
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {stats.absent}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Absent
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.late}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Late
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.attendanceRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Attendance Rate
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Attendance Records
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total: {attendanceRecords.length} records
          </div>
        </div>
        
        {attendanceRecords.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No attendance records found
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={attendanceRecords}
            pageSize={10}
            showPagination
            className="attendance-table"
          />
        )}
      </Card>

      {/* Attendance Trend Chart Placeholder */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Attendance Trend
        </h3>
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Attendance trend chart will be displayed here
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentAttendance;