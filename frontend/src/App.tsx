import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PermissionsProvider } from '@/context/PermissionsContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import Patients from '@/pages/Patients';
import Appointments from '@/pages/Appointments';
import Inventory from '@/pages/Inventory';
import VitalSigns from '@/pages/VitalSigns';
import Reports from '@/pages/Reports';
import DoctorDashboard from '@/pages/DoctorDashboard';
import NurseDashboard from '@/pages/NurseDashboard';
import ReceptionistDashboard from '@/pages/ReceptionistDashboard';
import PharmacistDashboard from '@/pages/PharmacistDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import PatientRecords from '@/pages/PatientRecords';
import Prescriptions from '@/pages/Prescriptions';
import Billing from '@/pages/Billing';
import Staff from '@/pages/Staff';
import PermissionsManagement from '@/pages/PermissionsManagement';

const queryClient = new QueryClient();

// Component to handle initial redirect
const InitialRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PermissionsProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<InitialRedirect />} />
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<RoleDashboard />} />
                  <Route path="patients" element={<Patients />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="records" element={
                    <ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'ADMINISTRATOR']}>
                      <PatientRecords />
                    </ProtectedRoute>
                  } />
                  <Route path="prescriptions" element={
                    <ProtectedRoute allowedRoles={['DOCTOR', 'PHARMACIST', 'ADMINISTRATOR']}>
                      <Prescriptions />
                    </ProtectedRoute>
                  } />
                  <Route path="billing" element={
                    <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMINISTRATOR']}>
                      <Billing />
                    </ProtectedRoute>
                  } />
                  <Route path="staff" element={
                    <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                      <Staff />
                    </ProtectedRoute>
                  } />
                  <Route path="inventory" element={
                    <ProtectedRoute allowedRoles={['PHARMACIST', 'ADMINISTRATOR']}>
                      <Inventory />
                    </ProtectedRoute>
                  } />
                  <Route path="vitals" element={
                    <ProtectedRoute allowedRoles={['NURSE', 'DOCTOR', 'ADMINISTRATOR']}>
                      <VitalSigns />
                    </ProtectedRoute>
                  } />
                  <Route path="reports" element={
                    <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                      <Reports />
                    </ProtectedRoute>
                  } />
                </Route>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<RoleDashboard />} />
                </Route>
                <Route path="/unauthorized" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                      <p className="text-gray-600">You don't have permission to access this page.</p>
                    </div>
                  </div>
                } />
                <Route path="permissions" element={
                  <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                    <PermissionsManagement />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </PermissionsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Role-based dashboard component
const RoleDashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ADMINISTRATOR':
      return <AdminDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'NURSE':
      return <NurseDashboard />;
    case 'RECEPTIONIST':
      return <ReceptionistDashboard />;
    case 'PHARMACIST':
      return <PharmacistDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default App;