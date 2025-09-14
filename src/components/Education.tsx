import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Play, Clock, 
  Globe, Star, CheckCircle, Users 
} from 'lucide-react';

interface EducationProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const Education: React.FC<EducationProps> = ({ userProfile }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(userProfile.preferredLanguage);
  const [activeCategory, setActiveCategory] = useState('all');
  const [completedModules, setCompletedModules] = useState(new Set([1, 3, 7]));

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  ];

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'stress', label: 'Stress Management' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'cultural', label: 'Cultural Perspectives' },
  ];

  const educationModules = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Global Perspective',
      description: 'Learn about anxiety from different cultural viewpoints and universal coping strategies.',
      category: 'anxiety',
      duration: 15,
      difficulty: 'Beginner',
      culturalFocus: 'Cross-cultural',
      languages: ['en', 'es', 'fr', 'zh', 'ar'],
      rating: 4.8,
      completions: 12456,
      completed: true
    },
    {
      id: 2,
      title: 'Mindfulness in Eastern and Western Traditions',
      description: 'Explore mindfulness practices from Buddhist, Hindu, and contemporary Western approaches.',
      category: 'mindfulness',
      duration: 20,
      difficulty: 'Intermediate',
      culturalFocus: 'East-West comparison',
      languages: ['en', 'zh', 'hi'],
      rating: 4.9,
      completions: 8923,
      completed: false
    },
    {
      id: 3,
      title: 'Family and Mental Health: Cultural Considerations',
      description: 'Understanding how family dynamics affect mental health across different cultures.',
      category: 'relationships',
      duration: 18,
      difficulty: 'Intermediate',
      culturalFocus: 'Family systems',
      languages: ['en', 'es', 'pt', 'ar', 'hi'],
      rating: 4.7,
      completions: 6789,
      completed: true
    },
    {
      id: 4,
      title: 'Depression: Breaking Cultural Stigma',
      description: 'Address cultural barriers to seeking help for depression and available resources.',
      category: 'depression',
      duration: 25,
      difficulty: 'Beginner',
      culturalFocus: 'Stigma reduction',
      languages: ['en', 'es', 'fr', 'pt', 'ar', 'hi'],
      rating: 4.8,
      completions: 15234,
      completed: false
    },
    {
      id: 5,
      title: 'Stress and Work: International Perspectives',
      description: 'Compare work-related stress and coping mechanisms across different societies.',
      category: 'stress',
      duration: 22,
      difficulty: 'Intermediate',
      culturalFocus: 'Workplace culture',
      languages: ['en', 'zh', 'fr'],
      rating: 4.6,
      completions: 9876,
      completed: false
    },
    {
      id: 6,
      title: 'Traditional Healing and Modern Therapy',
      description: 'Integrating traditional healing practices with contemporary mental health approaches.',
      category: 'cultural',
      duration: 30,
      difficulty: 'Advanced',
      culturalFocus: 'Traditional practices',
      languages: ['en', 'es', 'zh', 'hi', 'ar'],
      rating: 4.9,
      completions: 4567,
      completed: false
    },
    {
      id: 7,
      title: 'Building Resilience: Universal Principles',
      description: 'Core resilience-building strategies that work across all cultures and backgrounds.',
      category: 'stress',
      duration: 16,
      difficulty: 'Beginner',
      culturalFocus: 'Universal',
      languages: ['en', 'es', 'fr', 'pt', 'zh', 'ar', 'hi'],
      rating: 4.8,
      completions: 18745,
      completed: true
    }
  ];

  const filteredModules = educationModules.filter(module => 
    (activeCategory === 'all' || module.category === activeCategory) &&
    module.languages.includes(selectedLanguage)
  );

  const markComplete = (moduleId: number) => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(moduleId);
    setCompletedModules(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <GraduationCap className="h-6 w-6 text-orange-600 mr-2" />
          Culturally Sensitive Psychoeducation
        </h2>
        <p className="text-gray-600">
          Learn about mental health through culturally informed content available in multiple languages. 
          All content is reviewed by cultural consultants and mental health professionals.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Content Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Topic Category
            </label>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Modules</p>
              <p className="text-2xl font-bold text-gray-900">{completedModules.size}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Languages</p>
              <p className="text-2xl font-bold text-gray-900">{languages.length}</p>
            </div>
            <Globe className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Learning Time</p>
              <p className="text-2xl font-bold text-gray-900">4.2h</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Community Size</p>
              <p className="text-2xl font-bold text-gray-900">2.8k</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Education Modules */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Learning Modules</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModules.map((module) => {
            const isCompleted = completedModules.has(module.id);
            
            return (
              <div key={module.id} className={`
                border rounded-lg p-6 transition-all duration-200 hover:shadow-md
                ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'}
              `}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                      <h4 className="font-semibold text-gray-900">{module.title}</h4>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration} min
                      </span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                      <span>•</span>
                      <span>{module.culturalFocus}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{module.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{module.completions.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {languages
                      .filter(lang => module.languages.includes(lang.code))
                      .slice(0, 3)
                      .map(lang => (
                        <span key={lang.code} className="text-sm">
                          {lang.flag}
                        </span>
                      ))
                    }
                    {module.languages.length > 3 && (
                      <span className="text-xs text-gray-500">+{module.languages.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => !isCompleted && markComplete(module.id)}
                  className={`
                    w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors
                    ${isCompleted 
                      ? 'bg-green-100 text-green-700 cursor-default' 
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                    }
                  `}
                  disabled={isCompleted}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Start Learning</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No modules available in {languages.find(l => l.code === selectedLanguage)?.name} for this category.</p>
            <p className="text-sm text-gray-500 mt-2">Try selecting a different language or category.</p>
          </div>
        )}
      </div>

      {/* Cultural Sensitivity Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Cultural Sensitivity Commitment</h3>
        <p className="text-blue-800 text-sm">
          All our educational content is developed in collaboration with cultural consultants, mental health professionals, 
          and community representatives from diverse backgrounds. We regularly review and update our materials to ensure 
          they respect and reflect different cultural perspectives on mental health and wellbeing.
        </p>
      </div>
    </div>
  );
};

export default Education;