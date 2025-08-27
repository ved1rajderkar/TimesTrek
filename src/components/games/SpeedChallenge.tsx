import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Zap, Trophy, Star } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface SpeedChallengeProps {
  onBack: () => void;
}

interface Question {
  table: number;
  multiplier: number;
  answer: number;
  isDivision?: boolean;
}

const SpeedChallenge: React.FC<SpeedChallengeProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showDivision, setShowDivision] = useState(false);

  const { playerStats, updateStats, addBadge } = useGame();

  const getDifficultyRange = () => {
    switch (playerStats.difficultyLevel) {
      case 'beginner': return { min: 1, max: 5 };
      case 'intermediate': return { min: 1, max: 12 };
      case 'advanced': return { min: 1, max: 20 };
      default: return { min: 1, max: 5 };
    }
  };

  const generateQuestion = useCallback((): Question => {
    const { min, max } = getDifficultyRange();
    const table = Math.floor(Math.random() * (max - min + 1)) + min;
    const multiplier = Math.floor(Math.random() * max) + 1;
    const isDivision = showDivision && Math.random() > 0.5;
    
    let answer: number;
    let questionTable: number;
    let questionMultiplier: number;
    
    if (isDivision) {
      const product = table * multiplier;
      answer = Math.random() > 0.5 ? table : multiplier;
      questionTable = product;
      questionMultiplier = answer === table ? multiplier : table;
    } else {
      answer = table * multiplier;
      questionTable = table;
      questionMultiplier = multiplier;
    }
    
    return { 
      table: questionTable, 
      multiplier: questionMultiplier, 
      answer,
      isDivision 
    };
  }, [playerStats.difficultyLevel]);

  const startGame = () => {
    setIsGameActive(true);
    setGameEnded(false);
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(60);
    setFeedback('');
    setCurrentQuestion(generateQuestion());
  };

  const endGame = useCallback(() => {
    setIsGameActive(false);
    setGameEnded(true);
    
    // Award badges based on performance
    if (correctAnswers >= 15) addBadge('speed-demon');
    if (correctAnswers >= 25) addBadge('lightning-master');
    if (bestStreak >= 10) addBadge('streak-legend');
    if (bestStreak >= 15) addBadge('unstoppable');
  }, [correctAnswers, bestStreak, addBadge]);

  const showFeedback = (message: string, isCorrect: boolean) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 1000);
  };

  const checkAnswer = useCallback(() => {
    if (!currentQuestion || !userAnswer.trim()) return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentQuestion.answer;
    
    setTotalQuestions(prev => prev + 1);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const streakBonus = streak * 2;
      const points = 10 + timeBonus + streakBonus;
      
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      updateStats(true, currentQuestion.table, points);
      
      // Play success sound
      if ((window as any).playSuccessSound) {
        (window as any).playSuccessSound();
      }
      
      showFeedback(`+${points} points!`, true);
    } else {
      setStreak(0);
      updateStats(false, currentQuestion.table, 0);
      showFeedback(`${currentQuestion.answer}`, false);
    }
    
    setUserAnswer('');
    setCurrentQuestion(generateQuestion());
  }, [currentQuestion, userAnswer, timeLeft, streak, generateQuestion, updateStats]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isGameActive) {
      checkAnswer();
    }
  };

  // Timer effect
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Pre-game screen
  if (!isGameActive && !gameEnded) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-8xl mb-6 animate-bounce">⚡</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Speed Lightning!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Answer as many questions as you can in 60 seconds!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-lg font-bold text-blue-600">60 Seconds</div>
              <div className="text-sm text-gray-600">Race against time!</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-lg font-bold text-green-600">Speed Bonus</div>
              <div className="text-sm text-gray-600">Faster = more points!</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-lg font-bold text-purple-600">Streak Power</div>
              <div className="text-sm text-gray-600">Chain correct answers!</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-6 px-12 rounded-2xl text-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8" />
              <span>Start Lightning Round!</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameEnded) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Lightning Round Complete!</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-orange-600">{bestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </div>

          <div className="mb-6">
            {correctAnswers >= 25 && (
              <div className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white p-4 rounded-xl mb-4">
                🌟 INCREDIBLE! You're a Lightning Master! 🌟
              </div>
            )}
            {correctAnswers >= 15 && correctAnswers < 25 && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl mb-4">
                ⚡ AMAZING! You're a Speed Demon! ⚡
              </div>
            )}
            {correctAnswers < 15 && (
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-xl mb-4">
                🚀 Great effort! Keep practicing to get even faster! 🚀
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active game screen
  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-white text-left">
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-sm">Streak: {streak} 🔥</div>
        </div>

        <div className="text-center">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center space-x-2 font-bold text-xl">
              <Clock className="w-6 h-6" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="text-white text-right">
          <div className="text-lg font-bold">{correctAnswers} Correct</div>
          <div className="text-sm">{accuracy}% Accuracy</div>
          <button
            onClick={() => setShowDivision(!showDivision)}
            className="mt-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded"
          >
            {showDivision ? '✖️ Mult' : '➗ Div'}
          </button>
        </div>
      </div>

      {currentQuestion && (
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-4">
              {currentQuestion.isDivision ? (
                <>
                  <span className="text-purple-600">{currentQuestion.table}</span>
                  <span className="text-gray-400">÷</span>
                  <span className="text-blue-600">{currentQuestion.multiplier}</span>
                  <span className="text-gray-400">=</span>
                </>
              ) : (
                <>
                  <span className="text-blue-600">{currentQuestion.table}</span>
                  <span className="text-gray-400">×</span>
                  <span className="text-green-600">{currentQuestion.multiplier}</span>
                  <span className="text-gray-400">=</span>
                </>
              )}
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="?"
              className="text-5xl text-center font-bold w-40 border-4 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none p-3 bg-purple-50"
              autoFocus
            />

            <div className="mt-6">
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 text-xl"
              >
                Submit ⚡
              </button>
            </div>

            {/* Feedback Display */}
            {feedback && (
              <div className={`mt-4 text-2xl font-bold animate-bounce ${
                feedback.includes('+') ? 'text-green-600' : 'text-blue-600'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Encouraging Message */}
      <div className="mt-6 text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 shadow-xl">
          <p className="font-bold text-lg">
            {streak >= 5 ? `🔥 ON FIRE! ${streak} in a row! Keep it up! 🔥` : 
             correctAnswers >= 10 ? "⚡ You're lightning fast! ⚡" : 
             "🚀 Go for it! Every second counts! 🚀"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeedChallenge;