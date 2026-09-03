import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ProgressBar from '../../components/common/ProgressBar';
import { 
  Users, Calendar, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown,
  UserCheck, UserX, Filter, Download, Edit2, Eye 
} from 'lucide-react';

const FacultyAttendance = () => {
  const { user } = useAuth();
  const { attendance, users, courses, isLoading } = useData();
  const [facultyAttendance, setFacultyAttendance] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (user && attendance.length > 0 && users.length > 0) {
      // Get courses taught by this faculty
      const facultyCourses = courses.filter(c => c.createdBy === user.id);
      const courseIds = facultyCourses.map(c => c.id);
      
      // Get students enrolled in faculty's courses
      const facultyStudents = users.filter(u => 
        u.role === ROLES.STUDENT && 
        u.enrolledCourses?.some(courseId => courseIds.includes(courseId))
      );
      const studentIds = facultyStudents.map(s => s.id);
      
      // Filter attendance for faculty's students
      const userAttendance = attendance.filter(a => studentIds.includes(a.studentId));
      setFacultyAttendance(userAttendance);
      
      // Calculate statistics
      const present = userAttendance.filter(a => a.status === 'present').length;
      const absent = userAttendance.filter(a => a.status === 'absent').length;
      const late = userAttendance.filter(a => a.status === 'late').length;
      const excused = userAttendance.filter(a => a.status === 'excused').length;
      const total = userAttendance.length;
      
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
      
      setStats({
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate
      });
    }
  }, [user, attendance, users, courses]);

  const filteredAttendance = facultyAttendance.filter(record => {
    const query = searchQuery.toLowerCase();
    const student = users.find(u => u.id === record.studentId);
    
    return (
      (student?.name.toLowerCase().includes(query) ||
      student?.email.toLowerCase().includes(query) ||
      record.status.toLowerCase().includes(query) ||
      record.sessionType?.toLowerCase().includes(query)) ||
      (record.courseId && courses.find(c => c.id === record.courseId)?.title.toLowerCase().includes(query))
    );
  }).filter(record => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} className="text-green-600" />;
      case 'absent': return <XCircle size={16} className="text-red-600" />;
      case 'late': return <Clock size={16} className="text-yellow-600" />;
      case 'excused': return <UserCheck size={16} className="text-blue-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
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

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      header: 'Student',
      accessor: 'student',
      render: (record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{getStudentName(record.studentId)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{record.studentId}</div>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (record) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formatDate(record.date)}
        </span>
      )
    },
    {
      header: 'Session',
      accessor: 'session',
      render: (record) => (
        <span className="text-sm font-medium">
          {record.sessionType || getCourseTitle(record.courseId) || 'Regular'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (record) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(record.status)}
          <Badge className={getStatusColor(record.status)}>
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Badge>
        </div>
      )
    },
    {
      header: 'Check-in',
      accessor: 'checkInTime',
      render: (record) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formatTime(record.checkInTime)}
        </span>
      )
    },
    {
      header: 'Check-out',
      accessor: 'checkOutTime',
      render: (record) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formatTime(record.checkOutTime)}
        </span>
      )
    },
    {
      header: 'Remarks',
      accessor: 'remarks',
      render: (record) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {record.remarks || '-'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (record) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
            View
          </Button>
          <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
            Edit
          </Button>
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
          Attendance Management
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Records</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Present</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Absent</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Late</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <UserCheck size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Excused</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Rate</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Attendance Records
          </h3>
          <div className="flex flex-wrap gap-2">
            <SearchBar
              placeholder="Search attendance..."
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
                variant={filterStatus === 'present' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('present')}
              >
                Present
              </Button>
              <Button
                variant={filterStatus === 'absent' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('absent')}
              >
                Absent
              </Button>
              <Button
                variant={filterStatus === 'late' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('late')}
              >
                Late
              </Button>
              <Button
                variant={filterStatus === 'excused' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('excused')}
              >
                Excused
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredAttendance.length} of {facultyAttendance.length} records
        </div>

        {facultyAttendance.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No attendance records found
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredAttendance}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance by Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Present', count: stats.present, color: 'bg-green-200', percentage: stats.total > 0 ? (stats.present / stats.total) * 100 : 0 },
              { label: 'Absent', count: stats.absent, color: 'bg-red-200', percentage: stats.total > 0 ? (stats.absent / stats.total) * 100 : 0 },
              { label: 'Late', count: stats.late, color: 'bg-yellow-200', percentage: stats.total > 0 ? (stats.late / stats.total) * 100 : 0 },
              { label: 'Excused', count: stats.excused, color: 'bg-blue-200', percentage: stats.total > 0 ? (stats.excused / stats.total) * 100 : 0 }
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
                <ProgressBar
                  value={item.percentage}
                  maxValue={100}
                  className={`h-3 ${item.color} dark:opacity-30`}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Attendance
          </h3>
          {facultyAttendance.length > 0 ? (
            <div className="space-y-4">
              {facultyAttendance
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map(record => (
                  <div key={record.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getStudentName(record.studentId)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(record.date)} - {getCourseTitle(record.courseId)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No recent attendance records
            </p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            Mark Attendance
          </Button>
          <Button variant="outline" startIcon={<Download size={16} />}>
            Export Attendance
          </Button>
          <Button variant="outline" startIcon={<TrendingUp size={16} />}>
            Attendance Analytics
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Student Reports
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Attendance Trends
        </h3>
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <TrendingUp size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Attendance trend chart will be available in the full version
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultyAttendance;