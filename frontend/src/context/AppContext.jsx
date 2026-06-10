import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // UI state
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Mock login since no backend
      const mockUser = { id: 1, email, full_name: 'Developer', role: 'student' };
      const mockToken = 'mock-jwt-token-123';
      
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, username, fullName) => {
    setLoading(true); setError(null);
    try {
      const mockUser = { id: 2, email, username, full_name: fullName, role: 'student' };
      const mockToken = 'mock-jwt-token-456';
      
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    user, token, isAuthenticated, loading, error, setError,
    login, register, logout,
    solvedProblems, toggleProblemStatus,
    completedRoadmapNodes, toggleRoadmapNode,
    bookmarkedBlogs, toggleBookmark,
    darkMode, setDarkMode
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
