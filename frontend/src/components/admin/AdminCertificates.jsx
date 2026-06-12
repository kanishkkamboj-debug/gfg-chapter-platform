import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '../../utils/exportToCSV';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '', event_id: '', certificate_type: 'participation', certificate_url: ''
  });

  const fetchData = async () => {
    try {
      const usersRes = await fetch('/api/users', { credentials: 'include' });
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const usersData = await usersRes.json();
      setUsers(usersData.data || []);
      
      const certsRes = await fetch('/api/certificates/admin', { credentials: 'include' });
      if (!certsRes.ok) throw new Error('Failed to fetch certificates');
      const certsData = await certsRes.json();
      setCertificates(certsData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to revoke this certificate?")) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete certificate');
      setCertificates(certificates.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (cert) => {
    setEditingId(cert.id);
    setFormData({
      user_id: cert.user_id || '',
      event_id: cert.event_id || '',
      certificate_type: cert.certificate_type || 'participation',
      certificate_url: cert.certificate_url || ''
    });
    setIsCreating(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      payload.user_id = parseInt(payload.user_id);
      if (payload.event_id) payload.event_id = parseInt(payload.event_id);
      else delete payload.event_id;

      const url = editingId ? `/api/certificates/${editingId}` : '/api/certificates';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || `Failed to ${editingId ? 'update' : 'issue'} certificate`);
      }
      
      setIsCreating(false);
      setEditingId(null);
      setFormData({ user_id: '', event_id: '', certificate_type: 'participation', certificate_url: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-[#00FF88]">Loading Records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Certificate Management</h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => exportToCSV(certificates, 'certificates.csv')}
            className="px-4 py-3 bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#00FF88]/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span> Export to CSV
          </button>
          <button 
            onClick={() => {
            setEditingId(null);
            setFormData({ user_id: '', event_id: '', certificate_type: 'participation', certificate_url: '' });
            setIsCreating(true);
          }}
          className="px-6 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
        >
            <span className="material-symbols-outlined">workspace_premium</span> Issue Certificate
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-hidden mt-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Type</th>
              <th className="p-4">Event</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {certificates.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-[#a3b8cc]">No certificates issued yet.</td></tr>
            ) : (
              certificates.map(cert => (
                <tr key={cert.id} className="hover:bg-[#112218] text-white">
                  <td className="p-4">
                    <div className="font-bold">{cert.full_name}</div>
                    <div className="text-xs text-[#a3b8cc]">{cert.email}</div>
                  </td>
                  <td className="p-4"><span className="uppercase text-xs font-mono text-[#a3b8cc]">{cert.certificate_type}</span></td>
                  <td className="p-4 text-[#a3b8cc]">{cert.event_title || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <a href={cert.certificate_url} target="_blank" rel="noreferrer" className="text-[#a3b8cc] hover:text-[#00D4FF] transition-colors" title="View">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </a>
                      <button onClick={() => openEdit(cert)} className="text-[#a3b8cc] hover:text-[#00FF88] transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(cert.id)} className="text-[#a3b8cc] hover:text-red-500 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Certificate' : 'Issue New Certificate'}</h3>
                <button onClick={() => setIsCreating(false)} className="text-[#a3b8cc] hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">User</label>
                    <select required className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                      <option value="">Select User</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Certificate Type</label>
                    <select className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.certificate_type} onChange={e => setFormData({...formData, certificate_type: e.target.value})}>
                      <option value="participation">Participation</option>
                      <option value="achievement">Achievement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Event ID (Optional)</label>
                  <input type="number" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.event_id} onChange={e => setFormData({...formData, event_id: e.target.value})} placeholder="e.g. 1" />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Certificate Image/PDF URL</label>
                  <input required type="url" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.certificate_url} onChange={e => setFormData({...formData, certificate_url: e.target.value})} placeholder="https://drive.google.com/..." />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 border border-[#1a3324] text-white hover:bg-[#112218] rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-[#00FF88] text-[#0a1118] hover:bg-[#00D4FF] rounded-xl font-bold">{editingId ? 'Update Certificate' : 'Issue Certificate'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
