import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Phone, MessageSquare, Heart, 
  Wind, Eye, Headphones, Clock, MapPin 
} from 'lucide-react';

interface CrisisSupportProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const CrisisSupport: React.FC<CrisisSupportProps> = ({ userProfile }) => {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [breathingCount, setBreathingCount] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [exerciseTimer, setExerciseTimer] = useState(0);

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 crisis support',
      urgent: true
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free 24/7 support via text',
      urgent: true
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Treatment referral and information',
      urgent: false
    }
  ];

  const groundingExercises = [
    {
      id: '54321',
      name: '5-4-3-2-1 Grounding',
      description: 'Use your senses to ground yourself',
      icon: Eye,
      duration: 5
    },
    {
      id: 'breathing',
      name: '4-7-8 Breathing',
      description: 'Calm your nervous system',
      icon: Wind,
      duration: 3
    },
    {
      id: 'progressive',
      name: 'Progressive Muscle Relaxation',
      description: 'Release tension from your body',
      icon: Heart,
      duration: 10
    },
    {
      id: 'audio',
      name: 'Guided Audio Support',
      description: 'Listen to calming guidance',
      icon: Headphones,
      duration: 8
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentExercise === 'breathing' && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev - 1);
        setBreathingCount(prev => prev + 1);
        
        const cycle = breathingCount % 19; // 4+7+8 = 19 second cycle
        if (cycle < 4) {
          setBreathingPhase('inhale');
        } else if (cycle < 11) {
          setBreathingPhase('hold');
        } else {
          setBreathingPhase('exhale');
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [currentExercise, exerciseTimer, breathingCount]);

  const startExercise = (exerciseId: string, duration: number) => {
    setCurrentExercise(exerciseId);
    setExerciseTimer(duration * 60);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const renderBreathingExercise = () => {
    if (currentExercise !== 'breathing') return null;

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 text-center">
        <div className="mb-6">
          <div className={`
            w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000
            ${breathingPhase === 'inhale' ? 'border-blue-500 scale-110' : 
              breathingPhase === 'hold' ? 'border-purple-500 scale-110' : 
              'border-green-500 scale-90'}
          `}>
            <div className={`
              w-full h-full rounded-full transition-all duration-1000
              ${breathingPhase === 'inhale' ? 'bg-blue-200 scale-110' : 
                breathingPhase === 'hold' ? 'bg-purple-200 scale-110' : 
                'bg-green-200 scale-75'}
            `} />
          </div>
        </div>
        
        <h4 className="text-2xl font-bold text-gray-900 mb-2">
          {breathingPhase === 'inhale' ? 'Breathe In' :
           breathingPhase === 'hold' ? 'Hold' : 'Breathe Out'}
        </h4>
        
        <p className="text-gray-700 mb-4">
          {breathingPhase === 'inhale' ? 'Slowly inhale through your nose for 4 counts' :
           breathingPhase === 'hold' ? 'Hold your breath for 7 counts' : 
           'Exhale through your mouth for 8 counts'}
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{Math.floor(exerciseTimer / 60)}:{(exerciseTimer % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentExercise(null)}
          className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Stop Exercise
        </button>
      </div>
    );
  };

  const render54321Exercise = () => {
    if (currentExercise !== '54321') return null;

    const steps = [
      "Name 5 things you can see around you",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste"
    ];

    return (
      <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-xl p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">5-4-3-2-1 Grounding Exercise</h4>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-lg font-medium text-gray-800">{step}</p>
              <textarea
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Write your observations here..."
                rows={2}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentExercise(null)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Complete Exercise
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Crisis Alert Header */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
          <h2 className="text-2xl font-bold text-red-900">Crisis Support</h2>
        </div>
        <p className="text-red-800 mb-4">
          If you're in immediate danger or having thoughts of self-harm, please reach out for help immediately. 
          You are not alone, and support is available 24/7.
        </p>
        <div className="bg-red-100 rounded-lg p-4">
          <p className="text-red-900 font-semibold">Emergency: Call 911 or go to your nearest emergency room</p>
        </div>
      </div>

      {/* Crisis Hotlines */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Immediate Support Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crisisResources.map((resource, index) => (
            <div key={index} className={`
              rounded-lg p-4 border-2 transition-colors
              ${resource.urgent ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50'}
            `}>
              <div className="flex items-center mb-2">
                <Phone className={`h-5 w-5 mr-2 ${resource.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                <h4 className={`font-semibold ${resource.urgent ? 'text-red-900' : 'text-blue-900'}`}>
                  {resource.name}
                </h4>
              </div>
              <p className={`text-lg font-bold mb-2 ${resource.urgent ? 'text-red-800' : 'text-blue-800'}`}>
                {resource.phone}
              </p>
              <p className={`text-sm ${resource.urgent ? 'text-red-700' : 'text-blue-700'}`}>
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Grounding Exercises */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Immediate Grounding Exercises
        </h3>
        
        {currentExercise ? (
          <div>
            {renderBreathingExercise()}
            {render54321Exercise()}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groundingExercises.map((exercise) => {
              const Icon = exercise.icon;
              return (
                <button
                  key={exercise.id}
                  onClick={() => startExercise(exercise.id, exercise.duration)}
                  className="text-left p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <Icon className="h-6 w-6 text-indigo-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                  </div>
                  <p className="text-gray-600 mb-2">{exercise.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{exercise.duration} minutes</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety Planning */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Safety Plan</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Warning Signs I Notice:</h4>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="List thoughts, feelings, or behaviors that indicate you need support..."
              rows={3}
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">My Support Contacts:</h4>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="List trusted friends, family, or professionals you can contact..."
              rows={3}
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Safe Places I Can Go:</h4>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="List physical locations where you feel safe and supported..."
              rows={3}
            />
          </div>
        </div>
        
        <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors">
          Save Safety Plan
        </button>
      </div>
    </div>
  );
};

export default CrisisSupport;