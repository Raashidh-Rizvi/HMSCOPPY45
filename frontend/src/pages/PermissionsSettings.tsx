import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionsManagement from './PermissionsManagement';
import PermissionSummary from '@/components/permissions/PermissionSummary';

type ViewMode = 'management' | 'summary';

const PermissionsSettings: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('management');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      System Permissions
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400">
                      Manage role-based access control for the hospital management system
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'management' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('management')}
                    className={viewMode === 'management' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Management
                  </Button>
                  <Button
                    variant={viewMode === 'summary' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('summary')}
                    className={viewMode === 'summary' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Content based on view mode */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'management' ? (
            <PermissionsManagement />
          ) : (
            <div className="space-y-6">
              <PermissionSummary 
                permissions={{}}
                roles={[]}
                modules={[]}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PermissionsSettings;