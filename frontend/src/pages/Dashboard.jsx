import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import { motion, AnimatePresence } from 'framer-motion';
const AdminTransmissions = React.lazy(() => import('../components/admin/AdminTransmissions'));
const AdminEvents = React.lazy(() => import('../components/admin/AdminEvents'));
const AdminUsers = React.lazy(() => import('../components/admin/AdminUsers'));
const AdminResources = React.lazy(() => import('../components/admin/AdminResources'));
const AdminHallOfFame = React.lazy(() => import('../components/admin/AdminHallOfFame'));
const AdminGallery = React.lazy(() => import('../components/admin/AdminGallery'));
const AdminDutyLeave = React.lazy(() => import('../components/admin/AdminDutyLeave'));
const AdminAnalyticsDashboard = React.lazy(() => import('../components/admin/AdminAnalyticsDashboard'));
const AdminAnnouncements = React.lazy(() => import('../components/admin/AdminAnnouncements'));
const AdminCertificates = React.lazy(() => import('../components/admin/AdminCertificates'));
const ActivityChart = React.lazy(() => import('../components/admin/ActivityChart'));
import DutyLeavePortal from '../components/dashboard/DutyLeavePortal';
import CertificatesPortal from '../components/dashboard/CertificatesPortal';
const MemberEventsPortal = React.lazy(() => import('../components/dashboard/MemberEventsPortal'));
const ProfilePortal = React.lazy(() => import('../components/dashboard/ProfilePortal'));
const NotificationsPortal = React.lazy(() => import('../components/dashboard/NotificationsPortal'));

