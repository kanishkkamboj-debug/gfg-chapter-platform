import React from 'react';

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background">
      {/* Main gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-orb-1" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-mint/10 rounded-full blur-[120px] animate-orb-2" />
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[100px] animate-orb-3" />
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] animate-orb-1" style={{ animationDelay: '-10s' }} />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />
      
      {/* Bottom gradient mask for smooth fading */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default AmbientBackground;
