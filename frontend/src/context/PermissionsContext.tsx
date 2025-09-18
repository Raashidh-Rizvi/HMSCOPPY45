import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

interface Permission {
  module: string;
  action: string;
  allowed: boolean;
}

interface RolePermissions {
  [role: string]: Permission[];
}

interface PermissionsContextType {
  permissions: RolePermissions;
  hasPermission: (module: string, action: string) => boolean;
  updatePermissions: (rolePermissions: RolePermissions) => void;
  loading: boolean;
  refreshPermissions: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Default permissions based on role
const defaultPermissions: RolePermissions = {
  ADMINISTRATOR: [
    { module: 'patients', action: 'view', allowed: true },
    { module: 'patients', action: 'create', allowed: true },
    { module: 'patients', action: 'edit', allowed: true },
    { module: 'patients', action: 'delete', allowed: true },
    { module: 'staff', action: 'view', allowed: true },
    { module: 'staff', action: 'create', allowed: true },
    { module: 'staff', action: 'edit', allowed: true },
    { module: 'staff', action: 'delete', allowed: true },
    { module: 'appointments', action: 'view', allowed: true },
    { module: 'appointments', action: 'create', allowed: true },
    { module: 'appointments', action: 'edit', allowed: true },
    { module: 'appointments', action: 'delete', allowed: true },
    { module: 'records', action: 'view', allowed: true },
    { module: 'records', action: 'create', allowed: true },
    { module: 'records', action: 'edit', allowed: true },
    { module: 'records', action: 'delete', allowed: true },
    { module: 'prescriptions', action: 'view', allowed: true },
    { module: 'prescriptions', action: 'create', allowed: true },
    { module: 'prescriptions', action: 'edit', allowed: true },
    { module: 'prescriptions', action: 'delete', allowed: true },
    { module: 'billing', action: 'view', allowed: true },
    { module: 'billing', action: 'create', allowed: true },
    { module: 'billing', action: 'edit', allowed: true },
    { module: 'billing', action: 'delete', allowed: true },
    { module: 'inventory', action: 'view', allowed: true },
    { module: 'inventory', action: 'create', allowed: true },
    { module: 'inventory', action: 'edit', allowed: true },
    { module: 'inventory', action: 'delete', allowed: true },
    { module: 'vitals', action: 'view', allowed: true },
    { module: 'vitals', action: 'create', allowed: true },
    { module: 'vitals', action: 'edit', allowed: true },
    { module: 'vitals', action: 'delete', allowed: true },
    { module: 'reports', action: 'view', allowed: true },
    { module: 'settings', action: 'view', allowed: true },
    { module: 'settings', action: 'edit', allowed: true },
  ],
  DOCTOR: [
    { module: 'patients', action: 'view', allowed: true },
    { module: 'patients', action: 'create', allowed: false },
    { module: 'patients', action: 'edit', allowed: true },
    { module: 'patients', action: 'delete', allowed: false },
    { module: 'appointments', action: 'view', allowed: true },
    { module: 'appointments', action: 'create', allowed: true },
    { module: 'appointments', action: 'edit', allowed: true },
    { module: 'appointments', action: 'delete', allowed: false },
    { module: 'records', action: 'view', allowed: true },
    { module: 'records', action: 'create', allowed: true },
    { module: 'records', action: 'edit', allowed: true },
    { module: 'records', action: 'delete', allowed: false },
    { module: 'prescriptions', action: 'view', allowed: true },
    { module: 'prescriptions', action: 'create', allowed: true },
    { module: 'prescriptions', action: 'edit', allowed: true },
    { module: 'prescriptions', action: 'delete', allowed: false },
    { module: 'vitals', action: 'view', allowed: true },
    { module: 'vitals', action: 'create', allowed: false },
    { module: 'vitals', action: 'edit', allowed: false },
    { module: 'vitals', action: 'delete', allowed: false },
  ],
  NURSE: [
    { module: 'patients', action: 'view', allowed: true },
    { module: 'patients', action: 'create', allowed: false },
    { module: 'patients', action: 'edit', allowed: false },
    { module: 'patients', action: 'delete', allowed: false },
    { module: 'appointments', action: 'view', allowed: true },
    { module: 'appointments', action: 'create', allowed: false },
    { module: 'appointments', action: 'edit', allowed: false },
    { module: 'appointments', action: 'delete', allowed: false },
    { module: 'records', action: 'view', allowed: true },
    { module: 'records', action: 'create', allowed: false },
    { module: 'records', action: 'edit', allowed: false },
    { module: 'records', action: 'delete', allowed: false },
    { module: 'vitals', action: 'view', allowed: true },
    { module: 'vitals', action: 'create', allowed: true },
    { module: 'vitals', action: 'edit', allowed: true },
    { module: 'vitals', action: 'delete', allowed: false },
  ],
  RECEPTIONIST: [
    { module: 'patients', action: 'view', allowed: true },
    { module: 'patients', action: 'create', allowed: true },
    { module: 'patients', action: 'edit', allowed: true },
    { module: 'patients', action: 'delete', allowed: false },
    { module: 'appointments', action: 'view', allowed: true },
    { module: 'appointments', action: 'create', allowed: true },
    { module: 'appointments', action: 'edit', allowed: true },
    { module: 'appointments', action: 'delete', allowed: false },
    { module: 'billing', action: 'view', allowed: true },
    { module: 'billing', action: 'create', allowed: true },
    { module: 'billing', action: 'edit', allowed: true },
    { module: 'billing', action: 'delete', allowed: false },
  ],
  PHARMACIST: [
    { module: 'patients', action: 'view', allowed: true },
    { module: 'patients', action: 'create', allowed: false },
    { module: 'patients', action: 'edit', allowed: false },
    { module: 'patients', action: 'delete', allowed: false },
    { module: 'prescriptions', action: 'view', allowed: true },
    { module: 'prescriptions', action: 'create', allowed: false },
    { module: 'prescriptions', action: 'edit', allowed: false },
    { module: 'prescriptions', action: 'delete', allowed: false },
    { module: 'inventory', action: 'view', allowed: true },
    { module: 'inventory', action: 'create', allowed: true },
    { module: 'inventory', action: 'edit', allowed: true },
    { module: 'inventory', action: 'delete', allowed: false },
  ],
};

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<RolePermissions>(defaultPermissions);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPermissions();
    setupRealTimeUpdates();
  }, [user]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      // Try to fetch custom permissions from the server
      const response = await api.get('/system-settings/permissions');
      if (response.data && Object.keys(response.data).length > 0) {
        setPermissions(response.data);
      } else {
        // Use default permissions if none are set
        setPermissions(defaultPermissions);
      }
    } catch (error) {
      console.log('Using default permissions - custom permissions not found');
      setPermissions(defaultPermissions);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Poll for permission updates every 10 seconds
    const interval = setInterval(() => {
      fetchPermissions();
    }, 10000);

    return () => clearInterval(interval);
  };

  const refreshPermissions = () => {
    fetchPermissions();
  };

  // Listen for permission updates
  useEffect(() => {
    const handlePermissionUpdate = () => fetchPermissions();
    window.addEventListener('permissionsUpdated', handlePermissionUpdate);
    return () => window.removeEventListener('permissionsUpdated', handlePermissionUpdate);
  }, []);

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    
    const rolePermissions = permissions[user.role];
    if (!rolePermissions) return false;
    
    const permission = rolePermissions.find(p => p.module === module && p.action === action);
    return permission ? permission.allowed : false;
  };

  const updatePermissions = async (rolePermissions: RolePermissions) => {
    try {
      await api.post('/system-settings/permissions', rolePermissions);
      setPermissions(rolePermissions);
      
      // Notify all components about permission update
      window.dispatchEvent(new CustomEvent('permissionsUpdated'));
      
      toast.success('Permissions updated successfully!');
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  };

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission, updatePermissions, loading, refreshPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};