
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import VerificationPage from './pages/VerificationPage';
import LoginPage from './pages/LoginPage';
import CountdownPage from './pages/CountdownPage';
import { UserStats, Achievement, Game, User } from './types';
import { ACHIEVEMENTS, GAMES } from './constants';

const App: React.FC = () => {
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem('playverse_verified') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('playverse_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('playverse_theme');
    // Default to dark mode as requested
    return saved ? JSON.parse(saved) : true;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('playverse_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [recent, setRecent] = useState<string[]>(() => {
    const saved = localStorage.getItem('playverse_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('playverse_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  const [earnedAchievements, setEarnedAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('playverse_earned_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [playedHistory, setPlayedHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('playverse_played_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [playCounts, setPlayCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('playverse_play_counts');
    return saved ? JSON.parse(saved) : {};
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    sessionStorage.setItem('playverse_verified', JSON.stringify(isVerified));
  }, [isVerified]);

  useEffect(() => {
    localStorage.setItem('playverse_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('playverse_theme', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => localStorage.setItem('playverse_favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('playverse_recent', JSON.stringify(recent)), [recent]);
  useEffect(() => localStorage.setItem('playverse_ratings', JSON.stringify(ratings)), [ratings]);
  useEffect(() => localStorage.setItem('playverse_earned_achievements', JSON.stringify(earnedAchievements)), [earnedAchievements]);
  useEffect(() => localStorage.setItem('playverse_played_history', JSON.stringify(playedHistory)), [playedHistory]);
  useEffect(() => localStorage.setItem('playverse_play_counts', JSON.stringify(playCounts)), [playCounts]);

  const toggleTheme = useCallback(() => setIsDarkMode((prev: boolean) => !prev), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const addToRecent = useCallback((id: string) => {
    setRecent(prev => [id, ...prev.filter(item => item !== id)].slice(0, 8));
    setPlayedHistory(prev => Array.from(new Set([...prev, id])));
    setPlayCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const setUserRating = useCallback((gameId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [gameId]: rating }));
  }, []);

  const userStats = useMemo((): UserStats => {
    const categoryStats: Record<string, number> = {};
    playedHistory.forEach(id => {
      const g = GAMES.find(game => game.id === id);
      if (g) {
        categoryStats[g.category] = (categoryStats[g.category] || 0) + 1;
      }
    });

    return {
      gamesPlayed: playedHistory.length,
      categoryStats,
      totalFavorites: favorites.length
    };
  }, [playedHistory, favorites]);

  const handleLogout = () => setCurrentUser(null);
  const handleVerified = () => setIsVerified(true);

  useEffect(() => {
    const newEarned = [...earnedAchievements];
    let changed = false;
    ACHIEVEMENTS.forEach(ach => {
      if (newEarned.includes(ach.id)) return;
      let met = false;
      const { requirement } = ach;
      if (requirement.type === 'play_count') met = userStats.gamesPlayed >= requirement.value;
      else if (requirement.type === 'category_count') met = (userStats.categoryStats[requirement.category || ''] || 0) >= requirement.value;
      else if (requirement.type === 'favorite_count') met = userStats.totalFavorites >= requirement.value;
      if (met) { newEarned.push(ach.id); changed = true; }
    });
    if (changed) setEarnedAchievements(newEarned);
  }, [userStats, earnedAchievements]);

  if (!isVerified) {
    return <VerificationPage onVerified={handleVerified} />;
  }

  return (
    <Router>
      <Layout 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onSearch={setSearchTerm}
        userStats={userStats}
        earnedAchievements={earnedAchievements}
        currentUser={currentUser}
        onLogout={handleLogout}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                favorites={favorites} 
                recent={recent}
                toggleFavorite={toggleFavorite} 
                searchTerm={searchTerm}
                ratings={ratings}
                playCounts={playCounts}
                isLoggedIn={!!currentUser}
              />
            } 
          />
          <Route 
            path="/game/:id" 
            element={
              <GamePage 
                favorites={favorites} 
                toggleFavorite={toggleFavorite} 
                addToRecent={addToRecent}
                ratings={ratings}
                setUserRating={setUserRating}
                playCounts={playCounts}
              />
            } 
          />
          <Route 
            path="/login" 
            element={<LoginPage onLogin={setCurrentUser} />} 
          />
          <Route 
            path="/countdown" 
            element={<CountdownPage />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
