import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useForm } from '../../hooks/useForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Switch } from '../../components/common';
import { Moon, Sun, User, Shield, Bell, Globe, Save, X, Edit2 } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const { values, handleChange, handleSubmit, setFormValues, resetForm } = useForm(
    {
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      emailNotifications: true,
      pushNotifications: true,
      assessmentReminders: true,
      courseUpdates: true
    },
    {},
    async (formValues) => {
      try {
        await updateUser(user.id, { preferences: formValues });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating settings:', error);
      }
    }
  );

  useEffect(() => {
    if (user && user.preferences) {
      setFormValues({
        language: user.preferences.language || 'en',
        timezone: user.preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        emailNotifications: user.preferences.emailNotifications !== false,
        pushNotifications: user.preferences.pushNotifications !== false,
        assessmentReminders: user.preferences.assessmentReminders !== false,
        courseUpdates: user.preferences.courseUpdates !== false
      });
    }
  }, [user, setFormValues]);

  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'appearance', label: 'Appearance', icon: isDarkMode ? Moon : Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        {isEditing && (
          <div className="flex gap-2">
            <Button onClick={handleSubmit} variant="primary" startIcon={<Save size={16} />}>
              Save Settings
            </Button>
            <Button onClick={handleCancelClick} variant="outline" startIcon={<X size={16} />}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <section.icon size={20} />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="input input-primary w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="input input-primary w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={user?.id || ''}
                    readOnly
                    className="input input-primary w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    readOnly
                    className="input input-primary w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Appearance
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enable dark theme for better viewing in low light conditions
                    </p>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Theme Color</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-blue-500" />
                    <button className="w-8 h-8 rounded-full bg-purple-500 border-2 border-transparent hover:border-purple-500" />
                    <button className="w-8 h-8 rounded-full bg-green-500 border-2 border-transparent hover:border-green-500" />
                    <button className="w-8 h-8 rounded-full bg-red-500 border-2 border-transparent hover:border-red-500" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={values.emailNotifications}
                    onCheckedChange={(checked) => setFormValues({ ...values, emailNotifications: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={values.pushNotifications}
                    onCheckedChange={(checked) => setFormValues({ ...values, pushNotifications: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Assessment Reminders</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get reminders for upcoming assessments
                    </p>
                  </div>
                  <Switch
                    checked={values.assessmentReminders}
                    onCheckedChange={(checked) => setFormValues({ ...values, assessmentReminders: checked })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Course Updates</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive notifications about course updates and new content
                    </p>
                  </div>
                  <Switch
                    checked={values.courseUpdates}
                    onCheckedChange={(checked) => setFormValues({ ...values, courseUpdates: checked })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {!isEditing && (
                <div className="mt-6 text-center">
                  <Button onClick={handleEditClick} variant="outline" startIcon={<Edit2 size={16} />}>
                    Edit Notification Settings
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeSection === 'privacy' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy & Security
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Change Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Update your account password for better security
                  </p>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Sessions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Manage your active login sessions and devices
                  </p>
                  <Button variant="outline" size="sm">
                    View Active Sessions
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Account Activity</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Review your recent account activity and login history
                  </p>
                  <Button variant="outline" size="sm">
                    View Activity Log
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'preferences' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={values.language}
                    onChange={(e) => setFormValues({ ...values, language: e.target.value })}
                    disabled={!isEditing}
                    className="select select-primary w-full"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={values.timezone}
                    onChange={(e) => setFormValues({ ...values, timezone: e.target.value })}
                    disabled={!isEditing}
                    className="select select-primary w-full"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Auto-enroll in new courses</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Automatically enroll in new courses as they become available
                    </p>
                  </div>
                  <Switch
                    checked={user?.preferences?.autoEnroll || false}
                    onCheckedChange={(checked) => updateUser(user.id, { preferences: { ...user.preferences, autoEnroll: checked } })}
                  />
                </div>
              </div>

              {!isEditing && (
                <div className="mt-6 text-center">
                  <Button onClick={handleEditClick} variant="outline" startIcon={<Edit2 size={16} />}>
                    Edit Preferences
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;