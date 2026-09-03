import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2, Eye, 
  Repeat, Bell, CheckCircle, XCircle, TrendingUp 
} from 'lucide-react';

const FacultySchedule = () => {
  const { user } = useAuth();
  const { schedules, courses, users, isLoading } = useData();
  const [facultySchedules, setFacultySchedules] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    recurring: 0,
    students: 0
  });

  useEffect(() => {
    if (user && schedules.length > 0) {
      const userSchedules = schedules.filter(s => s.createdBy === user.id);
      setFacultySchedules(userSchedules);
      
      const upcoming = userSchedules.filter(s => {
        const startTime = new Date(s.startTime);
        const now = new Date();
        return startTime >= now && !s.completed;
      }).length;
      
      const recurring = userSchedules.filter(s => s.recurring).length;
      
      // Count total students across all sessions
      const totalStudents = userSchedules.reduce((sum, schedule) => {
        if (schedule.participantIds && schedule.participantIds.length > 0) {
          return sum + schedule.participantIds.length;
        }
        return sum;
      }, 0);
      
      setStats({
        total: userSchedules.length,
        upcoming,
        recurring,
        students: totalStudents
      });
    }
  }, [user, schedules]);

  const getTodaySessions = () => {
    const today = new Date();
    return facultySchedules.filter(s => {
      const startTime = new Date(s.startTime);
      return startTime.toDateString() === today.toDateString();
    });
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return facultySchedules
      .filter(s => {
        const startTime = new Date(s.startTime);
        return startTime >= now && !s.completed;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  };

  const getDaySessions = (date) => {
    return facultySchedules.filter(s => {
      const scheduleDate = new Date(s.startTime);
      return scheduleDate.toDateString() === date.toDateString();
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-purple-100 text-purple-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'in_progress': return <Bell size={16} className="text-blue-600" />;
      case 'upcoming': return <Calendar size={16} className="text-purple-600" />;
      case 'missed': return <XCircle size={16} className="text-red-600" />;
      case 'cancelled': return <XCircle size={16} className="text-gray-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || courseId || 'N/A';
  };

  const getParticipantCount = (participantIds) => {
    if (!participantIds || participantIds.length === 0) return 0;
    return participantIds.length;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Schedule
        </h1>
        <Link to="/admin/schedule">
          <Button variant="primary" startIcon={<Plus size={16} />}>
            Create Session
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Bell size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Upcoming</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Repeat size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.recurring}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Recurring</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Students</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Sessions
            </h3>
            <Badge variant="primary">{formatDate(new Date())}</Badge>
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
                            {getCourseTitle(session.courseId) || session.title || 'Untitled Session'}
                          </h4>
                          <Badge className={getStatusColor(status)}>
                            {status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {session.description || 'No description'}
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
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {getParticipantCount(session.participantIds)} students
                          </span>
                          {session.recurring && (
                            <Badge variant="secondary" startIcon={<Repeat size={12} />} className="ml-2">
                              Recurring
                            </Badge>
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

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Sessions
            </h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
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
                            {getCourseTitle(session.courseId) || session.title || 'Untitled Session'}
                          </h4>
                          <Badge variant="info">
                            {daysUntil > 1 ? `${daysUntil} days` : daysUntil === 1 ? 'Tomorrow' : 'Today'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {session.description || 'No description'}
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
                        <div className="mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {getParticipantCount(session.participantIds)} students
                          </span>
                          {session.recurring && (
                            <Badge variant="secondary" startIcon={<Repeat size={12} />} className="ml-2">
                              Recurring
                            </Badge>
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
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Calendar
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate(-7)}>
              Previous Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate(7)}>
              Next Week
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - date.getDay() + index);
            const daySessions = getDaySessions(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={day} 
                className={`p-3 rounded-lg ${isToday ? 'bg-blue-100 dark:bg-blue-900/20' : 
                          isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">{day}</div>
                  <div className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                    {date.getDate()}
                  </div>
                </div>
                <div className="space-y-1">
                  {daySessions.slice(0, 2).map((session) => {
                    const status = getSessionStatus(session);
                    return (
                      <div 
                        key={session.id} 
                        className={`text-xs p-1 rounded truncate ${getStatusColor(status)}`}
                        title={getCourseTitle(session.courseId) || session.title}
                      >
                        {formatTime(session.startTime)} - {getCourseTitle(session.courseId)?.substring(0, 10) || 'Session'}
                      </div>
                    );
                  })}
                  {daySessions.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{daySessions.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Session Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/schedule">
            <Button variant="primary" startIcon={<Plus size={16} />}>
              Create Session
            </Button>
          </Link>
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            View Full Calendar
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Manage Participants
          </Button>
          <Button variant="outline" startIcon={<Repeat size={16} />}>
            Create Recurring
          </Button>
          <Button variant="outline" startIcon={<Download size={16} />}>
            Export Schedule
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Schedule Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-green-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Upcoming</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{stats.recurring}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Recurring</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultySchedule;