import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const ProjectsPage = () => {
  const [filter, setFilter] = useState('All');

  const projects = [
    { id: 1, title: 'GFG Chapter Platform', type: 'Chapter', desc: 'The very platform you are on. Built with React, Three.js, and Node.', tech: ['React', 'Three.js', 'Tailwind'], lookingFor: ['Frontend', 'UI/UX'], stars: 45 },
    { id: 2, title: 'Algorithmic Visualizer', type: 'Open Source', desc: 'A tool to visualize complex DSA algorithms step-by-step in the browser.', tech: ['Vue', 'D3.js'], lookingFor: ['Contributors'], stars: 120 },
    { id: 3, title: 'Campus Smart Parking', type: 'Team', desc: 'IoT based smart parking solution for the university campus.', tech: ['Python', 'IoT', 'React Native'], lookingFor: ['Backend Devs', 'IoT'], stars: 12 },
  ];

  const filters = ['All', 'Open Source', 'Chapter', 'Team'];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.type === filter);

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Project <span className="gradient-text-accent">Hub</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto mb-10">
            Discover active projects, contribute to open source, and find your next team.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f ? 'bg-white text-background' : 'glass-card text-text-muted hover:text-white border border-border-low-opacity'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, i) => (
          <ScrollReveal key={project.id} delay={i * 0.1}>
            <TiltCard className="p-8 rounded-[2rem] border-t-accent-mint/30 h-full flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-surface-container rounded-lg text-xs font-mono text-accent-cyan">{project.type}</span>
                <span className="flex items-center gap-1 text-sm text-text-muted">
                  <span className="material-symbols-outlined text-[16px]">star</span> {project.stars}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent-mint transition-colors">{project.title}</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">{project.desc}</p>
              
              <div className="mb-6">
                <h4 className="font-mono text-xs text-text-muted mb-2">TECH STACK</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="w-auto h-6 px-2 bg-surface-container flex items-center justify-center rounded text-xs text-white border border-border-low-opacity">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-low-opacity">
                <h4 className="font-mono text-xs text-text-muted mb-2">RECRUITING</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.lookingFor.map(role => (
                    <span key={role} className="px-2 py-1 bg-purple-400/10 text-purple-400 rounded text-xs border border-purple-400/20">
                      {role}
                    </span>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl bg-surface-container hover:bg-accent-mint hover:text-background text-white font-bold transition-all text-sm flex items-center justify-center gap-2 group-hover:shadow-neon">
                  Apply to Contribute <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
      
      <ScrollReveal delay={0.4}>
        <div className="mt-16 text-center">
           <button className="px-8 py-4 rounded-xl border border-dashed border-text-muted text-text-muted hover:border-accent-cyan hover:text-accent-cyan transition-colors flex items-center justify-center gap-2 mx-auto">
              <span className="material-symbols-outlined">add</span> Register New Project
           </button>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default ProjectsPage;
