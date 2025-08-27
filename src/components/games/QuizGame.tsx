import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, X, Star } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface QuizGameProps {
  onBack: () => void;
}

interface Question {
  table: number;
  multiplier: number;
  answer: number;
  options: number[];
  isDivision?: boolean;
}

const QuizGame: React.FC<QuizGameProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
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

  const generateQuestion = (): Question => {
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
    
    // Generate wrong options
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { 
      table: questionTable, 
      multiplier: questionMultiplier, 
      answer, 
      options,
      isDivision 
    };
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (answer: number) => {
    if (!currentQuestion || showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const points = 10 + (streak * 5); // Bonus for streaks
      setScore(score + points);
      setStreak(streak + 1);
      updateStats(true, currentQuestion.table, points);
      
      // Check for badges
      if (streak + 1 === 5) addBadge('5-streak');
      if (streak + 1 === 10) addBadge('10-streak');
      
      // Play success sound
      if ((window as any).playSuccessSound) {
        (window as any).playSuccessSound();
      }
      
      speakText('Correct! Well done!');
    } else {
      setStreak(0);
      updateStats(false, currentQuestion.table, 0);
      speakText('Not quite right. Try again!');
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
  };

  const nextQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setSelectedAnswer(null);
    setShowResult(false);
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [playerStats.difficultyLevel]);

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Quiz Master</h1>
        </div>

        <div className="text-white text-right">
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-sm">Streak: {streak} 🔥</div>
          <button
            onClick={() => setShowDivision(!showDivision)}
            className="mt-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded"
          >
            {showDivision ? '✖️ Multiplication' : '➗ Division'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white bg-opacity-20 rounded-full h-4 mb-8">
        <div 
          className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(100, (questionsAnswered / 20) * 100)}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🤔</div>
          <div className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-4">
            {currentQuestion.isDivision ? (
              <>
                <span className="text-purple-600">{currentQuestion.table}</span>
                <span className="text-gray-400">÷</span>
                <span className="text-blue-600">{currentQuestion.multiplier}</span>
                <span className="text-gray-400">=</span>
                <span className="text-green-600">?</span>
              </>
            ) : (
              <>
                <span className="text-blue-600">{currentQuestion.table}</span>
                <span className="text-gray-400">×</span>
                <span className="text-green-600">{currentQuestion.multiplier}</span>
                <span className="text-gray-400">=</span>
                <span className="text-purple-600">?</span>
              </>
            )}
          </div>

          <button
            onClick={() => speakText(
              currentQuestion.isDivision 
                ? `What is ${currentQuestion.table} divided by ${currentQuestion.multiplier}?`
                : `What is ${currentQuestion.table} times ${currentQuestion.multiplier}?`
            )}
            className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Volume2 className="w-5 h-5" />
            <span>Hear Question</span>
          </button>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option) => {
            let buttonClass = "p-6 text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 ";
            
            if (showResult) {
              if (option === currentQuestion.answer) {
                buttonClass += "bg-green-500 text-white";
              } else if (option === selectedAnswer) {
                buttonClass += "bg-red-500 text-white";
              } else {
                buttonClass += "bg-gray-200 text-gray-500";
              }
            } else {
              buttonClass += "bg-gradient-to-br from-purple-100 to-pink-100 text-gray-800 hover:from-purple-200 hover:to-pink-200 cursor-pointer";
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center justify-center">
                  {option}
                  {showResult && option === currentQuestion.answer && (
                    <Check className="w-6 h-6 ml-2" />
                  )}
                  {showResult && option === selectedAnswer && option !== currentQuestion.answer && (
                    <X className="w-6 h-6 ml-2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Message */}
        {showResult && (
          <div className="text-center">
            <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? (
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-current animate-spin" />
                  <span>Excellent! +{10 + (streak * 5)} points</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Good try! The answer is {currentQuestion.answer}</span>
                </div>
              )}
            </div>

            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              {questionsAnswered >= 20 ? 'View Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>

      {/* Encouragement */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 shadow-xl">
          <p className="font-bold">
            {streak > 0 ? `Amazing streak of ${streak}! Keep it up! 🔥` : "You're doing great! Every question helps you learn! 💪"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;