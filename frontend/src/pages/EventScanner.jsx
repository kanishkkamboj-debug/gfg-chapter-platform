import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EventScanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useApp();
  
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Fetch event details to show what they're scanning for
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  // If they aren't logged in, redirect them to login then back here
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=/events/${id}/scan`);
    }
  }, [authLoading, isAuthenticated, navigate, id]);

  const handleConfirmAttendance = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`/api/events/${id}/attend`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record attendance');
      }
      
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!isAuthenticated) return null; // Wait for redirect

  return (
    <div className="max-w-md mx-auto px-4 text-center mt-12 mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Event Attendance</h1>
        {event ? (
          <p className="text-text-muted mb-8">
            You are recording attendance for: <br />
            <strong className="text-white text-lg">{event.title}</strong>
          </p>
        ) : (
          <p className="text-text-muted mb-8">Loading event details...</p>
        )}

        {status === 'idle' && (
          <button 
            onClick={handleConfirmAttendance}
            className="w-full py-4 bg-primary text-[#0a1118] font-bold text-lg rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
          >
            Confirm Attendance
          </button>
        )}

        {status === 'loading' && (
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        )}

        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-500 mb-2">Success!</h2>
            <p className="text-text-muted mb-6">Attendance recorded. You earned 10 Activity Points!</p>
            <Link to="/leaderboard" className="text-primary hover:underline">View Leaderboard</Link>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
            <p className="text-text-muted mb-6">{errorMsg}</p>
            <button onClick={() => setStatus('idle')} className="text-primary hover:underline">Try Again</button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EventScanner;
