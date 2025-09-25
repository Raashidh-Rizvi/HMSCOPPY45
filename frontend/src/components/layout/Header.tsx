import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, User, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import AnnouncementSystem from '@/components/announcements/AnnouncementSystem';
import api from '@/services/api';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const AnnouncementBadge: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/announcements');
        const announcements = response.data || [];
        const filteredAnnouncements = announcements.filter(
          (ann: any) => ann.targetRoles.includes('ALL') || ann.targetRoles.includes(user?.role || '')
        );
        const unread = filteredAnnouncements.filter((ann: any) => !ann.read).length;
        setUnreadCount(unread);
      } catch (error) {
        setUnreadCount(0);
      }
    };

    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm animate-pulse"></span>
  );
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Welcome back, {user?.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
              {user?.role.toLowerCase()} Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-slate-500" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
            <Moon className="w-4 h-4 text-slate-500" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <AnnouncementSystem />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;