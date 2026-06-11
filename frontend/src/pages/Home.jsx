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
                    <img loading="lazy" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" className="w-full h-full object-cover" />
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
               <svg viewBox="0 0 24 24" className="w-full h-full fill-[#00FF88]">
                 <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
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
      
      {/* Reusable Global Components (Dynamic Data) */}
      <section className="py-20 relative z-10 bg-[#0a1118]">
        <div className="container-max">
           <ScrollReveal>
              <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Community Ecosystem</h2>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324] hover:shadow-neon transition-shadow">
                    <h3 className="text-[#00FF88] font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">campaign</span> Global Transmissions</h3>
                    <RecentAnnouncements />
                 </div>
                 <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324] hover:shadow-neon transition-shadow">
                    <h3 className="text-[#00FF88] font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">event</span> Upcoming Objectives</h3>
                    <UpcomingEvents />
                 </div>
              </div>
           </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

const RecentAnnouncements = () => {
  const [announcements, setAnnouncements] = React.useState([]);
  React.useEffect(() => {
    fetch('/api/search/announcements?q=')
      .then(res => res.json())
      .then(data => setAnnouncements(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (announcements.length === 0) return <div className="text-[#a3b8cc] text-sm">No recent transmissions intercepted.</div>;

  return (
    <ul className="space-y-4">
      {announcements.map((ann, i) => (
        <li key={i} className="text-[#a3b8cc] text-sm flex items-start gap-3 pb-4 border-b border-[#1a3324] last:border-0 last:pb-0">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] mt-1.5 shrink-0"></span> 
          <div>
            <div className="text-white font-bold">{ann.title}</div>
            <div className="text-xs text-[#a3b8cc]/80 mt-1 line-clamp-1">{ann.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const UpcomingEvents = () => {
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    fetch('/api/search/events?q=')
      .then(res => res.json())
      .then(data => setEvents(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (events.length === 0) return <div className="text-[#a3b8cc] text-sm">No upcoming objectives scheduled.</div>;

  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <div key={i} className="flex justify-between items-center text-[#a3b8cc] text-sm pb-4 border-b border-[#1a3324] last:border-0 last:pb-0">
          <div>
            <div className="text-white font-bold">{event.title}</div>
            <div className="text-xs text-[#a3b8cc]/80 mt-1">{new Date(event.start_date).toLocaleDateString()}</div>
          </div>
          <span className="font-mono text-[#00FF88] bg-[#00FF88]/10 px-2 py-1 rounded text-xs border border-[#00FF88]/30">Open</span>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
