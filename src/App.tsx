import React, { useState, useEffect } from 'react';
import { Brain, Menu, X, Shield, Globe, Accessibility, Sparkles } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import CBTExercises from './components/CBTExercises';
import CrisisSupport from './components/CrisisSupport';
import Goals from './components/Goals';
import PeerSupport from './components/PeerSupport';
import Education from './components/Education';
import Settings from './components/Settings';
import Navigation from './components/Navigation';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'journal':
        return <Journal userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'cbt':
        return <CBTExercises userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'crisis':
        return <CrisisSupport userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'goals':
        return <Goals userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'peer-support':
        return <PeerSupport userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'education':
        return <Education userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
      case 'settings':
        return <Settings userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} setUserProfile={() => {}} />;
      default:
        return <Dashboard userProfile={{ name: 'Guest', preferredLanguage: 'en', accessibilityMode: false, anonymousMode: true }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75"></div>
                <Brain className="relative h-10 w-10 text-white p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl" />
              </div>
              <div className="ml-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MindSpace
                </h1>
                <p className="text-sm text-gray-500 -mt-1">Your wellness companion</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">Global</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-purple-50 px-3 py-1.5 rounded-full">
                <Accessibility className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700 font-medium">Inclusive</span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Crisis Support Quick Access */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <button
            onClick={() => setCurrentView('crisis')}
            className="relative bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full p-5 shadow-2xl transition-all duration-300 hover:scale-110 group"
            aria-label="Crisis support - Get immediate help"
          >
            <Sparkles className="h-7 w-7" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;