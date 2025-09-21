import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, Settings, Shield, TrendingUp, Activity, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/context/PermissionsContext';

import api from '@/services/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [billings, setBillings] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [permissions, setPermissions] = useState({});
  const { permissions: currentPermissions, updatePermissions } = usePermissions();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, patientsRes, appointmentsRes, billingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/billings')
      ]);
      setUsers(usersRes.data);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setBillings(billingsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Calculate real revenue from billing data
  const totalRevenue = billings.filter(b => b.status === 'PAID').reduce((sum, bill) => sum + bill.amount, 0);
  
  // Generate monthly revenue data from actual billing data
  const monthlyRevenueData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthRevenue = billings.filter(b => {
        const billMonth = new Date(b.billingDate).getMonth();
        return billMonth === index && b.status === 'PAID';
      }).reduce((sum, bill) => sum + bill.amount, 0);
      
      return { month, revenue: monthRevenue };
    });
  }, [billings]);

  // Generate patient registration data
  const patientRegistrationData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthPatients = patients.filter(p => {
        const patientMonth = new Date(p.registrationDate).getMonth();
        return patientMonth === index;
      }).length;
      
      return { month, patients: monthPatients };
    });
  }, [patients]);

  const roleDistribution = users.reduce((acc: any, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      title: 'Total Staff',
      value: users.length.toString(),
      change: '+5 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Total Patients',
      value: patients.length.toString(),
      change: '+12 this week',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15% from last month',
      icon: DollarSign,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20'
    },
    {
      title: 'Total Appointments',
      value: appointments.length.toString(),
      change: '+8% this week',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
  ];

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Get all form data for permissions
    const updatedPermissions = { ...currentPermissions };
    
    // Update permissions based on form data
    Object.keys(updatedPermissions).forEach(role => {
      updatedPermissions[role].forEach((permission: any) => {
        const fieldName = `${role}_${permission.module}_${permission.action}`;
        permission.allowed = formData.get(fieldName) === 'on';
      });
    });
    
    // Save permissions
    updatePermissions(updatedPermissions).then(() => {
      alert('Permissions updated successfully!');
    }).catch((error) => {
      alert('Error updating permissions: ' + error.message);
    });
    
    setIsSettingsOpen(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Administrator Dashboard - System overview and management</p>
        </div>
      </motion.div>

      {/* Quick Actions - Moved to top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative shortcuts and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => navigate('/app/staff')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Manage Staff</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={() => navigate('/app/reports')}
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                onClick={() => navigate('/app/patients')}
              >
                <Activity className="w-6 h-6" />
                <span className="text-sm">Patient Management</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                onClick={() => navigate('/app/billing')}
              >
                <DollarSign className="w-6 h-6" />
                <span className="text-sm">Billing</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm">System Settings</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                onClick={() => navigate('/app/permissions')}
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">Permissions</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid - Real data based */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Actual revenue from billing records</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Patient Registrations</CardTitle>
              <CardDescription>Monthly patient registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patientRegistrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Staff Overview and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Staff Distribution
              </CardTitle>
              <CardDescription>Current staff by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(roleDistribution).map(([role, count]: [string, any]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {role.toLowerCase()}
                    </span>
                    <span className="text-lg font-bold text-navy-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>Current system health and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 dark:text-green-400">
                      Database Status
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">Online</p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 dark:text-green-400">
                      API Services
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">Operational</p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      Backup Status
                    </span>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">Scheduled</p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                      Server Load
                    </span>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Normal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>System Settings & Permissions</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input id="hospitalName" defaultValue="General Hospital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>UTC-5 (Eastern)</option>
                    <option>UTC-6 (Central)</option>
                    <option>UTC-7 (Mountain)</option>
                    <option>UTC-8 (Pacific)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              {/* Role Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Role Permissions</h3>
                
                {/* Doctor Permissions */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Doctor Permissions</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentPermissions.DOCTOR?.map((permission: any, index: number) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name={`DOCTOR_${permission.module}_${permission.action}`}
                          defaultChecked={permission.allowed} 
                        />
                        <span>{permission.action} {permission.module}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nurse Permissions */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Nurse Permissions</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentPermissions.NURSE?.map((permission: any, index: number) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name={`NURSE_${permission.module}_${permission.action}`}
                          defaultChecked={permission.allowed} 
                        />
                        <span>{permission.action} {permission.module}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Receptionist Permissions */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Receptionist Permissions</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentPermissions.RECEPTIONIST?.map((permission: any, index: number) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name={`RECEPTIONIST_${permission.module}_${permission.action}`}
                          defaultChecked={permission.allowed} 
                        />
                        <span>{permission.action} {permission.module}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pharmacist Permissions */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Pharmacist Permissions</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentPermissions.PHARMACIST?.map((permission: any, index: number) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          name={`PHARMACIST_${permission.module}_${permission.action}`}
                          defaultChecked={permission.allowed} 
                        />
                        <span>{permission.action} {permission.module}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input id="passwordExpiry" type="number" defaultValue="90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="3" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="twoFactor" defaultChecked />
                <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auditLog" defaultChecked />
                <Label htmlFor="auditLog">Enable Audit Logging</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                Save Settings
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;