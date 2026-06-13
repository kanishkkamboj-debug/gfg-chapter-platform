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
    { name: 'Community Forum', path: '/community' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Hall of Fame', path: '/hall-of-fame' },
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
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
               <svg viewBox="0 0 24 24" className="w-full h-full fill-[#00FF88]">
                 <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
               </svg>
            </div>
            <div className="hidden sm:flex flex-col justify-center">
               <span className="text-white font-bold text-lg leading-none tracking-tight">GeeksforGeeks</span>
               <span className="text-[#a3b8cc] text-xs font-medium tracking-widest uppercase mt-0.5">Student Chapter</span>
            </div>
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
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold font-mono tracking-widest uppercase text-accent-mint hover:text-white transition-colors border border-accent-mint/30 px-3 py-1.5 rounded-md bg-accent-mint/10">
                    Admin Panel
                  </Link>
                )}
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
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="w-full py-4 rounded-xl bg-accent-mint/10 border border-accent-mint/30 text-accent-mint text-center font-bold tracking-widest uppercase">
                        Admin Panel
                      </Link>
                    )}
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
