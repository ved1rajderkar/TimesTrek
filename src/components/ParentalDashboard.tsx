import React, { useState } from 'react';
import { Users, TrendingUp, Calendar, Settings, BarChart3, Clock, Target } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const ParentalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'settings'>('overview');
  const { playerStats, resetStats } = useGame();

  const getPerformanceLevel = () => {
    const accuracy = playerStats.totalAttempted > 0 ? (playerStats.totalCorrect / playerStats.totalAttempted) * 100 : 0;
    if (accuracy >= 90) return { level: 'Excellent', color: 'green', description: 'Outstanding performance!' };
    if (accuracy >= 75) return { level: 'Good', color: 'blue', description: 'Solid understanding' };
    if (accuracy >= 60) return { level: 'Fair', color: 'yellow', description: 'Room for improvement' };
    return { level: 'Needs Practice', color: 'red', description: 'Requires more practice' };
  };

  const getRecommendations = () => {
    const recommendations = [];
    const accuracy = playerStats.totalAttempted > 0 ? (playerStats.totalCorrect / playerStats.totalAttempted) * 100 : 0;
    
    if (accuracy < 70) {
      recommendations.push("Focus on learning mode to build foundation");
    }
    if (playerStats.bestStreak < 5) {
      recommendations.push("Practice consistently to improve focus");
    }
    if (playerStats.completedTables.length < 5) {
      recommendations.push("Work on mastering basic tables (1-5) first");
    }
    if (playerStats.badges.length < 3) {
      recommendations.push("Play different game modes to earn badges");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Great progress! Continue with current difficulty level");
    }
    
    return recommendations;
  };

  const performance = getPerformanceLevel();
  const recommendations = getRecommendations();

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          👨‍👩‍👧‍👦 Parent Dashboard
        </h1>
        <p className="text-xl text-white drop-shadow-md">
          Track your child's learning progress and achievements
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-xl mb-8">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'detailed'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Detailed</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${performance.color}-100 p-3 rounded-full`}>
                  <Target className={`w-6 h-6 text-${performance.color}-600`} />
                </div>
                <div className={`text-sm font-semibold px-3 py-1 rounded-full bg-${performance.color}-100 text-${performance.color}-700`}>
                  {performance.level}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {playerStats.totalAttempted > 0 ? Math.round((playerStats.totalCorrect / playerStats.totalAttempted) * 100) : 0}%
              </div>
              <div className="text-gray-600 text-sm">Overall Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">{performance.description}</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{playerStats.level}</div>
              <div className="text-gray-600 text-sm">Current Level</div>
              <div className="text-xs text-gray-500 mt-1">{playerStats.pointsEarned} total points</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="bg-green-100 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{playerStats.completedTables.length}/20</div>
              <div className="text-gray-600 text-sm">Tables Mastered</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((playerStats.completedTables.length / 20) * 100)}% complete
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="bg-yellow-100 p-3 rounded-full w-fit mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{playerStats.bestStreak}</div>
              <div className="text-gray-600 text-sm">Best Streak</div>
              <div className="text-xs text-gray-500 mt-1">Current: {playerStats.currentStreak}</div>
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Progress</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Tables Mastered</span>
                  <span className="text-gray-600">{playerStats.completedTables.length}/20</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${(playerStats.completedTables.length / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Overall Accuracy</span>
                  <span className="text-gray-600">
                    {playerStats.totalAttempted > 0 ? Math.round((playerStats.totalCorrect / playerStats.totalAttempted) * 100) : 0}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      performance.color === 'green' ? 'bg-green-500' :
                      performance.color === 'blue' ? 'bg-blue-500' :
                      performance.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${playerStats.totalAttempted > 0 ? (playerStats.totalCorrect / playerStats.totalAttempted) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Achievements Earned</span>
                  <span className="text-gray-600">{playerStats.badges.length} badges</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (playerStats.badges.length / 10) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommendations for Parents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600 mt-1">💡</div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Tab */}
      {activeTab === 'detailed' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Statistics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Questions Attempted</span>
                    <span className="font-semibold">{playerStats.totalAttempted}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="font-semibold text-green-600">{playerStats.totalCorrect}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Incorrect Answers</span>
                    <span className="font-semibold text-red-600">{playerStats.totalAttempted - playerStats.totalCorrect}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-semibold text-purple-600">{playerStats.bestStreak}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Current Level</span>
                    <span className="font-semibold text-blue-600">{playerStats.level}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total Points Earned</span>
                    <span className="font-semibold text-yellow-600">{playerStats.pointsEarned}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Difficulty Settings</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {playerStats.difficultyLevel === 'beginner' ? '🌱' :
                       playerStats.difficultyLevel === 'intermediate' ? '🌟' : '🚀'}
                    </div>
                    <div className="font-bold text-lg capitalize mb-1">
                      {playerStats.difficultyLevel}
                    </div>
                    <div className="text-sm text-gray-600">
                      {playerStats.difficultyLevel === 'beginner' ? 'Tables 1-5' :
                       playerStats.difficultyLevel === 'intermediate' ? 'Tables 1-12' : 'Tables 1-20'}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-6">Achievements</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{playerStats.badges.length}</div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </div>
                  {playerStats.badges.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {playerStats.badges.slice(0, 6).map((badge, index) => (
                        <span key={index} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          {badge}
                        </span>
                      ))}
                      {playerStats.badges.length > 6 && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          +{playerStats.badges.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Mastery Grid */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Multiplication Tables Progress</h2>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 20 }, (_, i) => i + 1).map(table => {
                const isCompleted = playerStats.completedTables.includes(table);
                return (
                  <div
                    key={table}
                    className={`aspect-square flex items-center justify-center rounded-lg font-bold text-sm ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {table}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Green indicates mastered tables
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Parent Controls</h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Settings className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> Your child can change difficulty levels from the Learning section. 
                      Monitor their progress here to ensure they're being challenged appropriately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Reset Progress</h3>
                <p className="text-red-700 mb-4">
                  This will permanently delete all progress, scores, badges, and achievements. 
                  Your child will start completely fresh.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
                      resetStats();
                      alert('Progress has been reset successfully.');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Reset All Progress
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Tips for Parents</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Encourage daily practice for 10-15 minutes</li>
                  <li>• Celebrate achievements and badges earned</li>
                  <li>• If accuracy drops below 70%, consider reviewing in Learning Mode</li>
                  <li>• Mix different game modes to keep learning fun</li>
                  <li>• Progress gradually from Beginner to Advanced difficulty</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentalDashboard;