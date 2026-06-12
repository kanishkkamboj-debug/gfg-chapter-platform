import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminHallOfFame = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '', achievement_title: '', achievement_type: 'Hackathon', description: ''
  });

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/admin/hall-of-fame', { credentials: 'include' });
      const data = await res.json();
      setAchievements(data.data || []);
    } catch (err) {
      setAchievements([
        { id: 1, user_id: 101, username: 'alex_kumar', achievement_title: '1st Place Winter Hackathon', achievement_type: 'Hackathon', created_at: new Date() }
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Hall of Fame Records</h2>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-yellow-400 text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span> Add Record
        </button>
      </div>

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">User ID / Name</th>
              <th className="p-4">Achievement</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {achievements.map(item => (
              <tr key={item.id} className="hover:bg-[#112218] text-white">
                <td className="p-4 font-mono text-[#00FF88]">UID: {item.user_id} <br/><span className="text-xs text-[#a3b8cc]">{item.username}</span></td>
                <td className="p-4 font-bold">{item.achievement_title}</td>
                <td className="p-4"><span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded text-xs">{item.achievement_type}</span></td>
                <td className="p-4 text-right"><button className="text-red-400 p-2"><span className="material-symbols-outlined">delete</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Record Achievement</h3>
                <button onClick={() => setShowAddModal(false)} className="text-[#a3b8cc] hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">User ID</label>
                  <input type="number" required className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Title</label>
                  <input type="text" required className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Type</label>
                  <select className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1">
                    <option>Hackathon</option><option>Coding Contest</option><option>Top Contributor</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-yellow-400 text-[#0a1118] font-bold rounded-xl mt-4">Save Record</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHallOfFame;
