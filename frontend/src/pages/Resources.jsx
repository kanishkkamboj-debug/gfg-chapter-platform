import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const ResourcesPage = () => {
  const { completedRoadmapNodes, toggleRoadmapNode } = useApp();
  const [activeTab, setActiveTab] = useState('roadmaps'); 

  const tabs = [
    { id: 'roadmaps', label: 'Curated Roadmaps' },
    { id: 'dsa', label: 'DSA Resources' },
    { id: 'dev', label: 'Development Resources' },
    { id: 'ml', label: 'Machine Learning' },
    { id: 'os', label: 'Open Source' },
    { id: 'interview', label: 'Interview Prep' },
    { id: 'links', label: 'Useful Links' }
  ];

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Resource <span className="gradient-text-primary">Center</span>
          </h1>
          <p className="text-xl text-[#a3b8cc] font-light max-w-2xl mx-auto mb-10">
            Comprehensive curriculum, development paths, and interactive roadmaps to master software engineering.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full font-bold transition-all text-sm ${
                  activeTab === tab.id ? 'bg-[#00FF88] text-[#0a1118] shadow-neon' : 'bg-[#0c1610] text-[#a3b8cc] hover:text-white border border-[#1a3324]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="mt-12 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'roadmaps' && (
            <motion.div key="roadmaps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0c1610] rounded-[3rem] p-8 md:p-12 border border-[#1a3324] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.1)_0%,transparent_50%)]"></div>
                 
                 <div className="flex justify-between items-center mb-12 relative z-10">
                    <div>
                      <h3 className="text-3xl font-display font-bold text-white mb-2">Interactive Roadmap Graphs</h3>
                      <p className="text-[#a3b8cc]">Expandable nodes tracking your progress.</p>
                    </div>
                    <button className="px-6 py-2 bg-[#112218] rounded-lg font-mono text-sm text-white border border-[#1a3324] hover:border-[#00FF88] transition-colors">
                      Reset Progress
                    </button>
                 </div>

                 <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 flex flex-col gap-6 w-full items-center">
                       {['Internet Fundamentals', 'HTML & CSS', 'JavaScript Basics', 'React Framework', 'System Design'].map((node, i) => {
                         const isCompleted = completedRoadmapNodes.includes(node);
                         return (
                           <div key={i} className="relative flex items-center justify-center w-full max-w-sm">
                              {i !== 0 && <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 ${isCompleted ? 'bg-[#00FF88]' : 'bg-[#112218]'}`}></div>}
                              <button 
                                onClick={() => toggleRoadmapNode(node)}
                                className={`w-full px-6 py-4 rounded-xl font-bold flex justify-between items-center transition-all ${
                                  isCompleted ? 'bg-[#00FF88] border border-transparent text-[#0a1118] shadow-[0_0_20px_rgba(0,255,136,0.4)]' : 'bg-[#112218] border border-[#1a3324] text-white hover:border-[#00D4FF]'
                                }`}
                              >
                                {node}
                                {isCompleted ? <span className="material-symbols-outlined text-[18px]">check_circle</span> : <span className="material-symbols-outlined text-[18px] text-[#a3b8cc]">radio_button_unchecked</span>}
                              </button>
                           </div>
                         )
                       })}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'dsa' && (
            <motion.div key="dsa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TiltCard className="p-8 rounded-[2rem] border-t-[#00D4FF]/30 max-w-3xl mx-auto">
                <span className="material-symbols-outlined text-4xl text-[#00D4FF] mb-6">data_object</span>
                <h3 className="text-2xl font-bold text-white mb-4">DSA Resources</h3>
                <p className="text-[#a3b8cc] mb-6">Topic-wise roadmap, problems, and progress tracking for data structures and algorithms.</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                   <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">Blind 75 Sheet</div>
                   <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">Neetcode 150</div>
                   <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">Striver SDE Sheet</div>
                   <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">GFG Must Do</div>
                </div>
                <button className="w-full py-3 bg-[#00D4FF] text-[#0a1118] rounded-xl font-bold transition-colors">Open Practice Portal</button>
              </TiltCard>
            </motion.div>
          )}

          {activeTab === 'dev' && (
             <motion.div key="dev" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TiltCard className="p-8 rounded-[2rem] border-t-purple-400/30 max-w-3xl mx-auto">
                <span className="material-symbols-outlined text-4xl text-purple-400 mb-6">webhook</span>
                <h3 className="text-2xl font-bold text-white mb-4">Development Resources</h3>
                <p className="text-[#a3b8cc] mb-6">Frontend, Backend, DevOps, and Mobile app development guides and tutorials.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-purple-400">check</span> Modern React & Next.js</li>
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-purple-400">check</span> Node.js & Microservices</li>
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-purple-400">check</span> Docker & Kubernetes Setup</li>
                </ul>
              </TiltCard>
            </motion.div>
          )}

          {activeTab === 'ml' && (
             <motion.div key="ml" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TiltCard className="p-8 rounded-[2rem] border-t-yellow-400/30 max-w-3xl mx-auto">
                <span className="material-symbols-outlined text-4xl text-yellow-400 mb-6">memory</span>
                <h3 className="text-2xl font-bold text-white mb-4">Machine Learning Resources</h3>
                <p className="text-[#a3b8cc] mb-6">Deep Learning, NLP, Computer Vision, and Data Science resources.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-yellow-400">check</span> PyTorch & TensorFlow</li>
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-yellow-400">check</span> LLMs & Prompt Engineering</li>
                </ul>
              </TiltCard>
            </motion.div>
          )}

          {activeTab === 'os' && (
             <motion.div key="os" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TiltCard className="p-8 rounded-[2rem] border-t-green-400/30 max-w-3xl mx-auto">
                <span className="material-symbols-outlined text-4xl text-green-400 mb-6">share</span>
                <h3 className="text-2xl font-bold text-white mb-4">Open Source Resources</h3>
                <p className="text-[#a3b8cc] mb-6">Getting started with Git, GitHub, and major open source programs.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-green-400">check</span> GSOC Guidelines</li>
                  <li className="flex items-center gap-2 text-sm text-[#a3b8cc]"><span className="material-symbols-outlined text-[16px] text-green-400">check</span> First Contributions</li>
                </ul>
              </TiltCard>
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div key="interview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-3 gap-6">
                {['Company Questions', 'Mock Interviews', 'Interview Notes'].map((title, i) => (
                  <TiltCard key={i} className="p-8 rounded-2xl border border-[#1a3324] hover:border-[#00FF88]/50">
                    <h3 className="font-bold text-white text-xl mb-4">{title}</h3>
                    <p className="text-sm text-[#a3b8cc] mb-6">Access archived experiences and verified question banks.</p>
                    <button className="text-[#00FF88] font-mono text-sm hover:underline flex items-center gap-1">Access <span className="material-symbols-outlined text-[14px]">arrow_forward</span></button>
                  </TiltCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'links' && (
             <motion.div key="links" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0c1610] rounded-2xl border border-[#1a3324] hover:border-white/50 transition-colors cursor-pointer flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">G</div>
                   <div>
                     <h4 className="text-white font-bold">GeeksforGeeks Official</h4>
                     <p className="text-xs text-[#a3b8cc]">Main portal</p>
                   </div>
                </div>
                <div className="p-6 bg-[#0c1610] rounded-2xl border border-[#1a3324] hover:border-[#5865F2]/50 transition-colors cursor-pointer flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-[#5865F2] text-white flex items-center justify-center"><span className="material-symbols-outlined">forum</span></div>
                   <div>
                     <h4 className="text-white font-bold">Discord Server</h4>
                     <p className="text-xs text-[#a3b8cc]">Join community discussions</p>
                   </div>
                </div>
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourcesPage;
