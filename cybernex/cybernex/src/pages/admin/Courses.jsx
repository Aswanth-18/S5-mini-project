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
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Eye, BookOpen, Users, Clock, Calendar, Shield, Filter, Download } from 'lucide-react';

const Courses = () => {
  const { user } = useAuth();
  const { courses, users, isLoading } = useData();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDomain, setFilterDomain] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
    totalStudents: 0,
    totalHours: 0
  });

  useEffect(() => {
    if (courses.length > 0) {
      setFilteredCourses(courses);
      
      const active = courses.filter(c => c.status === 'active').length;
      const draft = courses.filter(c => c.status === 'draft').length;
      const archived = courses.filter(c => c.status === 'archived').length;
      
      const totalStudents = courses.reduce((sum, course) => {
        const enrolled = users.filter(u => u.enrolledCourses?.includes(course.id)).length;
        return sum + enrolled;
      }, 0);
      
      const totalHours = courses.reduce((sum, course) => sum + (course.duration || 0), 0);
      
      setStats({
        total: courses.length,
        active,
        draft,
        archived,
        totalStudents,
        totalHours
      });
    }
  }, [courses, users]);

  const filteredData = filteredCourses
    .filter(course => {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        (course.domain && course.domain.toLowerCase().includes(query)) ||
        course.id.toLowerCase().includes(query)
      );
    })
    .filter(course => {
      if (filterStatus === 'all') return true;
      return course.status === filterStatus;
    })
    .filter(course => {
      if (filterDomain === 'all') return true;
      return course.domain === filterDomain;
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
    return users.filter(u => u.enrolledCourses?.includes(courseId)).length;
  };

  const getCreatorName = (creatorId) => {
    const creator = users.find(u => u.id === creatorId);
    return creator?.name || creatorId || 'System';
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = () => {
    if (selectedCourse) {
      // In a real implementation, this would call an API
      console.log('Deleting course:', selectedCourse.id);
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  // Get unique domains
  const domains = [...new Set(courses.map(c => c.domain).filter(Boolean))];

  const columns = [
    {
      header: 'Course',
      accessor: 'course',
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
      header: 'Creator',
      accessor: 'creator',
      render: (course) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {getCreatorName(course.createdBy)}
        </span>
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
      header: 'Duration',
      accessor: 'duration',
      render: (course) => (
        <span className="text-sm font-medium">{course.duration || 'N/A'} hrs</span>
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
      header: 'Status',
      accessor: 'status',
      render: (course) => (
        <Badge className={getStatusColor(course.status)}>
          {course.status}
        </Badge>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (course) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(course.createdAt).toLocaleDateString()}
        </span>
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
          <Button 
            variant="outline" 
            size="sm" 
            startIcon={<Trash2 size={14} />} 
            onClick={() => handleDeleteCourse(course)}
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
          Course Management
        </h1>
        <Link to="/admin/courses/new">
          <Button variant="primary" startIcon={<Plus size={16} />}>
            Add Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
            <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen size={24} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Draft</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Enrollments</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Shield size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{domains.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Domains</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock size={24} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-600">{stats.totalHours}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Hours</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Course List
          </h3>
          <div className="flex flex-wrap gap-2">
            <SearchBar
              placeholder="Search courses..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="min-w-[200px]"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="select select-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredData.length} of {courses.length} courses
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No courses found
            </p>
            <Link to="/admin/courses/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Add Your First Course
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
          <Button variant="outline" startIcon={<Download size={16} />}>
            Export Course List
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Manage Enrollments
          </Button>
          <Button variant="outline" startIcon={<Calendar size={16} />}>
            Schedule Management
          </Button>
          <Button variant="outline" startIcon={<Filter size={16} />}>
            Advanced Filters
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Course Domains
        </h3>
        {domains.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {domains.map(domain => (
              <Badge key={domain} variant="secondary" className="px-3 py-1">
                {domain}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center py-4">
            No domains available
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Course Analytics
        </h3>
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Course analytics chart will be available in the full version
            </p>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteCourse}
        title="Confirm Course Deletion"
        message={`Are you sure you want to delete course "${selectedCourse?.title}" (${selectedCourse?.code})? This will remove all associated data and cannot be undone.`}
        confirmButtonText="Delete Course"
        confirmButtonVariant="danger"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default Courses;