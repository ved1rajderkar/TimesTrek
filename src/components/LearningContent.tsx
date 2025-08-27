import React, { useState, useEffect } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Star, BookOpen, Target, Lightbulb } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface LearningContentProps {
  playerName: string;
}

const LearningContent: React.FC<LearningContentProps> = ({ playerName }) => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [currentLesson, setCurrentLesson] = useState<'concept' | 'visual' | 'practice'>('concept');
  const [showVisualAid, setShowVisualAid] = useState(true);
  const [showDivision, setShowDivision] = useState(false);
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
      result: table * (i + 1),
      divisionResult1: table * (i + 1),
      divisionResult2: i + 1
    }));
  };

  const currentTable = generateTable(selectedTable);

  const getConceptExplanation = (table: number) => {
    const concepts = {
      1: "The 1 times table is the easiest! When you multiply any number by 1, you get the same number. It's like having 1 group of things.",
      2: "The 2 times table is about doubling! It's like counting by 2s: 2, 4, 6, 8... Think of pairs of things, like shoes or socks!",
      3: "The 3 times table is about groups of 3! Think of triangles, tricycles, or groups of 3 friends playing together.",
      4: "The 4 times table is about groups of 4! Think of car wheels, table legs, or seasons in a year.",
      5: "The 5 times table always ends in 0 or 5! It's like counting nickels or fingers on hands.",
      10: "The 10 times table is super easy! Just add a zero to any number. 3 × 10 = 30, 7 × 10 = 70!",
      division: "Division is the opposite of multiplication! If 3 × 4 = 12, then 12 ÷ 3 = 4 and 12 ÷ 4 = 3. Think of sharing equally!"
    };
    return concepts[table as keyof typeof concepts] || `The ${table} times table shows groups of ${table}. Practice counting by ${table}s!`;
  };

  const getVisualStrategy = (table: number) => {
    const strategies = {
      2: "Double the number! 2 × 6 = 6 + 6 = 12",
      5: "Count by 5s on your fingers! 5, 10, 15, 20...",
      9: "Use the finger trick! Hold up 10 fingers, fold down the number you're multiplying by 9.",
      10: "Just add a zero! 4 × 10 = 40",
      11: "For numbers 1-9, just repeat the digit! 11 × 3 = 33"
    };
    return strategies[table as keyof typeof strategies] || `Look for patterns in the ${table} times table!`;
  };

  const renderConceptLesson = () => (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Understanding the {selectedTable} Times Table
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Core Concept
            </h3>
            <p className="text-blue-700 text-lg leading-relaxed">
              {getConceptExplanation(selectedTable)}
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Learning Strategy
            </h3>
            <p className="text-green-700 text-lg leading-relaxed">
              {getVisualStrategy(selectedTable)}
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-purple-800 mb-3">
              Real-World Examples
            </h3>
            <div className="space-y-2 text-purple-700">
              <p>• {selectedTable} groups of cookies {showDivision && `(or sharing cookies into ${selectedTable} groups)`}</p>
              <p>• {selectedTable} rows of seats {showDivision && `(or dividing seats into ${selectedTable} rows)`}</p>
              <p>• {selectedTable} boxes with items inside {showDivision && `(or splitting items into ${selectedTable} boxes)`}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Pattern Recognition</h3>
            <button
              onClick={() => setShowDivision(!showDivision)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                showDivision 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
            >
              {showDivision ? 'Show Multiplication' : 'Show Division'}
            </button>
          </div>
          {currentTable.slice(0, 5).map(({ multiplier, result, divisionResult1, divisionResult2 }) => (
            <div key={multiplier} className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-800 flex-1">
                  {showDivision ? (
                    <div className="space-y-1">
                      <div>{divisionResult1} ÷ {selectedTable} = {multiplier}</div>
                      <div className="text-lg text-gray-600">{divisionResult1} ÷ {multiplier} = {selectedTable}</div>
                    </div>
                  ) : (
                    <div>{selectedTable} × {multiplier} = {result}</div>
                  )}
                </div>
                <button
                  onClick={() => speakText(
                    showDivision 
                      ? `${divisionResult1} divided by ${selectedTable} equals ${multiplier}`
                      : `${selectedTable} times ${multiplier} equals ${result}`
                  )}
                  className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition-colors"
                >
                  <Volume2 className="w-5 h-5 text-orange-600" />
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {showDivision ? (
                  <span>Think: Share {divisionResult1} items into {selectedTable} equal groups = {multiplier} each</span>
                ) : (
                  <span>Think: {selectedTable} groups of {multiplier} = {result}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setCurrentLesson('visual')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
        >
          See Visual Examples →
        </button>
      </div>
    </div>
  );

  const renderVisualAid = (multiplier: number, result: number) => {
    if (!showVisualAid || multiplier > 10) return null;

    const items = [];
    for (let i = 0; i < Math.min(selectedTable, 10); i++) {
      for (let j = 0; j < Math.min(multiplier, 10); j++) {
        items.push(
          <div
            key={`${i}-${j}`}
            className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse shadow-lg"
            style={{
              animationDelay: `${(i * multiplier + j) * 100}ms`
            }}
          />
        );
      }
    }

    return (
      <div className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-blue-800">
            Visual Representation: {selectedTable} groups of {multiplier}
          </h4>
        </div>
        <div className="grid gap-3 justify-center" style={{
          gridTemplateColumns: `repeat(${Math.min(multiplier, 10)}, 1fr)`,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {items}
        </div>
        <div className="text-center mt-4 text-blue-700 font-semibold">
          Total dots: {result}
        </div>
      </div>
    );
  };

  const renderVisualLesson = () => (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">👀</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Visual Learning: {selectedTable} Times Table
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => setShowDivision(!showDivision)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              showDivision 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            {showDivision ? '🔄 Switch to Multiplication' : '🔄 Switch to Division'}
          </button>
        </div>
        
        {currentTable.slice(0, 6).map(({ multiplier, result, divisionResult1 }) => (
          <div key={multiplier} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-gray-800 flex items-center space-x-4 flex-1">
                {showDivision ? (
                  <>
                    <span className="text-purple-600">{divisionResult1}</span>
                    <span className="text-gray-500">÷</span>
                    <span className="text-blue-600">{selectedTable}</span>
                    <span className="text-gray-500">=</span>
                    <span className="text-green-600">{multiplier}</span>
                  </>
                ) : (
                  <>
                    <span className="text-blue-600">{selectedTable}</span>
                    <span className="text-gray-500">×</span>
                    <span className="text-green-600">{multiplier}</span>
                    <span className="text-gray-500">=</span>
                    <span className="text-purple-600">{result}</span>
                  </>
                )}
              </div>
              <button
                onClick={() => speakText(
                  showDivision 
                    ? `${divisionResult1} divided by ${selectedTable} equals ${multiplier}`
                    : `${selectedTable} times ${multiplier} equals ${result}`
                )}
                className="p-3 rounded-full bg-purple-200 hover:bg-purple-300 transition-colors"
              >
                <Volume2 className="w-6 h-6 text-purple-600" />
              </button>
            </div>
            {!showDivision && renderVisualAid(multiplier, result)}
            {showDivision && (
              <div className="mt-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-orange-800">
                    Division Visualization: {divisionResult1} ÷ {selectedTable}
                  </h4>
                </div>
                <div className="text-center text-orange-700">
                  <p className="mb-2">Imagine you have {divisionResult1} items to share equally among {selectedTable} groups:</p>
                  <div className="text-2xl font-bold text-orange-600">
                    Each group gets {multiplier} items
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentLesson('concept')}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
        >
          ← Back to Concept
        </button>
        <button
          onClick={() => setCurrentLesson('practice')}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          Practice Now →
        </button>
      </div>
    </div>
  );

  const renderPracticeLesson = () => (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">💪</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Practice: {selectedTable} Times Table
        </h2>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => setShowDivision(!showDivision)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              showDivision 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            {showDivision ? '✖️ Multiplication Mode' : '➗ Division Mode'}
          </button>
        </div>
        
        {currentTable.map(({ multiplier, result, divisionResult1 }) => (
          <div
            key={multiplier}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center space-x-4 flex-1">
                {showDivision ? (
                  <>
                    <span className="text-purple-600">{divisionResult1}</span>
                    <span className="text-gray-500">÷</span>
                    <span className="text-blue-600">{selectedTable}</span>
                    <span className="text-gray-500">=</span>
                    <span className="text-green-600">{multiplier}</span>
                  </>
                ) : (
                  <>
                    <span className="text-blue-600">{selectedTable}</span>
                    <span className="text-gray-500">×</span>
                    <span className="text-green-600">{multiplier}</span>
                    <span className="text-gray-500">=</span>
                    <span className="text-purple-600">{result}</span>
                  </>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => speakText(
                    showDivision 
                      ? `${divisionResult1} divided by ${selectedTable} equals ${multiplier}`
                      : `${selectedTable} times ${multiplier} equals ${result}`
                  )}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </button>
                {playerStats.completedTables.includes(selectedTable) && (
                  <div className="p-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">Ready to Test Your Knowledge?</h3>
          <p className="text-lg">Now that you've learned the {selectedTable} {showDivision ? 'division' : 'times'} table, try the games to practice!</p>
        </div>
        
        <button
          onClick={() => setCurrentLesson('concept')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          ← Review Concept
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          📚 Learning Center
        </h1>
        <p className="text-xl text-white drop-shadow-md">
          Master multiplication with step-by-step lessons, {playerName}! 🌟
        </p>
      </div>

      {/* Lesson Navigation */}
      <div className="bg-white rounded-2xl p-4 mb-8 shadow-xl">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentLesson('concept')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentLesson === 'concept'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>1. Concept</span>
          </button>
          
          <button
            onClick={() => setCurrentLesson('visual')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentLesson === 'visual'
                ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>2. Visual</span>
          </button>
          
          <button
            onClick={() => setCurrentLesson('practice')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentLesson === 'practice'
                ? 'bg-green-500 text-white shadow-lg transform scale-105'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            <Star className="w-5 h-5" />
            <span>3. Practice</span>
          </button>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Choose Your Learning Level
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
                  Mastered!
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
      </div>

      {/* Lesson Content */}
      {currentLesson === 'concept' && renderConceptLesson()}
      {currentLesson === 'visual' && renderVisualLesson()}
      {currentLesson === 'practice' && renderPracticeLesson()}
    </div>
  );
};

export default LearningContent;