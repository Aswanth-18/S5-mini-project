import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useData } from '../../contexts/DataContext';
import { ROLES, LEVELS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Mail, Shield, Calendar, Award, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { users, isLoading } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  const { values, handleChange, handleSubmit, setFormValues, resetForm } = useForm(
    {
      name: '',
      email: '',
      bio: '',
      department: '',
      phone: ''
    },
    {},
    async (formValues) => {
      try {
        await updateUser(user.id, formValues);
        setIsEditing(false);
        // Refresh user data
        const updatedUser = users.find(u => u.id === user.id);
        setUserData(updatedUser);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  );

  useEffect(() => {
    if (user) {
      const fullUserData = users.find(u => u.id === user.id) || user;
      setUserData(fullUserData);
      setFormValues({
        name: fullUserData.name || '',
        email: fullUserData.email || '',
        bio: fullUserData.bio || '',
        department: fullUserData.department || '',
        phone: fullUserData.phone || ''
      });
    }
  }, [user, users, setFormValues]);

  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getLevelName = (level) => {
    const levelNames = {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced',
      4: 'Expert',
      5: 'Master'
    };
    return levelNames[level] || 'Beginner';
  };

  const getLevelColor = (level) => {
    const levelColors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-purple-100 text-purple-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    return levelColors[level] || 'bg-green-100 text-green-800';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-red-100 text-red-800';
      case ROLES.FACULTY:
        return 'bg-blue-100 text-blue-800';
      case ROLES.STUDENT:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    resetForm();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        {!isEditing ? (
          <Button onClick={handleEditClick} variant="outline" startIcon={<Edit2 size={16} />}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSubmit} variant="primary" startIcon={<Save size={16} />}>
              Save Changes
            </Button>
            <Button onClick={handleCancelClick} variant="outline" startIcon={<X size={16} />}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center text-center">
              <Avatar 
                src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`}
                size="xl"
                className="mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="input input-primary w-full"
                  />
                ) : (
                  userData.name
                )}
              </h2>
              <div className="flex gap-2 mb-4">
                <Badge className={`px-3 py-1 ${getRoleColor(userData.role)}`}>
                  {userData.role}
                </Badge>
                <Badge className={`px-3 py-1 ${getLevelColor(userData.level || 1)}`}>
                  Level {userData.level || 1} - {getLevelName(userData.level || 1)}
                </Badge>
              </div>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {userData.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        className="input input-primary w-full"
                      />
                    ) : (
                      userData.email
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Joined: {new Date(userData.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Security Score: {userData.securityScore || 0}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={values.department}
                      onChange={handleChange}
                      className="input input-primary w-full"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.department || 'Not specified'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      className="input input-primary w-full"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.phone || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    rows={4}
                    className="input input-primary w-full"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100">
                    {userData.bio || 'No bio yet. Add one to tell others about yourself!'}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      {userData.role === ROLES.STUDENT && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <Award size={24} className="mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.xp || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">XP</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <Calendar size={24} className="mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.progress?.streak || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <Shield size={24} className="mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.certificates?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Certificates</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <User size={24} className="mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.progress?.courses?.completed?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;