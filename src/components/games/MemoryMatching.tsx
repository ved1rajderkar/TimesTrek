import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface MemoryMatchingProps {
  onBack: () => void;
}

interface Card {
  id: number;
  type: 'equation' | 'answer';
  content: string;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatching: React.FC<MemoryMatchingProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);

  const { playerStats, updateStats, addBadge } = useGame();

  const getDifficultyRange = () => {
    switch (playerStats.difficultyLevel) {
      case 'beginner': return { min: 1, max: 5 };
      case 'intermediate': return { min: 1, max: 12 };
      case 'advanced': return { min: 1, max: 20 };
      default: return { min: 1, max: 5 };
    }
  };

  const generateCards = (numPairs: number): Card[] => {
    const { min, max } = getDifficultyRange();
    const equations: Card[] = [];
    const answers: Card[] = [];
    
    for (let i = 0; i < numPairs; i++) {
      const table = Math.floor(Math.random() * (max - min + 1)) + min;
      const multiplier = Math.floor(Math.random() * max) + 1;
      const result = table * multiplier;
      
      equations.push({
        id: i * 2,
        type: 'equation',
        content: `${table} × ${multiplier}`,
        value: result,
        isFlipped: false,
        isMatched: false
      });
      
      answers.push({
        id: i * 2 + 1,
        type: 'answer',
        content: result.toString(),
        value: result,
        isFlipped: false,
        isMatched: false
      });
    }
    
    // Shuffle cards
    const allCards = [...equations, ...answers];
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    
    return allCards;
  };

  const startGame = (gameLevel: number = 1) => {
    const numPairs = Math.min(4 + gameLevel, 8); // Start with 5 pairs, max 9
    setCards(generateCards(numPairs));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setScore(0);
    setGameStarted(true);
    setLevel(gameLevel);
  };

  const handleCardClick = (clickedCard: Card) => {
    if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [first, second] = newFlippedCards;
        
        if (first.value === second.value && first.id !== second.id) {
          // Match found!
          setCards(prev => prev.map(card => 
            card.value === first.value ? { ...card, isMatched: true } : card
          ));
          setMatches(prev => prev + 1);
          
          const points = Math.max(50 - (moves * 2), 10); // Fewer moves = more points
          setScore(prev => prev + points);
          updateStats(true, Math.floor(first.value / 10) || 1, points);
          
          // Play success sound
          if ((window as any).playSuccessSound) {
            (window as any).playSuccessSound();
          }
          
          // Check if game complete
          const totalPairs = cards.length / 2;
          if (matches + 1 === totalPairs) {
            setGameComplete(true);
            // Award badges
            if (moves <= totalPairs + 2) addBadge('memory-master');
            if (moves <= totalPairs) addBadge('perfect-memory');
          }
        } else {
          // No match - flip cards back
          setCards(prev => prev.map(card => 
            newFlippedCards.some(fc => fc.id === card.id) && !card.isMatched
              ? { ...card, isFlipped: false }
              : card
          ));
          updateStats(false, Math.floor(first.value / 10) || 1, 0);
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    startGame(level);
  };

  const nextLevel = () => {
    startGame(level + 1);
  };

  // Pre-game screen
  if (!gameStarted) {
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
          <div className="text-8xl mb-6">🧩</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Memory Match</h2>
          <p className="text-xl text-gray-600 mb-8">
            Match multiplication equations with their answers!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-xl">
              <div className="text-4xl mb-2">🧠</div>
              <div className="text-lg font-bold text-pink-600">Memory Power</div>
              <div className="text-sm text-gray-600">Remember card positions!</div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-lg font-bold text-blue-600">Perfect Matches</div>
              <div className="text-sm text-gray-600">Fewer moves = more points!</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-lg font-bold text-green-600">Level Up</div>
              <div className="text-sm text-gray-600">More cards each level!</div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => startGame(1)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl text-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Level 1 (5 Pairs)
            </button>
            <button
              onClick={() => startGame(2)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Level 2 (6 Pairs)
            </button>
            <button
              onClick={() => startGame(3)}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl text-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Level 3 (7 Pairs)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game complete screen
  if (gameComplete) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Level {level} Complete!</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{moves}</div>
              <div className="text-sm text-gray-600">Moves</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{matches}</div>
              <div className="text-sm text-gray-600">Matches</div>
            </div>
          </div>

          <div className="mb-6">
            {moves <= cards.length / 2 && (
              <div className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white p-4 rounded-xl mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-6 h-6 fill-current" />
                  <span>🏆 PERFECT MEMORY! 🏆</span>
                  <Star className="w-6 h-6 fill-current" />
                </div>
              </div>
            )}
            {moves <= cards.length / 2 + 2 && moves > cards.length / 2 && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl mb-4">
                🌟 EXCELLENT MEMORY! 🌟
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Replay Level</span>
            </button>
            {level < 4 && (
              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              >
                Next Level
              </button>
            )}
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Memory Match - Level {level}</h1>
        </div>

        <button
          onClick={resetGame}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{moves}</div>
            <div className="text-sm text-gray-600">Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{matches}/{cards.length / 2}</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className={`grid gap-4 ${cards.length <= 12 ? 'grid-cols-4' : 'grid-cols-5'} max-w-4xl mx-auto`}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`relative h-24 md:h-32 rounded-xl cursor-pointer transform transition-all duration-500 ${
              card.isFlipped || card.isMatched
                ? 'scale-105'
                : 'hover:scale-105'
            }`}
            style={{ perspective: '1000px' }}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
              }`}
            >
              {/* Card Back */}
              <div className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                <div className="text-2xl md:text-4xl">🧩</div>
              </div>
              
              {/* Card Front */}
              <div className={`absolute w-full h-full backface-hidden rounded-xl rotate-y-180 flex items-center justify-center shadow-lg ${
                card.isMatched 
                  ? 'bg-gradient-to-br from-green-400 to-green-500 text-white' 
                  : card.type === 'equation'
                    ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
                    : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
              }`}>
                <div className={`font-bold text-center ${card.content.includes('×') ? 'text-sm md:text-lg' : 'text-lg md:text-2xl'}`}>
                  {card.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Encouragement */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-xl p-4 shadow-xl">
          <p className="font-bold">
            {matches === 0 ? "🧠 Use your memory power! Find the matching pairs! 🧩" :
             matches < cards.length / 4 ? "🎯 Great start! Keep finding those matches! ✨" :
             matches < cards.length / 2 ? "🚀 Excellent memory! You're doing amazing! 🌟" :
             "🏆 Almost there! You've got this! 🎉"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatching;