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
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Repeat,
  AlertCircle,
  CheckCircle,
  X,
  Download
} from 'lucide-react';

const Schedule = () => {
  const { user } = useAuth();
  const { filteredSchedules, filteredCourses, filteredUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter schedule data
  const getFilteredSchedules = () => {
    let schedules = [...filteredSchedules];
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      schedules = schedules.filter(s => 
        s.courseId.toLowerCase().includes(lowerQuery) ||
        s.courseTitle?.toLowerCase().includes(lowerQuery) ||
        s.instructorId.toLowerCase().includes(lowerQuery) ||
        s.instructorName?.toLowerCase().includes(lowerQuery) ||
        s.day.toLowerCase().includes(lowerQuery) ||
        s.time.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      schedules = schedules.filter(s => s.courseId === selectedCourse);
    }

    // Filter by instructor
    if (selectedInstructor !== 'all') {
      schedules = schedules.filter(s => s.instructorId === selectedInstructor);
    }

    // Filter by day
    if (selectedDay !== 'all') {
      schedules = schedules.filter(s => s.day === selectedDay);
    }

    // Sort by day then time
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    schedules.sort((a, b) => {
      const dayCompare = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayCompare !== 0) return dayCompare;
      return a.time.localeCompare(b.time);
    });

    return schedules;
  };

  const filteredSchedulesList = getFilteredSchedules();
  const totalPages = Math.ceil(filteredSchedulesList.length / itemsPerPage);
  const currentSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique courses, instructors, and days for filters
  const facultyUsers = filteredUsers.filter(u => u.role === 'FACULTY');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Calculate statistics
  const totalSessions = filteredSchedulesList.length;
  const uniqueCourses = new Set(filteredSchedulesList.map(s => s.courseId)).size;
  const uniqueInstructors = new Set(filteredSchedulesList.map(s => s.instructorId)).size;
  const recurringSessions = filteredSchedulesList.filter(s => s.recurring).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const columns = [
    {
      header: 'Course',
      accessor: 'courseTitle',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.courseTitle || row.courseId}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{row.courseId}</div>
        </div>
      )
    },
    {
      header: 'Day & Time',
      accessor: 'day',
      render: (row) => (
        <div>
          <div className="font-medium">{row.day}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{row.time}</div>
        </div>
      )
    },
    {
      header: 'Instructor',
      accessor: 'instructorName',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.instructorName || row.instructorId}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{row.instructorId}</div>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location',
      render: (row) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.location || 'TBD'}
        </span>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Badge className={`bg-purple-100 text-purple-800`}>
          {row.recurring ? 'Recurring' : 'One-time'}
        </Badge>
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
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
            View
          </Button>
          {hasPermission('schedule.edit') && (
            <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          )}
          {hasPermission('schedule.delete') && (
            <Button variant="outline" size="sm" startIcon={<Trash2 size={14} />} className="text-red-600 hover:text-red-700">
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Management</h1>
        {hasPermission('schedule.create') && (
          <Link to="/admin/schedule/new">
            <Button startIcon={<Plus size={16} />}>
              Add Schedule
            </Button>
          </Link>
        )}
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{totalSessions}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</div>
        </Card>
        <Card className="text-center">
          <BookOpen size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{uniqueCourses}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
        </Card>
        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{uniqueInstructors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Instructors</div>
        </Card>
        <Card className="text-center">
          <Repeat size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{recurringSessions}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Recurring</div>
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
              placeholder="Search schedules..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-primary w-full pl-10"
            />
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-primary select-sm"
            >
              <option value="all">All Courses</option>
              {filteredCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title} ({course.code})</option>
              ))}
            </select>
          </div>

          {/* Instructor Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructor:</span>
            <select
              value={selectedInstructor}
              onChange={(e) => {
                setSelectedInstructor(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-primary select-sm"
            >
              <option value="all">All Instructors</option>
              {facultyUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.id})</option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-primary select-sm"
            >
              <option value="all">All Days</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Schedule Table */}
      {currentSchedules.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={currentSchedules}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredSchedulesList.length)} 
                of {filteredSchedulesList.length} sessions
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" startIcon={<Download size={14} />}>
                  Export CSV
                </Button>
                {hasPermission('schedule.create') && (
                  <Button variant="outline" size="sm" startIcon={<Calendar size={14} />}>
                    Sync Calendar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No schedule found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery || selectedCourse !== 'all' || selectedInstructor !== 'all' || selectedDay !== 'all'
                ? 'Try adjusting your filters.'
                : 'There are no scheduled sessions yet.'}
            </p>
            {hasPermission('schedule.create') && (
              <Link to="/admin/schedule/new" className="mt-4 inline-block">
                <Button startIcon={<Plus size={16} />}>
                  Add Schedule
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Weekly Schedule View */}
      {totalSessions > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">Time</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Group by time slots */}
                {(() => {
                  const timeSlots = new Set(filteredSchedulesList.map(s => s.time));
                  const sortedTimes = Array.from(timeSlots).sort((a, b) => a.localeCompare(b));
                  
                  return sortedTimes.map(timeSlot => (
                    <tr key={timeSlot} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-3 text-sm text-gray-900 dark:text-white">{timeSlot}</td>
                      {daysOfWeek.map(day => {
                        const session = filteredSchedules.find(s => s.day === day && s.time === timeSlot);
                        return (
                          <td key={day} className="p-3">
                            {session ? (
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">{session.courseTitle || session.courseId}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-300">{session.instructorName || session.instructorId}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{session.location || 'TBD'}</div>
                              </div>
                            ) : (
                              <div className="p-2"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      {totalSessions > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasPermission('schedule.edit') && (
              <Button variant="outline" startIcon={<Edit2 size={16} />} className="w-full justify-start">
                Bulk Edit Sessions
              </Button>
            )}
            {hasPermission('schedule.create') && (
              <Button variant="outline" startIcon={<Repeat size={16} />} className="w-full justify-start">
                Create Recurring Pattern
              </Button>
            )}
            <Button variant="outline" startIcon={<AlertCircle size={16} />} className="w-full justify-start">
              Check for Conflicts
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Schedule;