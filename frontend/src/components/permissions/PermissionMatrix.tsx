import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface Permission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface PermissionMatrixProps {
  roleId: string;
  roleName: string;
  roleColor: string;
  permissions: Permission[];
  modules: Array<{ id: string; name: string; description: string }>;
  onPermissionChange: (roleId: string, moduleId: string, operation: string, value: boolean) => void;
  onToggleAll: (roleId: string, moduleId: string, enable: boolean) => void;
}

const CRUD_OPERATIONS = [
  { id: 'create', name: 'Create', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { id: 'read', name: 'Read', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'update', name: 'Update', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'delete', name: 'Delete', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' }
];

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roleId,
  roleName,
  roleColor,
  permissions,
  modules,
  onPermissionChange,
  onToggleAll
}) => {
  return (
    <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 ${roleColor} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">
                {roleName.charAt(0)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {roleName}
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {modules.map((module, moduleIndex) => {
            const modulePermissions = permissions.find(p => p.module === module.id);
            const allEnabled = modulePermissions && 
              modulePermissions.create && 
              modulePermissions.read && 
              modulePermissions.update && 
              modulePermissions.delete;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: moduleIndex * 0.05 }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {module.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {module.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`${roleId}-${module.id}-all`} className="text-sm font-medium">
                      Toggle All
                    </Label>
                    <Switch
                      id={`${roleId}-${module.id}-all`}
                      checked={allEnabled || false}
                      onCheckedChange={(checked) => onToggleAll(roleId, module.id, checked)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CRUD_OPERATIONS.map(operation => (
                    <div 
                      key={operation.id} 
                      className={`flex items-center space-x-2 p-3 rounded-lg ${operation.bgColor} border border-slate-200 dark:border-slate-600`}
                    >
                      <Switch
                        id={`${roleId}-${module.id}-${operation.id}`}
                        checked={modulePermissions?.[operation.id as keyof Permission] || false}
                        onCheckedChange={(checked) => onPermissionChange(roleId, module.id, operation.id, checked)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Label 
                        htmlFor={`${roleId}-${module.id}-${operation.id}`}
                        className={`font-medium cursor-pointer ${operation.color}`}
                      >
                        {operation.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionMatrix;