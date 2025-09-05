import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings,
  Heart,
  UserPlus,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPath, onNavigate }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    ];

    switch (user?.role) {
      case 'ADMINISTRATOR':
        return [
          ...baseItems,
          { icon: Users, label: 'Staff', path: '/staff' },
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: FileText, label: 'Records', path: '/records' },
          { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
          { icon: CreditCard, label: 'Billing', path: '/billing' },
          { icon: Package, label: 'Inventory', path: '/inventory' },
          { icon: Heart, label: 'Vital Signs', path: '/vitals' },
          { icon: BarChart3, label: 'Reports', path: '/reports' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      case 'RECEPTIONIST':
        return [
          ...baseItems,
          { icon: UserPlus, label: 'Patient Registration', path: '/patients' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: CreditCard, label: 'Billing', path: '/billing' },
        ];
      case 'DOCTOR':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: FileText, label: 'Records', path: '/records' },
          { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
        ];
      case 'NURSE':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: FileText, label: 'Records', path: '/records' },
          { icon: Heart, label: 'Vital Signs', path: '/vitals' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
        ];
      case 'PHARMACIST':
        return [
          ...baseItems,
          { icon: Package, label: 'Inventory', path: '/inventory' },
          { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-navy-700 h-full flex flex-col"
    >
      <div className="p-6 border-b border-gray-200 dark:border-navy-700">
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-navy-900 dark:text-white">HMS</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hospital Management</p>
            </div>
          )}
        </motion.div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <li key={item.path}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;