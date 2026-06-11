import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTransmissions = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch transmissions');
      const data = await res.json();
      setTickets(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    
    setReplying(true);
    try {
      const res = await fetch(`/api/contact/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reply_message: replyMessage })
      });
      
      if (!res.ok) throw new Error('Failed to send reply');
      
      // Update local state
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'closed' } : t));
      setSelectedTicket(null);
      setReplyMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setReplying(false);
    }
  };

  if (loading) return <div className="text-center p-12 text-[#00FF88]">Intercepting transmissions...</div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      <div className="bg-[#0c1610] rounded-3xl border border-[#1a3324] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#112218] text-[#a3b8cc] uppercase text-xs font-mono">
            <tr>
              <th className="p-4">Sender Identity</th>
              <th className="p-4">Subject Vector</th>
              <th className="p-4">Status</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3324]">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-[#112218] transition-colors">
                <td className="p-4">
                  <div className="text-white font-bold">{ticket.name}</div>
                  <div className="text-xs text-[#a3b8cc]">{ticket.email}</div>
                </td>
                <td className="p-4 text-white">{ticket.subject}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-mono border ${ticket.status === 'open' ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30' : 'bg-surface-container text-text-muted border-border-low-opacity'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-4 text-[#a3b8cc]">{new Date(ticket.created_at).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-4 py-2 bg-primary/20 text-accent-mint hover:bg-primary/40 rounded-xl transition-colors text-xs font-bold"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-[#a3b8cc]">No transmissions received.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Transmission Data</h3>
                  <div className="text-[#00FF88] font-mono text-sm">FROM: {selectedTicket.email}</div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-[#a3b8cc] hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="bg-[#112218] border border-[#1a3324] p-6 rounded-2xl mb-6">
                <h4 className="text-[#a3b8cc] text-xs font-mono uppercase mb-2">Subject: {selectedTicket.subject}</h4>
                <p className="text-white whitespace-pre-wrap leading-relaxed">{selectedTicket.message}</p>
              </div>

              {selectedTicket.status === 'open' ? (
                <form onSubmit={handleReply} className="space-y-4">
                  <label className="block text-xs font-mono text-[#a3b8cc] uppercase">Deploy Reply Protocol (Email)</label>
                  <textarea 
                    rows="5"
                    className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-4 text-white focus:outline-none focus:border-[#00FF88] transition-colors resize-none"
                    placeholder="Type your response here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <div className="flex justify-end gap-4 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setSelectedTicket(null)}
                      className="px-6 py-3 border border-[#1a3324] text-white hover:bg-[#112218] rounded-xl transition-colors font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={replying}
                      className="px-6 py-3 bg-[#00FF88] text-[#0a1118] hover:bg-[#00D4FF] rounded-xl transition-colors font-bold flex items-center gap-2"
                    >
                      {replying ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Send & Close Ticket'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center p-4 bg-surface-container rounded-xl text-text-muted">
                  This transmission has been marked as closed.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTransmissions;
