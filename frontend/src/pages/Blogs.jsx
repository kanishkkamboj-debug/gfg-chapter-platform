import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState('technical');
  const [selectedPost, setSelectedPost] = useState(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const categories = [
    { id: 'technical', label: 'Technical Articles' },
    { id: 'reports', label: 'Event Reports' },
    { id: 'updates', label: 'Chapter Updates' }
  ];

  const renderPostDetail = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-cyan origin-left z-50" style={{ scaleX }} />
      
      <div className="container-max py-24 relative">
         <button onClick={() => setSelectedPost(null)} className="fixed top-24 left-4 md:left-8 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-surface-bright transition-colors z-50">
           <span className="material-symbols-outlined">arrow_back</span>
         </button>

         <div className="max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded text-xs font-mono uppercase tracking-wider mb-6 inline-block">Technical</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">Demystifying React Server Components</h1>
            
            {/* Author Page Link / Header */}
            <div className="flex items-center gap-4 border-b border-border-low-opacity pb-8 mb-8 cursor-pointer group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                <img loading="lazy" src="https://i.pravatar.cc/150?u=author1" alt="Author" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white group-hover:text-accent-cyan transition-colors">Alex Kumar</h4>
                <div className="text-sm text-text-muted flex items-center gap-2">
                  <span>Oct 24, 2025</span> • <span>8 min read</span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mb-16 text-text-muted">
              <p>React Server Components (RSC) represent a fundamental shift in how we build React applications. By executing components exclusively on the server, we can send zero JavaScript to the client for those components, significantly improving load times and reducing bundle sizes.</p>
              <h3>Why Server Components?</h3>
              <p>Traditionally, React rendered the initial HTML on the server (SSR), but the client still had to download and execute all the component code to make it interactive (hydration). RSC allows you to keep heavy dependencies entirely on the server.</p>
              <div className="bg-surface-container p-6 rounded-xl border border-border-low-opacity my-8 font-mono text-sm text-accent-mint">
                {`// Server Component
import db from './db';

export default async function NoteList() {
  const notes = await db.notes.getAll();
  return (
    <ul>
      {notes.map(note => <li key={note.id}>{note.title}</li>)}
    </ul>
  );
}`}
              </div>
              <p>Notice how we can directly query the database? This component will never run in the browser, and the 'db' module won't be included in the client bundle.</p>
            </div>

            {/* Related Articles */}
            <div className="border-t border-border-low-opacity pt-12">
               <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
               <div className="grid sm:grid-cols-2 gap-6">
                 <TiltCard className="p-6 rounded-2xl border border-border-low-opacity cursor-pointer group hover:border-accent-cyan/50">
                   <div className="text-xs text-accent-cyan font-mono mb-2">Technical</div>
                   <h4 className="font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">Understanding Next.js App Router</h4>
                   <p className="text-sm text-text-muted">A deep dive into the new routing paradigm...</p>
                 </TiltCard>
                 <TiltCard className="p-6 rounded-2xl border border-border-low-opacity cursor-pointer group hover:border-accent-cyan/50">
                   <div className="text-xs text-accent-cyan font-mono mb-2">Technical</div>
                   <h4 className="font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">State Management in 2025</h4>
                   <p className="text-sm text-text-muted">Zustand, Jotai, or Context?</p>
                 </TiltCard>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {selectedPost && renderPostDetail()}
      </AnimatePresence>

      <div className="container-max py-24 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              Chapter <span className="gradient-text-primary">Chronicles</span>
            </h1>
            <p className="text-xl text-text-muted font-light max-w-2xl mx-auto mb-10">
              Technical insights, event post-mortems, and official chapter news.
            </p>
            
            <div className="relative max-w-md mx-auto mb-12">
              <span className="absolute inset-y-0 left-4 flex items-center text-text-muted"><span className="material-symbols-outlined">search</span></span>
              <input type="text" placeholder="Search articles..." className="w-full bg-surface-container border border-border-low-opacity rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan transition-colors" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${
                    activeCategory === cat.id ? 'bg-white text-background shadow-neon' : 'glass-card text-text-muted hover:text-white border border-border-low-opacity'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {activeCategory === 'technical' && (
              <motion.div key="tech" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: 'Demystifying React Server Components', desc: 'A deep dive into RSC and Next.js App Router architecture.', tags: ['React', 'Next.js'], time: '8 min read' },
                  { title: 'Mastering Dynamic Programming', desc: 'Mental models for solving complex DP problems efficiently.', tags: ['DSA', 'Algorithms'], time: '12 min read' },
                  { title: 'Building Scalable Microservices', desc: 'Event-driven architecture using Kafka and Node.js.', tags: ['Backend', 'System Design'], time: '15 min read' }
                ].map((post, i) => (
                  <TiltCard key={i} className="p-0 rounded-[2rem] border-t-accent-cyan/30 overflow-hidden flex flex-col h-full group cursor-pointer" onClick={() => setSelectedPost(i)}>
                    <div className="h-48 bg-surface-bright relative overflow-hidden">
                      <img loading="lazy" src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&sig=${i}`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Post" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-center text-xs font-mono text-text-muted mb-4">
                        <span className="flex gap-2">{post.tags.map(t => <span key={t} className="text-accent-cyan">{t}</span>)}</span>
                        <span>{post.time}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-cyan transition-colors">{post.title}</h3>
                      <p className="text-sm text-text-muted mb-6 flex-1">{post.desc}</p>
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border-low-opacity/50">
                        <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden"><img loading="lazy" src={`https://i.pravatar.cc/150?u=${i}`} alt="Author" className="w-full h-full object-cover" /></div>
                        <span className="text-sm font-medium text-white">Alex Kumar</span>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </motion.div>
            )}

            {activeCategory === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {[1, 2].map(i => (
                  <TiltCard key={i} className="p-6 md:p-8 rounded-3xl border-t-purple-400/30 flex flex-col md:flex-row gap-8 items-center cursor-pointer group" onClick={() => setSelectedPost(i)}>
                    <div className="w-full md:w-64 h-48 rounded-2xl bg-surface-container overflow-hidden shrink-0">
                      <img loading="lazy" src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600&sig=${i+10}`} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt="Report" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2 block">Event Post-Mortem</span>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Spring Hackathon 2025: Outcomes</h3>
                      <p className="text-text-muted mb-6">A comprehensive look at the winning projects, statistics, and lessons learned from our largest hackathon to date.</p>
                      <button className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-purple-400 transition-colors">Read Report <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                    </div>
                  </TiltCard>
                ))}
              </motion.div>
            )}

            {activeCategory === 'updates' && (
              <motion.div key="updates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="max-w-3xl mx-auto space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-low-opacity before:to-transparent">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer" onClick={() => setSelectedPost(i)}>
                       <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border-low-opacity bg-surface-container shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-primary transition-colors">
                         <span className="material-symbols-outlined text-[16px] text-text-muted group-hover:text-primary">newspaper</span>
                       </div>
                       <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] glass-card p-6 rounded-2xl border hover:border-primary/30 transition-colors">
                         <div className="font-mono text-xs text-primary mb-2">October {20 - i}, 2025</div>
                         <h4 className="font-bold text-white mb-2">Platform v2.0 Launched</h4>
                         <p className="text-sm text-text-muted">We've completely overhauled the digital ecosystem with new 3D visualizations and roadmaps.</p>
                       </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
