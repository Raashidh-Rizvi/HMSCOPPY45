import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Pill, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, patientsRes, prescriptionsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/prescriptions')
      ]);
      
      setAppointments(appointmentsRes.data.slice(0, 5));
      setPatients(patientsRes.data.slice(0, 5));
      setPrescriptions(prescriptionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '8',
      change: '+2 from yesterday',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Total Patients',
      value: '156',
      change: '+12 this month',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Prescriptions Written',
      value: '24',
      change: '+5 today',
      icon: Pill,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Avg. Consultation Time',
      value: '25 min',
      change: '-3 min from last week',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
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
          <p className="text-gray-600 dark:text-gray-400">Doctor Dashboard - Manage your patients and appointments</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common doctor tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-teal-500 hover:bg-teal-600"
                onClick={() => navigate('/records')}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">View Records</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate('/prescriptions')}
              >
                <Pill className="w-6 h-6" />
                <span className="text-sm">Prescribe</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-500 hover:bg-green-600"
                onClick={() => navigate('/appointments')}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-500 hover:bg-purple-600"
                onClick={() => navigate('/patients')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Patients</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common doctor tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-teal-500 hover:bg-teal-600"
                onClick={() => navigate('/records')}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">View Records</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate('/prescriptions')}
              >
                <Pill className="w-6 h-6" />
                <span className="text-sm">Prescribe</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-500 hover:bg-green-600"
                onClick={() => navigate('/appointments')}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Schedule</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-500 hover:bg-purple-600"
                onClick={() => navigate('/patients')}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Patients</span>
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

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Appointments
              </CardTitle>
              <CardDescription>Your scheduled appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment: any, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-800"
                    >
                      <div>
                        <p className="font-medium text-navy-900 dark:text-white">
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'SCHEDULED' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {appointment.status}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No appointments scheduled for today
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Patients
              </CardTitle>
              <CardDescription>Recently registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.length > 0 ? (
                  patients.map((patient: any, index) => (
    </div>
  );
};

export default DoctorDashboard;