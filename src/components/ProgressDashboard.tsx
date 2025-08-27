import React from 'react';
import { Trophy, Target, Zap, Star, TrendingUp, Calendar } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface ProgressDashboardProps {
  playerName: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ playerName }) => {
  const { playerStats } = useGame();

  const getBadgeInfo = (badge: string) => {
    const badgeMap: { [key: string]: { name: string; icon: string; description: string } } = {
      'first-correct': { name: 'First Success', icon: '🎯', description: 'Got your first answer right!' },
      '5-streak': { name: 'Hot Streak', icon: '🔥', description: '5 correct answers in a row' },
      '10-streak': { name: 'On Fire', icon: '🌟', description: '10 correct answers in a row' },
      'speed-demon': { name: 'Speed Demon', icon: '⚡', description: '15+ correct in speed challenge' },
      'lightning-master': { name: 'Lightning Master', icon: '🏆', description: '25+ correct in speed challenge' },
      'memory-master': { name: 'Memory Master', icon: '🧠', description: 'Perfect memory match' },
      'perfect-memory': { name: 'Perfect Memory', icon: '💎', description: 'Flawless memory game' },
      'level-1': { name: 'Seedling', icon: '🌱', description: 'Completed Level 1' },
      'level-2': { name: 'Sprout', icon: '🌿', description: 'Completed Level 2' },
      'level-3': { name: 'Lightning', icon: '⚡', description: 'Completed Level 3' },
      'level-4': { name: 'Master', icon: '🏆', description: 'Completed Level 4' },
      'level-5': { name: 'Champion', icon: '👑', description: 'Completed Level 5' },
      'ultimate-champion': { name: 'Ultimate Champion', icon: '🏅', description: 'Completed all challenges' },
      'streak-legend': { name: 'Streak Legend', icon: '🌠', description: '10+ streak in speed challenge' },
      'unstoppable': { name: 'Unstoppable', icon: '🚀', description: '15+ streak in speed challenge' }
    };
    return badgeMap[badge] || { name: badge, icon: '🏆', description: 'Special achievement!' };
  };

  const getProgressPercentage = () => {
    return playerStats.totalAttempted > 0 ? (playerStats.totalCorrect / playerStats.totalAttempted) * 100 : 0;
  };

  const getNextLevelProgress = () => {
    const pointsForCurrentLevel = (playerStats.level - 1) * 1000;
    const pointsForNextLevel = playerStats.level * 1000;
    const currentProgress = playerStats.pointsEarned - pointsForCurrentLevel;
    const totalNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return (currentProgress / totalNeeded) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          📊 Progress Dashboard
        </h1>
        <p className="text-xl text-white drop-shadow-md">
          Look how much you've learned, {playerName}! 🌟
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{playerStats.level}</div>
          <div className="text-gray-600 font-semibold">Current Level</div>
          <div className="mt-2 bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, getNextLevelProgress())}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{Math.round(getProgressPercentage())}%</div>
          <div className="text-gray-600 font-semibold">Accuracy</div>
          <div className="text-sm text-gray-500 mt-1">{playerStats.totalCorrect}/{playerStats.totalAttempted}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{playerStats.bestStreak}</div>
          <div className="text-gray-600 font-semibold">Best Streak</div>
          <div className="text-sm text-gray-500 mt-1">Current: {playerStats.currentStreak}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-transform">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">{playerStats.pointsEarned}</div>
          <div className="text-gray-600 font-semibold">Total Points</div>
          <div className="text-sm text-gray-500 mt-1">Keep earning!</div>
        </div>
      </div>

      {/* Tables Progress */}
      <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          Multiplication Tables Mastered
        </h2>
        
        <div className="grid grid-cols-4 md:grid-cols-10 gap-3">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(table => {
            const isCompleted = playerStats.completedTables.includes(table);
            return (
              <div
                key={table}
                className={`relative p-4 rounded-xl text-center font-bold text-lg transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white transform scale-110 shadow-lg'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {table}
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-lg text-gray-600">
            <span className="font-bold text-green-600">{playerStats.completedTables.length}</span> out of 20 tables mastered!
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${(playerStats.completedTables.length / 20) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
          Achievement Badges ({playerStats.badges.length})
        </h2>
        
        {playerStats.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playerStats.badges.map((badge, index) => {
              const badgeInfo = getBadgeInfo(badge);
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl text-center border-2 border-yellow-300 transform hover:scale-105 transition-transform"
                >
                  <div className="text-4xl mb-2">{badgeInfo.icon}</div>
                  <div className="font-bold text-gray-800 text-sm mb-1">{badgeInfo.name}</div>
                  <div className="text-xs text-gray-600">{badgeInfo.description}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-600 text-lg">No badges yet - keep playing to earn your first achievement!</p>
          </div>
        )}
      </div>

      {/* Difficulty Level */}
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-600" />
          Current Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl border-2 ${
            playerStats.difficultyLevel === 'beginner' ? 'border-green-400 bg-green-50' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-2">🌱</div>
              <div className="font-bold text-green-600">Beginner</div>
              <div className="text-sm text-gray-600">Tables 1-5</div>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl border-2 ${
            playerStats.difficultyLevel === 'intermediate' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <div className="font-bold text-yellow-600">Intermediate</div>
              <div className="text-sm text-gray-600">Tables 1-12</div>
            </div>
          </div>
          
          <div className={`p-6 rounded-xl border-2 ${
            playerStats.difficultyLevel === 'advanced' ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-bold text-red-600">Advanced</div>
              <div className="text-sm text-gray-600">Tables 1-20</div>
            </div>
          </div>
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-6 shadow-xl">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-xl font-bold mb-2">
            {playerStats.level >= 10 ? "You're a Multiplication Master!" :
             playerStats.level >= 5 ? "Amazing progress, keep it up!" :
             playerStats.totalCorrect >= 50 ? "You're getting really good at this!" :
             playerStats.totalCorrect >= 20 ? "Great job learning!" :
             "You're off to a fantastic start!"}
          </p>
          <p className="text-lg opacity-90">
            Keep practicing to unlock more badges and level up! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;