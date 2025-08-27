import React, { useState, useEffect } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface LearningModeProps {
  playerName: string;
}

const LearningMode: React.FC<LearningModeProps> = ({ playerName }) => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [showVisualAid, setShowVisualAid] = useState(true);
  const { playerStats, setDifficultyLevel } = useGame();

  const getDifficultyRange = () => {
    switch (playerStats.difficultyLevel) {
      case 'beginner': return { min: 1, max: 5 };
      case 'intermediate': return { min: 1, max: 12 };
      case 'advanced': return { min: 1, max: 20 };
      default: return { min: 1, max: 5 };
    }
  };

  const { min, max } = getDifficultyRange();

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const generateTable = (table: number) => {
    return Array.from({ length: max }, (_, i) => ({
      multiplier: i + 1,
      result: table * (i + 1)
    }));
  };

  const currentTable = generateTable(selectedTable);

  const renderVisualAid = (multiplier: number, result: number) => {
    if (!showVisualAid || multiplier > 10) return null;

    const items = [];
    for (let i = 0; i < Math.min(selectedTable, 10); i++) {
      for (let j = 0; j < Math.min(multiplier, 10); j++) {
        items.push(
          <div
            key={`${i}-${j}`}
            className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"
            style={{
              animationDelay: `${(i * multiplier + j) * 50}ms`
            }}
          />
        );
      }
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <div className="grid gap-2" style={{
          gridTemplateColumns: `repeat(${Math.min(multiplier, 10)}, 1fr)`,
          maxWidth: '400px'
        }}>
          {items}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          🎯 Multiplication Tables
        </h1>
        <p className="text-xl text-white drop-shadow-md">
          Learn with your animal friends! 🦊🐻🐰
        </p>
      </div>

      {/* Difficulty Selector */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Choose Your Level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setDifficultyLevel('beginner')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              playerStats.difficultyLevel === 'beginner'
                ? 'border-green-500 bg-green-50 transform scale-105'
                : 'border-gray-300 hover:border-green-300'
            }`}
          >
            <div className="text-3xl mb-2">🌱</div>
            <div className="font-bold text-green-600">Beginner</div>
            <div className="text-sm text-gray-600">Tables 1-5</div>
          </button>

          <button
            onClick={() => setDifficultyLevel('intermediate')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              playerStats.difficultyLevel === 'intermediate'
                ? 'border-yellow-500 bg-yellow-50 transform scale-105'
                : 'border-gray-300 hover:border-yellow-300'
            }`}
          >
            <div className="text-3xl mb-2">🌟</div>
            <div className="font-bold text-yellow-600">Intermediate</div>
            <div className="text-sm text-gray-600">Tables 1-12</div>
          </button>

          <button
            onClick={() => setDifficultyLevel('advanced')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              playerStats.difficultyLevel === 'advanced'
                ? 'border-red-500 bg-red-50 transform scale-105'
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-bold text-red-600">Advanced</div>
            <div className="text-sm text-gray-600">Tables 1-20</div>
          </button>
        </div>
      </div>

      {/* Table Selector */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedTable(Math.max(min, selectedTable - 1))}
            disabled={selectedTable <= min}
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {selectedTable}
            </div>
            <div className="text-xl text-gray-600">
              Times Table
            </div>
            {playerStats.completedTables.includes(selectedTable) && (
              <div className="flex items-center justify-center mt-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm font-semibold text-yellow-600">
                  Completed!
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedTable(Math.min(max, selectedTable + 1))}
            disabled={selectedTable >= max}
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Table Numbers Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(num => (
            <button
              key={num}
              onClick={() => setSelectedTable(num)}
              className={`p-3 rounded-lg font-bold transition-all duration-300 ${
                selectedTable === num
                  ? 'bg-blue-500 text-white transform scale-110'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Visual Aid Toggle */}
        <div className="text-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showVisualAid}
              onChange={(e) => setShowVisualAid(e.target.checked)}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              showVisualAid ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                showVisualAid ? 'transform translate-x-6' : ''
              }`} />
            </div>
            <span className="ml-3 text-gray-700 font-semibold">
              Show Visual Dots
            </span>
          </label>
        </div>
      </div>

      {/* Multiplication Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="grid gap-4">
          {currentTable.map(({ multiplier, result }) => (
            <div
              key={multiplier}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center space-x-4">
                  <span className="text-blue-600">{selectedTable}</span>
                  <span className="text-gray-500">×</span>
                  <span className="text-green-600">{multiplier}</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-purple-600">{result}</span>
                </div>
                
                <button
                  onClick={() => speakText(`${selectedTable} times ${multiplier} equals ${result}`)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              
              {renderVisualAid(multiplier, result)}
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-6 shadow-xl">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-xl font-bold">
            Great job learning, {playerName}! Keep practicing to become a multiplication master!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningMode;