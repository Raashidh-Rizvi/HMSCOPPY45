import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart3, Settings, Shield, TrendingUp, Activity, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, patientsRes, appointmentsRes, metricsRes] = await Promise.all([
        api.get('/users'),
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/metrics')
      ]);
      setUsers(usersRes.data);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', patients: 120, revenue: 45000, appointments: 180 },
    { month: 'Feb', patients: 135, revenue: 52000, appointments: 195 },
    { month: 'Mar', patients: 148, revenue: 48000, appointments: 210 },
    { month: 'Apr', patients: 162, revenue: 61000, appointments: 225 },
    { month: 'May', patients: 178, revenue: 55000, appointments: 240 },
    { month: 'Jun', patients: 195, revenue: 67000, appointments: 260 },
  ];

  const departmentData = [
    { name: 'Cardiology', value: 30, color: '#0d9488' },
    { name: 'Neurology', value: 25, color: '#14b8a6' },
    { name: 'Orthopedics', value: 20, color: '#2dd4bf' },
    { name: 'Pediatrics', value: 15, color: '#5eead4' },
    { name: 'Emergency', value: 10, color: '#99f6e4' },
  ];

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
      title: 'Monthly Revenue',
      value: '$67,000',
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
        <div className="flex space-x-2">
          <Button className="bg-teal-500 hover:bg-teal-600">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
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
              transition={{ delay: index * 0.1 }}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hospital Performance</CardTitle>
              <CardDescription>Monthly trends for key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#14b8a6" 
                    strokeWidth={3}
                    name="Patients"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Appointments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Patient distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
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
          transition={{ delay: 0.6 }}
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
          transition={{ delay: 0.7 }}
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

      {/* Quick Actions */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Administrative shortcuts and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600"
                  onClick={() => navigate('/staff')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Manage Staff</span>
              </Button>
              <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-500 hover:bg-green-600"
                  onClick={() => navigate('/reports')}
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-500 hover:bg-purple-600"
                  onClick={() => alert('System configuration coming soon!')}
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm">System Config</span>
              </Button>
              <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-orange-500 hover:bg-orange-600"
                  onClick={() => alert('Security settings coming soon!')}
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">Security</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>



    </div>
  );
};

export default AdminDashboard;