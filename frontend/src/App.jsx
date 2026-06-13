import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import GlobalScene from './components/GlobalScene';
import CustomCursor from './components/CustomCursor';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded Pages
const HomePage = lazy(() => import('./pages/Home'));
const AnnouncementsPage = lazy(() => import('./pages/Announcements'));
const AnnouncementDetailPage = lazy(() => import('./pages/AnnouncementDetail'));
const EventsPage = lazy(() => import('./pages/Events'));
const EventDetailPage = lazy(() => import('./pages/EventDetail'));
const EventScannerPage = lazy(() => import('./pages/EventScanner'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const TeamPage = lazy(() => import('./pages/Team'));
const ResourcesPage = lazy(() => import('./pages/Resources'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const ContactPage = lazy(() => import('./pages/Contact'));
const HallOfFamePage = lazy(() => import('./pages/HallOfFame'));
const LeaderboardPage = lazy(() => import('./pages/Leaderboard'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const PracticePortal = lazy(() => import('./pages/PracticePortal'));
const BlogsPage = lazy(() => import('./pages/Blogs'));
const CommunityPage = lazy(() => import('./pages/Community'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AboutPage = lazy(() => import('./pages/About'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfile'));
const GuidelinesPage = lazy(() => import('./pages/Guidelines'));
const PrivacyPage = lazy(() => import('./pages/Privacy'));

// Loading Spinner
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
      <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-accent-cyan/10 border-b-accent-cyan animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApp();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Page Transition Wrapper
const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-12"
    >
      {children}
    </motion.div>
  );
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Animated Routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
          <Route path="/announcements" element={<PageWrapper><AnnouncementsPage /></PageWrapper>} />
          <Route path="/announcements/:id" element={<PageWrapper><AnnouncementDetailPage /></PageWrapper>} />
          <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
          <Route path="/events/:id" element={<PageWrapper><EventDetailPage /></PageWrapper>} />
          <Route path="/events/:id/scan" element={<PageWrapper><EventScannerPage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="/guidelines" element={<PageWrapper><GuidelinesPage /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
          <Route path="/team" element={<PageWrapper><TeamPage /></PageWrapper>} />
          <Route path="/resources" element={<PageWrapper><ResourcesPage /></PageWrapper>} />
          <Route path="/gallery" element={<PageWrapper><GalleryPage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/achievements" element={<PageWrapper><HallOfFamePage /></PageWrapper>} />
          <Route path="/hall-of-fame" element={<PageWrapper><HallOfFamePage /></PageWrapper>} />
          <Route path="/leaderboard" element={<PageWrapper><LeaderboardPage /></PageWrapper>} />
          <Route path="/practice" element={<PageWrapper><PracticePortal /></PageWrapper>} />
          <Route path="/blogs" element={<PageWrapper><BlogsPage /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><BlogsPage /></PageWrapper>} />
          <Route path="/community" element={<PageWrapper><CommunityPage /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><ProjectsPage /></PageWrapper>} />
          <Route path="/profile/:username" element={<PageWrapper><PublicProfilePage /></PageWrapper>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <PageWrapper><DashboardPage isAdmin={true} /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageWrapper><DashboardPage isAdmin={false} /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </AnimatePresence>
  );
};

// Footer Component
const Footer = () => (
  <footer className="relative z-10 mt-32">
    <div className="mx-4 mb-4">
      <div className="glass-card py-12 px-6 rounded-2xl relative overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <Link to="/" className="text-xl font-display font-bold gradient-text-primary tracking-wide mb-6 inline-block">
                GFG Chapter
              </Link>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Empowering the next generation of software engineers through algorithms, development, and community.
              </p>
              <div className="text-xs text-text-muted">
                &copy; {new Date().getFullYear()} GFG Student Chapter.<br />Precision Engineered for Developers.
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold text-white mb-6 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-4 text-text-muted text-sm">
                <li><Link to="/resources" className="hover:text-accent-mint transition-colors inline-block">DSA Roadmap</Link></li>
                <li><Link to="/resources" className="hover:text-accent-mint transition-colors inline-block">Practice Portal</Link></li>
                <li><Link to="/events" className="hover:text-accent-mint transition-colors inline-block">Contests</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold text-white mb-6 uppercase tracking-wider">Engage</h4>
              <ul className="space-y-4 text-text-muted text-sm">
                <li><Link to="/events" className="hover:text-accent-mint transition-colors inline-block">Events & Hackathons</Link></li>
                <li><Link to="/team" className="hover:text-accent-mint transition-colors inline-block">Core Team</Link></li>
                <li><Link to="/gallery" className="hover:text-accent-mint transition-colors inline-block">Visual Archive</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs font-semibold text-white mb-6 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4 text-text-muted text-sm">
                <li><Link to="/guidelines" className="hover:text-accent-mint transition-colors inline-block">Community Guidelines</Link></li>
                <li><Link to="/privacy" className="hover:text-accent-mint transition-colors inline-block">Privacy Protocol</Link></li>
                <li>
                  <Link to="/contact" className="text-accent-mint hover:text-white flex items-center gap-2 transition-colors mt-8 group">
                    <span>Contact Protocol</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// Main App Content
const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-transparent relative font-body text-text-primary selection:bg-accent-mint/30 selection:text-white">
        <GlobalScene />
        <CustomCursor />
        <Navigation />
        <ScrollToTop />

        <main>
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </Router>
  );
};

// Root App Component
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
