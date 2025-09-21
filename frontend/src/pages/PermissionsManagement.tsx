import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Save, RotateCcw, Users, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Permission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface RolePermissions {
  [role: string]: Permission[];
}

const MODULES = [
  { id: 'patients', name: 'Patient Records', description: 'Manage patient information and medical history' },
  { id: 'appointments', name: 'Appointments', description: 'Schedule and manage patient appointments' },
  { id: 'prescriptions', name: 'Prescriptions', description: 'Create and manage medication prescriptions' },
  { id: 'billing', name: 'Billing & Payments', description: 'Handle patient billing and payment processing' },
  { id: 'inventory', name: 'Inventory Management', description: 'Manage medical supplies and medications' },
  { id: 'vitals', name: 'Vital Signs', description: 'Record and monitor patient vital signs' },
  { id: 'records', name: 'Medical Records', description: 'Access and update patient medical records' },
  { id: 'reports', name: 'Reports & Analytics', description: 'Generate and view system reports' },
  { id: 'staff', name: 'Staff Management', description: 'Manage hospital staff and user accounts' }
];

const ROLES = [
  { id: 'DOCTOR', name: 'Doctor', color: 'bg-blue-500', description: 'Medical practitioners and physicians' },
  { id: 'NURSE', name: 'Nurse', color: 'bg-green-500', description: 'Nursing staff and patient care providers' },
  { id: 'RECEPTIONIST', name: 'Receptionist', color: 'bg-orange-500', description: 'Front desk and patient registration staff' },
  { id: 'PHARMACIST', name: 'Pharmacist', color: 'bg-purple-500', description: 'Pharmacy and medication management staff' }
];

const CRUD_OPERATIONS = [
  { id: 'create', name: 'Create', description: 'Add new records', color: 'text-green-600' },
  { id: 'read', name: 'Read', description: 'View existing records', color: 'text-blue-600' },
  { id: 'update', name: 'Update', description: 'Modify existing records', color: 'text-yellow-600' },
  { id: 'delete', name: 'Delete', description: 'Remove records', color: 'text-red-600' }
];

const PermissionsManagement: React.FC = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<RolePermissions>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/system-settings/permissions');
      
      // Initialize permissions structure if empty
      const fetchedPermissions = response.data || {};
      const initializedPermissions: RolePermissions = {};
      
      ROLES.forEach(role => {
        initializedPermissions[role.id] = MODULES.map(module => ({
          module: module.id,
          create: fetchedPermissions[role.id]?.find((p: any) => p.module === module.id)?.create || false,
          read: fetchedPermissions[role.id]?.find((p: any) => p.module === module.id)?.read || false,
          update: fetchedPermissions[role.id]?.find((p: any) => p.module === module.id)?.update || false,
          delete: fetchedPermissions[role.id]?.find((p: any) => p.module === module.id)?.delete || false,
        }));
      });
      
      setPermissions(initializedPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = (roleId: string, moduleId: string, operation: string, value: boolean) => {
    setPermissions(prev => {
      const updated = { ...prev };
      const rolePermissions = updated[roleId] || [];
      const moduleIndex = rolePermissions.findIndex(p => p.module === moduleId);
      
      if (moduleIndex >= 0) {
        updated[roleId] = [...rolePermissions];
        updated[roleId][moduleIndex] = {
          ...updated[roleId][moduleIndex],
          [operation]: value
        };
      }
      
      return updated;
    });
    setHasChanges(true);
  };

  const toggleAllForModule = (roleId: string, moduleId: string, enable: boolean) => {
    setPermissions(prev => {
      const updated = { ...prev };
      const rolePermissions = updated[roleId] || [];
      const moduleIndex = rolePermissions.findIndex(p => p.module === moduleId);
      
      if (moduleIndex >= 0) {
        updated[roleId] = [...rolePermissions];
        updated[roleId][moduleIndex] = {
          module: moduleId,
          create: enable,
          read: enable,
          update: enable,
          delete: enable
        };
      }
      
      return updated;
    });
    setHasChanges(true);
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      await api.post('/system-settings/permissions', permissions);
      setHasChanges(false);
      toast.success('Permissions updated successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const resetPermissions = () => {
    fetchPermissions();
    setHasChanges(false);
    toast.success('Permissions reset to saved state');
  };

  if (user?.role !== 'ADMINISTRATOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only administrators can access permission management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Permissions Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Control CRUD permissions for each role and module
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </motion.div>
            )}
            
            <Button
              variant="outline"
              onClick={resetPermissions}
              disabled={!hasChanges || saving}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
            
            <Button
              onClick={savePermissions}
              disabled={!hasChanges || saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </motion.div>

        {/* Permissions Grid */}
        <div className="space-y-8">
          {ROLES.map((role, roleIndex) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: roleIndex * 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">
                        {role.name}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {MODULES.map((module, moduleIndex) => {
                      const modulePermissions = permissions[role.id]?.find(p => p.module === module.id);
                      const allEnabled = modulePermissions && 
                        modulePermissions.create && 
                        modulePermissions.read && 
                        modulePermissions.update && 
                        modulePermissions.delete;
                      const someEnabled = modulePermissions && 
                        (modulePermissions.create || modulePermissions.read || modulePermissions.update || modulePermissions.delete);

                      return (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (roleIndex * 0.1) + (moduleIndex * 0.05) }}
                          className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Settings className="w-5 h-5 text-slate-500" />
                              <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                  {module.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`${role.id}-${module.id}-all`} className="text-sm font-medium">
                                All
                              </Label>
                              <Switch
                                id={`${role.id}-${module.id}-all`}
                                checked={allEnabled || false}
                                onCheckedChange={(checked) => toggleAllForModule(role.id, module.id, checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {CRUD_OPERATIONS.map(operation => (
                              <div key={operation.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <Switch
                                  id={`${role.id}-${module.id}-${operation.id}`}
                                  checked={modulePermissions?.[operation.id as keyof Permission] || false}
                                  onCheckedChange={(checked) => updatePermission(role.id, module.id, operation.id, checked)}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                                <div>
                                  <Label 
                                    htmlFor={`${role.id}-${module.id}-${operation.id}`}
                                    className={`font-medium cursor-pointer ${operation.color}`}
                                  >
                                    {operation.name}
                                  </Label>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {operation.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Permission Summary
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Managing permissions for {ROLES.length} roles across {MODULES.length} modules. 
                    {hasChanges ? ' You have unsaved changes.' : ' All changes are saved.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PermissionsManagement;