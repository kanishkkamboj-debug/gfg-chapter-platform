import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '../../utils/exportToCSV';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'admins'

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    if(!confirm(`Are you sure you want to make this user an ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("CRITICAL WARNING: Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete');
      }
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-[#00FF88]">Scanning user registry...</div>;

  const filteredUsers = users.filter(u => 
    activeTab === 'admins' ? u.role === 'admin' : u.role === 'member'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">User Registry</h3>
        <button 
          onClick={() => exportToCSV(filteredUsers, `${activeTab}_registry.csv`)}
          className="px-4 py-2 bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00FF88]/20 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span> Export {activeTab === 'admins' ? 'Admins' : 'Members'}
        </button>
      </div>

      <div className="flex gap-4 mb-4 border-b border-[#1a3324]">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 ${activeTab === 'members' ? 'text-[#00FF88] border-[#00FF88]' : 'text-[#a3b8cc] border-transparent hover:text-white'}`}
        >
          Members ({users.filter(u => u.role === 'member').length})
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 ${activeTab === 'admins' ? 'text-purple-400 border-purple-400' : 'text-[#a3b8cc] border-transparent hover:text-white'}`}
        >
          Admins ({users.filter(u => u.role === 'admin').length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">Identity</th>
              <th className="p-4">Access Level</th>
              <th className="p-4">Auth Origin</th>
              <th className="p-4">Join Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-[#112218] transition-colors">
                <td className="p-4">
                  <div className="text-white font-bold">{user.full_name}</div>
                  <div className="text-xs text-[#a3b8cc]">{user.email} • {user.username}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-mono border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-mono border ${user.auth_provider === 'local' ? 'bg-[#112218] text-[#a3b8cc] border-[#1a3324]' : 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30'}`}>
                    {user.auth_provider}
                  </span>
                </td>
                <td className="p-4 text-[#a3b8cc]">{new Date(user.joined_at).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-2">
                  {user.role === 'member' ? (
                    <button 
                      onClick={() => handleRoleChange(user.id, 'admin')}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 rounded text-xs font-bold transition-colors"
                      title="Promote to Admin"
                    >
                      Promote
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRoleChange(user.id, 'member')}
                      className="px-3 py-1 bg-[#112218] border border-[#1a3324] text-[#a3b8cc] hover:text-white rounded text-xs font-bold transition-colors"
                      title="Demote to Member"
                    >
                      Demote
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded text-xs font-bold transition-colors"
                    title="Terminate User"
                  >
                    Terminate
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-[#a3b8cc]">No {activeTab} found in the registry.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
