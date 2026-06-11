import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // UI state
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', { method: 'POST', credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Verify failed:', err);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // Persistent User Data (Mocking backend via localStorage)
  const [solvedProblems, setSolvedProblems] = useState(() => {
    return JSON.parse(localStorage.getItem('solvedProblems')) || [];
  });
  
  const [completedRoadmapNodes, setCompletedRoadmapNodes] = useState(() => {
    return JSON.parse(localStorage.getItem('completedRoadmapNodes')) || [];
  });

  const [bookmarkedBlogs, setBookmarkedBlogs] = useState(() => {
    return JSON.parse(localStorage.getItem('bookmarkedBlogs')) || [];
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems)); }, [solvedProblems]);
  useEffect(() => { localStorage.setItem('completedRoadmapNodes', JSON.stringify(completedRoadmapNodes)); }, [completedRoadmapNodes]);
  useEffect(() => { localStorage.setItem('bookmarkedBlogs', JSON.stringify(bookmarkedBlogs)); }, [bookmarkedBlogs]);

  // Auth functions
  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      return { user: data.user };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, username, fullName) => {
    setLoading(true); setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username, full_name: fullName })
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      return { user: data.user };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Progress Tracking Actions
  const toggleProblemStatus = useCallback((problemId) => {
    setSolvedProblems(prev => 
      prev.includes(problemId) ? prev.filter(id => id !== problemId) : [...prev, problemId]
    );
  }, []);

  const toggleRoadmapNode = useCallback((nodeId) => {
    setCompletedRoadmapNodes(prev => 
      prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
    );
  }, []);

  const toggleBookmark = useCallback((blogId) => {
    setBookmarkedBlogs(prev => 
      prev.includes(blogId) ? prev.filter(id => id !== blogId) : [...prev, blogId]
    );
  }, []);

  const value = {
    user, isAuthenticated, loading, error, setError,
    login, register, logout,
    solvedProblems, toggleProblemStatus,
    completedRoadmapNodes, toggleRoadmapNode,
    bookmarkedBlogs, toggleBookmark,
    darkMode, setDarkMode
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
