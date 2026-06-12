import React, { useState, useEffect } from 'react';

const AdminDutyLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/duty-leaves/admin', { credentials: 'include' });
      const data = await res.json();
      setLeaves(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/duty-leaves/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Duty Leave Approvals</h2>
      </div>

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Event</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {leaves.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-[#a3b8cc]">No applications pending.</td></tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-[#112218] text-white">
                  <td className="p-4">
                    <div className="font-bold text-white">{leave.full_name}</div>
                    <div className="text-xs text-[#a3b8cc]">{leave.email}</div>
                  </td>
                  <td className="p-4 font-bold">{leave.event_name}</td>
                  <td className="p-4"><span className="uppercase text-xs font-mono text-[#a3b8cc]">{leave.leave_type}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase font-mono border ${getStatusColor(leave.status)}`}>
                      {leave.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      value={leave.status} 
                      onChange={(e) => handleUpdateStatus(leave.id, e.target.value)}
                      className="bg-[#112218] border border-[#1a3324] text-white rounded px-2 py-1 outline-none focus:border-[#00FF88]"
                    >
                      <option value="pending">Pending</option>
                      <option value="coordinator_approved">Coord Approved</option>
                      <option value="faculty_approved">Faculty Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(AdminDutyLeave);
