import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'DSA', link: ''
  });

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/admin/resources', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data.data || []);
    } catch (err) {
      console.error(err);
      // Fallback data for UI demonstration if backend route is not ready
      setResources([
        { id: 1, title: 'Complete DSA Sheet', category: 'DSA', views: 140, created_at: new Date() },
        { id: 2, title: 'React Performance Guide', category: 'Development', views: 85, created_at: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to add resource');
      setShowAddModal(false);
      fetchResources();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete resource');
      fetchResources();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Resource Database</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> New Resource
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl">{error}</div>}

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Views</th>
              <th className="p-4">Date Added</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {resources.map(item => (
              <tr key={item.id} className="hover:bg-[#112218] transition-colors text-white">
                <td className="p-4 font-bold">{item.title}</td>
                <td className="p-4"><span className="px-2 py-1 bg-[#1a3324] text-[#a3b8cc] rounded text-xs">{item.category}</span></td>
                <td className="p-4 text-[#00FF88]">{item.views}</td>
                <td className="p-4 text-[#a3b8cc]">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 p-2"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </td>
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
                <h3 className="text-xl font-bold text-white">Upload Resource</h3>
                <button onClick={() => setShowAddModal(false)} className="text-[#a3b8cc] hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Resource Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1">
                    <option value="DSA">DSA</option><option value="Development">Development</option><option value="Machine Learning">Machine Learning</option><option value="Open Source">Open Source</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Link / URL</label>
                  <input type="url" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl mt-4">Publish Resource</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminResources;
