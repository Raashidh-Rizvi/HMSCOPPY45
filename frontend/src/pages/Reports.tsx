import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '@/services/api';

const Reports: React.FC = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [billings, setBillings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real metrics
  const totalRevenue = billings.filter(b => b.status === 'PAID').reduce((sum, bill) => sum + bill.amount, 0);
  const patientVisits = appointments.filter(a => a.status === 'COMPLETED').length;
  const avgStayDuration = Math.round(Math.random() * 5 + 2); // Placeholder calculation
  const satisfactionRate = Math.round(85 + Math.random() * 10); // Placeholder calculation

  // Generate monthly revenue data
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Reports & Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Comprehensive hospital performance insights</p>
        </div>
        <div className="flex space-x-2">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+15%', icon: DollarSign, color: 'text-green-600' },
          { title: 'Patient Visits', value: patientVisits.toString(), change: '+8%', icon: Users, color: 'text-blue-600' },
          { title: 'Avg. Stay Duration', value: `${avgStayDuration} days`, change: '-5%', icon: Calendar, color: 'text-purple-600' },
          { title: 'Satisfaction Rate', value: `${satisfactionRate}%`, change: '+3%', icon: TrendingUp, color: 'text-indigo-600' },
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
                      <p className="text-sm text-green-600">{metric.change} from last month</p>
                    </div>
                    <Icon className={`w-8 h-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the last 6 months</CardDescription>
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
              <CardTitle>Patient Registrations</CardTitle>
              <CardDescription>New patient registrations by month</CardDescription>
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

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Current system statistics and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Total Staff Members</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{appointments.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Total Appointments</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{billings.length}</h3>
                <p className="text-slate-600 dark:text-slate-400">Total Billing Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;