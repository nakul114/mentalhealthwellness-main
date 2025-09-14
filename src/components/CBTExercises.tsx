import React, { useState } from 'react';
import { 
  Brain, CheckCircle, ArrowRight, Lightbulb, 
  Target, Calendar, TrendingUp, BookOpen 
} from 'lucide-react';

interface CBTExercisesProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const CBTExercises: React.FC<CBTExercisesProps> = ({ userProfile }) => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    thoughts: '',
    emotions: '',
    behaviors: '',
    evidence_for: '',
    evidence_against: '',
    balanced_thought: ''
  });

  const cbtModules = [
    {
      id: 'thought-record',
      title: 'Thought Record',
      description: 'Challenge and reframe unhelpful thoughts',
      icon: Brain,
      duration: '10-15 min',
      difficulty: 'Beginner',
      category: 'Cognitive'
    },
    {
      id: 'behavioral-activation',
      title: 'Behavioral Activation',
      description: 'Plan activities that improve your mood',
      icon: Target,
      duration: '5-10 min',
      difficulty: 'Beginner',
      category: 'Behavioral'
    },
    {
      id: 'mood-monitoring',
      title: 'Mood Monitoring',
      description: 'Track patterns in your emotional experiences',
      icon: TrendingUp,
      duration: '5 min',
      difficulty: 'Easy',
      category: 'Monitoring'
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Break down challenges into manageable steps',
      icon: Lightbulb,
      duration: '15-20 min',
      difficulty: 'Intermediate',
      category: 'Skills'
    }
  ];

  const renderThoughtRecord = () => {
    const steps = [
      {
        key: 'situation',
        label: 'Situation',
        prompt: 'What happened? Describe the specific situation objectively.',
        placeholder: 'e.g., I received critical feedback on my presentation...'
      },
      {
        key: 'thoughts',
        label: 'Automatic Thoughts',
        prompt: 'What went through your mind? What thoughts occurred automatically?',
        placeholder: 'e.g., I\'m terrible at presentations, everyone thinks I\'m incompetent...'
      },
      {
        key: 'emotions',
        label: 'Emotions',
        prompt: 'What emotions did you feel? Rate intensity (1-10).',
        placeholder: 'e.g., Shame (8/10), Anxiety (7/10), Disappointment (6/10)...'
      },
      {
        key: 'behaviors',
        label: 'Behaviors',
        prompt: 'How did you respond? What did you do or not do?',
        placeholder: 'e.g., Avoided eye contact, rushed through answers, canceled next meeting...'
      },
      {
        key: 'evidence_for',
        label: 'Evidence Supporting the Thought',
        prompt: 'What evidence supports your automatic thought?',
        placeholder: 'e.g., The feedback pointed out specific areas for improvement...'
      },
      {
        key: 'evidence_against',
        label: 'Evidence Against the Thought',
        prompt: 'What evidence contradicts your automatic thought?',
        placeholder: 'e.g., They also mentioned several things I did well, this is my first presentation...'
      },
      {
        key: 'balanced_thought',
        label: 'Balanced Thought',
        prompt: 'What would be a more balanced, realistic way to think about this?',
        placeholder: 'e.g., I received mixed feedback on my first presentation. Some areas need work, but I also did some things well...'
      }
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            Thought Record Exercise
          </h3>
          <button
            onClick={() => setActiveExercise(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">{index + 1}</span>
                </div>
                <h4 className="ml-3 font-medium text-gray-900">{step.label}</h4>
              </div>
              
              <p className="text-gray-600 mb-3">{step.prompt}</p>
              
              <textarea
                value={thoughtRecord[step.key as keyof typeof thoughtRecord]}
                onChange={(e) => setThoughtRecord(prev => ({
                  ...prev,
                  [step.key]: e.target.value
                }))}
                placeholder={step.placeholder}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Save Draft
          </button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Complete Exercise
          </button>
        </div>
      </div>
    );
  };

  const renderBehavioralActivation = () => {
    const activities = [
      { category: 'Physical', items: ['Take a walk', 'Do yoga', 'Garden', 'Dance'] },
      { category: 'Social', items: ['Call a friend', 'Join a group', 'Volunteer', 'Visit family'] },
      { category: 'Creative', items: ['Draw/Paint', 'Write', 'Play music', 'Craft projects'] },
      { category: 'Self-Care', items: ['Take a bath', 'Read', 'Meditate', 'Cook a meal'] },
      { category: 'Achievement', items: ['Organize space', 'Learn something', 'Complete a task', 'Set goals'] }
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="h-6 w-6 text-green-600 mr-2" />
            Behavioral Activation
          </h3>
          <button
            onClick={() => setActiveExercise(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Plan activities that can improve your mood and sense of accomplishment. 
            Choose activities from different categories for a balanced approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {activities.map((category) => (
            <div key={category.category} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">My Activity Plan for Today:</h4>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="List the activities you plan to do today and when..."
            rows={4}
          />
        </div>

        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          Save Activity Plan
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          CBT Interactive Exercises
        </h2>
        <p className="text-gray-600">
          Evidence-based cognitive behavioral therapy techniques to help you develop healthy thinking patterns and behaviors.
        </p>
      </div>

      {/* Active Exercise */}
      {activeExercise === 'thought-record' && renderThoughtRecord()}
      {activeExercise === 'behavioral-activation' && renderBehavioralActivation()}

      {/* Exercise Selection */}
      {!activeExercise && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose an Exercise</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cbtModules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Icon className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{module.title}</h4>
                        <p className="text-gray-600 text-sm">{module.category}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="bg-gray-100 px-2 py-1 rounded-full mb-1">
                        {module.duration}
                      </div>
                      <div className="text-gray-500">{module.difficulty}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{module.description}</p>
                  
                  <button
                    onClick={() => setActiveExercise(module.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <span>Start Exercise</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Tracking */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          Your Progress
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Exercises Completed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">7</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">Skills Practiced</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Recent Exercises:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700">Thought Record - Workplace Stress</span>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700">Behavioral Activation - Weekend Planning</span>
              </div>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBTExercises;