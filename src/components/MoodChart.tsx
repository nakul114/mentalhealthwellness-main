import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MoodEntry } from '../utils/storage';

interface MoodChartProps {
  moodHistory: MoodEntry[];
  className?: string;
}

const MoodChart: React.FC<MoodChartProps> = ({ moodHistory, className = '' }) => {
  // Get last 30 days of mood data
  const last30Days = moodHistory.slice(0, 30);
  
  // Calculate mood trend
  const getMoodTrend = () => {
    if (last30Days.length < 2) return 'stable';
    const recent = last30Days.slice(0, 7).reduce((sum, entry) => sum + entry.score, 0) / Math.min(7, last30Days.length);
    const older = last30Days.slice(7, 14).reduce((sum, entry) => sum + entry.score, 0) / Math.min(7, last30Days.slice(7).length);
    
    if (recent > older + 0.5) return 'improving';
    if (recent < older - 0.5) return 'declining';
    return 'stable';
  };

  const trend = getMoodTrend();
  
  // Get mood color based on score
  const getMoodColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    if (score >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get mood emoji based on score
  const getMoodEmoji = (score: number) => {
    if (score >= 8) return '😊';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    if (score >= 2) return '😔';
    return '😢';
  };

  // Calculate average mood for the period
  const averageMood = last30Days.length > 0 
    ? (last30Days.reduce((sum, entry) => sum + entry.score, 0) / last30Days.length).toFixed(1)
    : '0';

  // Get trend icon and color
  const getTrendDisplay = () => {
    switch (trend) {
      case 'improving':
        return { icon: TrendingUp, color: 'text-green-600', text: 'Improving' };
      case 'declining':
        return { icon: TrendingDown, color: 'text-red-600', text: 'Declining' };
      default:
        return { icon: Minus, color: 'text-gray-600', text: 'Stable' };
    }
  };

  const trendDisplay = getTrendDisplay();
  const TrendIcon = trendDisplay.icon;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Mood Trends</h3>
        <div className="flex items-center space-x-2">
          <TrendIcon className={`h-5 w-5 ${trendDisplay.color}`} />
          <span className={`text-sm font-medium ${trendDisplay.color}`}>
            {trendDisplay.text}
          </span>
        </div>
      </div>

      {/* Average Mood Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Average Mood (30 days)</p>
            <p className="text-3xl font-bold text-gray-900">{averageMood}/10</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-2xl font-bold text-blue-600">{last30Days.length}</p>
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between h-32 space-x-1">
          {last30Days.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>No mood data yet. Start tracking your mood to see trends!</p>
            </div>
          ) : (
            last30Days.slice(0, 14).reverse().map((entry, index) => {
              const height = (entry.score / 10) * 100;
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center group">
                  <div className="relative">
                    <div
                      className={`w-4 rounded-t transition-all duration-300 hover:opacity-80 ${getMoodColor(entry.score)}`}
                      style={{ height: `${height}%` }}
                      title={`${entry.date}: ${entry.score}/10`}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {entry.date}: {entry.score}/10
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {getMoodEmoji(entry.score)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mood Distribution */}
      {last30Days.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {[9, 7, 5, 3, 1].map((score) => {
            const count = last30Days.filter(entry => 
              score === 9 ? entry.score >= 8 : 
              score === 7 ? entry.score >= 6 && entry.score < 8 :
              score === 5 ? entry.score >= 4 && entry.score < 6 :
              score === 3 ? entry.score >= 2 && entry.score < 4 :
              entry.score < 2
            ).length;
            const percentage = last30Days.length > 0 ? (count / last30Days.length) * 100 : 0;
            
            return (
              <div key={score} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {score === 9 ? 'Great' : 
                   score === 7 ? 'Good' : 
                   score === 5 ? 'Okay' : 
                   score === 3 ? 'Tough' : 'Very Tough'}
                </div>
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${getMoodColor(score + 1)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insights */}
      {last30Days.length >= 7 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Insights</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {trend === 'improving' && (
              <p>🎉 Your mood has been improving over the past week! Keep up the great work.</p>
            )}
            {trend === 'declining' && (
              <p>💙 Your mood has been lower recently. Consider trying some self-care activities or reaching out for support.</p>
            )}
            {trend === 'stable' && (
              <p>📊 Your mood has been relatively stable. Consistency is a good foundation for growth.</p>
            )}
            {averageMood && parseFloat(averageMood) < 4 && (
              <p>🤗 You've been going through a tough time. Remember that it's okay to ask for help.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodChart;
