import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useForm } from '../../hooks/useForm';
import { ROLES, CYBER_DOMAINS, ASSESSMENT_TYPES, DIFFICULTY_LEVELS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Settings as SettingsIcon, Check, X, AlertTriangle, ShieldCheck, Bell, Clock, User, BookOpen, Calendar, Hash, Mail, Globe, Database } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const { isLoading } = useData();
  const { hasPermission } = usePermissions();
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state for different settings sections
  const generalForm = useForm({
    appName: 'CyberNex',
    appDescription: 'Enterprise Cybersecurity Education & Assessment Platform',
    appVersion: '1.0.0',
    maintenanceMode: false,
    maintenanceMessage: ''
  }, {}, async (values) => {
    setIsSaving(true);
    setError(null);
    
    try {
      // In a real app, this would call a service to save settings
      console.log('Saving general settings:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  });

  const securityForm = useForm({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    requireLowercase: true,
    enable2FA: false,
    ipWhitelist: '',
    rateLimiting: true
  }, {}, async (values) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Saving security settings:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  });

  const notificationForm = useForm({
    emailNotifications: true,
    pushNotifications: true,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    senderEmail: 'noreply@cybernex.edu',
    adminEmail: 'admin@cybernex.edu'
  }, {}, async (values) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Saving notification settings:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  });

  const assessmentForm = useForm({
    defaultDuration: 60,
    defaultDifficulty: 'Medium',
    defaultType: 'Knowledge Assessment',
    maxAttempts: 3,
    timeBetweenAttempts: 24,
    showHints: true,
    enableCheatingDetection: true,
    autoGrade: true,
    passingScore: 70,
    certificateThreshold: 80
  }, {}, async (values) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Saving assessment settings:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save assessment settings');
    } finally {
      setIsSaving(false);
    }
  });

  const systemForm = useForm({
    backupFrequency: 'daily',
    backupRetention: 30,
    logRetention: 90,
    maxFileUploadSize: 500,
    allowedFileTypes: '.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.svg,.mp4,.mov,.zip,.tar,.gz',
    cacheEnabled: true,
    debugMode: false,
    apiRateLimit: 100
  }, {}, async (values) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Saving system settings:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save system settings');
    } finally {
      setIsSaving(false);
    }
  });

  const handleSave = async (form) => {
    await form.handleSubmit();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'assessment', label: 'Assessment', icon: <BookOpen size={18} /> },
    { id: 'system', label: 'System', icon: <Database size={18} /> }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasPermission('access_control.manage') && !hasPermission('system.manage')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <span>You do not have permission to access system settings. Please contact an administrator.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Configure platform-wide settings and preferences</p>
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
            <span>Settings saved successfully!</span>
          </div>
        </Card>
      )}

      {/* Settings Tabs */}
      <Card>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Settings Content */}
      <div className="space-y-4">
        {/* General Settings */}
        {activeTab === 'general' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
              <Button 
                variant="primary" 
                startIcon={isSaving ? <LoadingSpinner size="sm" /> : <Check size={16} />}
                onClick={() => handleSave(generalForm)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  name="appName"
                  value={generalForm.values.appName}
                  onChange={generalForm.handleChange}
                  onBlur={generalForm.handleBlur}
                  placeholder="Enter application name"
                  className="input input-primary w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Version
                </label>
                <input
                  type="text"
                  name="appVersion"
                  value={generalForm.values.appVersion}
                  onChange={generalForm.handleChange}
                  onBlur={generalForm.handleBlur}
                  placeholder="Enter version number"
                  className="input input-primary w-full"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Description
                </label>
                <textarea
                  name="appDescription"
                  value={generalForm.values.appDescription}
                  onChange={generalForm.handleChange}
                  onBlur={generalForm.handleBlur}
                  placeholder="Enter application description"
                  rows={4}
                  className="textarea textarea-primary w-full"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalForm.values.maintenanceMode}
                    onChange={(e) => generalForm.setFormValues({ maintenanceMode: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Maintenance Mode
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  When enabled, users will see a maintenance message and won't be able to access the platform.
                </p>
              </div>
              
              {generalForm.values.maintenanceMode && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maintenance Message
                  </label>
                  <textarea
                    name="maintenanceMessage"
                    value={generalForm.values.maintenanceMessage}
                    onChange={generalForm.handleChange}
                    onBlur={generalForm.handleBlur}
                    placeholder="Enter maintenance message to display to users"
                    rows={3}
                    className="textarea textarea-primary w-full"
                  />
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
              <Button 
                variant="primary" 
                startIcon={isSaving ? <LoadingSpinner size="sm" /> : <Check size={16} />}
                onClick={() => handleSave(securityForm)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Authentication Security
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Clock size={16} className="inline mr-2" />
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={securityForm.values.sessionTimeout}
                    onChange={securityForm.handleChange}
                    onBlur={securityForm.handleBlur}
                    min="5"
                    max="1440"
                    className="input input-primary w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    User will be automatically logged out after this period of inactivity
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <User size={16} className="inline mr-2" />
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    value={securityForm.values.maxLoginAttempts}
                    onChange={securityForm.handleChange}
                    onBlur={securityForm.handleBlur}
                    min="1"
                    max="20"
                    className="input input-primary w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Number of failed login attempts before account is locked
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Clock size={16} className="inline mr-2" />
                    Lockout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="lockoutDuration"
                    value={securityForm.values.lockoutDuration}
                    onChange={securityForm.handleChange}
                    onBlur={securityForm.handleBlur}
                    min="1"
                    max="1440"
                    className="input input-primary w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Duration to lock the account after exceeding max login attempts
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Hash size={16} className="inline mr-2" />
                    Password Minimum Length
                  </label>
                  <input
                    type="number"
                    name="passwordMinLength"
                    value={securityForm.values.passwordMinLength}
                    onChange={securityForm.handleChange}
                    onBlur={securityForm.handleBlur}
                    min="4"
                    max="50"
                    className="input input-primary w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Minimum number of characters required for passwords
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
                Password Requirements
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.values.requireSpecialChars}
                    onChange={(e) => securityForm.setFormValues({ requireSpecialChars: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Special Characters
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.values.requireNumbers}
                    onChange={(e) => securityForm.setFormValues({ requireNumbers: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Numbers
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.values.requireUppercase}
                    onChange={(e) => securityForm.setFormValues({ requireUppercase: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Uppercase Letters
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.values.requireLowercase}
                    onChange={(e) => securityForm.setFormValues({ requireLowercase: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require Lowercase Letters
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.values.enable2FA}
                    onChange={(e) => securityForm.setFormValues({ enable2FA: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Two-Factor Authentication
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityForm.values.rateLimiting}
                    onChange={(e) => securityForm.setFormValues({ rateLimiting: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Rate Limiting
                  </span>
                </label>
              </div>

              <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
                Network Security
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe size={16} className="inline mr-2" />
                  IP Whitelist (comma separated)
                </label>
                <textarea
                  name="ipWhitelist"
                  value={securityForm.values.ipWhitelist}
                  onChange={securityForm.handleChange}
                  onBlur={securityForm.handleBlur}
                  placeholder="Enter IP addresses to whitelist, separated by commas"
                  rows={3}
                  className="textarea textarea-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Only users from these IP addresses will be able to access the system. Leave empty to allow all IPs.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
              <Button 
                variant="primary" 
                startIcon={isSaving ? <LoadingSpinner size="sm" /> : <Check size={16} />}
                onClick={() => handleSave(notificationForm)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Notification Preferences
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationForm.values.emailNotifications}
                    onChange={(e) => notificationForm.setFormValues({ emailNotifications: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Email Notifications
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationForm.values.pushNotifications}
                    onChange={(e) => notificationForm.setFormValues({ pushNotifications: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Push Notifications
                  </span>
                </label>
              </div>

              <h4 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mt-6">
                SMTP Configuration
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={notificationForm.values.smtpHost}
                    onChange={notificationForm.handleChange}
                    onBlur={notificationForm.handleBlur}
                    placeholder="smtp.example.com"
                    className="input input-primary w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    name="smtpPort"
                    value={notificationForm.values.smtpPort}
                    onChange={notificationForm.handleChange}
                    onBlur={notificationForm.handleBlur}
                    placeholder="587"
                    className="input input-primary w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUser"
                    value={notificationForm.values.smtpUser}
                    onChange={notificationForm.handleChange}
                    onBlur={notificationForm.handleBlur}
                    placeholder="your@email.com"
                    className="input input-primary w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    value={notificationForm.values.smtpPassword}
                    onChange={notificationForm.handleChange}
                    onBlur={notificationForm.handleBlur}
                    placeholder="Enter SMTP password"
                    className="input input-primary w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Mail size={16} className="inline mr-2" />
                    Sender Email Address
                  </label>
                  <input
                    type="email"
                    name="senderEmail"
                    value={notificationForm.values.senderEmail}
                    onChange={notificationForm.handleChange}
                    onBlur={notificationForm.handleBlur}
                    placeholder="noreply@yourdomain.com"
                    className="input input-primary w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <User size={16} className="inline mr-2" />
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={notificationForm.values.adminEmail}
                    onChange={notificationForm.handleChange}
                    onBlur={notificationForm.handleBlur}
                    placeholder="admin@yourdomain.com"
                    className="input input-primary w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Email address for system notifications and alerts
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Assessment Settings */}
        {activeTab === 'assessment' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assessment Settings</h3>
              <Button 
                variant="primary" 
                startIcon={isSaving ? <LoadingSpinner size="sm" /> : <Check size={16} />}
                onClick={() => handleSave(assessmentForm)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Clock size={16} className="inline mr-2" />
                  Default Assessment Duration (minutes)
                </label>
                <input
                  type="number"
                  name="defaultDuration"
                  value={assessmentForm.values.defaultDuration}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  min="1"
                  max="720"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Default time limit for assessments
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Difficulty
                </label>
                <select
                  name="defaultDifficulty"
                  value={assessmentForm.values.defaultDifficulty}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  className="select select-primary w-full"
                >
                  {Object.values(DIFFICULTY_LEVELS).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Assessment Type
                </label>
                <select
                  name="defaultType"
                  value={assessmentForm.values.defaultType}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  className="select select-primary w-full"
                >
                  {Object.values(ASSESSMENT_TYPES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Attempts
                </label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={assessmentForm.values.maxAttempts}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  min="1"
                  max="10"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Maximum number of attempts allowed per assessment
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Clock size={16} className="inline mr-2" />
                  Time Between Attempts (hours)
                </label>
                <input
                  type="number"
                  name="timeBetweenAttempts"
                  value={assessmentForm.values.timeBetweenAttempts}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  min="0"
                  max="720"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Minimum time required between assessment attempts (0 = no restriction)
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentForm.values.showHints}
                    onChange={(e) => assessmentForm.setFormValues({ showHints: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Hints to Students
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enable hints for students during assessments
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentForm.values.enableCheatingDetection}
                    onChange={(e) => assessmentForm.setFormValues({ enableCheatingDetection: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Cheating Detection
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enable monitoring for suspicious behavior during assessments
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentForm.values.autoGrade}
                    onChange={(e) => assessmentForm.setFormValues({ autoGrade: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-Grade Assessments
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Automatically grade objective questions (multiple choice, true/false, etc.)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={assessmentForm.values.passingScore}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  min="1"
                  max="100"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Minimum percentage required to pass an assessment
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Threshold (%)
                </label>
                <input
                  type="number"
                  name="certificateThreshold"
                  value={assessmentForm.values.certificateThreshold}
                  onChange={assessmentForm.handleChange}
                  onBlur={assessmentForm.handleBlur}
                  min="1"
                  max="100"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Minimum percentage required to earn a certificate
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h3>
              <Button 
                variant="primary" 
                startIcon={isSaving ? <LoadingSpinner size="sm" /> : <Check size={16} />}
                onClick={() => handleSave(systemForm)}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Database size={16} className="inline mr-2" />
                  Backup Frequency
                </label>
                <select
                  name="backupFrequency"
                  value={systemForm.values.backupFrequency}
                  onChange={systemForm.handleChange}
                  onBlur={systemForm.handleBlur}
                  className="select select-primary w-full"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How often to create automatic backups
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={16} className="inline mr-2" />
                  Backup Retention (days)
                </label>
                <input
                  type="number"
                  name="backupRetention"
                  value={systemForm.values.backupRetention}
                  onChange={systemForm.handleChange}
                  onBlur={systemForm.handleBlur}
                  min="1"
                  max="365"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How long to keep backup files before automatic deletion
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText size={16} className="inline mr-2" />
                  Log Retention (days)
                </label>
                <input
                  type="number"
                  name="logRetention"
                  value={systemForm.values.logRetention}
                  onChange={systemForm.handleChange}
                  onBlur={systemForm.handleBlur}
                  min="1"
                  max="3650"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How long to keep audit logs and activity logs
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum File Upload Size (MB)
                </label>
                <input
                  type="number"
                  name="maxFileUploadSize"
                  value={systemForm.values.maxFileUploadSize}
                  onChange={systemForm.handleChange}
                  onBlur={systemForm.handleBlur}
                  min="1"
                  max="5000"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Maximum file size allowed for uploads
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Allowed File Types
                </label>
                <textarea
                  name="allowedFileTypes"
                  value={systemForm.values.allowedFileTypes}
                  onChange={systemForm.handleChange}
                  onBlur={systemForm.handleBlur}
                  placeholder="Enter file extensions separated by commas"
                  rows={3}
                  className="textarea textarea-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  File extensions that are allowed for upload. Separate with commas.
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemForm.values.cacheEnabled}
                    onChange={(e) => systemForm.setFormValues({ cacheEnabled: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Caching
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enable caching for better performance. Disable during development.
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemForm.values.debugMode}
                    onChange={(e) => systemForm.setFormValues({ debugMode: e.target.checked })}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Debug Mode
                  </span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enable debug mode to see detailed error messages. Disable in production.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Rate Limit (requests per minute)
                </label>
                <input
                  type="number"
                  name="apiRateLimit"
                  value={systemForm.values.apiRateLimit}
                  onChange={systemForm.handleChange}
                  onBlur={systemForm.handleBlur}
                  min="1"
                  max="10000"
                  className="input input-primary w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Maximum number of API requests allowed per minute per IP
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;