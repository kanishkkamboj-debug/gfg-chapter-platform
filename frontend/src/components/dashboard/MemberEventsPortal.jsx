import React, { useState, useEffect } from 'react';

const MemberEventsPortal = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      alert('Successfully registered for the event!');
      fetchEvents(); // refresh counts
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-[#00FF88]">Loading Events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Event Registration</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.length === 0 ? (
           <div className="col-span-2 text-center p-12 text-[#a3b8cc] border border-[#1a3324] rounded-3xl">No upcoming events.</div>
        ) : events.map(event => (
          <div key={event.id} className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324] flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#112218] text-[#00FF88] border border-[#00FF88]/30 rounded-lg text-xs font-mono uppercase">
                  {event.event_type}
                </span>
                <span className="text-xs text-[#a3b8cc] font-mono flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  {event.registered_count} / {event.capacity || '∞'}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
              <p className="text-sm text-[#a3b8cc] mb-4 line-clamp-2">{event.description}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#1a3324] flex justify-between items-center">
              <div className="text-xs text-[#a3b8cc] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {new Date(event.start_date).toLocaleDateString()}
              </div>
              <button 
                onClick={() => handleRegister(event.id)}
                className="px-4 py-2 bg-[#112218] text-[#00FF88] border border-[#00FF88]/30 hover:bg-[#00FF88] hover:text-[#0a1118] transition-colors rounded-lg font-bold text-sm"
              >
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberEventsPortal;
