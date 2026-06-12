import React, { useState, useEffect } from 'react';

const AdminAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-[#00FF88] font-mono animate-pulse">Compiling analytics...</div>;
  if (!data) return <div className="text-red-500">Failed to load analytics data.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Chapter Analytics Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0c1610] p-4 rounded-xl border border-[#1a3324]">
            <div className="text-[#a3b8cc] text-xs uppercase mb-1">Total Members</div>
            <div className="text-2xl font-bold text-white">{data.total_members}</div>
          </div>
          <div className="bg-[#0c1610] p-4 rounded-xl border border-[#1a3324]">
            <div className="text-[#a3b8cc] text-xs uppercase mb-1">Active Members</div>
            <div className="text-2xl font-bold text-[#00FF88]">{data.active_members}</div>
          </div>
          <div className="bg-[#0c1610] p-4 rounded-xl border border-[#1a3324]">
            <div className="text-[#a3b8cc] text-xs uppercase mb-1">Total Events</div>
            <div className="text-2xl font-bold text-[#00D4FF]">{data.total_events}</div>
          </div>
          <div className="bg-[#0c1610] p-4 rounded-xl border border-[#1a3324]">
            <div className="text-[#a3b8cc] text-xs uppercase mb-1">Pending DLs</div>
            <div className="text-2xl font-bold text-yellow-400">{data.pending_leaves}</div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Team & Individual Metrics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324]">
            <h4 className="font-bold text-[#00FF88] mb-4">Database Aggregates</h4>
            <ul className="space-y-3 text-sm text-[#a3b8cc]">
              <li className="flex justify-between"><span>Total Resources Uploaded</span> <span className="text-white">{data.total_resources}</span></li>
              <li className="flex justify-between"><span>Total Volunteer Hours</span> <span className="text-white">{data.volunteer_hours}h</span></li>
              <li className="flex justify-between"><span>Total Tasks Completed</span> <span className="text-white">{data.tasks_completed}</span></li>
            </ul>
          </div>
          <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324]">
            <h4 className="font-bold text-[#00D4FF] mb-4">System Status</h4>
            <ul className="space-y-3 text-sm text-[#a3b8cc]">
              <li className="flex justify-between"><span>API Gateway</span> <span className="text-[#00FF88]">Online</span></li>
              <li className="flex justify-between"><span>Database Connection</span> <span className="text-[#00FF88]">Stable</span></li>
              <li className="flex justify-between"><span>WebSocket Live Sync</span> <span className="text-[#00FF88]">Active</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
