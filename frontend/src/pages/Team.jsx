import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const TeamPage = () => {
  const [activeFilter, setActiveFilter] = useState('faculty');

  const filters = [
    { id: 'faculty', label: 'Faculty Coordinator' },
    { id: 'core', label: 'Core Team' },
    { id: 'volunteers', label: 'Volunteers' },
    { id: 'alumni', label: 'Alumni Team' }
  ];

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            The <span className="gradient-text-primary">Syndicate</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto mb-10">
            Meet the driving force behind the chapter. An organization hierarchy built on collaboration.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${
                  activeFilter === filter.id ? 'bg-accent-mint text-background shadow-neon' : 'glass-card text-text-muted hover:text-white border border-border-low-opacity'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Team Network Graph Visualization placeholder via CSS/HTML */}
      <div className="w-full h-48 bg-surface-container-high rounded-3xl border border-border-low-opacity mb-12 flex flex-col items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.05)_0%,transparent_60%)]"></div>
         {/* Network Nodes */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-8">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_#FACC15]"></motion.div>
            <div className="w-20 h-px bg-border-low-opacity"></div>
            <motion.div animate={{ scale: [1, 1.1, 1], transition: { delay: 0.5 } }} className="w-4 h-4 bg-accent-mint rounded-full shadow-[0_0_10px_#00FF88]"></motion.div>
            <div className="w-20 h-px bg-border-low-opacity"></div>
            <motion.div animate={{ scale: [1, 1.1, 1], transition: { delay: 1 } }} className="w-4 h-4 bg-accent-cyan rounded-full shadow-[0_0_10px_#00D4FF]"></motion.div>
         </div>
         <span className="material-symbols-outlined text-3xl text-text-muted mb-2 z-10">share</span>
         <span className="font-mono text-xs text-text-muted z-10">Organization Hierarchy Graph</span>
      </div>

      <AnimatePresence mode="wait">
        
        {activeFilter === 'faculty' && (
          <motion.div key="faculty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center">
             <TiltCard className="max-w-2xl w-full p-12 rounded-[3rem] border-t-yellow-400/30 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-surface to-surface-container relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-48 h-48 shrink-0 rounded-full overflow-hidden border-4 border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                  <img src="https://i.pravatar.cc/300?u=faculty" alt="Faculty" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                  <h2 className="text-3xl font-display font-bold text-white mb-2">Dr. Alan Turing</h2>
                  <div className="font-mono text-sm text-yellow-400 mb-4">Faculty Coordinator</div>
                  <p className="text-text-muted mb-6 text-sm">Professor of Computer Science, specializing in algorithmic complexity and decentralized systems. Mentoring the chapter since 2023.</p>
                  
                  <div className="flex justify-center md:justify-start gap-4 mb-6">
                    <span className="px-3 py-1 bg-surface-container rounded text-xs font-mono text-white">15+ Papers</span>
                    <span className="px-3 py-1 bg-surface-container rounded text-xs font-mono text-white">AI Researcher</span>
                  </div>

                  <div className="flex justify-center md:justify-start gap-3">
                     <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-white border border-border-low-opacity hover:border-yellow-400 transition-colors"><span className="material-symbols-outlined text-[18px]">language</span></a>
                     <a href="#" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-white border border-border-low-opacity hover:border-yellow-400 transition-colors"><span className="material-symbols-outlined text-[18px]">mail</span></a>
                  </div>
                </div>
             </TiltCard>
          </motion.div>
        )}

        {activeFilter === 'core' && (
          <motion.div key="core" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'President', img: 'https://i.pravatar.cc/300?u=sarah', color: 'accent-mint', res: 'Strategic direction, partnerships' },
              { name: 'Alex Kumar', role: 'Technical Lead', img: 'https://i.pravatar.cc/300?u=alex', color: 'accent-cyan', res: 'System architecture, hackathons' },
              { name: 'Jordan Dev', role: 'Events Head', img: 'https://i.pravatar.cc/300?u=jordan', color: 'purple-400', res: 'Logistics, speaker acquisition' }
            ].map((member, i) => (
              <TiltCard key={i} className={`p-8 rounded-[2rem] border-t-${member.color}/30 text-center relative group`}>
                 <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                 <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-2 border-${member.color}/30`}>
                   <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                 <div className={`text-xs font-mono uppercase text-${member.color} mb-4`}>{member.role}</div>
                 <p className="text-sm text-text-muted mb-6">Responsibilities: {member.res}</p>
                 <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-text-muted hover:text-white"><span className="material-symbols-outlined text-[16px]">code</span></span>
                    <span className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-text-muted hover:text-white"><span className="material-symbols-outlined text-[16px]">terminal</span></span>
                 </div>
              </TiltCard>
            ))}
          </motion.div>
        )}

        {activeFilter === 'volunteers' && (
          <motion.div key="volunteers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="glass-card p-6 rounded-2xl border border-border-low-opacity hover:border-primary/30 transition-colors text-center group">
                 <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">person</span>
                 </div>
                 <h4 className="font-bold text-white text-sm">Volunteer {i}</h4>
                 <div className="text-xs text-text-muted mt-2">Metrics: 5 Events</div>
              </div>
            ))}
          </motion.div>
        )}

        {activeFilter === 'alumni' && (
          <motion.div key="alumni" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <TiltCard key={i} className="p-8 rounded-[2rem] border border-border-low-opacity relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[30px]"></div>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 rounded-full bg-surface-container border border-border-low-opacity flex items-center justify-center">
                     <span className="material-symbols-outlined text-text-muted">history_edu</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-white">Alumni Member {i}</h3>
                     <div className="text-xs font-mono text-primary">Class of 2023</div>
                   </div>
                 </div>
                 <p className="text-sm text-text-muted mb-4">Now working as a Software Engineer at major tech firm.</p>
                 <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <span className="material-symbols-outlined text-[14px]">work</span> Tech Corp Inc.
                 </div>
              </TiltCard>
            ))}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
