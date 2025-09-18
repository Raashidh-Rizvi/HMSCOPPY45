import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, TrendingUp, Users, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '@/services/api';

const Reports: React.FC = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [billings, setBillings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchReportsData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchReportsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [patientsRes, appointmentsRes, billingsRes, usersRes] = await Promise.all([
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/billings'),
        api.get('/users')
      ]);
      
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setBillings(billingsRes.data);
      setUsers(usersRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real-time metrics
  const totalRevenue = billings.filter(b => b.status === 'PAID').reduce((sum, bill) => sum + bill.amount, 0);
  const pendingRevenue = billings.filter(b => b.status === 'UNPAID').reduce((sum, bill) => sum + bill.amount, 0);
  const patientVisits = appointments.filter(a => a.status === 'COMPLETED').length;
  const todayAppointments = appointments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.appointmentDateTime).toDateString() === today;
  }).length;

  // Generate real-time monthly revenue data
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

  // Generate real-time patient registration data
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

  // Real-time appointment status distribution
  const appointmentStatusData = React.useMemo(() => {
    const statusCounts = appointments.reduce((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'COMPLETED' ? '#10b981' : status === 'SCHEDULED' ? '#3b82f6' : '#ef4444'
    }));
  }, [appointments]);

  // Real-time billing status data
  const billingStatusData = React.useMemo(() => {
    const statusCounts = billings.reduce((acc, bill) => {
      acc[bill.status] = (acc[bill.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'PAID' ? '#10b981' : '#ef4444'
    }));
  }, [billings]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Real-Time Reports & Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Live hospital performance insights - Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchReportsData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Real-time Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Revenue', 
            value: `$${totalRevenue.toLocaleString()}`, 
            change: `$${pendingRevenue.toLocaleString()} pending`, 
            icon: DollarSign, 
            color: 'text-green-600',
            trend: totalRevenue > 0 ? '+' : ''
          },
          { 
            title: 'Patient Visits', 
            value: patientVisits.toString(), 
            change: `${todayAppointments} today`, 
            icon: Users, 
            color: 'text-blue-600',
            trend: patientVisits > 0 ? '+' : ''
          },
          { 
            title: 'Total Patients', 
            value: patients.length.toString(), 
            change: 'Registered', 
            icon: Calendar, 
            color: 'text-purple-600',
            trend: '+'
          },
          { 
            title: 'Active Staff', 
            value: users.length.toString(), 
            change: 'Online', 
            icon: TrendingUp, 
            color: 'text-indigo-600',
            trend: '+'
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{metric.title}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{metric.change}</p>
                    </div>
                    <div className="relative">
                      <Icon className={`w-8 h-8 ${metric.color}`} />
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Monthly Revenue
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </div>
              </CardTitle>
              <CardDescription>Real-time revenue from billing records</CardDescription>
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
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Patient Registrations
                <div className="flex items-center text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </div>
              </CardTitle>
              <CardDescription>Real-time patient registration trends</CardDescription>
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

      {/* Real-time Status Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Appointment Status
                <div className="flex items-center text-sm text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </div>
              </CardTitle>
              <CardDescription>Current appointment status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Billing Status
                <div className="flex items-center text-sm text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </div>
              </CardTitle>
              <CardDescription>Current billing status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={billingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {billingStatusData.map((entry, index) => (
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

      {/* Real-time System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Live System Overview
              <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Real-time Data
              </div>
            </CardTitle>
            <CardDescription>Current system statistics and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Active Staff Members</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{appointments.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Total Appointments</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{billings.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Billing Records</p>
              </div>
              <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <TrendingUp className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{patients.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Registered Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;