import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Search, Filter, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export const AnnouncementsList = () => {
  const { announcements, fetchAnnouncements, loading, error } = useApp();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements(page, category, search).then(data => {
        setTotalPages(data?.pagination?.pages || 1);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [page, category, search, fetchAnnouncements]);

  return (
    <div className="space-y-12">
      {/* Filters & Search Sidebar / Top Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-1 w-full glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 relative z-10">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-text-muted group-focus-within:text-accent-mint transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-surface-container-low text-white placeholder-text-muted pl-12 pr-4 py-3 rounded-xl border border-border-low-opacity focus:outline-none focus:border-accent-mint focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] transition-all"
            />
          </div>
          
          <div className="relative w-full md:w-auto min-w-[200px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Filter size={18} className="text-text-muted" />
            </div>
            <select
              value={category || ''}
              onChange={(e) => {
                setCategory(e.target.value || null);
                setPage(1);
              }}
              className="w-full bg-surface-container-low text-white pl-12 pr-4 py-3 rounded-xl border border-border-low-opacity focus:outline-none focus:border-accent-mint transition-all appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="priority">Priority</option>
              <option value="opportunity">Opportunity</option>
              <option value="competition">Competition</option>
              <option value="notice">Notice</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-accent-mint border-t-transparent animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="glass-card border-red-500/30 bg-red-500/10 text-red-200 p-6 text-center rounded-2xl">
          <p className="font-mono">{error}</p>
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg font-medium">Transmission log empty.</p>
        </div>
      )}

      {/* Announcements Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-mint/50 via-accent-cyan/20 to-transparent -translate-x-1/2"></div>
        
        <div className="space-y-12">
          <AnimatePresence>
            {announcements.map((announcement, index) => {
              const isEven = index % 2 === 0;
              const isPriority = announcement.priority === 'high' || announcement.type === 'priority';
              const date = new Date(announcement.created_at);
              
              return (
                <motion.div 
                  key={announcement.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col md:flex-row items-center justify-between"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[39px] md:left-1/2 w-4 h-4 rounded-full bg-background border-2 -translate-x-1/2 z-10" style={{ borderColor: isPriority ? '#00FF88' : '#313630', boxShadow: isPriority ? '0 0 10px rgba(0,255,136,0.5)' : 'none' }}>
                    {isPriority && <div className="absolute inset-0.5 rounded-full bg-accent-mint"></div>}
                  </div>

                  {/* Left Side (Empty or Content) */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 mb-4 md:mb-0 ${!isEven ? 'md:order-1' : ''}`}>
                    {isEven ? (
                      <Link to={`/announcements/${announcement.id}`} className="block group">
                        <GlassCard hoverEffect={true} className={`p-6 ${isPriority ? 'border-accent-mint shadow-[0_0_20px_rgba(0,255,136,0.1)]' : ''}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-mono text-text-muted uppercase tracking-wider border border-border-low-opacity">
                              {announcement.type || 'NOTICE'}
                            </span>
                            {isPriority && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-accent-mint uppercase tracking-wider">
                                <AlertCircle size={12} /> Priority
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-mint transition-colors">
                            {announcement.title}
                          </h3>
                          <p className="text-text-muted text-sm line-clamp-3 mb-4">
                            {announcement.description}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-low-opacity">
                            <span className="text-xs font-mono text-accent-mint flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read Log <ArrowRight size={14} />
                            </span>
                          </div>
                        </GlassCard>
                      </Link>
                    ) : (
                      <div className="hidden md:flex flex-col items-end text-right">
                        <div className="text-2xl font-display font-bold text-white">
                          {date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm font-mono text-text-muted flex items-center gap-1">
                          {date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side (Content or Empty) */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${!isEven ? 'md:order-2' : ''}`}>
                    {!isEven ? (
                      <Link to={`/announcements/${announcement.id}`} className="block group">
                        <GlassCard hoverEffect={true} className={`p-6 ${isPriority ? 'border-accent-mint shadow-[0_0_20px_rgba(0,255,136,0.1)]' : ''}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-mono text-text-muted uppercase tracking-wider border border-border-low-opacity">
                              {announcement.type || 'NOTICE'}
                            </span>
                            {isPriority && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-accent-mint uppercase tracking-wider">
                                <AlertCircle size={12} /> Priority
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-mint transition-colors">
                            {announcement.title}
                          </h3>
                          <p className="text-text-muted text-sm line-clamp-3 mb-4">
                            {announcement.description}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-low-opacity">
                            <span className="text-xs font-mono text-accent-mint flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read Log <ArrowRight size={14} />
                            </span>
                          </div>
                        </GlassCard>
                      </Link>
                    ) : (
                      <div className="hidden md:flex flex-col items-start text-left">
                        <div className="text-2xl font-display font-bold text-white">
                          {date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm font-mono text-accent-mint flex items-center gap-1">
                          {date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-16 relative z-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl font-mono text-sm flex items-center justify-center transition-all ${
                page === p 
                  ? 'bg-accent-mint/20 border border-accent-mint text-accent-mint shadow-[0_0_10px_rgba(0,255,136,0.2)]' 
                  : 'bg-surface-container border border-border-low-opacity text-text-muted hover:bg-surface-container-high hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
