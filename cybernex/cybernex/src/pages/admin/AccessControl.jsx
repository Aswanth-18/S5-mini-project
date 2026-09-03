import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ROLES, PERMISSIONS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldCheck, User, CheckSquare, XSquare, Key, AlertTriangle, Check, X, Plus, Trash2 } from 'lucide-react';

const AccessControl = () => {
  const { user } = useAuth();
  const { permissions, isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [expandedPermissions, setExpandedPermissions] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Group permissions by category
  const permissionCategories = {
    'User Management': [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE
    ],
    'Course Management': [
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.COURSES_CREATE,
      PERMISSIONS.COURSES_EDIT,
      PERMISSIONS.COURSES_DELETE
    ],
    'Practice Labs': [
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.PRACTICE_MANAGE
    ],
    'Assessments': [
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_CREATE,
      PERMISSIONS.ASSESSMENT_MANAGE,
      PERMISSIONS.ASSESSMENT_START,
      PERMISSIONS.ASSESSMENT_REVIEW
    ],
    'Results': [
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.RESULTS_MANAGE
    ],
    'Attendance': [
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_MANAGE
    ],
    'Schedule': [
      PERMISSIONS.SCHEDULE_VIEW,
      PERMISSIONS.SCHEDULE_MANAGE
    ],
    'Faculty': [
      PERMISSIONS.FACULTY_VIEW,
      PERMISSIONS.FACULTY_MANAGE
    ],
    'Assets': [
      PERMISSIONS.ASSETS_VIEW,
      PERMISSIONS.ASSETS_MANAGE
    ],
    'Restrictions': [
      PERMISSIONS.RESTRICTIONS_VIEW,
      PERMISSIONS.RESTRICTIONS_MANAGE
    ],
    'Violations': [
      PERMISSIONS.VIOLATIONS_VIEW,
      PERMISSIONS.VIOLATIONS_MANAGE
    ],
    'Backup': [
      PERMISSIONS.BACKUP_CREATE,
      PERMISSIONS.BACKUP_RESTORE
    ],
    'Access Control': [
      PERMISSIONS.ACCESS_CONTROL_MANAGE
    ],
    'System': [
      PERMISSIONS.SYSTEM_MANAGE
    ]
  };

  // Get default permissions for each role
  const roleDefaultPermissions = {
    [ROLES.STUDENT]: [
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_START,
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.SCHEDULE_VIEW
    ],
    [ROLES.FACULTY]: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.COURSES_CREATE,
      PERMISSIONS.COURSES_EDIT,
      PERMISSIONS.COURSES_DELETE,
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.PRACTICE_MANAGE,
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_CREATE,
      PERMISSIONS.ASSESSMENT_MANAGE,
      PERMISSIONS.ASSESSMENT_START,
      PERMISSIONS.ASSESSMENT_REVIEW,
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.RESULTS_MANAGE,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_MANAGE,
      PERMISSIONS.SCHEDULE_VIEW,
      PERMISSIONS.SCHEDULE_MANAGE,
      PERMISSIONS.VIOLATIONS_VIEW,
      PERMISSIONS.VIOLATIONS_MANAGE
    ],
    [ROLES.ADMIN]: Object.values(PERMISSIONS)
  };

  // Get current permissions for the selected role
  const currentPermissions = permissions[selectedRole] || roleDefaultPermissions[selectedRole] || [];

  // Toggle permission for a role
  const handlePermissionToggle = (permission) => {
    if (!hasPermission('access_control.manage')) return;
    
    // In a real app, this would update the permissions for the role
    console.log(`Toggling permission ${permission} for role ${selectedRole}`);
  };

  // Check if a permission is enabled for the current role
  const isPermissionEnabled = (permission) => {
    return currentPermissions.includes(permission);
  };

  // Expand/collapse permission category
  const toggleCategory = (category) => {
    setExpandedPermissions(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Count enabled permissions
  const countEnabledPermissions = () => {
    return currentPermissions.length;
  };

  // Count total permissions
  const countTotalPermissions = () => {
    return Object.values(PERMISSIONS).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasPermission('access_control.manage')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Control</h1>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>You do not have permission to manage access control. Please contact an administrator.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Control</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage role permissions and access control</p>
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
            <Check size={20} />
            <span>Access control settings saved successfully!</span>
          </div>
        </Card>
      )}

      {/* Role Selection and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role Selection */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Role</h3>
          
          <div className="space-y-3">
            {Object.values(ROLES).map(role => {
              const isSelected = selectedRole === role;
              const enabledCount = permissions[role]?.length || roleDefaultPermissions[role]?.length || 0;
              const totalCount = Object.values(PERMISSIONS).length;
              const percentage = Math.round((enabledCount / totalCount) * 100);
              
              return (
                <div 
                  key={role}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary/10 ring-2 ring-primary' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {role.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {role.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {enabledCount} of {totalCount} permissions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{percentage}%</div>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <ShieldCheck size={24} className="mx-auto mb-2 text-blue-600" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">{Object.keys(ROLES).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Roles</div>
              </div>
              <div>
                <Key size={24} className="mx-auto mb-2 text-purple-600" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">{countEnabledPermissions()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Enabled</div>
              </div>
              <div>
                <CheckSquare size={24} className="mx-auto mb-2 text-green-600" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">{countTotalPermissions()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Permissions</div>
              </div>
              <div>
                <User size={24} className="mx-auto mb-2 text-orange-600" />
                <div className="text-xl font-bold text-gray-900 dark:text-white">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Custom Roles</div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Role Actions</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage {selectedRole.replace('_', ' ')} role permissions
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" startIcon={<Check size={16} />}>
                  Save Permissions
                </Button>
                <Button variant="outline" startIcon={<Plus size={16} />}>
                  Add Custom Role
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Permission Matrix */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Permission Matrix for {selectedRole.replace('_', ' ')}
        </h3>
        
        <div className="space-y-4">
          {Object.entries(permissionCategories).map(([category, categoryPermissions]) => {
            const isExpanded = expandedPermissions[category] !== false;
            const enabledCount = categoryPermissions.filter(p => isPermissionEnabled(p)).length;
            const totalCount = categoryPermissions.length;
            const percentage = Math.round((enabledCount / totalCount) * 100);
            
            return (
              <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button 
                  className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Key size={20} className="text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{category}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{totalCount} permissions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{percentage}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{enabledCount}/{totalCount}</div>
                    </div>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {isExpanded ? '−' : '+'}
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryPermissions.map(permission => {
                        const isEnabled = isPermissionEnabled(permission);
                        const permissionLabel = permission
                          .replace(/(_|\.)/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase());
                        
                        return (
                          <div 
                            key={permission} 
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              isEnabled 
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handlePermissionToggle(permission)}
                          >
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => {}}
                                className="checkbox checkbox-primary"
                                disabled={!hasPermission('access_control.manage')}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white text-sm">{permissionLabel}</div>
                                <code className="text-xs text-gray-500 dark:text-gray-400">{permission}</code>
                              </div>
                              {isEnabled ? (
                                <CheckSquare size={16} className="text-green-600" />
                              ) : (
                                <XSquare size={16} className="text-gray-400" />
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Permission Legend */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permission Legend</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">View</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Read-only access</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Create</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Add new items</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Edit</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Modify existing items</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Delete</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Remove items</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Manage</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Full control</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccessControl;