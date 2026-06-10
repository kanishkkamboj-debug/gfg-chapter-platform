import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useApp();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Resources', path: '/resources' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-6'
    }`}>
      <div className="container-max">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'glass-card px-6 py-3 rounded-full border-border-low-opacity/50' : 'px-2 py-2'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="text-xl font-display font-bold flex items-center gap-2 group relative z-50">
            <span className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
              <span className="material-symbols-outlined text-accent-mint text-sm">terminal</span>
            </span>
            <span className="gradient-text-primary tracking-wide hidden sm:block">GFG Chapter</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`relative font-mono text-sm tracking-wide transition-colors ${
                    isActive ? 'text-white' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-mint to-transparent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-low-opacity hover:border-accent-mint transition-colors">
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-accent-mint">person</span>
                  </div>
                  <span className="text-sm font-medium">{user?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-full transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/register" className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold hover:shadow-neon transition-all hover:-translate-y-0.5 text-sm">
                Join Chapter
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`w-full h-0.5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-background/90 z-40 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-xs">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                  className="w-full text-center"
                >
                  <Link 
                    to={link.path}
                    className="text-2xl font-display font-bold text-white hover:text-accent-mint transition-colors block py-2"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="w-full h-px bg-border-low-opacity my-4"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.1 }}
                className="flex flex-col gap-4 w-full"
              >
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="w-full py-4 rounded-xl border border-border-low-opacity text-center text-white font-bold">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="w-full py-4 rounded-xl bg-error/20 text-error font-bold">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full py-4 rounded-xl border border-border-low-opacity text-center text-white font-bold">
                      Sign In
                    </Link>
                    <Link to="/register" className="w-full py-4 rounded-xl bg-primary text-on-primary text-center font-bold">
                      Join Chapter
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
