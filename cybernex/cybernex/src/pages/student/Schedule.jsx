import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Calendar, Clock, MapPin, User, Bell, Repeat } from 'lucide-react';

const StudentSchedule = () => {
  const { user } = useAuth();
  const { schedules, courses, isLoading } = useData();
  const [studentSchedules, setStudentSchedules] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user && schedules.length > 0) {
      // Filter schedules for current user (student)
      const filteredSchedules = schedules.filter(s => 
        s.studentId === user.id || 
        (s.batchId && user.batchId === s.batchId) ||
        (s.courseId && user.enrolledCourses?.includes(s.courseId))
      );
      setStudentSchedules(filteredSchedules);
    }
  }, [user, schedules]);

  const getDaySchedules = (date) => {
    return studentSchedules.filter(s => {
      const scheduleDate = new Date(s.date || s.startTime);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return studentSchedules
      .filter(s => {
        const startTime = new Date(s.startTime);
        return startTime >= now && !s.completed;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  };

  const getTodaySessions = () => {
    const today = new Date();
    return studentSchedules.filter(s => {
      const startTime = new Date(s.startTime);
      return startTime.toDateString() === today.toDateString();
    });
  };

  const navigateDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    
    if (session.completed) return 'completed';
    if (session.cancelled) return 'cancelled';
    if (now >= startTime && now <= endTime) return 'in_progress';
    if (now > endTime) return 'missed';
    if (now < startTime) return 'upcoming';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const todaySessions = getTodaySessions();
  const upcomingSessions = getUpcomingSessions();
  const currentDaySchedules = getDaySchedules(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Schedule
        </h1>
      </div>

      {/* Today's Sessions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Sessions
          </h3>
          <Badge variant="primary">
            {formatDate(new Date())}
          </Badge>
        </div>
        
        {todaySessions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No sessions scheduled for today
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaySessions.map((session) => {
              const course = courses.find(c => c.id === session.courseId);
              const status = getSessionStatus(session);
              
              return (
                <div 
                  key={session.id} 
                  className={`p-4 rounded-lg border-2 ${status === 'completed' ? 'border-green-200 dark:border-green-800' : 
                            status === 'in_progress' ? 'border-blue-200 dark:border-blue-800' : 
                            status === 'missed' ? 'border-red-200 dark:border-red-800' : 
                            'border-purple-200 dark:border-purple-800'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {course?.title || session.title || 'Untitled Session'}
                        </h4>
                        <Badge className={getStatusColor(status)}>
                          {status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {course?.code || session.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{session.location}</span>
                          </div>
                        )}
                        {session.instructor && (
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{session.instructor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Sessions
        </h3>
        
        {upcomingSessions.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No upcoming sessions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => {
              const course = courses.find(c => c.id === session.courseId);
              const daysUntil = Math.ceil(
                (new Date(session.startTime) - new Date()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div 
                  key={session.id} 
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {course?.title || session.title || 'Untitled Session'}
                        </h4>
                        <Badge variant="info">
                          {daysUntil > 1 ? `${daysUntil} days` : daysUntil === 1 ? 'Tomorrow' : 'Today'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {course?.code || session.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(session.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                        </div>
                      </div>
                      {session.recurring && (
                        <div className="mt-2">
                          <Badge variant="secondary" startIcon={<Repeat size={12} />}>
                            Recurring
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Weekly Calendar View */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Calendar
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate(-1)}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate(1)}
            >
              Next
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - date.getDay() + index);
            const daySchedules = getDaySchedules(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={day} 
                className={`p-3 rounded-lg ${isToday ? 'bg-blue-100 dark:bg-blue-900/20' : 
                          isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {day}
                  </div>
                  <div className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                    {date.getDate()}
                  </div>
                </div>
                <div className="space-y-1">
                  {daySchedules.slice(0, 2).map((session) => {
                    const course = courses.find(c => c.id === session.courseId);
                    return (
                      <div 
                        key={session.id} 
                        className="text-xs bg-blue-100 dark:bg-blue-900/20 p-1 rounded truncate"
                        title={course?.title || session.title}
                      >
                        {formatTime(session.startTime)} - {course?.code || 'Session'}
                      </div>
                    );
                  })}
                  {daySchedules.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{daySchedules.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Calendar Navigation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Full Calendar
        </h3>
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Interactive calendar will be available in the full version
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentSchedule;