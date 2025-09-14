import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Shield, Globe, Eye, 
  Bell, Smartphone, Volume2, Moon, Sun, 
  Download, Trash2, Lock, User, Save, AlertTriangle, Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
  setUserProfile: (profile: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, setUserProfile }) => {
  const { state, updateProfile, clearAllData, exportData, importData } = useApp();
  const [notifications, setNotifications] = useState({
    dailyCheckins: true,
    goalReminders: true,
    communityUpdates: false,
    crisisAlerts: true,
    weeklyReports: true
  });

  const [privacy, setPrivacy] = useState({
    dataCollection: 'minimal',
    shareProgress: false,
    profileVisibility: 'private',
    analyticsOptOut: true
  });

  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    colorBlindSupport: false,
    voiceNavigation: false,
    audioDescriptions: false,
    simplifiedLanguage: false,
    lowLiteracyMode: false,
    voiceInput: true,
    voiceOutput: true
  });

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिंदी' }
  ];

  const handleProfileUpdate = (updates: Partial<typeof userProfile>) => {
    updateProfile(updates);
    setUserProfile({ ...userProfile, ...updates });
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindspace-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      clearAllData();
      alert('All data has been deleted.');
    }
  };

  const handleImportData = () => {
    if (importFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = importData(content);
        if (success) {
          alert('Data imported successfully!');
          setShowImportDialog(false);
          setImportFile(null);
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(importFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <SettingsIcon className="h-6 w-6 text-gray-600 mr-2" />
          Settings & Preferences
        </h2>
        <p className="text-gray-600">
          Customize your experience, manage privacy settings, and configure accessibility options.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => handleProfileUpdate({ name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="How you'd like to be addressed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
            <select
              value={userProfile.preferredLanguage}
              onChange={(e) => handleProfileUpdate({ preferredLanguage: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userProfile.anonymousMode}
              onChange={(e) => handleProfileUpdate({ anonymousMode: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Use anonymous mode (recommended for privacy)</span>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-green-600 mr-2" />
          Privacy & Security
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Collection Level</label>
            <select
              value={privacy.dataCollection}
              onChange={(e) => setPrivacy({...privacy, dataCollection: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="minimal">Minimal - Only essential data</option>
              <option value="standard">Standard - Improve your experience</option>
              <option value="full">Full - Help improve the platform</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              We always encrypt your data and never sell personal information.
            </p>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={privacy.shareProgress}
                onChange={(e) => setPrivacy({...privacy, shareProgress: e.target.checked})}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700">Share anonymous progress data for research</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={privacy.analyticsOptOut}
                onChange={(e) => setPrivacy({...privacy, analyticsOptOut: e.target.checked})}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700">Opt out of analytics tracking</span>
            </label>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="h-5 w-5 text-purple-600 mr-2" />
          Accessibility Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Visual Accessibility</h4>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(e) => setAccessibility({...accessibility, highContrast: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">High contrast mode</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.largeText}
                onChange={(e) => setAccessibility({...accessibility, largeText: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Large text size</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.colorBlindSupport}
                onChange={(e) => setAccessibility({...accessibility, colorBlindSupport: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Color blind friendly palette</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Motion & Navigation</h4>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.reduceMotion}
                onChange={(e) => setAccessibility({...accessibility, reduceMotion: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Reduce motion and animations</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.screenReader}
                onChange={(e) => setAccessibility({...accessibility, screenReader: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Optimize for screen readers</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.voiceNavigation}
                onChange={(e) => setAccessibility({...accessibility, voiceNavigation: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Voice navigation</span>
            </label>
          </div>
        </div>

        {/* Additional Accessibility Options */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Audio & Voice</h4>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.voiceInput}
                onChange={(e) => setAccessibility({...accessibility, voiceInput: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Voice input enabled</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.voiceOutput}
                onChange={(e) => setAccessibility({...accessibility, voiceOutput: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Voice output enabled</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.audioDescriptions}
                onChange={(e) => setAccessibility({...accessibility, audioDescriptions: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Audio descriptions</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Language & Literacy</h4>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.simplifiedLanguage}
                onChange={(e) => setAccessibility({...accessibility, simplifiedLanguage: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Simplified language</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={accessibility.lowLiteracyMode}
                onChange={(e) => setAccessibility({...accessibility, lowLiteracyMode: e.target.checked})}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">Low literacy mode</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="h-5 w-5 text-orange-600 mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.dailyCheckins}
                  onChange={(e) => setNotifications({...notifications, dailyCheckins: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">Daily mood check-ins</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.goalReminders}
                  onChange={(e) => setNotifications({...notifications, goalReminders: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">Goal and habit reminders</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.crisisAlerts}
                  onChange={(e) => setNotifications({...notifications, crisisAlerts: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-gray-700">Crisis support alerts (recommended)</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.communityUpdates}
                  onChange={(e) => setNotifications({...notifications, communityUpdates: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">Community activity updates</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">Weekly progress reports</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="h-5 w-5 text-indigo-600 mr-2" />
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Export Your Data</h4>
              <p className="text-sm text-gray-600">Download a copy of all your data in JSON format</p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Import Data</h4>
              <p className="text-sm text-blue-700">Restore data from a previous export</p>
            </div>
            <button
              onClick={() => setShowImportDialog(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-medium text-red-900">Delete All Data</h4>
              <p className="text-sm text-red-700">Permanently delete all your data</p>
            </div>
            <button
              onClick={handleDeleteAllData}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Support Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 text-sm mb-4">
          If you have questions about these settings or need assistance with accessibility features, 
          our support team is available 24/7.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-blue-700">📧 support@mindspace.app</span>
          <span className="text-blue-700">📞 1-800-MINDCARE</span>
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Import Data</h3>
              <button
                onClick={() => setShowImportDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Select a JSON file exported from MindSpace to restore your data.
              </p>
              
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              
              {importFile && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {importFile.name}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleImportData}
                disabled={!importFile}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </button>
              <button
                onClick={() => setShowImportDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;