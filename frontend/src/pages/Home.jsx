import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

export const HomePage = () => {
  return (
    <div className="relative font-body">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-12 overflow-hidden flex flex-col justify-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,141,70,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="container-max relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#112218] border border-[#1a3324] mb-8"
            >
              <span className="material-symbols-outlined text-[#00FF88] text-sm">group</span>
              <span className="text-xs font-mono text-[#a3b8cc] font-bold uppercase tracking-widest">GFG STUDENT CHAPTER</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1]"
            >
              Learn. Code.<br />
              Build. <span className="text-[#00FF88]">Together.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#a3b8cc] text-lg max-w-lg mb-10 leading-relaxed"
            >
              A community of passionate learners and problem solvers building the future through code and collaboration.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link to="/events" className="px-6 py-3 bg-[#00FF88] text-[#0a1118] rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex items-center gap-2">
                Explore Events <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link to="/about" className="px-6 py-3 bg-[#112218] border border-[#1a3324] text-white rounded-xl font-bold hover:bg-[#1a3324] transition-colors">
                About Us
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0a1118] overflow-hidden bg-surface-container relative z-[${10-i}]`}>
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-[#a3b8cc]">
                <span className="text-[#00FF88]">500+</span> Active Members
              </div>
            </motion.div>
          </div>

          {/* Right Content - 3D GFG Logo & Orbits */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] hidden lg:flex justify-center items-center perspective-1000"
          >
            {/* Glowing Podium */}
            <div className="absolute bottom-10 w-64 h-16 bg-[#00FF88]/20 rounded-[100%] blur-2xl"></div>
            <div className="absolute bottom-16 w-48 h-8 bg-[#00FF88]/40 rounded-[100%] blur-xl"></div>
            <div className="absolute bottom-20 w-32 h-2 bg-white rounded-[100%] blur-sm shadow-[0_0_30px_#00FF88,0_0_60px_#00FF88]"></div>

            {/* Orbit Rings */}
            <motion.div animate={{ rotateX: 75, rotateZ: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-[450px] h-[450px] rounded-full border border-[#00FF88]/20 transform-style-3d"></motion.div>
            <motion.div animate={{ rotateX: 75, rotateZ: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[350px] h-[350px] rounded-full border border-[#00FF88]/40 transform-style-3d border-dashed"></motion.div>

            {/* Floating Badges */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0 }} className="absolute top-20 left-10 px-3 py-1.5 bg-[#112218] border border-[#1a3324] rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-[#00FF88] text-[16px]">data_object</span><span className="text-xs font-bold text-[#a3b8cc]">DSA</span>
            </motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-10 right-20 px-3 py-1.5 bg-[#112218] border border-[#1a3324] rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-[#00FF88] text-[16px]">language</span><span className="text-xs font-bold text-[#a3b8cc]">Web Dev</span>
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2 }} className="absolute top-1/2 -left-4 px-3 py-1.5 bg-[#112218] border border-[#1a3324] rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-[#00FF88] text-[16px]">emoji_events</span><span className="text-xs font-bold text-[#a3b8cc]">CP</span>
            </motion.div>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.2, repeat: Infinity, delay: 0.5 }} className="absolute top-40 -right-10 px-3 py-1.5 bg-[#112218] border border-[#1a3324] rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-[#00FF88] text-[16px]">groups</span><span className="text-xs font-bold text-[#a3b8cc]">Workshops</span>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.8, repeat: Infinity, delay: 1.5 }} className="absolute bottom-32 -right-4 px-3 py-1.5 bg-[#112218] border border-[#1a3324] rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-[#00FF88] text-[16px]">folder</span><span className="text-xs font-bold text-[#a3b8cc]">Projects</span>
            </motion.div>

            {/* Center Logo Graphic */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-48 h-48 drop-shadow-[0_0_30px_rgba(0,255,136,0.6)] flex items-center justify-center"
            >
               {/* Custom GFG Logo Shape Simulation */}
               <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#00FF88] stroke-[8px] stroke-linecap-round stroke-linejoin-round">
                 <path d="M 45,25 C 20,25 15,40 15,50 C 15,60 20,75 45,75 L 45,60 C 35,60 30,55 30,50 C 30,45 35,40 45,40 L 45,25 Z" />
                 <path d="M 55,25 C 80,25 85,40 85,50 C 85,60 80,75 55,75 L 55,60 C 65,60 70,55 70,50 C 70,45 65,40 55,40 L 55,25 Z" />
                 <line x1="35" y1="50" x2="65" y2="50" />
               </svg>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 4-Feature Horizontal Bar */}
      <section className="relative z-10 -mt-10 mb-20 px-4">
        <div className="container-max">
           <ScrollReveal>
             <div className="bg-[#0c1610] border border-[#1a3324] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#1a3324]">
                {[
                  { title: 'Learn Together', desc: 'Collaborate, learn and grow with like-minded peers.', icon: 'group' },
                  { title: 'Events & Workshops', desc: 'Participate in workshops, coding contests and tech talks.', icon: 'calendar_today' },
                  { title: 'Build & Contribute', desc: 'Work on real-world projects and contribute to open source.', icon: 'code' },
                  { title: 'Grow & Excel', desc: 'Sharpen your skills and level up your career.', icon: 'emoji_events' }
                ].map((feature, i) => (
                  <div key={i} className={`flex-1 flex gap-4 ${i !== 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}>
                    <div className="w-12 h-12 rounded-xl bg-[#112218] border border-[#1a3324] flex items-center justify-center shrink-0 text-[#00FF88]">
                      <span className="material-symbols-outlined">{feature.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1 text-sm">{feature.title}</h3>
                      <p className="text-[#a3b8cc] text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
           </ScrollReveal>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 relative z-10">
        <div className="container-max">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#112218] border border-[#1a3324] mb-6">
                <span className="text-xs font-mono text-[#00FF88] font-bold uppercase tracking-widest">WHAT WE DO</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Empowering Learners. Creating <span className="text-[#00FF88]">Impact.</span>
              </h2>
              <p className="text-[#a3b8cc] text-lg max-w-2xl mx-auto">
                We organize events and initiatives that help students enhance their skills, build projects and connect with the tech community.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: 'Coding Contests', desc: 'Challenge yourself and compete with the best.', icon: 'event' },
                 { title: 'Workshops', desc: 'Hands-on sessions on trending technologies.', icon: 'code' },
                 { title: 'Tech Talks', desc: 'Learn from industry experts and inspiring speakers.', icon: 'groups' },
                 { title: 'Projects', desc: 'Build real-world projects and strengthen your portfolio.', icon: 'folder' }
               ].map((card, i) => (
                 <div key={i} className="bg-[#0c1610] border border-[#1a3324] p-6 rounded-3xl hover:border-[#00FF88]/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-[#112218] flex items-center justify-center text-[#a3b8cc] group-hover:text-[#00FF88] transition-colors mb-6">
                      <span className="material-symbols-outlined">{card.icon}</span>
                    </div>
                    <h3 className="text-white font-bold mb-3">{card.title}</h3>
                    <p className="text-[#a3b8cc] text-sm leading-relaxed">{card.desc}</p>
                 </div>
               ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Reusable Global Components (Placeholders for remaining Home requirements) */}
      <section className="py-20 relative z-10 bg-[#0a1118]">
        <div className="container-max">
           <ScrollReveal>
              <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Community Ecosystem</h2>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]">
                    <h3 className="text-[#00FF88] font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">campaign</span> Recent Announcements</h3>
                    <ul className="space-y-4">
                      {['Winter Hackathon 2025 Registration', 'Core Team Interviews Open', 'New React Roadmap Published'].map((ann, i) => (
                        <li key={i} className="text-[#a3b8cc] text-sm flex items-center gap-3 pb-4 border-b border-[#1a3324] last:border-0 last:pb-0"><span className="w-2 h-2 rounded-full bg-[#00FF88]"></span> {ann}</li>
                      ))}
                    </ul>
                 </div>
                 <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]">
                    <h3 className="text-[#00FF88] font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">emoji_events</span> Hall of Fame Preview</h3>
                    <div className="space-y-4">
                      {['Alex Kumar - Grandmaster', 'Sarah Chen - Master', 'David Byte - Expert'].map((user, i) => (
                        <div key={i} className="flex justify-between items-center text-[#a3b8cc] text-sm pb-4 border-b border-[#1a3324] last:border-0 last:pb-0">
                          <span className="text-white font-bold">{user.split(' - ')[0]}</span>
                          <span className="font-mono text-[#00FF88]">{user.split(' - ')[1]}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
           </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
