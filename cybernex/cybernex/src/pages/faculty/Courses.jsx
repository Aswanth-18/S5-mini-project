import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { BookOpen, Users, BarChart3, Clock, Edit2, Trash2, Plus, Eye, Calendar } from 'lucide-react';

const FacultyCourses = () => {
  const { user } = useAuth();
  const { courses, users, isLoading } = useData();
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    students: 0,
    avgDuration: 0
  });

  useEffect(() => {
    if (user && courses.length > 0) {
      const userCourses = courses.filter(c => c.createdBy === user.id);
      setFacultyCourses(userCourses);
      
      const activeCourses = userCourses.filter(c => c.status === 'active').length;
      
      const totalStudents = userCourses.reduce((sum, course) => {
        const enrolledStudents = users.filter(u => 
          u.role === 'student' && u.enrolledCourses?.includes(course.id)
        ).length;
        return sum + enrolledStudents;
      }, 0);
      
      const avgDuration = userCourses.length > 0 ? 
        Math.round(userCourses.reduce((sum, c) => sum + (c.duration || 0), 0) / userCourses.length) : 0;
      
      setStats({
        total: userCourses.length,
        active: activeCourses,
        students: totalStudents,
        avgDuration
      });
    }
  }, [user, courses, users]);

  const filteredCourses = facultyCourses.filter(course => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      (course.domain && course.domain.toLowerCase().includes(query))
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrolledStudents = (courseId) => {
    return users.filter(u => u.role === 'student' && u.enrolledCourses?.includes(courseId)).length;
  };

  const columns = [
    {
      header: 'Course',
      accessor: 'title',
      render: (course) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{course.code}</div>
        </div>
      )
    },
    {
      header: 'Domain',
      accessor: 'domain',
      render: (course) => (
        <Badge variant="secondary">{course.domain || 'General'}</Badge>
      )
    },
    {
      header: 'Difficulty',
      accessor: 'difficulty',
      render: (course) => (
        <Badge className={getDifficultyColor(course.difficulty)}>
          {course.difficulty || 'Beginner'}
        </Badge>
      )
    },
    {
      header: 'Students',
      accessor: 'students',
      render: (course) => (
        <span className="font-medium">{getEnrolledStudents(course.id)}</span>
      )
    },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (course) => (
        <span>{course.duration || 'N/A'} hrs</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (course) => (
        <Badge className={getStatusColor(course.status)}>
          {course.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (course) => (
        <div className="flex gap-2">
          <Link to={`/student/learning/${course.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <Link to={`/admin/courses/${course.id}/edit`}>
            <Button variant="primary" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" startIcon={<Trash2 size={14} />}>
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
          My Courses
        </h1>
        <Link to="/admin/courses/new">
          <Button variant="primary" startIcon={<Plus size={16} />}>
            Create Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Courses</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active Courses</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Enrollments</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.avgDuration} hrs</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Duration</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Course List
          </h3>
          <SearchBar
            placeholder="Search courses..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredCourses.length} of {facultyCourses.length} courses
        </div>

        {facultyCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No courses found
            </p>
            <Link to="/admin/courses/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Create Your First Course
              </Button>
            </Link>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCourses}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Course Domains
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...new Set(facultyCourses.map(c => c.domain).filter(Boolean))].map(domain => (
            <Badge key={domain} variant="secondary" className="px-3 py-1">
              {domain}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/courses/new">
            <Button variant="primary" startIcon={<Plus size={16} />}>
              Create Course
            </Button>
          </Link>
          <Button variant="outline" startIcon={<Users size={16} />}>
            View All Students
          </Button>
          <Button variant="outline" startIcon={<BarChart3 size={16} />}>
            Course Analytics
          </Button>
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            Schedule Management
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FacultyCourses;