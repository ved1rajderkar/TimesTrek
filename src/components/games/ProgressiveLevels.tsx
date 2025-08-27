import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Star, Zap, Target } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface ProgressiveLevelsProps {
  onBack: () => void;
}

interface Challenge {
  id: number;
  name: string;
  description: string;
  icon: string;
  targetScore: number;
  questionsCount: number;
  timeLimit?: number;
  completed: boolean;
  locked: boolean;
  reward: string;
}

interface Question {
  table: number;
  multiplier: number;
  answer: number;
  options: number[];
}

const ProgressiveLevels: React.FC<ProgressiveLevelsProps> = ({ onBack }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [challengePassed, setChallengePassed] = useState(false);

  const { playerStats, updateStats, addBadge } = useGame();

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      name: "First Steps",
      description: "Master the basics with tables 1-3",
      icon: "🌱",
      targetScore: 80,
      questionsCount: 10,
      completed: false,
      locked: false,
      reward: "Seedling Badge"
    },
    {
      id: 2,
      name: "Growing Stronger",
      description: "Tackle tables 1-5 with confidence",
      icon: "🌿",
      targetScore: 120,
      questionsCount: 12,
      completed: false,
      locked: true,
      reward: "Sprout Badge"
    },
    {
      id: 3,
      name: "Speed Burst",
      description: "Answer 15 questions in 90 seconds",
      icon: "⚡",
      targetScore: 150,
      questionsCount: 15,
      timeLimit: 90,
      completed: false,
      locked: true,
      reward: "Lightning Badge"
    },
    {
      id: 4,
      name: "Table Master",
      description: "Conquer tables 1-10 like a pro",
      icon: "🏆",
      targetScore: 200,
      questionsCount: 20,
      completed: false,
      locked: true,
      reward: "Master Badge"
    },
    {
      id: 5,
      name: "Ultimate Challenge",
      description: "Face the toughest problems",
      icon: "👑",
      targetScore: 300,
      questionsCount: 25,
      timeLimit: 120,
      completed: false,
      locked: true,
      reward: "Champion Crown"
    }
  ]);

  const getDifficultyForChallenge = (challengeId: number) => {
    switch (challengeId) {
      case 1: return { min: 1, max: 3 };
      case 2: return { min: 1, max: 5 };
      case 3: return { min: 1, max: 7 };
      case 4: return { min: 1, max: 10 };
      case 5: return { min: 1, max: 20 };
      default: return { min: 1, max: 5 };
    }
  };

  const generateQuestion = (challengeId: number): Question => {
    const { min, max } = getDifficultyForChallenge(challengeId);
    const table = Math.floor(Math.random() * (max - min + 1)) + min;
    const multiplier = Math.floor(Math.random() * max) + 1;
    const answer = table * multiplier;
    
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { table, multiplier, answer, options };
  };

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setCurrentQuestion(generateQuestion(challenge.id));
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setChallengeComplete(false);
    setChallengePassed(false);
    
    if (challenge.timeLimit) {
      setTimeLeft(challenge.timeLimit);
    }
  };

  const handleAnswer = (answer: number) => {
    if (!currentQuestion || !currentChallenge || showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const basePoints = 10;
      const timeBonus = currentChallenge.timeLimit ? Math.floor(timeLeft / 10) : 0;
      const points = basePoints + timeBonus;
      setScore(prev => prev + points);
      updateStats(true, currentQuestion.table, points);
      
      // Play success sound
      if ((window as any).playSuccessSound) {
        (window as any).playSuccessSound();
      }
    } else {
      updateStats(false, currentChallenge.table, 0);
    }
  };

  const nextQuestion = () => {
    if (!currentChallenge) return;
    
    if (questionIndex + 1 >= currentChallenge.questionsCount) {
      // Challenge complete
      setChallengeComplete(true);
      const passed = score >= currentChallenge.targetScore;
      setChallengePassed(passed);
      
      if (passed) {
        // Update challenges state
        setChallenges(prev => prev.map((ch, index) => {
          if (ch.id === currentChallenge.id) {
            return { ...ch, completed: true };
          } else if (ch.id === currentChallenge.id + 1) {
            return { ...ch, locked: false };
          }
          return ch;
        }));
        
        // Award badge
        addBadge(`level-${currentChallenge.id}`);
        if (currentChallenge.id === 5) addBadge('ultimate-champion');
      }
    } else {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(generateQuestion(currentChallenge.id));
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (currentChallenge?.timeLimit && timeLeft > 0 && !challengeComplete && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentChallenge?.timeLimit && timeLeft === 0 && !challengeComplete) {
      setChallengeComplete(true);
      setChallengePassed(score >= currentChallenge.targetScore);
    }
  }, [timeLeft, currentChallenge, challengeComplete, showResult, score]);

  // Challenge selection screen
  if (!currentChallenge) {
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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">Level Quest</h1>
          <p className="text-xl text-white drop-shadow-md">Complete challenges to unlock new levels!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-white rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                challenge.locked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer transform hover:scale-105'
              } ${challenge.completed ? 'ring-4 ring-green-400' : ''}`}
              onClick={() => !challenge.locked && startChallenge(challenge)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{challenge.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                  {challenge.name}
                  {challenge.completed && (
                    <Star className="w-6 h-6 text-yellow-500 fill-current ml-2" />
                  )}
                  {challenge.locked && (
                    <div className="w-6 h-6 text-gray-400 ml-2">🔒</div>
                  )}
                </h3>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">Target Score:</span>
                    <span className="font-bold text-green-600">{challenge.targetScore}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">Questions:</span>
                    <span className="font-bold text-blue-600">{challenge.questionsCount}</span>
                  </div>
                  {challenge.timeLimit && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">Time Limit:</span>
                      <span className="font-bold text-red-600">{challenge.timeLimit}s</span>
                    </div>
                  )}
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600 font-semibold">Reward:</div>
                  <div className="text-purple-800">{challenge.reward}</div>
                </div>

                {!challenge.locked && (
                  <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                    {challenge.completed ? 'Play Again' : 'Start Challenge'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Challenge complete screen
  if (challengeComplete) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-8xl mb-6">
            {challengePassed ? '🎉' : '💪'}
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Challenge {challengePassed ? 'Complete!' : 'Not Quite There'}
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{currentChallenge.targetScore}</div>
              <div className="text-sm text-gray-600">Target Score</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{questionIndex + 1}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
          </div>

          {challengePassed ? (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl mb-6">
              <div className="text-2xl font-bold mb-2">🏆 CHALLENGE PASSED! 🏆</div>
              <div className="text-lg">You earned the {currentChallenge.reward}!</div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-xl mb-6">
              <div className="text-xl font-bold mb-2">Keep practicing! 💪</div>
              <div>You need {currentChallenge.targetScore - score} more points to pass.</div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => startChallenge(currentChallenge)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Try Again
            </button>
            <button
              onClick={() => setCurrentChallenge(null)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
            >
              Back to Challenges
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active challenge screen
  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentChallenge(null)}
          className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">{currentChallenge.name}</h1>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span>Question {questionIndex + 1}/{currentChallenge.questionsCount}</span>
            {currentChallenge.timeLimit && (
              <span className="bg-red-500 px-2 py-1 rounded">⏰ {timeLeft}s</span>
            )}
          </div>
        </div>

        <div className="text-white text-right">
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-sm">Target: {currentChallenge.targetScore}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white bg-opacity-20 rounded-full h-4 mb-8">
        <div 
          className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${((questionIndex + 1) / currentChallenge.questionsCount) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentChallenge.icon}</div>
            <div className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-4">
              <span className="text-blue-600">{currentQuestion.table}</span>
              <span className="text-gray-400">×</span>
              <span className="text-green-600">{currentQuestion.multiplier}</span>
              <span className="text-gray-400">=</span>
              <span className="text-purple-600">?</span>
            </div>
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
                  {option}
                </button>
              );
            })}
          </div>

          {/* Result and Next Button */}
          {showResult && (
            <div className="text-center">
              <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 Correct! Great job!' : `😊 Nice try! The answer is ${currentQuestion.answer}`}
              </div>

              <button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                {questionIndex + 1 >= currentChallenge.questionsCount ? 'Finish Challenge' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressiveLevels;