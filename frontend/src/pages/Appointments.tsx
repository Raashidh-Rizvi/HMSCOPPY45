import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, User, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, patientsRes, usersRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/users')
      ]);
      
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(usersRes.data.filter((user: any) => user.role === 'DOCTOR'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const appointmentData = {
      patient: { id: parseInt(formData.get('patientId') as string) },
      doctor: { id: parseInt(formData.get('doctorId') as string) },
      appointmentDateTime: `${formData.get('date')}T${formData.get('time')}:00`,
      status: formData.get('status') as string || 'SCHEDULED',
    };

    try {
      if (selectedAppointment) {
        await api.put(`/appointments/${selectedAppointment.id}`, appointmentData);
      } else {
        await api.post('/appointments', appointmentData);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    `${appointment.patient?.firstName} ${appointment.patient?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: appointments.length.toString(), icon: Calendar, color: 'text-blue-600' },
          { label: 'Scheduled', value: appointments.filter(a => a.status === 'SCHEDULED').length.toString(), icon: Clock, color: 'text-green-600' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length.toString(), icon: User, color: 'text-teal-600' },
          { label: 'Cancelled', value: appointments.filter(a => a.status === 'CANCELLED').length.toString(), icon: Calendar, color: 'text-red-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointment Schedule</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search appointments..."
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
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment, index) => (
                <motion.tr
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-navy-800"
                >
                  <TableCell className="font-medium">
                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                  </TableCell>
                  <TableCell>{appointment.doctor?.name}</TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentDateTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Appointment Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <select
                  name="patientId"
                  defaultValue={selectedAppointment?.patient?.id}
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
                <Label htmlFor="doctorId">Doctor</Label>
                <select
                  name="doctorId"
                  defaultValue={selectedAppointment?.doctor?.id}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor: any) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  name="date"
                  type="date"
                  defaultValue={selectedAppointment ? selectedAppointment.appointmentDateTime.split('T')[0] : ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  name="time"
                  type="time"
                  defaultValue={selectedAppointment ? selectedAppointment.appointmentDateTime.split('T')[1]?.substring(0, 5) : ''}
                  required
                />
              </div>
            </div>

            {selectedAppointment && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  name="status"
                  defaultValue={selectedAppointment?.status}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {selectedAppointment ? 'Update' : 'Schedule'} Appointment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;