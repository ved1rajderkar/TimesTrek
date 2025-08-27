import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Trophy, Users, Settings, Volume2, VolumeX, GraduationCap, ClipboardCheck } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import LearningContent from './components/LearningContent';
import GameHub from './components/GameHub';
import ProgressDashboard from './components/ProgressDashboard';
import ParentalDashboard from './components/ParentalDashboard';
import AssessmentCenter from './components/AssessmentCenter';
import AudioManager from './components/AudioManager';
import { GameProvider } from './contexts/GameContext';

type Screen = 'welcome' | 'learning' | 'games' | 'progress' | 'parental' | 'assessment';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [playerName, setPlayerName] = useState<string>('');
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
      setCurrentScreen('learning');
    }

    const musicEnabled = localStorage.getItem('musicEnabled');
    const soundEnabled = localStorage.getItem('soundEnabled');
    
    if (musicEnabled !== null) setIsMusicEnabled(musicEnabled === 'true');
    if (soundEnabled !== null) setIsSoundEnabled(soundEnabled === 'true');
  }, []);

  const handlePlayerLogin = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
    setCurrentScreen('learning');
  };

  const toggleMusic = () => {
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);
    localStorage.setItem('musicEnabled', newState.toString());
  };

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem('soundEnabled', newState.toString());
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onPlayerLogin={handlePlayerLogin} />;
      case 'learning':
        return <LearningContent playerName={playerName} />;
      case 'games':
        return <GameHub playerName={playerName} />;
      case 'progress':
        return <ProgressDashboard playerName={playerName} />;
      case 'parental':
        return <ParentalDashboard />;
      case 'assessment':
        return <AssessmentCenter playerName={playerName} />;
      default:
        return <LearningContent playerName={playerName} />;
    }
  };

  if (currentScreen === 'welcome') {
    return (
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
          <AudioManager 
            isMusicEnabled={isMusicEnabled} 
            isSoundEnabled={isSoundEnabled} 
          />
          {renderScreen()}
        </div>
      </GameProvider>
    );
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <AudioManager 
          isMusicEnabled={isMusicEnabled} 
          isSoundEnabled={isSoundEnabled} 
        />
        
        {/* Header */}
        <header className="bg-white shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-purple-600">
                🎯 Math Explorer
              </div>
              <div className="hidden md:block text-lg text-gray-600">
                Welcome back, {playerName}! 🌟
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMusic}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                title={isMusicEnabled ? 'Turn off music' : 'Turn on music'}
              >
                {isMusicEnabled ? (
                  <Volume2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-blue-600" />
                )}
              </button>
              <button
                onClick={toggleSound}
                className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                title={isSoundEnabled ? 'Turn off sounds' : 'Turn on sounds'}
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-green-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-t border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-1 md:space-x-4">
              <button
                onClick={() => setCurrentScreen('learning')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentScreen === 'learning'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="hidden sm:inline">Learn</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('games')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentScreen === 'games'
                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span className="hidden sm:inline">Games</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('progress')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentScreen === 'progress'
                    ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                    : 'text-yellow-600 hover:bg-yellow-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Progress</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('assessment')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentScreen === 'assessment'
                    ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ClipboardCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Test</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('parental')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentScreen === 'parental'
                    ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Parent</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {renderScreen()}
        </main>
      </div>
    </GameProvider>
  );
}

export default App;