import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DutyLeavePortal = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '', leave_type: 'ordinary', reason: '', pdf_url: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/duty-leaves', { credentials: 'include' });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setLeaves(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      const res = await fetch(`/api/duty-leaves/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete application');
      }
      setLeaves(leaves.filter(l => l.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/duty-leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to submit application');
      setShowApplyModal(false);
      setFormData({ event_name: '', leave_type: 'ordinary', reason: '', pdf_url: '' });
      fetchLeaves();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'coordinator_approved': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'faculty_approved': return 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30';
      case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Duty Leave Application</h2>
          <p className="text-[#a3b8cc]">Track your academic leaves for chapter events.</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="px-6 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all">
          Apply Now
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-3xl group-hover:bg-[#00D4FF]/10 transition-colors"></div>
          <h3 className="text-xl font-bold text-white mb-2">Ordinary DL</h3>
          <p className="text-[#a3b8cc] text-sm mb-4">For standard internal events and workshops. Requires Coordinator approval.</p>
        </div>
        <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF88]/5 rounded-full blur-3xl group-hover:bg-[#00FF88]/10 transition-colors"></div>
          <h3 className="text-xl font-bold text-white mb-2">Special DL</h3>
          <p className="text-[#a3b8cc] text-sm mb-4">For external hackathons or multi-day events. Requires Faculty approval.</p>
        </div>
      </div>

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-hidden mt-8">
        <h3 className="text-lg font-bold text-white p-6 border-b border-[#1a3324]">Your Applications</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">Event</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Date Applied</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {leaves.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-[#a3b8cc]">No applications found.</td></tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-[#112218] text-white">
                  <td className="p-4 font-bold">{leave.event_name}</td>
                  <td className="p-4"><span className="uppercase text-xs font-mono text-[#a3b8cc]">{leave.leave_type}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase font-mono border ${getStatusColor(leave.status)}`}>
                      {leave.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[#a3b8cc]">{new Date(leave.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {leave.status === 'pending' && (
                      <button onClick={() => handleDelete(leave.id)} className="text-[#a3b8cc] hover:text-red-500 transition-colors" title="Withdraw Application">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showApplyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Submit Application</h3>
                <button onClick={() => setShowApplyModal(false)} className="text-[#a3b8cc] hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Event Name</label>
                  <input type="text" required value={formData.event_name} onChange={e => setFormData({...formData, event_name: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Leave Type</label>
                  <select value={formData.leave_type} onChange={e => setFormData({...formData, leave_type: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1">
                    <option value="ordinary">Ordinary DL</option>
                    <option value="special">Special DL</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Reason</label>
                  <textarea rows="3" required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Supporting PDF Link (Optional)</label>
                  <input type="url" value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} placeholder="Google Drive Link etc." className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl mt-4">Submit to Coordinator</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DutyLeavePortal;
