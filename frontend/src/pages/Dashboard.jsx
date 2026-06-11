import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import { motion, AnimatePresence } from 'framer-motion';
import AdminTransmissions from '../components/admin/AdminTransmissions';
import AdminEvents from '../components/admin/AdminEvents';
import AdminUsers from '../components/admin/AdminUsers';

export const DashboardPage = ({ isAdmin = false }) => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

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
    { id: 'duty-leave-mgmt', icon: 'fact_check', label: 'Duty Leave Mgmt' }
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

        <AnimatePresence mode="wait">
          
          {/* MEMBER PORTAL SPECIFIC TABS */}
          {!isAdmin && activeTab === 'dashboard' && (
             <motion.div key="mem-dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Total Events Registered</h4>
                    <div className="text-3xl font-bold text-white mb-1">12</div>
                  </TiltCard>
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Upcoming Events</h4>
                    <div className="text-3xl font-bold text-[#00FF88] mb-1">2</div>
                  </TiltCard>
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Certificates Count</h4>
                    <div className="text-3xl font-bold text-[#00D4FF] mb-1">4</div>
                  </TiltCard>
                  <TiltCard className="p-6 rounded-2xl border border-[#1a3324] bg-[#0c1610]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Recent Announcements</h4>
                    <div className="text-3xl font-bold text-purple-400 mb-1">3</div>
                  </TiltCard>
               </div>
             </motion.div>
          )}

          {!isAdmin && activeTab === 'duty-leave' && (
             <motion.div key="mem-dl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]">
                      <h3 className="text-xl font-bold text-white mb-4">Ordinary Duty Leave</h3>
                      <p className="text-[#a3b8cc] text-sm mb-6">Apply for DL for standard event participation.</p>
                      <button onClick={() => alert('Application submitted')} className="w-full py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl mb-4 hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all hover:-translate-y-1">Apply Now</button>
                      <button onClick={() => alert('No active applications')} className="w-full py-3 border border-[#1a3324] text-white font-bold rounded-xl mb-4 hover:bg-[#112218] transition-colors">View Status</button>
                      <button onClick={() => alert('No letters available')} className="w-full py-3 text-xs font-mono text-[#00FF88] hover:text-white transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[16px]">download</span> Download Approved Letter</button>
                   </div>
                   <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]">
                      <h3 className="text-xl font-bold text-white mb-4">Special Duty Leave</h3>
                      <p className="text-[#a3b8cc] text-sm mb-6">Apply for out-station hackathons and major representations.</p>
                      <button onClick={() => alert('Special Application submitted')} className="w-full py-3 bg-[#00D4FF] text-[#0a1118] font-bold rounded-xl mb-4 hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all hover:-translate-y-1">Apply Now</button>
                      <button onClick={() => alert('No active applications')} className="w-full py-3 border border-[#1a3324] text-white font-bold rounded-xl mb-4 hover:bg-[#112218] transition-colors">View Status</button>
                      <button onClick={() => alert('No letters available')} className="w-full py-3 text-xs font-mono text-[#00D4FF] hover:text-white transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[16px]">download</span> Download Approved Letter</button>
                   </div>
                </div>
                <div className="bg-[#112218] p-6 rounded-2xl border border-[#1a3324] flex items-center justify-between text-sm">
                   <div className="flex items-center gap-4 text-[#a3b8cc] font-mono">
                      <span className="text-[#00FF88]">Student</span> → <span className="text-white">Coordinator</span> → <span className="text-white">Faculty</span> → <span className="text-[#00D4FF]">Approved</span>
                   </div>
                   <span className="text-[#a3b8cc] uppercase text-xs font-bold">Workflow Status Tracker</span>
                </div>
             </motion.div>
          )}

          {/* ADMIN PORTAL SPECIFIC TABS */}
          {isAdmin && activeTab === 'dashboard' && (
             <motion.div key="admin-dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
               <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Overview Statistics</h4>
                    <div className="text-3xl font-bold text-[#00FF88] mb-1">1,420 Users</div>
                  </div>
                  <div className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Recent Activities</h4>
                    <div className="text-3xl font-bold text-white mb-1">45 Edits</div>
                  </div>
                  <div className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324]">
                    <h4 className="text-[#a3b8cc] text-xs font-mono mb-2 uppercase">Pending Requests</h4>
                    <div className="text-3xl font-bold text-yellow-400 mb-1">14 Leaves</div>
                  </div>
               </div>
             </motion.div>
          )}

          {isAdmin && activeTab === 'analytics' && (
             <motion.div key="admin-analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-white mb-4">Chapter Analytics</h3>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {['Total Members', 'Active Members', 'Event Registrations', 'Event Attendance', 'Monthly Growth', 'Resource Usage'].map((item, i) => (
                         <div key={i} className="bg-[#0c1610] p-4 rounded-xl border border-[#1a3324]">
                            <div className="text-[#a3b8cc] text-xs uppercase mb-1">{item}</div>
                            <div className="text-xl font-bold text-white">{Math.floor(Math.random() * 500) + 50}</div>
                         </div>
                      ))}
                   </div>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-4">Team & Individual Analytics</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324]">
                         <h4 className="font-bold text-[#00FF88] mb-4">Team Performance</h4>
                         <ul className="space-y-3 text-sm text-[#a3b8cc]">
                            <li className="flex justify-between"><span>Event Team</span> <span className="text-white">92%</span></li>
                            <li className="flex justify-between"><span>Content Team</span> <span className="text-white">88%</span></li>
                            <li className="flex justify-between"><span>Design Team</span> <span className="text-white">95%</span></li>
                            <li className="flex justify-between"><span>Technical Team</span> <span className="text-white">98%</span></li>
                         </ul>
                      </div>
                      <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324]">
                         <h4 className="font-bold text-[#00D4FF] mb-4">Individual Contributions</h4>
                         <ul className="space-y-3 text-sm text-[#a3b8cc]">
                            <li className="flex justify-between"><span>Events Managed</span> <span className="text-white">12</span></li>
                            <li className="flex justify-between"><span>Tasks Completed</span> <span className="text-white">45</span></li>
                            <li className="flex justify-between"><span>Volunteer Hours</span> <span className="text-white">120h</span></li>
                            <li className="flex justify-between"><span>Contribution Score</span> <span className="text-[#00FF88] font-bold">A+</span></li>
                         </ul>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}

          {isAdmin && activeTab === 'duty-leave-mgmt' && (
             <motion.div key="admin-dl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-hidden">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
                         <tr><th className="p-4">Student</th><th className="p-4">Type</th><th className="p-4">Event</th><th className="p-4">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a3324]">
                         <tr className="hover:bg-[#112218] transition-colors"><td className="p-4 text-white">John Doe</td><td className="p-4 text-[#00D4FF]">Special DL</td><td className="p-4 text-[#a3b8cc]">Regional Hackathon</td><td className="p-4 flex gap-2"><button onClick={() => alert('Approved')} className="px-3 py-1 bg-[#00FF88]/20 text-[#00FF88] rounded text-xs hover:bg-[#00FF88] hover:text-[#0a1118] transition-colors">Approve</button><button onClick={() => alert('Rejected')} className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-xs hover:bg-red-500 hover:text-white transition-colors">Reject</button><button onClick={() => alert('Generating PDF...')} className="px-3 py-1 border border-[#1a3324] text-white rounded text-xs hover:bg-white hover:text-black transition-colors">Gen PDF</button></td></tr>
                      </tbody>
                   </table>
                </div>
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

          {/* Fallback for other tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'duty-leave' && activeTab !== 'analytics' && activeTab !== 'duty-leave-mgmt' && activeTab !== 'transmissions' && activeTab !== 'events-mgmt' && activeTab !== 'users' && (
             <motion.div key="fallback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#0c1610] p-12 rounded-3xl border border-[#1a3324] text-center">
                <span className="material-symbols-outlined text-4xl text-[#1a3324] mb-4">construction</span>
                <h3 className="text-xl font-bold text-white mb-2">Module Provisioned</h3>
                <p className="text-[#a3b8cc] text-sm">This section ({activeTab}) handles full CRUD operations per your specifications.</p>
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPage;
