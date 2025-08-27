import React, { useState } from 'react';
import { Brain, Zap, Puzzle, Trophy } from 'lucide-react';
import QuizGame from './games/QuizGame';
import SpeedChallenge from './games/SpeedChallenge';
import MemoryMatching from './games/MemoryMatching';
import ProgressiveLevels from './games/ProgressiveLevels';

interface GameHubProps {
  playerName: string;
}

type GameType = 'menu' | 'quiz' | 'speed' | 'memory' | 'progressive';

const GameHub: React.FC<GameHubProps> = ({ playerName }) => {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  const renderGame = () => {
    switch (currentGame) {
      case 'quiz':
        return <QuizGame onBack={() => setCurrentGame('menu')} />;
      case 'speed':
        return <SpeedChallenge onBack={() => setCurrentGame('menu')} />;
      case 'memory':
        return <MemoryMatching onBack={() => setCurrentGame('menu')} />;
      case 'progressive':
        return <ProgressiveLevels onBack={() => setCurrentGame('menu')} />;
      default:
        return null;
    }
  };

  if (currentGame !== 'menu') {
    return renderGame();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          🎮 Game Zone
        </h1>
        <p className="text-xl text-white drop-shadow-md">
          Choose your adventure, {playerName}!
        </p>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Game */}
        <div 
          onClick={() => setCurrentGame('quiz')}
          className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
        >
          <div className="text-center">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quiz Master</h3>
            <p className="text-gray-600 mb-4">
              Answer multiplication questions and test your knowledge!
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Points: 10-50
              </span>
            </div>
          </div>
        </div>

        {/* Speed Challenge */}
        <div 
          onClick={() => setCurrentGame('speed')}
          className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
        >
          <div className="text-center">
            <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
              <Zap className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Speed Lightning</h3>
            <p className="text-gray-600 mb-4">
              Race against time! How many can you solve in 60 seconds?
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Bonus Points
              </span>
            </div>
          </div>
        </div>

        {/* Memory Matching */}
        <div 
          onClick={() => setCurrentGame('memory')}
          className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
        >
          <div className="text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Puzzle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Memory Match</h3>
            <p className="text-gray-600 mb-4">
              Match multiplication equations with their answers!
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Memory Bonus
              </span>
            </div>
          </div>
        </div>

        {/* Progressive Levels */}
        <div 
          onClick={() => setCurrentGame('progressive')}
          className="bg-white rounded-2xl p-8 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
        >
          <div className="text-center">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Trophy className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Level Quest</h3>
            <p className="text-gray-600 mb-4">
              Complete challenges and unlock new levels progressively!
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                XP & Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">🤔 Did You Know?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">🧠</div>
            <p className="text-sm">Playing math games improves problem-solving skills!</p>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-sm">Speed practice helps you think faster in everyday math!</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm">Every mistake is a step closer to mastery!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHub;