import React, { useState } from 'react';
import { 
  Target, Plus, CheckCircle, Clock, TrendingUp, 
  Calendar, Bell, Star, Award, Edit, Trash2, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GoalsProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const Goals: React.FC<GoalsProps> = ({ userProfile }) => {
  const { state, addGoal, updateGoal } = useApp();
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness',
    targetDate: '',
    completed: false,
    progress: 0,
    milestones: []
  });

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;
    
    addGoal(newGoal);
    setNewGoal({
      title: '',
      description: '',
      category: 'wellness',
      targetDate: '',
      completed: false,
      progress: 0,
      milestones: []
    });
    setShowNewGoal(false);
  };

  const handleUpdateGoal = (goalId: string, updates: any) => {
    updateGoal(goalId, updates);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    // This would need to be implemented in the context
    // For now, we'll just show a placeholder message
    alert('Delete functionality will be implemented in the next update.');
  };

  const categories = [
    { id: 'wellness', label: 'Mental Wellness', color: 'bg-purple-100 text-purple-800' },
    { id: 'health', label: 'Physical Health', color: 'bg-green-100 text-green-800' },
    { id: 'social', label: 'Social Connection', color: 'bg-blue-100 text-blue-800' },
    { id: 'reflection', label: 'Self-Reflection', color: 'bg-orange-100 text-orange-800' },
    { id: 'learning', label: 'Learning & Growth', color: 'bg-indigo-100 text-indigo-800' }
  ];


  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Target className="h-6 w-6 text-green-600 mr-2" />
              Goals & Habit Formation
            </h2>
            <p className="text-gray-600">
              Build healthy habits and achieve your wellness goals with gentle nudges and progress tracking.
            </p>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Goal
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{state.userData.goals.filter(g => !g.completed).length}</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Goals</p>
              <p className="text-2xl font-bold text-gray-900">{state.userData.goals.filter(g => g.completed).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{state.userData.goals.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievement Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.userData.goals.length > 0 
                  ? Math.round((state.userData.goals.filter(g => g.completed).length / state.userData.goals.length) * 100)
                  : 0}%
              </p>
            </div>
            <Award className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* New Goal Form */}
      {showNewGoal && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Goal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g., Practice gratitude daily"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Date (Optional)</label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              placeholder="Why is this goal important to you? How will you achieve it?"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateGoal}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Goal
            </button>
            <button
              onClick={() => setShowNewGoal(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Goals */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          Active Goals
        </h3>
        
        <div className="space-y-4">
          {state.userData.goals.filter(goal => !goal.completed).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active goals yet.</p>
              <p className="text-sm">Create your first goal to get started!</p>
            </div>
          ) : (
            state.userData.goals.filter(goal => !goal.completed).map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleUpdateGoal(goal.id, { completed: !goal.completed })}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 flex items-center justify-center"
                    >
                      {goal.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </button>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                          {categories.find(c => c.id === goal.category)?.label}
                        </span>
                        {goal.targetDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-sm text-gray-600 mt-2 ml-10">{goal.description}</p>
                )}
                
                <div className="mt-3 ml-10">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Goals */}
      {state.userData.goals.filter(goal => goal.completed).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Completed Goals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.userData.goals.filter(goal => goal.completed).map((goal) => (
              <div key={goal.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-green-900 line-through">{goal.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                      {categories.find(c => c.id === goal.category)?.label}
                    </span>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                {goal.description && (
                  <p className="text-sm text-green-700 mb-3">{goal.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <Star className="h-4 w-4 mr-1" />
                    <span>Completed!</span>
                  </div>
                  {goal.targetDate && (
                    <div className="text-green-600">
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;