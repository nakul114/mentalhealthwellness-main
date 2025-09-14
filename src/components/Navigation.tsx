import React from 'react';
import { 
  Home, BookOpen, Brain, AlertCircle, Target, 
  Users, GraduationCap, Settings, X
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setCurrentView, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-indigo-600' },
    { id: 'journal', name: 'Journal', icon: BookOpen, color: 'text-blue-600' },
    { id: 'cbt', name: 'CBT Exercises', icon: Brain, color: 'text-purple-600' },
    { id: 'crisis', name: 'Crisis Support', icon: AlertCircle, color: 'text-red-600' },
    { id: 'goals', name: 'Goals & Habits', icon: Target, color: 'text-green-600' },
    { id: 'peer-support', name: 'Peer Support', icon: Users, color: 'text-teal-600' },
    { id: 'education', name: 'Learn', icon: GraduationCap, color: 'text-orange-600' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-600' },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
        border-r border-gray-200
      `}>
        <div className="flex flex-col h-full pt-20 md:pt-8">
          {/* Mobile close button */}
          <div className="md:hidden absolute top-4 right-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation items */}
          <div className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg
                    transition-colors duration-200 hover:bg-gray-50
                    ${isActive ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : item.color}`} />
                  <span className={`font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Your privacy matters</p>
              <p className="mt-1">All data encrypted & anonymous</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;