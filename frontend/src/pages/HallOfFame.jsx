import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const HallOfFamePage = () => {
  const [activeTab, setActiveTab] = useState('hall-of-fame');

  const tabs = [
    { id: 'hall-of-fame', label: 'Hall of Fame' },
    { id: 'success-stories', label: 'Success Stories' },
    { id: 'contest-winners', label: 'Contest Winners' },
    { id: 'certifications', label: 'Certifications' }
  ];

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      
      {/* Achievement Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         {[...Array(15)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-2 h-2 bg-yellow-400 rounded-sm rotate-45 shadow-[0_0_10px_#FACC15]"
             initial={{ 
               x: Math.random() * window.innerWidth, 
               y: -20,
               opacity: 0 
             }}
             animate={{ 
               y: window.innerHeight + 20,
               rotate: 360,
               opacity: [0, 1, 0] 
             }}
             transition={{ 
               duration: 5 + Math.random() * 5, 
               repeat: Infinity,
               delay: Math.random() * 5,
               ease: "linear"
             }}
           />
         ))}
      </div>

      <ScrollReveal>
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Achievement <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Archive</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto mb-10">
            Celebrating the elite developers, contest winners, and success stories of our chapter.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${
                  activeTab === tab.id ? 'bg-yellow-400 text-background shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'glass-card text-text-muted hover:text-white border border-border-low-opacity'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Animated Trophy Room (CSS 3D Placeholder) */}
      <div className="w-full h-64 bg-surface/30 rounded-3xl border border-yellow-400/20 mb-12 flex flex-col items-center justify-center relative overflow-hidden perspective-1000 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.1)_0%,transparent_70%)]"></div>
        <motion.div animate={{ rotateY: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="transform-style-3d text-center relative z-10">
          <span className="material-symbols-outlined text-8xl text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]">emoji_events</span>
        </motion.div>
        <div className="absolute bottom-6 font-mono text-xs text-yellow-400/50 uppercase tracking-widest z-10">Animated Trophy Room Active</div>
      </div>

      <div className="relative z-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'hall-of-fame' && (
            <motion.div key="hof" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TiltCard className="p-8 rounded-[3rem] border-t-yellow-400/30">
                <h3 className="text-2xl font-bold text-white mb-6">Global Leaderboard</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { rank: 1, name: 'Alex Kumar', score: 15400, color: 'text-yellow-400', badge: 'Grandmaster' },
                    { rank: 2, name: 'Sarah Chen', score: 14200, color: 'text-slate-300', badge: 'Master' },
                    { rank: 3, name: 'Michael Dev', score: 13800, color: 'text-amber-600', badge: 'Master' },
                    { rank: 4, name: 'Jessica Code', score: 12500, color: 'text-text-muted', badge: 'Expert' },
                    { rank: 5, name: 'David Byte', score: 11200, color: 'text-text-muted', badge: 'Expert' }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-6 p-4 rounded-2xl border border-border-low-opacity hover:bg-surface-container transition-colors group">
                      <div className={`text-2xl font-display font-bold w-8 text-center ${user.color}`}>#{user.rank}</div>
                      <div className="w-10 h-10 rounded-full bg-surface border border-border-low-opacity flex items-center justify-center overflow-hidden">
                         <span className="material-symbols-outlined text-text-muted text-sm">person</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{user.name}</h4>
                        <span className="text-xs font-mono text-text-muted">{user.badge}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-accent-cyan font-bold">{user.score}</div>
                        <div className="text-[10px] text-text-muted uppercase">Points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          )}

          {activeTab === 'success-stories' && (
            <motion.div key="stories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <TiltCard key={i} className="p-8 rounded-[2rem] border-t-purple-400/30">
                  <div className="flex gap-6 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-surface-container overflow-hidden shrink-0">
                      <img loading="lazy" src={`https://i.pravatar.cc/300?u=story${i}`} alt="Alumni" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Jane Doe</h3>
                      <div className="text-sm text-text-muted mb-2">SWE @ Google</div>
                      <span className="px-2 py-1 bg-purple-400/10 text-purple-400 text-xs font-mono rounded">Class of 2024</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted italic leading-relaxed mb-6">
                    "The chapter's rigorous competitive programming sessions and mock interviews were instrumental in cracking the FAANG interviews. The community support is unmatched."
                  </p>
                  <div className="h-1 w-full bg-border-low-opacity rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 w-1/3"></div>
                  </div>
                  <div className="text-xs text-text-muted mt-2 font-mono">Journey Timeline: Novice to Expert</div>
                </TiltCard>
              ))}
            </motion.div>
          )}

          {activeTab === 'contest-winners' && (
            <motion.div key="winners" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Spring Hackathon', winner: 'Team Syntax', prize: '$1000' },
                { title: 'CodeSprint Regional', winner: 'Alex Kumar', prize: 'Gold Medal' },
                { title: 'Web3 Buidl', winner: 'Decentralized Squad', prize: 'Grants' }
              ].map((contest, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl border-t-accent-cyan/30 text-center relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 text-9xl text-accent-cyan/5 group-hover:text-accent-cyan/10 transition-colors material-symbols-outlined">military_tech</div>
                  <h4 className="text-text-muted text-xs font-mono uppercase mb-4 relative z-10">{contest.title}</h4>
                  <div className="text-2xl font-bold text-white mb-2 relative z-10">{contest.winner}</div>
                  <div className="inline-block px-3 py-1 bg-surface-container border border-border-low-opacity rounded-full text-accent-mint text-sm font-bold relative z-10">{contest.prize}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'certifications' && (
            <motion.div key="certs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card p-6 rounded-2xl border border-border-low-opacity hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="aspect-video bg-surface-container rounded-xl mb-4 flex items-center justify-center border border-border-low-opacity relative overflow-hidden">
                     <span className="material-symbols-outlined text-4xl text-text-muted group-hover:text-primary transition-colors z-10">verified</span>
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors">Advanced DSA</h4>
                  <div className="text-xs text-text-muted font-mono">Issued to: Verified User</div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default HallOfFamePage;
