import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { LEVELS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Eye, Layers, TrendingUp, Clock, Users, BookOpen, Award, Filter, CheckCircle, X } from 'lucide-react';

const Levels = () => {
  const { user } = useAuth();
  const { courses, users: allUsers, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalStudents: 0,
    totalCourses: 0
  });

  // Convert LEVELS object to array for easier manipulation
  const levelsArray = Object.entries(LEVELS).map(([id, name]) => ({
    id: parseInt(id),
    name,
    description: getLevelDescription(parseInt(id)),
    courses: [],
    students: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  }));

  useEffect(() => {
    if (courses.length > 0 && allUsers.length > 0) {
      // Enhance levels with actual data
      const enhancedLevels = levelsArray.map(level => {
        // Count courses for this level
        const levelCourses = courses.filter(c => c.level === level.id);
        
        // Count students who have accessed this level
        const levelStudents = allUsers.filter(u => 
          u.progress?.levels?.includes(level.id) || 
          u.progress?.currentLevel === level.id
        ).length;
        
        return {
          ...level,
          courses: levelCourses,
          students: levelStudents,
          courseCount: levelCourses.length,
          studentCount: levelStudents
        };
      });
      
      setFilteredLevels(enhancedLevels);
      
      const totalStudents = allUsers.length;
      const totalCourses = courses.length;
      
      setStats({
        total: enhancedLevels.length,
        active: enhancedLevels.filter(l => l.isActive).length,
        totalStudents,
        totalCourses
      });
    } else {
      setFilteredLevels(levelsArray);
      setStats({
        total: levelsArray.length,
        active: levelsArray.length,
        totalStudents: 0,
        totalCourses: 0
      });
    }
  }, [courses, allUsers]);

  useEffect(() => {
    let filtered = [...levelsArray];
    
    // Enhance with real data first
    if (courses.length > 0 && allUsers.length > 0) {
      filtered = levelsArray.map(level => {
        const levelCourses = courses.filter(c => c.level === level.id);
        const levelStudents = allUsers.filter(u => 
          u.progress?.levels?.includes(level.id) || 
          u.progress?.currentLevel === level.id
        ).length;
        
        return {
          ...level,
          courses: levelCourses,
          students: levelStudents,
          courseCount: levelCourses.length,
          studentCount: levelStudents
        };
      });
    }
    
    // Filter by search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(level =>
        level.name.toLowerCase().includes(lowerQuery) ||
        level.description.toLowerCase().includes(lowerQuery) ||
        level.id.toString().includes(lowerQuery)
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(level => level.isActive === isActive);
    }
    
    // Sort by level ID (ascending)
    filtered.sort((a, b) => a.id - b.id);
    
    setFilteredLevels(filtered);
  }, [searchQuery, filterStatus, courses, allUsers]);

  const getLevelDescription = (levelId) => {
    const descriptions = {
      1: 'Foundational cybersecurity concepts and basics',
      2: 'Core security fundamentals and principles',
      3: 'Web application security and vulnerabilities',
      4: 'Network security protocols and defense mechanisms',
      5: 'Linux system administration and security',
      6: 'Windows system administration and security',
      7: 'Active Directory configuration and management',
      8: 'Penetration testing methodologies and tools',
      9: 'Security Operations Center monitoring and analysis',
      10: 'Digital forensics investigation and analysis',
      11: 'Cloud computing and DevSecOps security',
      12: 'AI engineering and AI security specialization'
    };
    return descriptions[levelId] || 'Specialized cybersecurity level';
  };

  const handleDelete = (level) => {
    setSelectedLevel(level);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLevel) return;
    
    try {
      // In a real app, this would call a service to delete the level
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setSelectedLevel(null);
    } catch (error) {
      console.error('Error deleting level:', error);
    }
  };

  const getCompletionRate = (level) => {
    if (!level.studentCount || !level.courseCount) return 0;
    
    // Calculate average completion rate for courses in this level
    const levelCourses = courses.filter(c => c.level === level.id);
    if (levelCourses.length === 0) return 0;
    
    const totalProgress = levelCourses.reduce((sum, course) => {
      const completions = allUsers.filter(u => 
        u.progress?.courses?.completed?.includes(course.id)
      ).length;
      return sum + (completions / level.studentCount);
    }, 0);
    
    return Math.round((totalProgress / levelCourses.length) * 100);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      header: 'Level',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
            {row.id}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Level {row.id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <div className="max-w-60 truncate text-sm text-gray-600 dark:text-gray-300">
          {row.description}
        </div>
      )
    },
    {
      header: 'Courses',
      accessor: 'courseCount',
      render: (row) => (
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{row.courseCount || 0}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">courses</div>
        </div>
      )
    },
    {
      header: 'Students',
      accessor: 'studentCount',
      render: (row) => (
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">{row.studentCount || 0}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">students</div>
        </div>
      )
    },
    {
      header: 'Completion',
      accessor: 'completionRate',
      render: (row) => {
        const rate = getCompletionRate(row);
        return (
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{rate}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${rate}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <Badge className={getStatusColor(row.isActive)}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/admin/levels/${row.id}/edit`}>
            <Button variant="outline" size="sm" startIcon={<Edit2 size={14} />}>
              Edit
            </Button>
          </Link>
          {hasPermission('system.manage') && (
            <Button 
              variant="outline" 
              size="sm" 
              startIcon={<Trash2 size={14} />} 
              onClick={() => handleDelete(row)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          )}
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Levels</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage the structured learning path and curriculum levels</p>
        </div>
        
        {hasPermission('system.manage') && (
          <Link to="/admin/levels/new">
            <Button variant="primary" startIcon={<Plus size={18} />}>
              Add Level
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <Layers size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Levels</div>
        </Card>
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Active Levels</div>
        </Card>
        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Students</div>
        </Card>
        <Card className="text-center">
          <BookOpen size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Courses</div>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">0%</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Completion</div>
        </Card>
        <Card className="text-center">
          <Award size={24} className="mx-auto mb-2 text-yellow-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Certified</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex gap-4 flex-wrap items-center">
          <SearchBar
            placeholder="Search levels by name or description..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-[250px]"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-primary select-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            startIcon={<Filter size={16} />} 
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Levels Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredLevels}
          keyExtractor={(row) => row.id.toString()}
          emptyMessage="No learning levels found"
          emptyIcon={<Layers size={48} className="text-gray-400" />}
        />
      </Card>

      {/* Level Structure Visualization */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Path Structure</h3>
        
        <div className="flex flex-wrap gap-4">
          {filteredLevels.map((level, index) => (
            <div 
              key={level.id} 
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-[200px] flex-1"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl">
                {level.id}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{level.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{level.description}</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{level.courseCount || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">courses</div>
              </div>
              {index < filteredLevels.length - 1 && (
                <div className="text-gray-400">
                  <TrendingUp size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Level"
        message={`Are you sure you want to delete Level ${selectedLevel?.id || ''} - ${selectedLevel?.name || ''}? This will affect all courses and progress associated with this level.`}
        confirmText="Delete Level"
        confirmVariant="danger"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Levels;