import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import MessagingSystem from '@/components/messaging/MessagingSystem';
import AnnouncementSystem from '@/components/announcements/AnnouncementSystem';
import FeedbackSystem from '@/components/feedback/FeedbackSystem';
import { useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/30">
      <Sidebar 
        isOpen={sidebarOpen} 
        currentPath={location.pathname}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>
        
        <Footer />
        
        {/* Real-time Features */}
        <MessagingSystem />
        <AnnouncementSystem />
        <FeedbackSystem />
      </div>
    </div>
  );
};

export default Layout;