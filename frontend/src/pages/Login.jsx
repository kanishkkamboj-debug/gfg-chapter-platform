import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'oauth_failed') {
      setError('GitHub/Google login failed. Please check your OAuth keys or try again.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const loggedInUser = await login(email, password);
      if (loggedInUser?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 rounded-[2.5rem] border-t-accent-mint/40 relative overflow-hidden">
          {/* Top highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent-mint to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold mb-3 gradient-text-primary">Welcome Back</h1>
            <p className="text-text-muted">Sign in to access your developer dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-xl">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">Identifier (Email)</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-accent-mint transition-colors">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container border border-border-low-opacity rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent-mint transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">Security Key (Password)</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-accent-mint transition-colors">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container border border-border-low-opacity rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent-mint transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="#" className="text-sm text-accent-mint hover:text-accent-cyan transition-colors">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold shadow-neon hover:shadow-neon-strong transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
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
            New to the network? <Link to="/register" className="text-white hover:text-accent-mint transition-colors ml-1 border-b border-border-low-opacity hover:border-accent-mint">Initialize profile</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
