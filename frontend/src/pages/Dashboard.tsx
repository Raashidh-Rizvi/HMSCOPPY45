import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import NurseDashboard from './NurseDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import PharmacistDashboard from './PharmacistDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
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

export default Dashboard;