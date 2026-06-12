import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  return (
    <div className="container-max py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 rounded-[2.5rem] border-t-accent-mint/40 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent-mint to-transparent opacity-50"></div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 gradient-text-primary">Privacy Protocol</h1>
        
        <div className="prose prose-invert max-w-none text-text-muted space-y-6">
          <p className="text-lg">
            At the GFG Student Chapter, your privacy and data security are our top priorities. This Privacy Protocol outlines how we collect, use, and protect your information when you interact with our platform.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Information We Collect</h2>
          <p>
            When you register on our platform, we collect standard authentication information including your Name, Email Address, and University details. If you authenticate via third-party providers (Google or GitHub), we only retrieve your basic profile information (Name, Email, and Avatar) as authorized by you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Data</h2>
          <p>
            Your data is utilized strictly to provide and improve the services of the platform. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Authenticating your access to the developer dashboard.</li>
            <li>Tracking your progress in the Practice Portal and DSA Roadmaps.</li>
            <li>Registering you for events, hackathons, and contests.</li>
            <li>Sending critical updates regarding chapter activities.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security & Encryption</h2>
          <p>
            All network traffic is encrypted using industry-standard protocols. Passwords are cryptographically hashed using bcrypt with salt rounds before being stored in our PostgreSQL database. We utilize HttpOnly secure cookies to manage authentication tokens, significantly reducing the risk of XSS attacks.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Third-Party Sharing</h2>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal information to third parties. Data may only be shared with trusted infrastructure providers (such as hosting and database services) under strict confidentiality agreements, or when required by law.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Your Rights</h2>
          <p>
            You have full control over your data. You may request to view, modify, or permanently delete your account and associated data at any time by contacting the core admin team through the Contact Protocol.
          </p>

          <div className="mt-12 text-sm border-t border-border-low-opacity pt-6">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
