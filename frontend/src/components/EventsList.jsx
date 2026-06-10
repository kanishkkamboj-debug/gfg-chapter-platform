import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';

export const EventsList = () => {
  const { events, fetchEvents, registerForEvent, unregisterFromEvent, user, loading, error } = useApp();
  const [page, setPage] = useState(1);
  const [eventType, setEventType] = useState(null);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents(page, eventType, search).then(data => {
        setTotalPages(data?.pagination?.pages || 1);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [page, eventType, search, fetchEvents]);

  const handleRegister = async (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to register');
      return;
    }

    try {
      await registerForEvent(eventId);
      setRegisteredEvents(prev => new Set(prev).add(eventId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnregister = async (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await unregisterFromEvent(eventId);
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center glass-card p-4 rounded-2xl relative z-10">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-text-muted group-focus-within:text-accent-cyan transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search events matrix..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface-container-low text-white placeholder-text-muted pl-12 pr-4 py-3 rounded-xl border border-border-low-opacity focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all"
          />
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Filter size={18} className="text-text-muted" />
          </div>
          <select
            value={eventType || ''}
            onChange={(e) => {
              setEventType(e.target.value || null);
              setPage(1);
            }}
            className="w-full bg-surface-container-low text-white pl-12 pr-4 py-3 rounded-xl border border-border-low-opacity focus:outline-none focus:border-accent-cyan transition-all appearance-none cursor-pointer"
          >
            <option value="">All Event Types</option>
            <option value="hackathon">Hackathons</option>
            <option value="workshop">Workshops</option>
            <option value="webinar">Webinars</option>
            <option value="meetup">Meetups</option>
            <option value="competition">Competitions</option>
          </select>
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="glass-card border-red-500/30 bg-red-500/10 text-red-200 p-6 text-center rounded-2xl">
          <p className="font-mono">{error}</p>
        </div>
      )}
      
      {!loading && events.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-surface-container mb-4">
            <Search size={24} className="opacity-50" />
          </div>
          <p className="text-lg font-medium">No events located in current sector.</p>
          <p className="text-sm mt-2 opacity-70">Try adjusting your scanner parameters.</p>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{ perspective: 1000 }}
            >
              <Link to={`/events/${event.id}`} className="block h-full outline-none">
                <GlassCard hoverEffect={true} className="h-full flex flex-col p-0 border-border-low-opacity">
                  {/* Event Header / Image */}
                  <div className="h-48 relative overflow-hidden bg-surface-container-high shrink-0">
                    {event.image_url ? (
                      <img src={event.image_url} alt="" className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-bright to-surface-container-highest flex items-center justify-center opacity-80">
                        <Calendar size={48} className="text-border-low-opacity" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider border backdrop-blur-md ${
                        event.status === 'upcoming' 
                          ? 'bg-accent-mint/10 border-accent-mint/30 text-accent-mint' 
                          : 'bg-surface/50 border-white/10 text-white/70'
                      }`}>
                        {event.type || 'EVENT'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-white mb-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    <p className="text-text-muted text-sm mb-6 line-clamp-2 flex-1">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 text-sm font-mono text-text-muted mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-accent-cyan shrink-0" />
                        <span className="truncate">{new Date(event.start_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-accent-cyan shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-accent-cyan shrink-0" />
                        <span>{event.registered_count} / {event.capacity || '∞'} capacity</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-2 mt-auto">
                      {registeredEvents.has(event.id) ? (
                        <button
                          onClick={(e) => handleUnregister(event.id, e)}
                          className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-mono text-sm uppercase tracking-wider transition-colors z-20 relative"
                        >
                          Abort Registration
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleRegister(event.id, e)}
                          className="w-full py-2.5 bg-primary/20 hover:bg-primary/30 text-primary-bright border border-primary/50 rounded-xl font-mono text-sm uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(47,141,70,0.3)] z-20 relative"
                        >
                          Initialize Join
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl font-mono text-sm flex items-center justify-center transition-all ${
                page === p 
                  ? 'bg-accent-cyan/20 border border-accent-cyan text-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.2)]' 
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

export default EventsList;
