import React from 'react';
import { motion } from 'framer-motion';

const GuidelinesPage = () => {
  return (
    <div className="container-max py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 rounded-[2.5rem] border-t-accent-mint/40 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent-mint to-transparent opacity-50"></div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 gradient-text-primary">Community Guidelines</h1>
        
        <div className="prose prose-invert max-w-none text-text-muted space-y-6">
          <p className="text-lg">
            Welcome to the GFG Student Chapter! Our community is built on mutual respect, collaboration, and a shared passion for technology. To ensure a safe and welcoming environment for everyone, we ask that all members adhere to the following guidelines.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Be Respectful</h2>
          <p>
            Treat everyone with kindness and respect. Harassment, discrimination, hate speech, and personal attacks will not be tolerated. We celebrate diversity and believe that every voice matters.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Foster Collaboration</h2>
          <p>
            We are here to learn and grow together. Share your knowledge, help others when they are stuck, and be open to constructive feedback. Plagiarism or taking credit for others' work is strictly prohibited.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Keep It Professional</h2>
          <p>
            While we encourage a friendly atmosphere, please maintain professionalism in all public forums, events, and project collaborations. Avoid spamming, excessive self-promotion, or sharing inappropriate content.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Respect Privacy</h2>
          <p>
            Do not share personal information of other members without their explicit consent. This includes contact details, private messages, or any sensitive data.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Reporting Issues</h2>
          <p>
            If you witness or experience behavior that violates these guidelines, please reach out to the core team immediately via the Contact Protocol. All reports will be handled confidentially and promptly.
          </p>

          <div className="mt-12 p-6 bg-primary/10 border border-primary/30 rounded-2xl">
            <p className="m-0 text-white font-medium">
              By participating in the GFG Student Chapter, you agree to abide by these guidelines. Repeated violations may result in suspension or permanent removal from the community.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GuidelinesPage;
