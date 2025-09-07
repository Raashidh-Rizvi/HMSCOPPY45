import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Activity, Thermometer, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

const NurseDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vitalSigns, setVitalSigns] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [vitalSignsRes, patientsRes] = await Promise.all([
                api.get('/vital-signs'),
                api.get('/patients')
            ]);

            setVitalSigns(vitalSignsRes.data.slice(0, 5));
            setPatients(patientsRes.data.slice(0, 8));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const stats = [
        {
            title: 'Patients Monitored',
            value: patients.length.toString(),
            change: '+3 today',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Vital Signs Recorded',
            value: vitalSigns.length.toString(),
            change: '+6 today',
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            title: 'Critical Alerts',
            value: '2',
            change: 'Requires attention',
            icon: AlertTriangle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            title: 'Average Temperature',
            value: '98.7°F',
            change: 'Normal range',
            icon: Thermometer,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
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
                    <p className="text-gray-600 dark:text-gray-400">Nurse Dashboard - Monitor patient care and vital signs</p>
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
                        <CardDescription>Common nursing tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button
                                className="h-20 flex flex-col items-center justify-center space-y-2 bg-red-500 hover:bg-red-600"
                                onClick={() => navigate('/vitals')}
                            >
                                <Heart className="w-6 h-6" />
                                <span className="text-sm">Record Vitals</span>
                            </Button>
                            <Button
                                className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600"
                                onClick={() => navigate('/patients')}
                            >
                                <Users className="w-6 h-6" />
                                <span className="text-sm">Patient Care</span>
                            </Button>
                            <Button
                                className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-500 hover:bg-green-600"
                                onClick={() => navigate('/records')}
                            >
                                <Activity className="w-6 h-6" />
                                <span className="text-sm">Medical Records</span>
                            </Button>
                            <Button
                                className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-500 hover:bg-purple-600"
                                onClick={() => alert('Shift report feature coming soon!')}
                            >
                                <Clock className="w-6 h-6" />
                                <span className="text-sm">Shift Report</span>
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
                {/* Patient Care List */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Patient Care List
                            </CardTitle>
                            <CardDescription>Patients under your care</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {patients.length > 0 ? (
                                    patients.map((patient: any, index) => (
                                        <motion.div
                                            key={patient.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-800 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
                                        >
                                            <div>
                                                <p className="font-medium text-navy-900 dark:text-white">
                                                    {patient.firstName} {patient.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Room: {Math.floor(Math.random() * 300) + 100} | Age: {new Date().getFullYear() - new Date(patient.dob).getFullYear()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline">
                                                    Vitals
                                                </Button>
                                                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                                                    Care Plan
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        No patients assigned
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Vital Signs */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 mr-2" />
                                Recent Vital Signs
                            </CardTitle>
                            <CardDescription>Latest recorded vital signs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {vitalSigns.length > 0 ? (
                                    vitalSigns.map((vital: any, index) => (
                                        <motion.div
                                            key={vital.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className="p-3 rounded-lg bg-gray-50 dark:bg-navy-800"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-navy-900 dark:text-white">
                                                    {vital.patient?.firstName} {vital.patient?.lastName}
                                                </p>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(vital.logDateTime).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Temp:</span>
                                                    <span className="ml-1 font-medium">{vital.temperature}°F</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">BP:</span>
                                                    <span className="ml-1 font-medium">{vital.bloodPressure}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">HR:</span>
                                                    <span className="ml-1 font-medium">{vital.heartRate} bpm</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">RR:</span>
                                                    <span className="ml-1 font-medium">{vital.respiratoryRate} /min</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        No recent vital signs recorded
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Critical Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
                    <CardHeader>
                        <CardTitle className="text-orange-800 dark:text-orange-400 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            Critical Alerts
                        </CardTitle>
                        <CardDescription className="text-orange-700 dark:text-orange-300">
                            Patients requiring immediate attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-orange-900/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-orange-800 dark:text-orange-400">
                                        Room 205 - High Temperature
                                    </p>
                                    <p className="text-sm text-orange-600 dark:text-orange-300">
                                        Patient: John Smith - 102.3°F
                                    </p>
                                </div>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                    Respond
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-orange-900/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-orange-800 dark:text-orange-400">
                                        Room 312 - Irregular Heart Rate
                                    </p>
                                    <p className="text-sm text-orange-600 dark:text-orange-300">
                                        Patient: Mary Johnson - 110 bpm
                                    </p>
                                </div>
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                    Respond
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default NurseDashboard;