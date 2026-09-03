import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ROLES, ASSESSMENT_STATES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { Users, BarChart3, ShieldCheck, Clock, TrendingUp, Mail, Phone } from 'lucide-react';

const FacultyStudents = () => {
  const { user } = useAuth();
  const { users, courses, results, assessments, isLoading } = useData();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    avgScore: 0,
    avgProgress: 0
  });

  useEffect(() => {
    if (user && users.length > 0 && courses.length > 0) {
      // Get courses taught by this faculty
      const facultyCourses = courses.filter(c => c.createdBy === user.id);
      const courseIds = facultyCourses.map(c => c.id);
      
      // Get students enrolled in faculty's courses
      const allStudents = users.filter(u => u.role === ROLES.STUDENT);
      const facultyStudents = allStudents.filter(student => 
        student.enrolledCourses?.some(courseId => courseIds.includes(courseId))
      );
      
      setStudents(facultyStudents);
      
      // Calculate statistics
      const activeStudents = facultyStudents.filter(s => s.status === 'active').length;
      
      // Calculate average score from results
      const studentResults = results.filter(r => 
        facultyStudents.some(s => s.id === r.studentId) &&
        facultyCourses.some(c => c.id === r.courseId)
      );
      
      const avgScore = studentResults.length > 0 ? 
        Math.round(studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length) : 0;
      
      // Calculate average progress
      const totalProgress = facultyStudents.reduce((sum, student) => {
        const progress = student.progress?.overall || 0;
        return sum + progress;
      }, 0);
      const avgProgress = facultyStudents.length > 0 ? 
        Math.round(totalProgress / facultyStudents.length) : 0;
      
      setStats({
        total: facultyStudents.length,
        active: activeStudents,
        avgScore,
        avgProgress
      });
    }
  }, [user, users, courses, results]);

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      (student.id && student.id.toLowerCase().includes(query)) ||
      (student.department && student.department.toLowerCase().includes(query))
    );
  });

  const getStudentPerformance = (student) => {
    const studentResults = results.filter(r => r.studentId === student.id);
    if (studentResults.length === 0) return 'No data';
    
    const totalScore = studentResults.reduce((sum, r) => sum + r.percentage, 0);
    const avgScore = Math.round(totalScore / studentResults.length);
    
    if (avgScore >= 80) return 'Excellent';
    if (avgScore >= 60) return 'Good';
    if (avgScore >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Needs Improvement': return 'bg-red-100 text-red-800';
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

  const columns = [
    {
      header: 'Student',
      accessor: 'name',
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <Users size={16} className="text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{student.id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (student) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">{student.email}</span>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (student) => (
        <span className="text-sm">{student.department || 'N/A'}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (student) => (
        <Badge className={getStatusColor(student.status)}>
          {student.status}
        </Badge>
      )
    },
    {
      header: 'Performance',
      accessor: 'performance',
      render: (student) => (
        <Badge className={getPerformanceColor(getStudentPerformance(student))}>
          {getStudentPerformance(student)}
        </Badge>
      )
    },
    {
      header: 'Progress',
      accessor: 'progress',
      render: (student) => (
        <span className="text-sm font-medium">{student.progress?.overall || 0}%</span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (student) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail size={14} className="mr-1" />
            Message
          </Button>
          <Link to={`/student/results?studentId=${student.id}`}>
            <Button variant="primary" size="sm">
              View Results
            </Button>
          </Link>
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
          My Students
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Students</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active Students</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.avgScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Score</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.avgProgress}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Progress</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Student List
          </h3>
          <SearchBar
            placeholder="Search students..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredStudents.length} of {students.length} students
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No students found
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredStudents}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Excellent (80%+)', count: students.filter(s => getStudentPerformance(s) === 'Excellent').length, color: 'bg-green-100 text-green-800' },
            { label: 'Good (60-79%)', count: students.filter(s => getStudentPerformance(s) === 'Good').length, color: 'bg-blue-100 text-blue-800' },
            { label: 'Average (40-59%)', count: students.filter(s => getStudentPerformance(s) === 'Average').length, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'Needs Improvement (<40%)', count: students.filter(s => getStudentPerformance(s) === 'Needs Improvement').length, color: 'bg-red-100 text-red-800' }
          ].map((item) => (
            <div key={item.label} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.label}</div>
              <div className={`mt-2 h-3 rounded ${item.color}`} style={{ width: `${(item.count / students.length) * 100 || 0}%` }} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" startIcon={<Mail size={16} />}>
            Message All Students
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Export Student List
          </Button>
          <Button variant="outline" startIcon={<BarChart3 size={16} />}>
            View Performance Analytics
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FacultyStudents;