import React, { useState, useEffect } from 'react';

const NotificationsPortal = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Notifications</h2>
        <p className="text-[#a3b8cc]">Important updates and recent announcements.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-[#a3b8cc]">Loading notifications...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-[#0c1610] p-12 rounded-3xl border border-[#1a3324] text-center">
            <span className="material-symbols-outlined text-4xl text-[#1a3324] mb-4">notifications_off</span>
            <p className="text-[#a3b8cc]">No new notifications.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-[#0c1610] p-6 rounded-2xl border border-[#1a3324] flex gap-4 items-start">
              <div className={`p-3 rounded-xl flex items-center justify-center ${announcement.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-[#00FF88]/10 text-[#00FF88]'}`}>
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-white text-lg">{announcement.title}</h4>
                  {announcement.priority === 'high' && (
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-red-500/20 text-red-500 border border-red-500/30">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-[#a3b8cc] text-sm mb-2">{announcement.description}</p>
                <span className="text-xs font-mono text-[#1a3324]">
                  Posted on {new Date(announcement.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPortal;
