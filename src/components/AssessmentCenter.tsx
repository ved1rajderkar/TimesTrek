import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, BarChart3, Target, Trophy, Clock } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface AssessmentCenterProps {
  playerName: string;
}

interface AssessmentQuestion {
  table: number;
  multiplier: number;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number;
  isDivision?: boolean;
}

const AssessmentCenter: React.FC<AssessmentCenterProps> = ({ playerName }) => {
  const [currentAssessment, setCurrentAssessment] = useState<'pre' | 'active' | 'results'>('pre');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [assessmentResults, setAssessmentResults] = useState<{
    score: number;
    totalQuestions: number;
    averageTime: number;
    strengths: number[];
    weaknesses: number[];
    recommendations: string[];
  } | null>(null);
  const [includeDivision, setIncludeDivision] = useState(false);

  const { playerStats, updateStats } = useGame();

  const getDifficultyRange = () => {
    switch (playerStats.difficultyLevel) {
      case 'beginner': return { min: 1, max: 5 };
      case 'intermediate': return { min: 1, max: 12 };
      case 'advanced': return { min: 1, max: 20 };
      default: return { min: 1, max: 5 };
    }
  };

  const generateAssessmentQuestions = (): AssessmentQuestion[] => {
    const { min, max } = getDifficultyRange();
    const questions: AssessmentQuestion[] = [];
    
    // Generate 2 questions per table in the range
    for (let table = min; table <= max; table++) {
      for (let i = 0; i < 2; i++) {
        const multiplier = Math.floor(Math.random() * max) + 1;
        const isDivision = includeDivision && Math.random() > 0.5;
        
        if (isDivision) {
          const product = table * multiplier;
          const answer = Math.random() > 0.5 ? table : multiplier;
          questions.push({
            table: product,
            multiplier: answer === table ? multiplier : table,
            answer,
            isDivision: true
          });
        } else {
          questions.push({
            table,
            multiplier,
            answer: table * multiplier,
            isDivision: false
          });
        }
      }
    }
    
    // Shuffle questions
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    return questions.slice(0, 20); // Limit to 20 questions
  };

  const startAssessment = () => {
    const newQuestions = generateAssessmentQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setCurrentAssessment('active');
    setStartTime(Date.now());
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentQuestion.answer;
    const timeSpent = Date.now() - startTime;
    
    const updatedQuestion = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeSpent
    };
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
    
    // Update game stats
    updateStats(isCorrect, currentQuestion.table, isCorrect ? 10 : 0);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setStartTime(Date.now());
    } else {
      // Assessment complete
      completeAssessment(updatedQuestions);
    }
  };

  const completeAssessment = (completedQuestions: AssessmentQuestion[]) => {
    const correctAnswers = completedQuestions.filter(q => q.isCorrect).length;
    const totalTime = completedQuestions.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
    const averageTime = totalTime / completedQuestions.length / 1000; // Convert to seconds
    
    // Analyze performance by table
    const tablePerformance: { [key: number]: { correct: number; total: number } } = {};
    completedQuestions.forEach(q => {
      if (!tablePerformance[q.table]) {
        tablePerformance[q.table] = { correct: 0, total: 0 };
      }
      tablePerformance[q.table].total++;
      if (q.isCorrect) tablePerformance[q.table].correct++;
    });
    
    const strengths: number[] = [];
    const weaknesses: number[] = [];
    
    Object.entries(tablePerformance).forEach(([table, performance]) => {
      const accuracy = performance.correct / performance.total;
      if (accuracy >= 0.8) {
        strengths.push(parseInt(table));
      } else if (accuracy < 0.5) {
        weaknesses.push(parseInt(table));
      }
    });
    
    // Generate recommendations
    const recommendations: string[] = [];
    const overallAccuracy = correctAnswers / completedQuestions.length;
    
    if (overallAccuracy >= 0.9) {
      recommendations.push("Excellent work! You're ready for the next difficulty level.");
    } else if (overallAccuracy >= 0.7) {
      recommendations.push("Good progress! Focus on the weaker tables for improvement.");
    } else {
      recommendations.push("Keep practicing! Spend more time in Learning Mode.");
    }
    
    if (averageTime > 10) {
      recommendations.push("Try the Speed Challenge to improve your response time.");
    }
    
    if (weaknesses.length > 0) {
      recommendations.push(`Focus extra practice on tables: ${weaknesses.join(', ')}`);
    }
    
    setAssessmentResults({
      score: correctAnswers,
      totalQuestions: completedQuestions.length,
      averageTime,
      strengths,
      weaknesses,
      recommendations
    });
    
    setCurrentAssessment('results');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  // Pre-assessment screen
  if (currentAssessment === 'pre') {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            📊 Assessment Center
          </h1>
          <p className="text-xl text-white drop-shadow-md">
            Test your multiplication knowledge, {playerName}!
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Multiplication Assessment</h2>
            <p className="text-xl text-gray-600 mb-6">
              This assessment will help us understand your current level and provide personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">20 Questions</h3>
              <p className="text-blue-600">Covering your current difficulty level</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-lg font-bold text-green-800 mb-2">No Time Limit</h3>
              <p className="text-green-600">Take your time to think</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">Detailed Results</h3>
              <p className="text-purple-600">Get personalized feedback</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <Target className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Assessment Purpose:</strong> This assessment helps identify your strengths and areas for improvement. 
                  The results will guide your learning path and suggest which games to focus on.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Assessment Options</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDivision}
                onChange={(e) => setIncludeDivision(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-blue-700 font-semibold">Include Division Questions</span>
            </label>
            <p className="text-sm text-blue-600 mt-2">
              Check this box to include division problems alongside multiplication questions.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={startAssessment}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-12 rounded-2xl text-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active assessment screen
  if (currentAssessment === 'active' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-white">
            <div className="text-lg font-bold">Assessment Progress</div>
            <div className="text-sm">Question {currentQuestionIndex + 1} of {questions.length}</div>
          </div>
          
          <div className="bg-white rounded-full px-6 py-2">
            <div className="text-lg font-bold text-gray-800">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-20 rounded-full h-4 mb-8">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🤔</div>
            <div className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-4">
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
              className="text-4xl text-center font-bold w-32 border-4 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none p-3 bg-purple-50"
              autoFocus
            />

            <div className="mt-8">
              <button
                onClick={submitAnswer}
                disabled={!userAnswer.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 text-xl"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (currentAssessment === 'results' && assessmentResults) {
    const accuracy = Math.round((assessmentResults.score / assessmentResults.totalQuestions) * 100);
    
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            📊 Assessment Results
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">
              {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🌟' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{assessmentResults.score}/{assessmentResults.totalQuestions}</div>
              <div className="text-blue-800 font-semibold">Correct Answers</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
              <div className="text-green-800 font-semibold">Accuracy</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{assessmentResults.averageTime.toFixed(1)}s</div>
              <div className="text-purple-800 font-semibold">Avg. Time</div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Strengths
              </h3>
              {assessmentResults.strengths.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {assessmentResults.strengths.map(table => (
                    <span key={table} className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                      {table} times table
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-green-700">Keep practicing to identify your strengths!</p>
              )}
            </div>

            <div className="bg-red-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <XCircle className="w-6 h-6 mr-2" />
                Areas for Improvement
              </h3>
              {assessmentResults.weaknesses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {assessmentResults.weaknesses.map(table => (
                    <span key={table} className="bg-red-200 text-red-800 px-3 py-1 rounded-full font-semibold">
                      {table} times table
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-red-700">Great! No major weaknesses identified.</p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Personalized Recommendations
            </h3>
            <ul className="space-y-2">
              {assessmentResults.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-blue-700">
                  <span className="text-blue-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentAssessment('pre')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
            >
              Take Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AssessmentCenter;