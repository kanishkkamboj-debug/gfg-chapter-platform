import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState([]);

  const allInterests = ['DSA', 'Web Dev', 'ML/AI', 'Open Source', 'Competitive Programming', 'System Design'];

  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Security keys do not match.');
    }
    try {
      setLoading(true);
      setError('');
      // Passing interests alongside username(from email) and full name
      const username = formData.email.split('@')[0];
      await register(formData.email, formData.password, username, formData.fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-card p-10 md:p-14 rounded-[3rem] border-t-primary/40 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary-bright to-transparent opacity-50"></div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text-primary">Join the Chapter</h1>
            <p className="text-text-muted text-lg">Create your developer profile and enter the ecosystem.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-surface-container border border-border-low-opacity rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent-mint transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface-container border border-border-low-opacity rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent-mint transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-surface-container border border-border-low-opacity rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent-mint transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-surface-container border border-border-low-opacity rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-accent-mint transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border-low-opacity">
              <label className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4 block">Areas of Interest</label>
              <div className="flex flex-wrap gap-3">
                {allInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      interests.includes(interest) 
                        ? 'bg-primary/20 border-primary/50 text-accent-mint border' 
                        : 'bg-surface border-border-low-opacity text-text-muted border hover:text-white hover:border-text-muted'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 rounded-2xl bg-primary text-on-primary text-lg font-bold shadow-neon hover:shadow-neon-strong transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Initializing Profile...' : 'Create Account'}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-border-low-opacity"></div>
            <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase tracking-widest font-mono">Or Continue With</span>
            <div className="flex-grow border-t border-border-low-opacity"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <a
              href="http://localhost:5000/api/auth/google"
              className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-surface-container border border-border-low-opacity hover:border-accent-mint hover:bg-white/5 transition-all text-white font-medium group"
            >
              <img loading="lazy" src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Google
            </a>
            <a
              href="http://localhost:5000/api/auth/github"
              className="flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-surface-container border border-border-low-opacity hover:border-accent-mint hover:bg-white/5 transition-all text-white font-medium group"
            >
              <img loading="lazy" src="https://github.githubassets.com/favicons/favicon.png" alt="GitHub" className="w-5 h-5 filter invert group-hover:scale-110 transition-transform" />
              GitHub
            </a>
          </div>

          <div className="mt-8 text-center text-sm text-text-muted">
            Already in the network? <Link to="/login" className="text-white hover:text-accent-mint transition-colors ml-1 border-b border-border-low-opacity hover:border-accent-mint">Access Dashboard</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
