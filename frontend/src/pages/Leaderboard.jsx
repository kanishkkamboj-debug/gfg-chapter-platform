import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ErrorBoundary from '../components/ErrorBoundary';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/users/leaderboard/top');
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setLeaders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />;
      case 1: return <Medal className="w-8 h-8 text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.6)]" />;
      case 2: return <Award className="w-8 h-8 text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]" />;
      default: return <span className="text-xl font-bold text-text-muted">#{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10 bg-red-500/10 rounded-2xl">{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full mb-6 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
            <Trophy className="w-12 h-12 text-primary relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-space drop-shadow-neon">
            Chapter <span className="text-primary">Leaderboard</span>
          </h1>
          <p className="text-xl text-text-muted">
            The most active and dedicated members in our community. Attend events to earn Activity Points!
          </p>
        </motion.div>

        <div className="space-y-4">
          {leaders.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-card p-4 md:p-6 flex items-center gap-4 md:gap-6 ${
                index === 0 ? 'border-yellow-400/50 bg-yellow-400/5' : 
                index === 1 ? 'border-gray-300/50 bg-gray-300/5' : 
                index === 2 ? 'border-amber-600/50 bg-amber-600/5' : 
                'hover:border-primary/30'
              }`}
            >
              <div className="w-12 flex justify-center items-center flex-shrink-0">
                {getRankIcon(index)}
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface-container overflow-hidden border-2 border-border-low-opacity group-hover:border-primary/50 transition-colors">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-primary/10 text-primary">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white truncate">
                  {user.full_name}
                </h3>
                <p className="text-sm text-text-muted truncate">@{user.username}</p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2 bg-background p-3 rounded-xl border border-border-low-opacity shadow-inner">
                <Activity className="w-5 h-5 text-accent-cyan" />
                <span className="text-xl font-bold font-mono text-white">{user.activity_points}</span>
                <span className="text-xs text-text-muted uppercase hidden md:inline">Pts</span>
              </div>
            </motion.div>
          ))}
          
          {leaders.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              No points awarded yet. Be the first to attend an event!
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Leaderboard;
