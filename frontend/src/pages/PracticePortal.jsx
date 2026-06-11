import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import TiltCard from '../components/TiltCard';
import { practiceProblems } from '../data/practiceData';

const ProblemCard = React.memo(({ problem, isSolved, toggleProblemStatus }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-300 ${
    isSolved ? 'bg-accent-mint/5 border-accent-mint/30' : 'glass-card hover:border-accent-cyan/30'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-lg font-bold text-white flex-1 mr-4 group">
        <a href={problem.link} target="_blank" rel="noreferrer" className="hover:text-accent-cyan transition-colors inline-flex items-center gap-2">
          {problem.title}
          <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">open_in_new</span>
        </a>
      </h4>
      <button
        onClick={() => toggleProblemStatus(problem.id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all ${
          isSolved 
            ? 'bg-accent-mint border-accent-mint text-background shadow-[0_0_10px_#00FF88]' 
            : 'bg-surface-container border-border-low-opacity text-transparent hover:border-text-muted'
        }`}
      >
        <span className="material-symbols-outlined text-sm">check</span>
      </button>
    </div>
    
    <div className="flex items-center gap-3">
      <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${
        problem.difficulty === 'Easy' ? 'bg-accent-mint/10 text-accent-mint' :
        problem.difficulty === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' :
        'bg-error/10 text-error'
      }`}>
        {problem.difficulty}
      </span>
      <div className="flex flex-wrap gap-2 flex-1">
        {problem.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-xs text-text-muted bg-surface-container-high px-2 py-1 rounded">
            {tag}
          </span>
        ))}
        {problem.tags.length > 2 && (
          <span className="text-xs text-text-muted bg-surface-container-high px-2 py-1 rounded">
            +{problem.tags.length - 2}
          </span>
        )}
      </div>
    </div>
  </div>
));
export const PracticePortal = () => {
  const { solvedProblems, toggleProblemStatus } = useApp();
  const [activeList, setActiveList] = useState('Blind 75');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const lists = ['Blind 75', 'Neetcode 150', 'Striver SDE Sheet', 'GFG Essentials'];

  const filteredProblems = useMemo(() => {
    return practiceProblems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, difficultyFilter]);

  const groups = [...new Set(filteredProblems.map(p => p.group))];

  const totalSolved = solvedProblems.length;
  const progressPercentage = (totalSolved / practiceProblems.length) * 100;

  return (
    <div className="container-max py-24 relative z-10 min-h-screen">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-low-opacity bg-surface/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Training Simulator Active</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
              DSA Practice <span className="gradient-text-accent">Portal</span>
            </h1>
            <p className="text-xl text-text-muted font-light">Master algorithmic patterns through curated problem sets.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl min-w-[300px]">
            <h4 className="font-mono text-sm text-text-muted mb-2">Completion Status</h4>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-display font-bold text-white">{totalSolved}</span>
              <span className="text-accent-mint font-mono text-sm">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent-cyan to-accent-mint transition-all duration-1000" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Control Panel */}
      <ScrollReveal delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center">
          <div className="flex-1 flex flex-wrap gap-3">
            {lists.map(list => (
              <button
                key={list}
                onClick={() => setActiveList(list)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${
                  activeList === list ? 'bg-primary text-on-primary shadow-neon' : 'glass-card text-text-muted hover:text-white border border-border-low-opacity hover:border-accent-mint'
                }`}
              >
                {list}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <span className="absolute inset-y-0 left-4 flex items-center text-text-muted">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container border border-border-low-opacity rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-surface-container border border-border-low-opacity rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-cyan appearance-none cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Problem Grid */}
      <div className="space-y-12">
        {groups.map((group, gIdx) => {
          const groupProblems = filteredProblems.filter(p => p.group === group);
          const groupSolved = groupProblems.filter(p => solvedProblems.includes(p.id)).length;
          
          return (
            <ScrollReveal key={group} delay={0.2 + (gIdx * 0.1)}>
              <div className="mb-6 flex justify-between items-end border-b border-border-low-opacity pb-4">
                <h3 className="text-2xl font-display font-bold text-white">{group}</h3>
                <span className="font-mono text-sm text-text-muted">{groupSolved} / {groupProblems.length} Solved</span>
              </div>
              
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {groupProblems.map(problem => {
                    const isSolved = solvedProblems.includes(problem.id);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={problem.id}
                      >
                        <ProblemCard problem={problem} isSolved={isSolved} toggleProblemStatus={toggleProblemStatus} />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
};

export default PracticePortal;
