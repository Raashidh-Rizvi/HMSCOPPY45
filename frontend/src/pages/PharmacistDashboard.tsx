import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Pill, AlertTriangle, TrendingDown, ShoppingCart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

const PharmacistDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [restockOrders, setRestockOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [inventoryRes, prescriptionsRes, restockRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/prescriptions'),
        api.get('/restock-orders')
      ]);
      
      setInventory(inventoryRes.data);
      setPrescriptions(prescriptionsRes.data.slice(0, 5));
      setRestockOrders(restockRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const lowStockItems = inventory.filter((item: any) => 
    item.quantityAvailable <= item.reorderLevel
  );

  const stats = [
    {
      title: 'Total Inventory Items',
      value: inventory.length.toString(),
      change: 'Active items',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length.toString(),
      change: 'Need restocking',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Prescriptions Today',
      value: '15',
      change: '+3 from yesterday',
      icon: Pill,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Pending Orders',
      value: restockOrders.filter((order: any) => order.status === 'PENDING').length.toString(),
      change: 'Awaiting delivery',
      icon: ShoppingCart,
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
          <p className="text-gray-600 dark:text-gray-400">Pharmacist Dashboard - Manage inventory and prescriptions</p>
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
            <CardDescription>Common pharmacy tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => navigate('/app/inventory')}
              >
                <Package className="w-6 h-6" />
                <span className="text-sm">Check Inventory</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={() => navigate('/app/prescriptions')}
              >
                <Pill className="w-6 h-6" />
                <span className="text-sm">Dispense Medication</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                onClick={() => navigate('/app/inventory')}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-sm">Manage Stock</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                onClick={() => navigate('/app/inventory')}
              >
                <Clock className="w-6 h-6" />
                <span className="text-sm">Stock Alerts</span>
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

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-3">
                The following items are running low and need restocking:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lowStockItems.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-white dark:bg-red-900/20 rounded">
                    <span className="font-medium">{item.itemName}</span>
                    <span className="text-sm text-red-600 dark:text-red-400">
                      {item.quantityAvailable} left
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Prescriptions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="w-5 h-5 mr-2" />
                Recent Prescriptions
              </CardTitle>
              <CardDescription>Latest prescription requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.length > 0 ? (
                  prescriptions.map((prescription: any, index) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-800"
                    >
                      <div>
                        <p className="font-medium text-navy-900 dark:text-white">
                          {prescription.medicationName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Patient: {prescription.patient?.firstName} {prescription.patient?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          Dosage: {prescription.dosage} | Frequency: {prescription.frequency}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                          Dispense
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent prescriptions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Inventory Status
              </CardTitle>
              <CardDescription>Current stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.slice(0, 6).map((item: any, index) => {
                  const isLowStock = item.quantityAvailable <= item.reorderLevel;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isLowStock 
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                          : 'bg-gray-50 dark:bg-navy-800'
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${isLowStock ? 'text-red-800 dark:text-red-400' : 'text-navy-900 dark:text-white'}`}>
                          {item.itemName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Reorder at: {item.reorderLevel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-navy-900 dark:text-white'}`}>
                          {item.quantityAvailable}
                        </p>
                        <p className="text-xs text-gray-400">in stock</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </div>
  );
};

export default PharmacistDashboard;