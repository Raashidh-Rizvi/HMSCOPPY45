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
  Stethoscope,
  Shield
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
          { icon: Users, label: 'Staff', path: '/app/staff' },
          { icon: Users, label: 'Patients', path: '/app/patients' },
          { icon: Calendar, label: 'Appointments', path: '/app/appointments' },
          { icon: FileText, label: 'Records', path: '/app/records' },
          { icon: Pill, label: 'Prescriptions', path: '/app/prescriptions' },
          { icon: CreditCard, label: 'Billing', path: '/app/billing' },
          { icon: Package, label: 'Inventory', path: '/app/inventory' },
          { icon: Heart, label: 'Vital Signs', path: '/app/vitals' },
          { icon: BarChart3, label: 'Reports', path: '/app/reports' },
          { icon: Shield, label: 'Permissions', path: '/app/permissions' },
        ];
      case 'RECEPTIONIST':
        return [
          ...baseItems,
          { icon: UserPlus, label: 'Patient Registration', path: '/app/patients' },
          { icon: Calendar, label: 'Appointments', path: '/app/appointments' },
          { icon: CreditCard, label: 'Billing', path: '/app/billing' },
        ];
      case 'DOCTOR':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/app/patients' },
          { icon: FileText, label: 'Records', path: '/app/records' },
          { icon: Pill, label: 'Prescriptions', path: '/app/prescriptions' },
          { icon: Calendar, label: 'Appointments', path: '/app/appointments' },
        ];
      case 'NURSE':
        return [
          ...baseItems,
          { icon: Users, label: 'Patients', path: '/app/patients' },
          { icon: FileText, label: 'Records', path: '/app/records' },
          { icon: Heart, label: 'Vital Signs', path: '/app/vitals' },
          { icon: Calendar, label: 'Appointments', path: '/app/appointments' },
        ];
      case 'PHARMACIST':
        return [
          ...baseItems,
          { icon: Package, label: 'Inventory', path: '/app/inventory' },
          { icon: Pill, label: 'Prescriptions', path: '/app/prescriptions' },
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
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 h-full flex flex-col shadow-lg"
    >
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HMS</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hospital Management</p>
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
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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