import React, { useState } from 'react';
import { User, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onPlayerLogin: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPlayerLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onPlayerLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Characters */}
        <div className="mb-8 flex justify-center space-x-4">
          <div className="text-8xl animate-bounce">🦊</div>
          <div className="text-8xl animate-bounce delay-150">🐻</div>
          <div className="text-8xl animate-bounce delay-300">🐰</div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
          Math Explorer
        </h1>
        
        <p className="text-2xl md:text-3xl text-white mb-8 drop-shadow-md">
          Learn multiplication tables with fun games!
        </p>

        {/* Name Input Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            What's your name, explorer?
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-12 pr-4 py-4 text-xl border-3 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <Play className="w-6 h-6" />
              <span>Start Learning!</span>
            </button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-bold mb-2">Fun Games</h3>
            <p className="text-sm">Quiz, Speed Challenge, Memory Matching & More!</p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold mb-2">Earn Badges</h3>
            <p className="text-sm">Collect achievements and level up your skills!</p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-sm">See how much you've learned and improved!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;