import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ContactPage = () => {
  const { submitContactForm } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'idle' | 'loading' | 'success' | 'error'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      {/* Floating Communication Particles (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {[...Array(10)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-1 h-1 bg-accent-cyan rounded-full shadow-[0_0_10px_#00D4FF]"
             initial={{ 
               x: Math.random() * window.innerWidth, 
               y: Math.random() * window.innerHeight,
               opacity: 0 
             }}
             animate={{ 
               y: [null, Math.random() * window.innerHeight],
               opacity: [0, 0.8, 0] 
             }}
             transition={{ 
               duration: 5 + Math.random() * 5, 
               repeat: Infinity,
               delay: Math.random() * 5
             }}
           />
         ))}
      </div>

      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Establish <span className="gradient-text-primary">Connection</span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl mx-auto mb-10">
            Reach out for collaborations, sponsorships, or general inquiries. Our network is always open.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <ScrollReveal delay={0.1}>
          <TiltCard className="p-8 md:p-10 rounded-[3rem] border-t-accent-cyan/30 h-full relative">
            <h2 className="text-2xl font-display font-bold text-white mb-8">Send Transmission</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Protocol Identity</label>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={e => { setFormData({...formData, name: e.target.value}); setErrors({...errors, name: null}); }}
                    className={`w-full bg-surface-container border ${errors.name ? 'border-error' : 'border-border-low-opacity focus:border-accent-cyan'} rounded-xl px-4 py-3 text-white focus:outline-none transition-colors`}
                  />
                  {errors.name && <span className="text-xs text-error mt-1">{errors.name}</span>}
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Comms Link</label>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={e => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: null}); }}
                    className={`w-full bg-surface-container border ${errors.email ? 'border-error' : 'border-border-low-opacity focus:border-accent-cyan'} rounded-xl px-4 py-3 text-white focus:outline-none transition-colors`}
                  />
                  {errors.email && <span className="text-xs text-error mt-1">{errors.email}</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Subject Vector</label>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  value={formData.subject}
                  onChange={e => { setFormData({...formData, subject: e.target.value}); setErrors({...errors, subject: null}); }}
                  className={`w-full bg-surface-container border ${errors.subject ? 'border-error' : 'border-border-low-opacity focus:border-accent-cyan'} rounded-xl px-4 py-3 text-white focus:outline-none transition-colors`}
                />
                {errors.subject && <span className="text-xs text-error mt-1">{errors.subject}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Transmission Data</label>
                <textarea 
                  rows="5"
                  placeholder="Your message..." 
                  value={formData.message}
                  onChange={e => { setFormData({...formData, message: e.target.value}); setErrors({...errors, message: null}); }}
                  className={`w-full bg-surface-container border ${errors.message ? 'border-error' : 'border-border-low-opacity focus:border-accent-cyan'} rounded-xl px-4 py-3 text-white focus:outline-none transition-colors resize-none`}
                ></textarea>
                {errors.message && <span className="text-xs text-error mt-1">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 rounded-xl font-bold transition-all bg-accent-cyan text-background hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {status === 'loading' ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Initialize Transfer'}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-accent-mint/20 border border-accent-mint rounded-xl text-accent-mint text-center text-sm font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span> Transmission Successful
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </TiltCard>
        </ScrollReveal>

        {/* Info & Map */}
        <div className="space-y-8">
          <ScrollReveal delay={0.2}>
            <div className="grid sm:grid-cols-2 gap-6">
              <TiltCard className="p-6 rounded-3xl border-t-primary/30 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-surface-container border border-primary/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary-bright">location_on</span>
                </div>
                <h3 className="text-white font-bold mb-1">Physical Node</h3>
                <p className="text-text-muted text-sm">Computer Science Dept.<br/>University Campus</p>
              </TiltCard>

              <TiltCard className="p-6 rounded-3xl border-t-purple-400/30 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-surface-container border border-purple-400/20 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-purple-400">mail</span>
                </div>
                <h3 className="text-white font-bold mb-1">Digital Channel</h3>
                <p className="text-text-muted text-sm">chapter@university.edu<br/>support@gfgchapter.org</p>
              </TiltCard>
            </div>
          </ScrollReveal>

          {/* Social Links */}
          <ScrollReveal delay={0.3}>
            <div className="glass-card p-8 rounded-3xl border border-border-low-opacity">
              <h3 className="font-mono text-xs text-text-muted uppercase mb-6 text-center tracking-wider">Social Network Links</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: 'Discord', color: '#5865F2', icon: 'forum' },
                  { name: 'GitHub', color: '#ffffff', icon: 'code' },
                  { name: 'LinkedIn', color: '#0077b5', icon: 'work' },
                  { name: 'Twitter', color: '#1DA1F2', icon: 'tag' }
                ].map(social => (
                  <motion.a
                    key={social.name}
                    href="#"
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-2xl bg-surface-container border border-border-low-opacity flex flex-col items-center justify-center text-text-muted hover:text-white transition-colors relative group"
                  >
                    <span className="material-symbols-outlined text-xl mb-1 group-hover:text-current" style={{ color: social.color }}>{social.icon}</span>
                    <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Map Placeholder */}
          <ScrollReveal delay={0.4}>
            <div className="w-full h-48 bg-surface-container-high rounded-3xl border border-border-low-opacity flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.1)_0%,transparent_70%)]"></div>
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
               <div className="relative z-10 flex flex-col items-center">
                 <span className="material-symbols-outlined text-3xl text-text-muted mb-2 group-hover:text-accent-mint transition-colors group-hover:animate-bounce">my_location</span>
                 <span className="font-mono text-xs text-text-muted group-hover:text-white transition-colors">Interactive Map Grid</span>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
