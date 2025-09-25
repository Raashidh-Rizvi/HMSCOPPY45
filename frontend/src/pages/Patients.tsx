import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileEdit as Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Patient } from '@/types';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const patientData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dob: formData.get('dob') as string,
      gender: formData.get('gender') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      registrationDate: selectedPatient?.registrationDate || new Date().toISOString().split('T')[0]
    };

    try {
      if (selectedPatient) {
        await api.put(`/patients/${selectedPatient.id}`, patientData);
      } else {
        await api.post('/patients', patientData);
      }
      
      setIsDialogOpen(false);
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient. Please try again.');
      }
    }
  };

  // Check permissions based on user role
  const canAddPatients = user?.role === 'ADMINISTRATOR' || user?.role === 'RECEPTIONIST';
  const canEditPatients = user?.role === 'ADMINISTRATOR' || user?.role === 'RECEPTIONIST' || user?.role === 'DOCTOR';
  const canDeletePatients = user?.role === 'ADMINISTRATOR';
  const canViewPatients = true; // All roles can view patients

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Patients</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage patient information and records</p>
        </div>
        {canAddPatients && (
          <Button onClick={handleAddNew} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Patients</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{patients.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">New This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    {patients.filter(p => {
                      const registrationDate = new Date(p.registrationDate);
                      const currentMonth = new Date().getMonth();
                      return registrationDate.getMonth() === currentMonth;
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Patient Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">
                      #{patient.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{new Date(patient.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {canViewPatients && (
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {canEditPatients && (
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(patient)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {canDeletePatients && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(patient.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Patients Found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchTerm ? 'No patients match your search criteria' : 'Get started by adding your first patient'}
              </p>
              {canAddPatients && !searchTerm && (
                <Button 
                  onClick={handleAddNew}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Patient
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>
              {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={selectedPatient?.firstName}
                  placeholder="Enter first name"
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={selectedPatient?.lastName}
                  placeholder="Enter last name"
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  defaultValue={selectedPatient?.dob}
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  name="gender"
                  defaultValue={selectedPatient?.gender}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={selectedPatient?.address}
                placeholder="Enter address"
                className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={selectedPatient?.phone}
                  placeholder="Enter phone number"
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={selectedPatient?.email}
                  placeholder="Enter email"
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {selectedPatient ? 'Update' : 'Create'} Patient
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;