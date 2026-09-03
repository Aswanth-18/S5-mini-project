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
import { Terminal, Code, ShieldCheck, Clock, Edit2, Trash2, Plus, Eye, Users, PlayCircle } from 'lucide-react';

const FacultyPractice = () => {
  const { user } = useAuth();
  const { labs, results, users, courses, isLoading } = useData();
  const [facultyLabs, setFacultyLabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    domains: 0
  });

  useEffect(() => {
    if (user && labs.length > 0) {
      const userLabs = labs.filter(l => l.createdBy === user.id);
      setFacultyLabs(userLabs);
      
      const activeLabs = userLabs.filter(l => l.status === 'active').length;
      
      const labResults = results.filter(r => 
        userLabs.some(l => l.id === r.labId)
      );
      const completedLabs = labResults.filter(r => r.status === ASSESSMENT_STATES.COMPLETED).length;
      
      const uniqueDomains = new Set(userLabs.map(l => l.domain).filter(Boolean)).size;
      
      setStats({
        total: userLabs.length,
        active: activeLabs,
        completed: completedLabs,
        domains: uniqueDomains
      });
    }
  }, [user, labs, results]);

  const filteredLabs = facultyLabs.filter(lab => {
    const query = searchQuery.toLowerCase();
    return (
      lab.title.toLowerCase().includes(query) ||
      lab.description?.toLowerCase().includes(query) ||
      (lab.domain && lab.domain.toLowerCase().includes(query)) ||
      (lab.tags && lab.tags.some(tag => tag.toLowerCase().includes(query)))
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
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Hard': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionCount = (labId) => {
    return results.filter(r => r.labId === labId && r.status === ASSESSMENT_STATES.COMPLETED).length;
  };

  const getAttemptCount = (labId) => {
    return results.filter(r => r.labId === labId).length;
  };

  const columns = [
    {
      header: 'Practice Lab',
      accessor: 'title',
      render: (lab) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{lab.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{lab.code || lab.id}</div>
        </div>
      )
    },
    {
      header: 'Domain',
      accessor: 'domain',
      render: (lab) => (
        <Badge variant="secondary">{lab.domain || 'General'}</Badge>
      )
    },
    {
      header: 'Difficulty',
      accessor: 'difficulty',
      render: (lab) => (
        <Badge className={getDifficultyColor(lab.difficulty)}>
          {lab.difficulty || 'Medium'}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (lab) => (
        <Badge className={getStatusColor(lab.status)}>
          {lab.status}
        </Badge>
      )
    },
    {
      header: 'Attempts',
      accessor: 'attempts',
      render: (lab) => (
        <span className="font-medium">{getAttemptCount(lab.id)}</span>
      )
    },
    {
      header: 'Completed',
      accessor: 'completed',
      render: (lab) => (
        <span className="font-medium text-green-600">{getCompletionCount(lab.id)}</span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (lab) => (
        <div className="flex gap-2">
          <Link to={`/student/practice/${lab.id}`}>
            <Button variant="outline" size="sm" startIcon={<Eye size={14} />}>
              View
            </Button>
          </Link>
          <Link to={`/admin/courses/new`}>
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
          My Practice Labs
        </h1>
        <Link to="/admin/courses/new">
          <Button variant="primary" startIcon={<Plus size={16} />}>
            Create Lab
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Terminal size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Labs</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <PlayCircle size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active Labs</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Code size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.domains}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Domains</div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Practice Labs
          </h3>
          <SearchBar
            placeholder="Search labs..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Showing {filteredLabs.length} of {facultyLabs.length} labs
        </div>

        {facultyLabs.length === 0 ? (
          <div className="text-center py-12">
            <Terminal size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No practice labs found
            </p>
            <Link to="/admin/courses/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Create Your First Lab
              </Button>
            </Link>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredLabs}
            pageSize={10}
            showPagination
          />
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Popular Labs
        </h3>
        {facultyLabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facultyLabs
              .sort((a, b) => getCompletionCount(b.id) - getCompletionCount(a.id))
              .slice(0, 3)
              .map(lab => (
                <div key={lab.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white truncate">{lab.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{lab.domain || 'General'}</div>
                    </div>
                    <Badge className={getDifficultyColor(lab.difficulty)}>
                      {lab.difficulty || 'Medium'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {getAttemptCount(lab.id)} attempts
                    </span>
                    <span className="text-green-600 font-medium">
                      {getCompletionCount(lab.id)} completed
                    </span>
                  </div>
                  <ProgressBar
                    value={getAttemptCount(lab.id) > 0 ? 
                      Math.round((getCompletionCount(lab.id) / getAttemptCount(lab.id)) * 100) : 0}
                    maxValue={100}
                    className="h-2 mt-2"
                    variant="success"
                  />
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center py-4">
            No labs available
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/courses/new">
            <Button variant="primary" startIcon={<Plus size={16} />}>
              Create Lab
            </Button>
          </Link>
          <Button variant="outline" startIcon={<ShieldCheck size={16} />}>
            Lab Templates
          </Button>
          <Button variant="outline" startIcon={<Users size={16} />}>
            Student Progress
          </Button>
          <Button variant="outline" startIcon={<BarChart3 size={16} />}>
            Lab Analytics
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Lab Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...new Set(facultyLabs.map(l => l.domain).filter(Boolean))].map(domain => (
            <Badge key={domain} variant="secondary" className="px-3 py-1">
              {domain}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FacultyPractice;