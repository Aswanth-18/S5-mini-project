import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, ASSESSMENT_STATES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Unlock, Lock, Users, Filter, CheckCircle, X, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

const BulkUnlock = () => {
  const { user } = useAuth();
  const { assessments, users: allUsers, courses, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('assessments');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    locked: 0,
    unlocked: 0,
    totalUsers: 0
  });

  // Filter assessments that can be unlocked
  const unlockableAssessments = assessments.filter(a => 
    a.status !== ASSESSMENT_STATES.LOCKED && a.locked
  );
  
  // Filter courses that can be unlocked
  const unlockableCourses = courses.filter(c => c.locked);

  useEffect(() => {
    if (assessments.length > 0 && allUsers.length > 0 && courses.length > 0) {
      setStats({
        totalAssessments: unlockableAssessments.length,
        locked: assessments.filter(a => a.locked).length,
        unlocked: assessments.filter(a => !a.locked).length,
        totalUsers: allUsers.filter(u => u.role === ROLES.STUDENT).length
      });
    }
  }, [assessments, allUsers, courses]);

  const handleSelectAll = (items) => {
    setSelectedItems(items.map(item => item.id));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    const studentUsers = allUsers.filter(u => u.role === ROLES.STUDENT);
    setSelectedUsers(studentUsers.map(u => u.id));
  };

  const handleDeselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const handleBulkUnlock = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to unlock');
      return;
    }
    
    if (selectedUsers.length === 0 && filterType === 'assessments') {
      setError('Please select at least one user to unlock for');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to bulk unlock
      console.log('Bulk unlocking:', {
        items: selectedItems,
        users: selectedUsers,
        type: filterType
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setSelectedItems([]);
      setSelectedUsers([]);
      
    } catch (err) {
      setError(err.message || 'Failed to perform bulk unlock');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkLock = async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to lock');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to bulk lock
      console.log('Bulk locking:', {
        items: selectedItems,
        type: filterType
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setSelectedItems([]);
      
    } catch (err) {
      setError(err.message || 'Failed to perform bulk lock');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (locked) => {
    return locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasPermission('system.manage')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Unlock</h1>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>You do not have permission to perform bulk unlock operations. Please contact an administrator.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Access Control</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Unlock or lock assessments and courses for multiple users at once</p>
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {success && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle size={20} />
            <span>Bulk operation completed successfully!</span>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Unlock size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalAssessments}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Locked Assessments</div>
        </Card>
        <Card className="text-center">
          <Lock size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.locked}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Locked</div>
        </Card>
        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
        </Card>
      </div>

      {/* Type Selection */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Content Type</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Choose what type of content you want to manage</p>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSelectedItems([]);
                setSelectedUsers([]);
              }}
              className="select select-primary"
            >
              <option value="assessments">Assessments</option>
              <option value="courses">Courses</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content Selection */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {filterType === 'assessments' ? 'Select Assessments' : 'Select Courses'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Choose the items you want to {selectedItems.length > 0 ? 'unlock' : 'manage'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              startIcon={<CheckCircle size={16} />} 
              onClick={() => handleSelectAll(filterType === 'assessments' ? unlockableAssessments : unlockableCourses)}
              size="sm"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              startIcon={<X size={16} />} 
              onClick={handleDeselectAll}
              size="sm"
            >
              Clear Selection
            </Button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          {(filterType === 'assessments' ? unlockableAssessments : unlockableCourses).map(item => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  setSelectedItems(prev => 
                    prev.includes(item.id) 
                      ? prev.filter(id => id !== item.id)
                      : [...prev, item.id]
                  );
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="checkbox checkbox-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {item.title || item.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {item.domain || item.category || 'General'}
                  </div>
                </div>
                <Badge className={getStatusColor(item.locked)}>
                  {item.locked ? 'Locked' : 'Available'}
                </Badge>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {selectedItems.length} items selected
        </div>
      </Card>

      {/* User Selection (for assessments) */}
      {filterType === 'assessments' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Users</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Choose which students can access the selected assessments
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                startIcon={<CheckCircle size={16} />} 
                onClick={handleSelectAllUsers}
                size="sm"
              >
                Select All Students
              </Button>
              <Button 
                variant="outline" 
                startIcon={<X size={16} />} 
                onClick={handleDeselectAllUsers}
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-primary flex-1"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {allUsers
              .filter(u => u.role === ROLES.STUDENT)
              .filter(u => 
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(student => {
                const isSelected = selectedUsers.includes(student.id);
                
                return (
                  <div 
                    key={student.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleSelectUser(student.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="checkbox checkbox-primary"
                    />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {selectedUsers.length} students selected
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actions</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Choose what to do with the selected items
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="primary" 
              startIcon={<Unlock size={18} />} 
              onClick={handleBulkUnlock}
              disabled={isProcessing || (filterType === 'assessments' && selectedUsers.length === 0)}
              size="lg"
            >
              {isProcessing ? 'Processing...' : 'Bulk Unlock'}
            </Button>
            
            <Button 
              variant="outline" 
              startIcon={<Lock size={18} />} 
              onClick={handleBulkLock}
              disabled={isProcessing}
              size="lg"
              className="text-red-600 hover:text-red-700"
            >
              {isProcessing ? 'Processing...' : 'Bulk Lock'}
            </Button>
          </div>
        </div>

        {filterType === 'assessments' && selectedUsers.length > 0 && selectedItems.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Summary:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Will unlock <strong>{selectedItems.length}</strong> assessment(s) for <strong>{selectedUsers.length}</strong> student(s)
            </p>
          </div>
        )}

        {filterType === 'courses' && selectedItems.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Summary:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Will unlock <strong>{selectedItems.length}</strong> course(s) for all students
            </p>
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tips</h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Assessments:</strong> Unlock for specific students based on their progress and readiness.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Courses:</strong> Unlock entire courses for all students at once.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Use bulk operations to quickly manage access for multiple students and content items.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default BulkUnlock;