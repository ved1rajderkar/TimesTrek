import React, { createContext, useContext, useState, useEffect } from 'react';

interface PlayerStats {
  totalCorrect: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  pointsEarned: number;
  level: number;
  badges: string[];
  completedTables: number[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface GameContextType {
  playerStats: PlayerStats;
  updateStats: (correct: boolean, table: number, points: number) => void;
  resetStats: () => void;
  addBadge: (badge: string) => void;
  setDifficultyLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const initialStats: PlayerStats = {
  totalCorrect: 0,
  totalAttempted: 0,
  currentStreak: 0,
  bestStreak: 0,
  pointsEarned: 0,
  level: 1,
  badges: [],
  completedTables: [],
  difficultyLevel: 'beginner'
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(initialStats);

  useEffect(() => {
    const savedStats = localStorage.getItem('playerStats');
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('playerStats', JSON.stringify(playerStats));
  }, [playerStats]);

  const updateStats = (correct: boolean, table: number, points: number) => {
    setPlayerStats(prev => {
      const newStats = { ...prev };
      
      newStats.totalAttempted++;
      
      if (correct) {
        newStats.totalCorrect++;
        newStats.currentStreak++;
        newStats.pointsEarned += points;
        
        if (newStats.currentStreak > newStats.bestStreak) {
          newStats.bestStreak = newStats.currentStreak;
        }
        
        // Add table to completed if not already there
        if (!newStats.completedTables.includes(table)) {
          newStats.completedTables.push(table);
        }
      } else {
        newStats.currentStreak = 0;
      }
      
      // Level up based on points
      newStats.level = Math.floor(newStats.pointsEarned / 1000) + 1;
      
      return newStats;
    });
  };

  const addBadge = (badge: string) => {
    setPlayerStats(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge]
    }));
  };

  const setDifficultyLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setPlayerStats(prev => ({ ...prev, difficultyLevel: level }));
  };

  const resetStats = () => {
    setPlayerStats(initialStats);
    localStorage.removeItem('playerStats');
  };

  return (
    <GameContext.Provider value={{
      playerStats,
      updateStats,
      resetStats,
      addBadge,
      setDifficultyLevel
    }}>
      {children}
    </GameContext.Provider>
  );
};