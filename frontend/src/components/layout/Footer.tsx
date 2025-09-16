import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Shield, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">HMS</h3>
                <p className="text-sm text-blue-200">Hospital Management</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Comprehensive healthcare management system designed to streamline hospital operations and improve patient care.
            </p>
            <div className="flex space-x-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/app/patients')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Patient Care
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/app/patients')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Patient Management
              </button>
              <button
                onClick={() => navigate('/app/appointments')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Appointments
              </button>
              <button
                onClick={() => navigate('/app/records')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Medical Records
              </button>
              <button
                onClick={() => navigate('/app/billing')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Billing & Payments
              </button>
              <button
                onClick={() => navigate('/app/inventory')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Inventory
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/app/vitals')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Vital Signs Monitoring
              </button>
              <button
                onClick={() => navigate('/app/prescriptions')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Prescription Management
              </button>
              <button
                onClick={() => navigate('/app/staff')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Staff Management
              </button>
              <button
                onClick={() => navigate('/app/reports')}
                className="block text-slate-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Analytics & Reports
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">admin@hospital.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">123 Healthcare Ave, Medical City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 Hospital Management System. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <button className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                Privacy Policy
              </button>
              <button className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                Terms of Service
              </button>
              <button className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;