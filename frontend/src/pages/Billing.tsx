import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import api from '@/services/api';

interface Bill {
  id: number;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  amount: number;
  billingDate: string;
  status: 'PAID' | 'UNPAID';
}

const Billing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billsRes, patientsRes] = await Promise.all([
        api.get('/billings'),
        api.get('/patients')
      ]);
      
      setBills(billsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedBill(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const billData = {
      patient: { id: parseInt(formData.get('patientId') as string) },
      amount: parseFloat(formData.get('amount') as string),
      billingDate: formData.get('billingDate') as string,
      status: formData.get('status') as 'PAID' | 'UNPAID',
    };

    try {
      if (selectedBill) {
        await api.put(`/billings/${selectedBill.id}`, billData);
      } else {
        await api.post('/billings', billData);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/billings/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const filteredBills = bills.filter(bill =>
    `${bill.patient.firstName} ${bill.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = bills.filter(b => b.status === 'PAID').reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills.filter(b => b.status === 'UNPAID').reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidBills = bills.filter(b => b.status === 'UNPAID');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'UNPAID':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Billing & Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage patient billing and payment records</p>
        </div>
        <Button onClick={handleAddNew} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          New Bill
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</p>
                  <p className="text-2xl font-bold text-red-600">${pendingAmount.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Bills</p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">{bills.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unpaid Bills</p>
                  <p className="text-2xl font-bold text-orange-600">{unpaidBills.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Billing Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bills..."
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
                <TableHead>Amount</TableHead>
                <TableHead>Billing Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill, index) => (
                <motion.tr
                  key={bill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-navy-800"
                >
                  <TableCell className="font-medium">
                    {bill.patient.firstName} {bill.patient.lastName}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ${bill.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(bill.billingDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(bill)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(bill.id)}
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

      {/* Bill Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedBill ? 'Edit Bill' : 'New Bill'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient</Label>
              <select
                name="patientId"
                defaultValue={selectedBill?.patient.id}
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
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                defaultValue={selectedBill?.amount}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingDate">Billing Date</Label>
              <Input
                name="billingDate"
                type="date"
                defaultValue={selectedBill?.billingDate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                name="status"
                defaultValue={selectedBill?.status || 'UNPAID'}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {selectedBill ? 'Update' : 'Create'} Bill
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;