import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Pill, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

interface Prescription {
  id: number;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  doctor: {
    id: number;
    name: string;
  };
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

const Prescriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prescriptionsRes, patientsRes, usersRes] = await Promise.all([
        api.get('/prescriptions'),
        api.get('/patients'),
        api.get('/users')
      ]);
      
      setPrescriptions(prescriptionsRes.data);
      setPatients(patientsRes.data);
      setDoctors(usersRes.data.filter((user: any) => user.role === 'DOCTOR'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPrescription(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const prescriptionData = {
      patient: { id: parseInt(formData.get('patientId') as string) },
      doctor: { id: parseInt(formData.get('doctorId') as string) },
      medicationName: formData.get('medicationName') as string,
      dosage: formData.get('dosage') as string,
      frequency: formData.get('frequency') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };

    try {
      if (selectedPrescription) {
        await api.put(`/prescriptions/${selectedPrescription.id}`, prescriptionData);
      } else {
        await api.post('/prescriptions', prescriptionData);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await api.delete(`/prescriptions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting prescription:', error);
      }
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    `${prescription.patient.firstName} ${prescription.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePrescriptions = prescriptions.filter(p => 
    new Date(p.endDate) >= new Date()
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Prescriptions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage medication prescriptions</p>
        </div>
        <Button onClick={handleAddNew} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          New Prescription
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Prescriptions</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">{prescriptions.length}</p>
                </div>
                <Pill className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-green-600">{activePrescriptions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">
                    {prescriptions.filter(p => new Date(p.startDate).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <Pill className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prescription List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search prescriptions..."
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
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((prescription, index) => (
                <motion.tr
                  key={prescription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-navy-800"
                >
                  <TableCell className="font-medium">
                    {prescription.patient.firstName} {prescription.patient.lastName}
                  </TableCell>
                  <TableCell>{prescription.doctor.name}</TableCell>
                  <TableCell>{prescription.medicationName}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>
                    {new Date(prescription.startDate).toLocaleDateString()} - {new Date(prescription.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(prescription)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(prescription.id)}
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

      {/* Prescription Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <select
                  name="patientId"
                  defaultValue={selectedPrescription?.patient.id}
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
                  defaultValue={selectedPrescription?.doctor.id}
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
            
            <div className="space-y-2">
              <Label htmlFor="medicationName">Medication Name</Label>
              <Input
                name="medicationName"
                defaultValue={selectedPrescription?.medicationName}
                placeholder="Enter medication name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  name="dosage"
                  defaultValue={selectedPrescription?.dosage}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  name="frequency"
                  defaultValue={selectedPrescription?.frequency}
                  placeholder="e.g., Twice daily"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  name="startDate"
                  type="date"
                  defaultValue={selectedPrescription?.startDate}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  name="endDate"
                  type="date"
                  defaultValue={selectedPrescription?.endDate}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {selectedPrescription ? 'Update' : 'Create'} Prescription
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prescriptions;