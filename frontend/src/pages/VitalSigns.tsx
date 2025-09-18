import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Heart, Thermometer, Activity, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

interface VitalSignsLog {
  id: number;
  nurse: {
    id: number;
    name: string;
  };
  patient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  logDateTime: string;
}

const VitalSigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVital, setSelectedVital] = useState<VitalSignsLog | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSignsLog[]>([]);
  const [patients, setPatients] = useState([]);
  const [nurses, setNurses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vitalsRes, patientsRes, usersRes] = await Promise.all([
        api.get('/vital-signs'),
        api.get('/patients'),
        api.get('/users')
      ]);
      
      setVitalSigns(vitalsRes.data);
      setPatients(patientsRes.data);
      setNurses(usersRes.data.filter((user: any) => user.role === 'NURSE'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (vital: VitalSignsLog) => {
    setSelectedVital(vital);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedVital(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const vitalData = {
      patient: { id: parseInt(formData.get('patientId') as string) },
      nurse: { id: parseInt(formData.get('nurseId') as string) },
      temperature: parseFloat(formData.get('temperature') as string),
      bloodPressure: formData.get('bloodPressure') as string,
      heartRate: parseInt(formData.get('heartRate') as string),
      respiratoryRate: parseInt(formData.get('respiratoryRate') as string),
      logDateTime: formData.get('logDateTime') as string,
    };

    try {
      if (selectedVital) {
        await api.put(`/vital-signs/${selectedVital.id}`, vitalData);
      } else {
        await api.post('/vital-signs', vitalData);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving vital signs:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vital signs record?')) {
      try {
        await api.delete(`/vital-signs/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting vital signs:', error);
      }
    }
  };

  const filteredVitalSigns = vitalSigns.filter(vital =>
    `${vital.patient.firstName} ${vital.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVitalStatus = (vital: VitalSignsLog) => {
    // Simple vital signs assessment
    const temp = vital.temperature;
    const hr = vital.heartRate;
    
    if (temp > 100.4 || hr > 100 || hr < 60) {
      return { status: 'Abnormal', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' };
    } else if (temp > 99.5 || hr > 90) {
      return { status: 'Elevated', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' };
    }
    return { status: 'Normal', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' };
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Vital Signs</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and record patient vital signs</p>
        </div>
        <Button onClick={handleAddNew} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Record Vitals
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Patients Monitored Today</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">24</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Abnormal Readings</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <Activity className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Temperature</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">98.7°F</p>
                </div>
                <Thermometer className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Vital Signs</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Respiratory Rate</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVitalSigns.map((vital, index) => {
                const status = getVitalStatus(vital);
                return (
                  <motion.tr
                    key={vital.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TableCell className="font-medium">
                      {vital.patient.firstName} {vital.patient.lastName}
                    </TableCell>
                    <TableCell>{vital.temperature}°F</TableCell>
                    <TableCell>{vital.bloodPressure}</TableCell>
                    <TableCell>{vital.heartRate} bpm</TableCell>
                    <TableCell>{vital.respiratoryRate} /min</TableCell>
                    <TableCell>{vital.nurse.name}</TableCell>
                    <TableCell>
                      {new Date(vital.logDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(vital)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(vital.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vital Signs Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedVital ? 'Edit Vital Signs' : 'Record Vital Signs'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient</Label>
              <select
                name="patientId"
                defaultValue={selectedVital?.patient.id}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient: any) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nurseId">Nurse</Label>
              <select
                name="nurseId"
                defaultValue={selectedVital?.nurse.id}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Nurse</option>
                {nurses.map((nurse: any) => (
                  <option key={nurse.id} value={nurse.id}>
                    {nurse.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  name="temperature"
                  type="number"
                  step="0.1"
                  defaultValue={selectedVital?.temperature}
                  placeholder="98.6"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  name="bloodPressure"
                  defaultValue={selectedVital?.bloodPressure}
                  placeholder="120/80"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  name="heartRate"
                  type="number"
                  defaultValue={selectedVital?.heartRate}
                  placeholder="72"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                <Input
                  name="respiratoryRate"
                  type="number"
                  defaultValue={selectedVital?.respiratoryRate}
                  placeholder="16"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logDateTime">Date & Time</Label>
              <Input
                name="logDateTime"
                type="datetime-local"
                defaultValue={selectedVital ? selectedVital.logDateTime.slice(0, 16) : ''}
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {selectedVital ? 'Update' : 'Record'} Vital Signs
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VitalSigns;