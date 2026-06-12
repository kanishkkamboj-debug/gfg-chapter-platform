import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import { motion } from 'framer-motion';

export const AboutPage = () => {
  const [stats, setStats] = React.useState({ active_members: '500+', total_events: '24+' });
  React.useEffect(() => {
    fetch('/api/analytics/public')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setStats(data); })
      .catch(console.error);
  }, []);

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-low-opacity bg-surface/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            About the <span className="gradient-text-primary">Chapter</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto">
            Empowering the next generation of engineers with real-world skills, algorithms, and a collaborative network.
          </p>
        </div>
      </ScrollReveal>

      {/* About GeeksforGeeks & Student Chapter */}
      <div className="grid lg:grid-cols-2 gap-8 mb-24">
        <ScrollReveal delay={0.1}>
          <TiltCard className="p-10 rounded-[3rem] border-t-primary/30 h-full">
            <h2 className="text-3xl font-display font-bold text-white mb-6">GeeksforGeeks</h2>
            <p className="text-text-muted leading-relaxed mb-6">
              GeeksforGeeks is a portal that has been created to provide well written, well thought and well explained solutions for selected questions. It is a computer science portal for geeks. Through the GFG Student Chapters, the platform reaches university campuses to nurture competitive programming and software engineering at the grassroot level.
            </p>
            <div className="flex gap-4 font-mono text-sm">
               <span className="px-3 py-1 bg-surface-container rounded text-accent-mint">Algorithms</span>
               <span className="px-3 py-1 bg-surface-container rounded text-accent-cyan">Data Structures</span>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <TiltCard className="p-10 rounded-[3rem] border-t-accent-cyan/30 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[50px] rounded-full pointer-events-none"></div>
            <h2 className="text-3xl font-display font-bold text-white mb-6">Our Chapter</h2>
            <p className="text-text-muted leading-relaxed mb-8">
              Founded with the vision to bridge the gap between academic learning and industry standards. We organize hackathons, technical workshops, coding contests, and open-source sprints to elevate the technical proficiency of our campus.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface-container p-4 rounded-2xl border border-border-low-opacity">
                 <div className="text-2xl font-bold text-white mb-1">{stats.active_members}{typeof stats.active_members === 'number' ? '+' : ''}</div>
                 <div className="text-xs text-text-muted font-mono uppercase">Active Members</div>
               </div>
               <div className="bg-surface-container p-4 rounded-2xl border border-border-low-opacity">
                 <div className="text-2xl font-bold text-white mb-1">{stats.total_events}{typeof stats.total_events === 'number' ? '+' : ''}</div>
                 <div className="text-xs text-text-muted font-mono uppercase">Events Hosted</div>
               </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>

      {/* Mission & Vision */}
      <ScrollReveal delay={0.3}>
        <div className="glass-card rounded-[3rem] p-12 border-t-purple-400/30 mb-24 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_50%)]"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12">
            <div>
               <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="material-symbols-outlined text-purple-400 text-4xl">rocket_launch</span> Mission
               </h3>
               <p className="text-text-muted leading-relaxed">
                 To cultivate a vibrant programming culture where students can share knowledge, solve complex problems, and build scalable projects together. We aim to make every member industry-ready.
               </p>
            </div>
            <div>
               <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="material-symbols-outlined text-accent-cyan text-4xl">visibility</span> Vision
               </h3>
               <p className="text-text-muted leading-relaxed">
                 To become the most active and productive student developer community in the region, recognized for our contributions to open-source and excellence in competitive programming.
               </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Chapter Journey Timeline */}
      <ScrollReveal delay={0.4}>
        <div className="mb-24">
          <h2 className="text-4xl font-display font-bold text-white mb-12 text-center">Chapter Journey</h2>
          
          <div className="relative max-w-4xl mx-auto before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-accent-cyan before:to-transparent">
             {[
               { year: '2023', title: 'Chapter Foundation', desc: 'The GFG Student Chapter was officially established with 50 founding members.' },
               { year: '2024', title: 'First Mega Hackathon', desc: 'Hosted our first 24-hour hackathon with over 200 participants.' },
               { year: '2025', title: 'Ecosystem Launch', desc: 'Launched this comprehensive digital platform for all chapter operations.' }
             ].map((milestone, i) => (
               <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 last:mb-0">
                 <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-background bg-accent-cyan shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(0,212,255,0.5)] z-10"></div>
                 <div className="w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] glass-card p-6 rounded-2xl group-hover:border-accent-cyan/50 transition-colors">
                   <div className="font-mono text-accent-cyan text-sm mb-2">{milestone.year}</div>
                   <h4 className="text-xl font-bold text-white mb-2">{milestone.title}</h4>
                   <p className="text-text-muted text-sm">{milestone.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Faculty Coordinator Message */}
      <ScrollReveal delay={0.5}>
         <TiltCard className="p-12 rounded-[3rem] border-t-yellow-400/30 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-surface to-surface-container relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.05),transparent_50%)]"></div>
            
            <div className="w-40 h-40 shrink-0 rounded-full overflow-hidden border-4 border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
              <img loading="lazy" src="https://i.pravatar.cc/300?u=faculty" alt="Faculty Coordinator" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center md:text-left z-10">
              <span className="material-symbols-outlined text-4xl text-yellow-400/50 mb-4">format_quote</span>
              <p className="text-lg text-white font-light italic leading-relaxed mb-6">
                "The GeeksforGeeks chapter has been a phenomenal catalyst for peer-to-peer learning on our campus. It is inspiring to see students passionately coding, building, and leading technological initiatives. Keep innovating!"
              </p>
              <h4 className="font-bold text-white text-xl">Dr. Alan Turing</h4>
              <div className="font-mono text-sm text-yellow-400">Faculty Sponsor</div>
            </div>
         </TiltCard>
      </ScrollReveal>
    </div>
  );
};

export default AboutPage;
