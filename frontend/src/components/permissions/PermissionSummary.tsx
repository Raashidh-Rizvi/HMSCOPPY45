import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Settings, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface PermissionSummaryProps {
  permissions: RolePermissions;
  roles: Array<{ id: string; name: string; color: string }>;
  modules: Array<{ id: string; name: string }>;
}

const PermissionSummary: React.FC<PermissionSummaryProps> = ({
  permissions,
  roles,
  modules
}) => {
  const calculateStats = () => {
    let totalPermissions = 0;
    let enabledPermissions = 0;
    
    roles.forEach(role => {
      const rolePermissions = permissions[role.id] || [];
      rolePermissions.forEach(permission => {
        totalPermissions += 4; // 4 CRUD operations per module
        if (permission.create) enabledPermissions++;
        if (permission.read) enabledPermissions++;
        if (permission.update) enabledPermissions++;
        if (permission.delete) enabledPermissions++;
      });
    });
    
    return {
      total: totalPermissions,
      enabled: enabledPermissions,
      percentage: totalPermissions > 0 ? Math.round((enabledPermissions / totalPermissions) * 100) : 0
    };
  };

  const getRoleStats = (roleId: string) => {
    const rolePermissions = permissions[roleId] || [];
    let enabled = 0;
    let total = 0;
    
    rolePermissions.forEach(permission => {
      total += 4;
      if (permission.create) enabled++;
      if (permission.read) enabled++;
      if (permission.update) enabled++;
      if (permission.delete) enabled++;
    });
    
    return { enabled, total, percentage: total > 0 ? Math.round((enabled / total) * 100) : 0 };
  };

  const getModuleStats = (moduleId: string) => {
    let enabled = 0;
    let total = 0;
    
    roles.forEach(role => {
      const rolePermissions = permissions[role.id] || [];
      const modulePermission = rolePermissions.find(p => p.module === moduleId);
      if (modulePermission) {
        total += 4;
        if (modulePermission.create) enabled++;
        if (modulePermission.read) enabled++;
        if (modulePermission.update) enabled++;
        if (modulePermission.delete) enabled++;
      }
    });
    
    return { enabled, total, percentage: total > 0 ? Math.round((enabled / total) * 100) : 0 };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>Permission Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.enabled}/{stats.total}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Permissions Enabled
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.percentage}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Overall Coverage
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {roles.length}×{modules.length}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Roles × Modules
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Role Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-green-600" />
              <span>Role Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map(role => {
                const roleStats = getRoleStats(role.id);
                return (
                  <div key={role.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {role.name.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {role.name}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Permissions
                        </span>
                        <span className="font-medium">
                          {roleStats.enabled}/{roleStats.total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${roleStats.percentage}%` }}
                        />
                      </div>
                      <div className="text-center text-sm font-medium text-blue-600">
                        {roleStats.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Module Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <span>Module Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map(module => {
                const moduleStats = getModuleStats(module.id);
                return (
                  <div key={module.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-slate-500" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {module.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {moduleStats.enabled}/{moduleStats.total}
                      </span>
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${moduleStats.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-purple-600 w-12 text-right">
                        {moduleStats.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PermissionSummary;