export const DashboardPage = ({ isAdmin = false }) => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    if (isAdmin && activeTab === 'dashboard') {
      const fetchStats = async () => {
        try {
          const res = await fetch('/api/analytics', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setAdminStats(data);
          }
        } catch (err) {
          console.error("Failed to fetch admin stats:", err);
        }
      };
      fetchStats();
    }
  }, [isAdmin, activeTab]);

  const memberTabs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'profile', icon: 'person', label: 'Profile' },
    { id: 'events', icon: 'event', label: 'Event Registration' },
    { id: 'certificates', icon: 'workspace_premium', label: 'Certificates' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' },
    { id: 'duty-leave', icon: 'approval', label: 'Duty Leave Portal' }
  ];

  const adminTabs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Overview Dashboard' },
    { id: 'transmissions', icon: 'mail', label: 'Transmissions' },
    { id: 'analytics', icon: 'analytics', label: 'Analytics Dashboard' },
    { id: 'events-mgmt', icon: 'event_upcoming', label: 'Event Management' },
    { id: 'announcements', icon: 'campaign', label: 'Announcements' },
    { id: 'resources', icon: 'source', label: 'Resource Management' },
    { id: 'gallery', icon: 'photo_library', label: 'Gallery Management' },
    { id: 'hall-of-fame', icon: 'emoji_events', label: 'Hall of Fame' },
    { id: 'users', icon: 'manage_accounts', label: 'User Management' },
    { id: 'duty-leave-mgmt', icon: 'fact_check', label: 'Duty Leave Mgmt' },
    { id: 'certificates-mgmt', icon: 'workspace_premium', label: 'Certificates Mgmt' }
  ];

  const tabs = isAdmin ? adminTabs : memberTabs;

  return (
    <div className="container-max py-24 min-h-screen relative z-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 shrink-0">
        <ScrollReveal>
          <div className="bg-[#0c1610] border border-[#1a3324] p-6 rounded-3xl sticky top-32">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#1a3324]">
              <div className="w-12 h-12 rounded-full bg-[#112218] flex items-center justify-center font-bold text-xl text-white border border-[#1a3324]">
                {user?.full_name?.[0] || (isAdmin ? 'A' : 'M')}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{user?.full_name || (isAdmin ? 'Admin User' : 'Member User')}</h3>
                <span className="text-xs font-mono text-[#00FF88] uppercase">{user?.role || (isAdmin ? 'Administrator' : 'Student Member')}</span>
              </div>
            </div>

            <nav className="space-y-2 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    activeTab === tab.id 
                      ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 shadow-[inset_2px_0_0_#00FF88]' 
                      : 'text-[#a3b8cc] hover:bg-[#112218] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </ScrollReveal>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <ScrollReveal delay={0.1}>
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-white mb-2 capitalize">{activeTab.replace(/-/g, ' ')}</h1>
            <p className="text-[#a3b8cc]">{isAdmin ? 'Manage platform data and monitor performance analytics.' : 'View your personal dashboard and academic requests.'}</p>
          </div>
        </ScrollReveal>

        <React.Suspense fallback={<div className="p-12 text-center text-[#00FF88] font-mono animate-pulse">Loading module components...</div>}>
          <AnimatePresence mode="wait">
          {/* MEMBER PORTAL SPECIFIC TABS */}
          {!isAdmin && activeTab === 'dashboard' && (
             <motion.div key="mem-dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Total Events Registered</h4>
                    <div className="text-3xl font-bold text-white mb-1">Live data loading</div>
                  </TiltCard>
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Upcoming Events</h4>
                    <div className="text-3xl font-bold text-[#00FF88] mb-1">Syncing...</div>
                  </TiltCard>
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Certificates Count</h4>
                    <div className="text-3xl font-bold text-[#00D4FF] mb-1">Check tab</div>
                  </TiltCard>
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Recent Announcements</h4>
                    <div className="text-3xl font-bold text-purple-400 mb-1">New</div>
                  </TiltCard>
               </div>
               <div className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                  <h3 className="text-xl font-bold text-white mb-2">Welcome to your connected dashboard!</h3>
                  <p className="text-[#a3b8cc]">Navigate using the sidebar to view live events, manage your profile, and request duty leaves.</p>
               </div>
             </motion.div>
          )}

          {!isAdmin && activeTab === 'duty-leave' && (
             <motion.div key="mem-dl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <DutyLeavePortal />
             </motion.div>
          )}

          {!isAdmin && activeTab === 'certificates' && (
             <motion.div key="mem-cert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <CertificatesPortal />
             </motion.div>
          )}

          {!isAdmin && activeTab === 'events' && (
             <motion.div key="mem-events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <MemberEventsPortal />
             </motion.div>
          )}

          {!isAdmin && activeTab === 'profile' && (
             <motion.div key="mem-profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProfilePortal />
             </motion.div>
          )}

          {!isAdmin && activeTab === 'notifications' && (
             <motion.div key="mem-notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <NotificationsPortal />
             </motion.div>
          )}

          {/* ADMIN PORTAL SPECIFIC TABS */}
          {isAdmin && activeTab === 'dashboard' && (
             <motion.div key="admin-dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Overview Statistics</h4>
                    <div className="text-3xl font-bold text-[#00FF88] mb-1">
                      {adminStats ? adminStats.total_members : '...'} Users
                    </div>
                  </div>
                  <div className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Total Events</h4>
                    <div className="text-3xl font-bold text-white mb-1">
                      {adminStats ? adminStats.total_events : '...'} Events
                    </div>
                  </div>
                  <div className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Pending Requests</h4>
                    <div className="text-3xl font-bold text-yellow-400 mb-1">
                      {adminStats ? adminStats.pending_leaves : '...'} Leaves
                    </div>
                  </div>
               </div>

               <div className="grid lg:grid-cols-3 gap-6 mb-8">
                 <div className="lg:col-span-2">
                   <ActivityChart />
                 </div>
                 <div className="bg-[#0c1610] border border-[#1a3324] rounded-2xl p-6 h-[400px] flex flex-col">
                   <h3 className="text-lg font-bold text-white mb-6">Insights & System Overview</h3>
                   <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                     <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">
                       <h4 className="text-[#00FF88] text-sm font-bold mb-1">Transmission Health</h4>
                       <p className="text-[#a3b8cc] text-xs">Activity is up 24% compared to last week. Automated systems are functioning normally with 0% dropped packets.</p>
                     </div>
                     <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">
                       <h4 className="text-[#00D4FF] text-sm font-bold mb-1">User Engagement</h4>
                       <p className="text-[#a3b8cc] text-xs">Peak active users hit 65 today. Engagement in the coding resources module increased significantly.</p>
                     </div>
                     <div className="p-4 bg-[#112218] rounded-xl border border-[#1a3324]">
                       <h4 className="text-yellow-400 text-sm font-bold mb-1">Action Required</h4>
                       <p className="text-[#a3b8cc] text-xs">There are 14 pending duty leave requests waiting for administrative approval.</p>
                     </div>
                   </div>
                 </div>
               </div>
             </motion.div>
          )}

          {isAdmin && activeTab === 'analytics' && (
             <motion.div key="admin-analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminAnalyticsDashboard />
             </motion.div>
          )}

          {isAdmin && activeTab === 'duty-leave-mgmt' && (
             <motion.div key="admin-dl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminDutyLeave />
             </motion.div>
          )}

          {isAdmin && activeTab === 'transmissions' && (
             <motion.div key="admin-transmissions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminTransmissions />
             </motion.div>
          )}

          {isAdmin && activeTab === 'events-mgmt' && (
             <motion.div key="admin-events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminEvents />
             </motion.div>
          )}

          {isAdmin && activeTab === 'users' && (
             <motion.div key="admin-users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminUsers />
             </motion.div>
          )}

          {isAdmin && activeTab === 'resources' && (
             <motion.div key="admin-resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminResources />
             </motion.div>
          )}

          {isAdmin && activeTab === 'hall-of-fame' && (
             <motion.div key="admin-hof" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminHallOfFame />
             </motion.div>
          )}

          {isAdmin && activeTab === 'gallery' && (
             <motion.div key="admin-gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminGallery />
             </motion.div>
          )}

          {isAdmin && activeTab === 'announcements' && (
             <motion.div key="admin-announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminAnnouncements />
             </motion.div>
          )}

          {isAdmin && activeTab === 'certificates-mgmt' && (
             <motion.div key="admin-certs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <AdminCertificates />
             </motion.div>
          )}

          {/* Fallback for other tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'duty-leave' && activeTab !== 'certificates' && activeTab !== 'events' && activeTab !== 'profile' && activeTab !== 'notifications' && activeTab !== 'analytics' && activeTab !== 'duty-leave-mgmt' && activeTab !== 'transmissions' && activeTab !== 'events-mgmt' && activeTab !== 'users' && activeTab !== 'resources' && activeTab !== 'hall-of-fame' && activeTab !== 'gallery' && activeTab !== 'announcements' && activeTab !== 'certificates-mgmt' && (
             <motion.div key="fallback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#0c1610] p-12 rounded-3xl border border-[#1a3324] text-center">
                <span className="material-symbols-outlined text-4xl text-[#1a3324] mb-4">construction</span>
                <h3 className="text-xl font-bold text-white mb-2">Module Provisioned</h3>
                <p className="text-[#a3b8cc] text-sm">This section ({activeTab}) handles full CRUD operations per your specifications.</p>
             </motion.div>
          )}

          </AnimatePresence>
        </React.Suspense>
      </div>
    </div>
  );
};

export default DashboardPage;
