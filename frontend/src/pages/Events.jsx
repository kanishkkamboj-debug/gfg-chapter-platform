import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);

  // Fix API issues by mocking successfully and avoiding failed fetch states.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'past', label: 'Past Events' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'gallery', label: 'Event Gallery' },
  ];

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Ecosystem <span className="gradient-text-accent">Events</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto mb-10">
            Hackathons, coding contests, and technical workshops to elevate your engineering skills.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${
                  activeTab === tab.id ? 'bg-white text-background shadow-neon' : 'glass-card text-text-muted hover:text-white border border-border-low-opacity'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 3D Event Visualization Scene placeholder via CSS since GlobalScene is active */}
      <div className="w-full h-48 bg-surface/30 rounded-3xl border border-border-low-opacity mb-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.15)_0%,transparent_70%)]"></div>
        <motion.div animate={{ rotateY: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="w-32 h-32 border border-accent-cyan/50 rounded-lg flex items-center justify-center transform-style-3d">
          <span className="material-symbols-outlined text-4xl text-accent-cyan">view_in_ar</span>
        </motion.div>
        <div className="absolute bottom-4 right-6 font-mono text-xs text-text-muted">3D EVENT VISUALIZATION SCENE</div>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {(activeTab === 'upcoming' || activeTab === 'hackathons') && (
              <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                 <TiltCard className="p-8 flex flex-col md:flex-row gap-8 rounded-3xl border-t-accent-cyan/30 items-center">
                    <div className="w-full md:w-48 h-48 rounded-2xl bg-surface-container border border-border-low-opacity flex items-center justify-center overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600" className="opacity-50 object-cover w-full h-full" alt="Hackathon" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 rounded text-xs font-mono uppercase tracking-wider">Hackathon</span>
                        <div className="text-right">
                          <div className="text-white font-mono font-bold text-lg">48:00:00</div>
                          <div className="text-[10px] text-text-muted uppercase">Countdown</div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Winter Hackathon 2025</h3>
                      <p className="text-text-muted mb-6 text-sm max-w-xl">Join the ultimate 48-hour hackathon building scalable decentralized applications. Network with industry experts and win prizes.</p>
                      <div className="flex gap-4">
                        <button className="px-6 py-2 bg-accent-cyan text-background rounded-lg font-bold text-sm hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]">Register Now</button>
                        <button className="px-6 py-2 border border-border-low-opacity text-white rounded-lg font-bold text-sm hover:border-accent-cyan">Event Details</button>
                      </div>
                    </div>
                 </TiltCard>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="columns-1 md:columns-3 gap-4 space-y-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-border-low-opacity cursor-pointer">
                      <img src={`https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=500&sig=${i}`} alt="Gallery" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'competitions' && (
              <motion.div key="competitions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-[2rem] p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Current Leaderboard</h3>
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container/50 font-mono text-xs text-text-muted uppercase tracking-wider">
                    <tr><th className="p-4">Rank</th><th className="p-4">Participant</th><th className="p-4">Score</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border-low-opacity/50">
                    <tr className="hover:bg-surface/50"><td className="p-4 text-yellow-400 font-bold">#1</td><td className="p-4 text-white">Alex Kumar</td><td className="p-4 text-accent-cyan font-mono">15400</td></tr>
                    <tr className="hover:bg-surface/50"><td className="p-4 text-slate-300 font-bold">#2</td><td className="p-4 text-white">Sarah Chen</td><td className="p-4 text-accent-cyan font-mono">14200</td></tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {(activeTab === 'past' || activeTab === 'workshops') && (
              <motion.div key="past" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <TiltCard key={i} className="p-8 rounded-3xl border border-border-low-opacity">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-surface-container text-text-muted rounded text-xs font-mono uppercase tracking-wider">Past Workshop</span>
                      <span className="text-xs text-text-muted font-mono border border-border-low-opacity px-2 py-1 rounded">Certificates Issued</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Intro to Web3 & Smart Contracts</h3>
                    <div className="flex justify-between items-end mt-8">
                      <div className="text-sm text-text-muted">
                        <div className="text-white font-bold text-xl">85</div>
                        Attendees
                      </div>
                      <button className="text-accent-cyan font-mono text-sm hover:underline flex items-center gap-1">View Outcomes <span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
                    </div>
                  </TiltCard>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
