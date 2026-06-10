import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

export const AnnouncementsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'updates', label: 'Latest Updates' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'internships', label: 'Internship Alerts' },
    { id: 'community', label: 'Community Notices' }
  ];

  const announcements = [
    { id: 1, title: 'Summer Internship Drive 2025', type: 'internships', date: 'Oct 24', desc: 'Top tier product companies visiting campus for summer internships. Submit your resumes by Nov 1.', isUrgent: true },
    { id: 2, title: 'CodeSprint Global Qualifier', type: 'competitions', date: 'Oct 23', desc: 'Registrations are now open for the largest competitive programming team event of the year.', isUrgent: false },
    { id: 3, title: 'Open Source Mentorship Program', type: 'opportunities', date: 'Oct 20', desc: 'Looking for maintainers and contributors for our new Web3 projects.', isUrgent: false },
    { id: 4, title: 'Chapter General Body Meeting', type: 'community', date: 'Oct 18', desc: 'Mandatory meeting for all core team and volunteers regarding the upcoming fest.', isUrgent: true },
    { id: 5, title: 'Platform v2.0 Live', type: 'updates', date: 'Oct 15', desc: 'The new interactive developer portal is live. Check out the new 3D visualizations.', isUrgent: false }
  ];

  const filteredAnnouncements = activeCategory === 'all' ? announcements : announcements.filter(a => a.type === activeCategory);

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Ecosystem <span className="text-[#00D4FF]">Notices</span>
          </h1>
          <p className="text-xl text-[#a3b8cc] font-light max-w-2xl mx-auto mb-10">
            Stay updated with internships, hackathons, and chapter news.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-bold transition-all text-sm ${
                  activeCategory === cat.id ? 'bg-[#00D4FF] text-[#0a1118] shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'bg-[#0c1610] text-[#a3b8cc] hover:text-white border border-[#1a3324]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredAnnouncements.map((ann, i) => (
            <motion.div 
              key={ann.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-3xl bg-[#0c1610] border ${ann.isUrgent ? 'border-red-500/50' : 'border-[#1a3324]'} flex flex-col md:flex-row gap-6 items-start md:items-center group hover:bg-[#112218] transition-colors`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#112218] border border-[#1a3324] flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined ${ann.isUrgent ? 'text-red-500 animate-pulse' : 'text-[#00D4FF]'}`}>
                  {ann.type === 'internships' ? 'work' : ann.type === 'competitions' ? 'emoji_events' : ann.type === 'community' ? 'campaign' : 'notifications'}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-mono px-2 py-1 rounded bg-[#112218] ${ann.isUrgent ? 'text-red-500 border border-red-500/30' : 'text-[#a3b8cc] border border-[#1a3324]'}`}>
                    {ann.isUrgent ? 'URGENT' : ann.date}
                  </span>
                  <span className="text-xs font-mono text-[#00D4FF] uppercase tracking-wider">{ann.type}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors">{ann.title}</h3>
                <p className="text-[#a3b8cc] text-sm">{ann.desc}</p>
              </div>

              <button className="md:self-stretch px-6 py-2 border border-[#1a3324] rounded-xl text-white font-bold text-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors whitespace-nowrap">
                View Details
              </button>
            </motion.div>
          ))}
          {filteredAnnouncements.length === 0 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
               <span className="material-symbols-outlined text-6xl text-[#1a3324] mb-4">inbox</span>
               <h3 className="text-xl text-[#a3b8cc] font-mono">No notices in this category.</h3>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
