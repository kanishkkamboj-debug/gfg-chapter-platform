import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import { motion } from 'framer-motion';

export const EventDetailPage = () => {
  const { id } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);

  // Mock Event Data based on ID
  const event = {
    id,
    title: id === '1' ? 'Winter Hackathon 2025' : 'CodeSprint Regional',
    date: '2025-12-15T09:00:00Z',
    type: id === '1' ? 'Hackathon' : 'Contest',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    desc: 'Join the ultimate 48-hour hackathon building scalable decentralized applications. Network with industry experts, win prizes, and boost your resume.',
    speakers: [
      { name: 'Dr. Emily Chen', role: 'AI Researcher', company: 'Google' },
      { name: 'David Smith', role: 'Blockchain Dev', company: 'Ethereum Foundation' }
    ],
    schedule: [
      { time: '09:00 AM', title: 'Opening Ceremony', desc: 'Kickoff and rules briefing.' },
      { time: '10:00 AM', title: 'Hacking Begins', desc: 'Teams start working on their projects.' },
      { time: '08:00 PM', title: 'Mentor Office Hours', desc: '1-on-1 sessions with industry experts.' }
    ]
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 z-10">
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
        <img loading="lazy" src={event.img} alt={event.title} className="w-full h-full object-cover opacity-30" />
      </div>

      <div className="container-max relative z-20">
        <ScrollReveal>
          <Link to="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 font-mono text-sm">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Events
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded text-xs font-mono uppercase tracking-wider mb-4 inline-block border border-accent-cyan/20">
                {event.type}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">{event.title}</h1>
              <p className="text-lg text-text-muted mb-12 max-w-3xl leading-relaxed">{event.desc}</p>

              {/* Schedule Timeline */}
              <h3 className="text-2xl font-bold text-white mb-6">Event Schedule</h3>
              <div className="space-y-6 mb-12 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border-low-opacity">
                {event.schedule.map((item, i) => (
                  <div key={i} className="relative flex items-start gap-6 group">
                    <div className="w-6 h-6 rounded-full bg-surface-container border-2 border-accent-cyan shrink-0 z-10 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,212,255,0.2)]"></div>
                    <div className="glass-card p-6 rounded-2xl flex-1 -mt-2 group-hover:border-accent-cyan/30 transition-colors">
                      <div className="font-mono text-accent-cyan text-sm mb-2">{item.time}</div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-text-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Speakers */}
              <h3 className="text-2xl font-bold text-white mb-6">Guest Speakers</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, i) => (
                  <TiltCard key={i} className="p-6 rounded-2xl flex items-center gap-4 border-t-purple-400/30">
                     <div className="w-16 h-16 rounded-full bg-surface-bright flex items-center justify-center font-bold text-xl">{speaker.name[0]}</div>
                     <div>
                       <h4 className="font-bold text-white">{speaker.name}</h4>
                       <div className="text-sm font-mono text-purple-400">{speaker.role}</div>
                       <div className="text-xs text-text-muted">{speaker.company}</div>
                     </div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Registration Sidebar */}
            <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-32">
               <TiltCard maxTilt={10} className="p-1 rounded-[2rem] bg-gradient-to-br from-accent-cyan/30 via-transparent to-primary/30">
                 <div className="bg-surface-container-high rounded-[1.8rem] p-8 h-full flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[50px] rounded-full pointer-events-none"></div>
                    
                    <span className="material-symbols-outlined text-5xl text-accent-cyan mb-4">local_activity</span>
                    <h3 className="text-2xl font-bold text-white mb-2">Event Pass</h3>
                    <p className="text-text-muted text-sm mb-8">Secure your spot for this exclusive event.</p>
                    
                    <div className="w-full space-y-4 mb-8">
                      <div className="flex justify-between items-center py-2 border-b border-border-low-opacity">
                        <span className="text-text-muted text-sm">Date</span>
                        <span className="text-white font-mono text-sm">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-low-opacity">
                        <span className="text-text-muted text-sm">Time</span>
                        <span className="text-white font-mono text-sm">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-low-opacity">
                        <span className="text-text-muted text-sm">Format</span>
                        <span className="text-white font-mono text-sm">In-person</span>
                      </div>
                    </div>

                    {!isRegistered ? (
                      <button 
                        onClick={() => setIsRegistered(true)}
                        className="w-full py-4 bg-accent-cyan text-background rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
                      >
                        Confirm Registration
                      </button>
                    ) : (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full py-4 bg-accent-mint/20 border border-accent-mint text-accent-mint rounded-xl font-bold flex justify-center items-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span> Pass Secured
                      </motion.div>
                    )}
                 </div>
               </TiltCard>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default EventDetailPage;
