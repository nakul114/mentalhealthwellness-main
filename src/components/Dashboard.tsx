import React, { useState } from 'react';
import { 
  Calendar, TrendingUp, Heart, Brain, Target, 
  MessageCircle, BookOpen, Sun, Cloud, CloudRain, Sparkles, Star, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MoodChart from './MoodChart';

interface DashboardProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const { state, addMoodEntry } = useApp();
  const [currentMood, setCurrentMood] = useState<string>('');
  const [moodNotes, setMoodNotes] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const moodOptions = [
    { id: 'great', label: 'Amazing', icon: Star, color: 'text-yellow-500', bg: 'from-yellow-400 to-orange-400', emoji: '🌟', score: 9 },
    { id: 'good', label: 'Good', icon: Sun, color: 'text-green-500', bg: 'from-green-400 to-emerald-400', emoji: '😊', score: 7 },
    { id: 'neutral', label: 'Okay', icon: Cloud, color: 'text-gray-500', bg: 'from-gray-400 to-slate-400', emoji: '😐', score: 5 },
    { id: 'struggling', label: 'Tough Day', icon: CloudRain, color: 'text-blue-500', bg: 'from-blue-400 to-indigo-400', emoji: '😔', score: 3 },
  ];

  const activityOptions = [
    'Exercise', 'Social time', 'Creative work', 'Reading', 'Music', 
    'Nature walk', 'Cooking', 'Meditation', 'Gaming', 'Learning'
  ];

  const handleMoodSubmit = () => {
    if (currentMood) {
      const selectedMood = moodOptions.find(m => m.id === currentMood);
      if (selectedMood) {
        addMoodEntry({
          date: new Date().toISOString().split('T')[0],
          mood: currentMood,
          score: selectedMood.score,
          notes: moodNotes,
          activities: selectedActivities
        });
        
        // Reset form
        setCurrentMood('');
        setMoodNotes('');
        setSelectedActivities([]);
      }
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const todaysPrompts = [
    "What brought you a moment of peace today?",
    "Describe a small victory you experienced recently.",
    "What emotions are you noticing right now?",
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {userProfile.anonymousMode ? 'Friend' : userProfile.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Ready to nurture your mental wellness today?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Check-in */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl mr-4">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">How are you feeling today?</h3>
            <p className="text-gray-600">Take a moment to check in with yourself</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {moodOptions.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.id}
                onClick={() => setCurrentMood(mood.id)}
                className={`
                  group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                  ${currentMood === mood.id 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 bg-white/50 hover:shadow-md'
                  }
                `}
                aria-label={`Select ${mood.label} mood`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{mood.emoji}</div>
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${mood.color}`} />
                  <span className="block text-sm font-semibold text-gray-700">
                    {mood.label}
                  </span>
                </div>
                {currentMood === mood.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {currentMood && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              <p className="text-purple-800 font-semibold">Tell us more about your day</p>
            </div>
            
            {/* Activity Selection */}
            <div className="mb-4">
              <p className="text-purple-700 text-sm mb-2">What activities did you do today? (optional)</p>
              <div className="flex flex-wrap gap-2">
                {activityOptions.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedActivities.includes(activity)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-purple-700 border-purple-300 hover:border-purple-400'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <p className="text-purple-700 text-sm mb-2">Any notes about how you're feeling? (optional)</p>
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                placeholder="Share what's on your mind..."
                className="w-full p-3 border border-purple-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleMoodSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Mood Entry
              </button>
              <button 
                onClick={() => {
                  setCurrentMood('');
                  setMoodNotes('');
                  setSelectedActivities([]);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">Mood Entries</p>
                <p className="text-3xl font-bold text-green-800">{state.userData.moodHistory.length}</p>
              </div>
            </div>
            <div className="flex items-center text-green-700">
              <Sparkles className="h-4 w-4 mr-1" />
              <span className="text-sm">Keep tracking!</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 font-medium">Journal Entries</p>
                <p className="text-3xl font-bold text-blue-800">{state.userData.journalEntries.length}</p>
              </div>
            </div>
            <div className="flex items-center text-blue-700">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">Great reflection!</span>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-lg border border-purple-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-600 font-medium">Goals Active</p>
                <p className="text-3xl font-bold text-purple-800">{state.userData.goals.filter(g => !g.completed).length}</p>
              </div>
            </div>
            <div className="flex items-center text-purple-700">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-sm">Keep going!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      <MoodChart moodHistory={state.userData.moodHistory} />

      {/* Today's Reflection Prompts */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Today's Reflection Prompts</h3>
            <p className="text-gray-600">Take a moment to reflect and grow</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {todaysPrompts.map((prompt, index) => (
            <div key={index} className="group p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium group-hover:text-indigo-700 transition-colors">{prompt}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
          Start Journaling Journey
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-4">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
            <p className="text-gray-600">Your wellness journey progress</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Completed breathing exercise</p>
              <p className="text-sm text-green-600">2 hours ago</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Brain className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Wrote a journal entry</p>
              <p className="text-sm text-blue-600">Yesterday</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Set a new wellness goal</p>
              <p className="text-sm text-purple-600">3 days ago</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;