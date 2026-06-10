import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';

export const CommunityPage = () => {
  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <ScrollReveal>
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-low-opacity bg-surface/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Global Network</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Join the <span className="gradient-text-primary">Ecosystem</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto">
            Connect with 500+ student developers. Find mentors, join study circles, and collaborate on projects.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Discord Server */}
        <ScrollReveal delay={0.1}>
          <div className="glass-card p-10 rounded-[3rem] border-t-[#5865F2]/50 relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" alt="Discord" className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">Official Discord</h3>
              <p className="text-text-muted mb-8 max-w-md">The central hub for all communications, daily problem solving, and instant help from peers and mentors.</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-mono text-text-muted flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-mint"></span> 142 Online
                </span>
                <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-mono text-text-muted">#dsa-help</span>
                <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-mono text-text-muted">#project-ideas</span>
              </div>
              
              <MagneticButton href="#" className="bg-[#5865F2] text-white rounded-xl px-8 py-4 font-bold hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]">
                Launch Discord
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>

        {/* WhatsApp Communities */}
        <ScrollReveal delay={0.2}>
          <div className="glass-card p-10 rounded-[3rem] border-t-[#25D366]/50 relative overflow-hidden group h-full">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">Study Circles</h3>
              <p className="text-text-muted mb-8 max-w-md">Join highly focused WhatsApp groups dedicated to specific domains and exam preparation.</p>
              
              <div className="space-y-4 mb-8">
                {[
                  { name: 'Web Dev Mastery', members: 120 },
                  { name: 'CP Enthusiasts', members: 85 },
                  { name: 'Machine Learning', members: 60 }
                ].map(group => (
                  <div key={group.name} className="flex justify-between items-center p-4 bg-surface-container rounded-2xl hover:bg-surface-bright transition-colors cursor-pointer border border-transparent hover:border-[#25D366]/30">
                    <span className="font-medium text-white">{group.name}</span>
                    <span className="text-xs font-mono text-text-muted">{group.members} Members</span>
                  </div>
                ))}
              </div>
              
              <MagneticButton href="#" className="bg-[#25D366] text-background rounded-xl px-8 py-4 font-bold hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]">
                Browse Circles
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Mentor System */}
      <ScrollReveal delay={0.3}>
        <div className="glass-card rounded-[3rem] p-10 border border-border-low-opacity relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-transparent pointer-events-none"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-xl">
                <h3 className="text-3xl font-bold text-white mb-4">Mentor Pairing System</h3>
                <p className="text-text-muted mb-6">Stuck on your learning path? Request a 1-on-1 session with our core team members and alumni network.</p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 rounded-xl bg-accent-cyan text-background font-bold hover:shadow-neon transition-shadow">Request Mentor</button>
                  <button className="px-6 py-3 rounded-xl border border-border-low-opacity text-white hover:border-accent-cyan transition-colors">Become a Mentor</button>
                </div>
              </div>
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-background bg-surface-bright flex items-center justify-center font-bold text-xl relative">
                    M{i}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent-mint rounded-full border-2 border-background"></div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default CommunityPage;
