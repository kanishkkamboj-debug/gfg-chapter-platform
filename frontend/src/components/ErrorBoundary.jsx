import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a1118] text-white p-6">
          <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324] max-w-md w-full text-center">
            <span className="material-symbols-outlined text-4xl text-red-500 mb-4 block">error</span>
            <h2 className="text-2xl font-bold mb-4">Module Unresponsive</h2>
            <p className="text-[#a3b8cc] text-sm mb-6">
              Our transmission encountered static. A component failed to load, which can happen after a fresh deployment or network drop.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl hover:shadow-neon transition-shadow"
            >
              Re-establish Connection
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
