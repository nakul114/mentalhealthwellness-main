import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Mic, Camera, Send, Lightbulb, 
  TrendingUp, Calendar, FileText, Search, Filter, Tag,
  Volume2, VolumeX, AlertTriangle, Smile
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import FacialExpressionAnalyzer from './FacialExpressionAnalyzer';

interface JournalProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const Journal: React.FC<JournalProps> = ({ userProfile }) => {
  const { state, addJournalEntry } = useApp();
  const [journalText, setJournalText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageMood, setImageMood] = useState<string | null>(null);
  const [showFacialAnalyzer, setShowFacialAnalyzer] = useState(false);
  const [facialMood, setFacialMood] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adaptivePrompts = [
    "What emotions am I experiencing right now, and where do I feel them in my body?",
    "What triggered my mood today, and how did I respond?",
    "What am I grateful for in this moment?",
    "What would I tell a friend who was feeling the way I do right now?",
    "What small step can I take today to care for myself?",
    "What patterns am I noticing in my thoughts or behaviors?",
  ];

  const availableTags = ['gratitude', 'anxiety', 'work', 'relationships', 'self-care', 'growth', 'challenges', 'achievements'];
  const moodOptions = ['great', 'good', 'neutral', 'struggling'];

  // Crisis detection keywords
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
    'hurt myself', 'self harm', 'cut myself', 'overdose', 'jump off', 'hang myself',
    'want to die', 'die', 'death', 'hopeless', 'helpless', 'worthless', 'burden'
  ];

  // Simplified language prompts for low literacy users
  const simplifiedPrompts = [
    "How do you feel today?",
    "What made you happy today?",
    "What made you sad today?",
    "What do you want to remember?",
    "What do you need help with?",
    "What are you thankful for?"
  ];

  const handleSaveEntry = () => {
    if (journalText.trim()) {
      // Generate simple AI insights based on content
      const insights = generateInsights(journalText);
      
      addJournalEntry({
        content: journalText,
        mood: selectedMood || undefined,
        tags: selectedTags,
        insights: insights,
        prompt: selectedPrompt || undefined
      });
      
      // Reset form
      setJournalText('');
      setSelectedPrompt('');
      setSelectedTags([]);
      setSelectedMood('');
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = userProfile.preferredLanguage || 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setJournalText(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [userProfile.preferredLanguage]);

  // Crisis detection function
  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userProfile.preferredLanguage || 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      synthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  // Image analysis for mood detection
  const analyzeImageMood = (imageData: string): string => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        brightness /= (data.length / 4);
        
        if (brightness > 180) {
          setImageMood('great');
        } else if (brightness > 120) {
          setImageMood('good');
        } else if (brightness > 80) {
          setImageMood('neutral');
        } else {
          setImageMood('struggling');
        }
      }
    };
    img.src = imageData;
    return imageMood || 'neutral';
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in your browser');
      }
    }
  };

  // Handle image capture
  const handleImageCapture = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        analyzeImageMood(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle facial expression analysis
  const handleFacialMoodDetected = (mood: string, confidence: number) => {
    setFacialMood(mood);
    setSelectedMood(mood);
    setShowFacialAnalyzer(false);
    
    // Add a note about the facial analysis
    const facialNote = `[Facial analysis detected: ${mood} mood with ${Math.round(confidence * 100)}% confidence]`;
    setJournalText(prev => prev + (prev ? '\n\n' : '') + facialNote);
  };

  const generateInsights = (content: string): string[] => {
    const insights: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // Crisis detection
    if (detectCrisis(content)) {
      setCrisisDetected(true);
      insights.push('⚠️ We detected concerning content. Please consider reaching out for immediate support.');
      return insights;
    }
    
    if (lowerContent.includes('grateful') || lowerContent.includes('thankful')) {
      insights.push('Gratitude practice detected');
    }
    if (lowerContent.includes('anxious') || lowerContent.includes('worried')) {
      insights.push('Anxiety patterns noted');
    }
    if (lowerContent.includes('sleep') || lowerContent.includes('tired')) {
      insights.push('Sleep-related concerns identified');
    }
    if (lowerContent.includes('friend') || lowerContent.includes('family')) {
      insights.push('Social connections mentioned');
    }
    if (lowerContent.includes('work') || lowerContent.includes('job')) {
      insights.push('Work-related reflections');
    }
    if (lowerContent.includes('exercise') || lowerContent.includes('walk')) {
      insights.push('Physical activity noted');
    }
    
    return insights.length > 0 ? insights : ['New entry added'];
  };

  const filteredEntries = state.userData.journalEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => entry.tags.includes(tag));
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    
    return matchesSearch && matchesTags && matchesMood;
  });

  const aiInsights = [
    "You've mentioned sleep quality 3 times this week. Consider exploring sleep hygiene practices.",
    "Your entries show increased gratitude when you spend time with friends. Social connection appears important to your wellbeing.",
    "You often use self-compassionate language when describing challenges. This is a strength to build on."
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          AI-Powered Journal
        </h2>
        <p className="text-gray-600">
          Reflect on your thoughts and emotions. Our AI provides personalized insights to support your growth.
        </p>
      </div>

      {/* Writing Interface */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">New Entry</h3>
        
        {/* Adaptive Prompts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Reflection Prompts (Choose one or write freely)</h4>
            <div className="flex items-center space-x-2">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={userProfile.accessibilityMode}
                  onChange={(e) => {
                    // This would update the user profile in a real app
                    console.log('Accessibility mode toggled:', e.target.checked);
                  }}
                  className="mr-1"
                />
                Simple language
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(userProfile.accessibilityMode ? simplifiedPrompts : adaptivePrompts).slice(0, 4).map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  if (audioEnabled) {
                    speakText(prompt);
                  }
                }}
                className={`
                  p-3 text-left rounded-lg border text-sm transition-colors
                  ${selectedPrompt === prompt 
                    ? 'border-blue-500 bg-blue-50 text-blue-800' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                {prompt}
                {audioEnabled && (
                  <Volume2 className="inline h-3 w-3 ml-2 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder={selectedPrompt || "What's on your mind today?"}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Journal entry text"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {journalText.length} characters
          </div>
        </div>

        {/* Tags and Mood Selection */}
        <div className="mb-4 space-y-4">
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <Tag className="inline h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Mood (optional)</label>
            <div className="flex gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedMood === mood
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {mood === 'great' ? '😊' : mood === 'good' ? '🙂' : mood === 'neutral' ? '😐' : '😔'} {mood}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Crisis Alert */}
        {crisisDetected && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-semibold text-red-900">Crisis Support Available</h4>
            </div>
            <p className="text-red-800 text-sm mb-3">
              We detected concerning content in your entry. Please know that help is available 24/7.
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.location.href = '#crisis'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Get Crisis Support
              </button>
              <button 
                onClick={() => setCrisisDetected(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Captured Image Display */}
        {capturedImage && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Captured Image</h4>
              <button 
                onClick={() => setCapturedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <img src={capturedImage} alt="Captured" className="w-32 h-32 object-cover rounded-lg mb-2" />
            {imageMood && (
              <p className="text-sm text-gray-600">
                Detected mood: <span className="font-medium capitalize">{imageMood}</span>
              </p>
            )}
          </div>
        )}

        {/* Input Options */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoiceRecording}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors
                ${isListening 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }
              `}
              aria-label={isListening ? "Stop recording" : "Start voice recording"}
            >
              <Mic className="h-4 w-4" />
              <span>{isListening ? 'Listening...' : 'Voice Note'}</span>
            </button>
            
            <button 
              onClick={handleImageCapture}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 text-gray-700"
            >
              <Camera className="h-4 w-4" />
              <span>Photo</span>
            </button>

            <button 
              onClick={() => setShowFacialAnalyzer(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-purple-300 hover:border-purple-400 text-purple-700"
            >
              <Smile className="h-4 w-4" />
              <span>Face Analysis</span>
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                audioEnabled 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>Audio {audioEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Get Insights</span>
            </button>
            
            <button
              onClick={handleSaveEntry}
              disabled={!journalText.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>Save Entry</span>
            </button>
          </div>
        </div>

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* AI Insights */}
        {showInsights && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              AI-Generated Insights
            </h4>
            <div className="space-y-2">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-purple-800 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="h-5 w-5 text-gray-600 mr-2" />
          Search & Filter Entries
        </h3>
        
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search entries</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your journal entries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >
                  <Tag className="inline h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by mood</label>
            <div className="flex gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                    selectedMood === mood
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {mood === 'great' ? '😊' : mood === 'good' ? '🙂' : mood === 'neutral' ? '😐' : '😔'} {mood}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 text-gray-600 mr-2" />
            Journal Entries ({filteredEntries.length})
          </h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <TrendingUp className="h-4 w-4" />
            <span>View Analytics</span>
          </button>
        </div>

        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No entries found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{entry.date}</span>
                    {entry.mood && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{entry.content.substring(0, 200)}{entry.content.length > 200 ? '...' : ''}</p>
                
                {entry.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">Tags:</span>
                    {entry.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {entry.insights.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Insights:</span>
                    {entry.insights.map((insight, index) => (
                      <span key={index} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {insight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Facial Expression Analyzer Modal */}
      {showFacialAnalyzer && (
        <FacialExpressionAnalyzer
          onMoodDetected={handleFacialMoodDetected}
          onClose={() => setShowFacialAnalyzer(false)}
        />
      )}
    </div>
  );
};

export default Journal;