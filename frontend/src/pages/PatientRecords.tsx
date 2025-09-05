import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

interface PatientRecord {
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
  diagnosis: string;
  treatmentPlan: string;
  recordDate: string;
}

const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recordsRes, patientsRes, usersRes] = await Promise.all([
        api.get('/patient-records'),
        api.get('/patients'),
        api.get('/users')
      ]);
      
      setRecords(recordsRes.data);
      setPatients(patientsRes.data);
      setDoctors(usersRes.data.filter((user: any) => user.role === 'DOCTOR'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (record: PatientRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const recordData = {
      patient: { id: parseInt(formData.get('patientId') as string) },
      doctor: { id: parseInt(formData.get('doctorId') as string) },
      diagnosis: formData.get('diagnosis') as string,
      treatmentPlan: formData.get('treatmentPlan') as string,
      recordDate: formData.get('recordDate') as string,
    };

    try {
      if (selectedRecord) {
        await api.put(`/patient-records/${selectedRecord.id}`, recordData);
      } else {
        await api.post('/patient-records', recordData);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/patient-records/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const filteredRecords = records.filter(record =>
    `${record.patient.firstName} ${record.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Patient Records</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage medical records and treatment plans</p>
        </div>
        <Button onClick={handleAddNew} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Record
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">{records.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">
                    {records.filter(r => new Date(r.recordDate).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <User className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Treatments</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">
                    {records.filter(r => r.treatmentPlan && r.treatmentPlan.trim() !== '').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medical Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search records..."
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
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment Plan</TableHead>
                <TableHead>Record Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-navy-800"
                >
                  <TableCell className="font-medium">
                    {record.patient.firstName} {record.patient.lastName}
                  </TableCell>
                  <TableCell>{record.doctor.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.diagnosis}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.treatmentPlan}</TableCell>
                  <TableCell>{new Date(record.recordDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(record.id)}
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

      {/* Record Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRecord ? 'Edit Medical Record' : 'Add New Medical Record'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <select
                  name="patientId"
                  defaultValue={selectedRecord?.patient.id}
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
                  defaultValue={selectedRecord?.doctor.id}
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
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <textarea
                name="diagnosis"
                defaultValue={selectedRecord?.diagnosis}
                placeholder="Enter diagnosis"
                className="w-full p-2 border rounded-md h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentPlan">Treatment Plan</Label>
              <textarea
                name="treatmentPlan"
                defaultValue={selectedRecord?.treatmentPlan}
                placeholder="Enter treatment plan"
                className="w-full p-2 border rounded-md h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordDate">Record Date</Label>
              <Input
                name="recordDate"
                type="date"
                defaultValue={selectedRecord?.recordDate}
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {selectedRecord ? 'Update' : 'Create'} Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRecords;