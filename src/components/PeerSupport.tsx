import React, { useState } from 'react';
import { 
  Users, MessageCircle, Heart, Shield, 
  Plus, Search, Filter, Flag, ThumbsUp 
} from 'lucide-react';

interface PeerSupportProps {
  userProfile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
}

const PeerSupport: React.FC<PeerSupportProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    anonymous: true
  });

  const supportGroups = [
    {
      id: 1,
      name: 'Anxiety Support Circle',
      members: 1247,
      description: 'A safe space for those dealing with anxiety',
      color: 'bg-blue-100 text-blue-800',
      joined: true
    },
    {
      id: 2,
      name: 'Mindfulness & Meditation',
      members: 892,
      description: 'Share meditation experiences and techniques',
      color: 'bg-purple-100 text-purple-800',
      joined: true
    },
    {
      id: 3,
      name: 'Work-Life Balance',
      members: 634,
      description: 'Discussing healthy boundaries and stress management',
      color: 'bg-green-100 text-green-800',
      joined: false
    },
    {
      id: 4,
      name: 'Young Adults Mental Health',
      members: 1156,
      description: 'Support for ages 18-35 navigating life challenges',
      color: 'bg-orange-100 text-orange-800',
      joined: false
    }
  ];

  const discussions = [
    {
      id: 1,
      title: 'How do you handle work anxiety?',
      author: 'Anonymous Helper',
      timeAgo: '2 hours ago',
      replies: 23,
      likes: 45,
      category: 'Anxiety Support',
      preview: 'I\'ve been struggling with anxiety at work, especially during meetings. What strategies have worked for you?',
      tags: ['anxiety', 'workplace', 'coping'],
      urgent: false
    },
    {
      id: 2,
      title: 'Celebrating small wins - what was yours today?',
      author: 'Mindful Journey',
      timeAgo: '4 hours ago',
      replies: 67,
      likes: 128,
      category: 'General Support',
      preview: 'Let\'s share the small victories! Mine was taking a 10-minute walk instead of scrolling social media.',
      tags: ['celebration', 'progress', 'positivity'],
      urgent: false
    },
    {
      id: 3,
      title: 'Having a really tough day - need encouragement',
      author: 'Anonymous Friend',
      timeAgo: '30 minutes ago',
      replies: 8,
      likes: 15,
      category: 'Crisis Support',
      preview: 'Everything feels overwhelming right now. Just need to know someone cares.',
      tags: ['support', 'encouragement', 'difficult-day'],
      urgent: true
    }
  ];

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    // Here you would typically send to backend
    // Post creation functionality would be implemented here
    
    setNewPost({ title: '', content: '', category: 'general', anonymous: true });
    setShowNewPost(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Users className="h-6 w-6 text-teal-600 mr-2" />
          Peer Support Community
        </h2>
        <p className="text-gray-600 mb-4">
          Connect with others on similar journeys. Share experiences, offer support, and find encouragement in a moderated, safe environment.
        </p>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-green-600">
            <Shield className="h-4 w-4" />
            <span>Moderated 24/7</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Heart className="h-4 w-4" />
            <span>Anonymous Options</span>
          </div>
          <div className="text-gray-600">2,847 active members</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'discussions', label: 'Discussions', icon: MessageCircle },
              { id: 'groups', label: 'Support Groups', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setShowNewPost(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Discussion</span>
                </button>
              </div>

              {/* New Post Form */}
              {showNewPost && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Start a New Discussion</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        placeholder="Discussion title..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        placeholder="Share your thoughts, ask for advice, or offer support..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <select
                          value={newPost.category}
                          onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="general">General Support</option>
                          <option value="anxiety">Anxiety Support</option>
                          <option value="depression">Depression Support</option>
                          <option value="crisis">Need Immediate Support</option>
                        </select>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newPost.anonymous}
                            onChange={(e) => setNewPost({...newPost, anonymous: e.target.checked})}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Post anonymously</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowNewPost(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePost}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                        >
                          Post Discussion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Discussion List */}
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className={`
                    border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer
                    ${discussion.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}
                  `}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {discussion.urgent && (
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          <h3 className="font-semibold text-gray-900">{discussion.title}</h3>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>by {discussion.author}</span>
                          <span>{discussion.timeAgo}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {discussion.category}
                          </span>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-gray-600">
                        <Flag className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{discussion.preview}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{discussion.likes} helpful</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {discussion.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{group.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{group.members.toLocaleString()} members</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${group.color}`}>
                        Active
                      </span>
                    </div>
                    
                    <button
                      className={`
                        w-full py-2 px-4 rounded-lg font-medium transition-colors
                        ${group.joined
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-teal-600 text-white hover:bg-teal-700'
                        }
                      `}
                    >
                      {group.joined ? 'Joined' : 'Join Group'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerSupport;