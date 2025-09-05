import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-navy-100 dark:from-navy-900 dark:to-navy-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-navy-900 dark:text-white">
              Hospital Management System
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-navy-900/95">

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-navy-900 to-teal-600 bg-clip-text text-transparent dark:from-white dark:to-teal-400">

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-800/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">Demo Credentials:</p>
                <div className="grid grid-cols-1 gap-2 text-xs space-y-1">
                  <div className="p-2 bg-white dark:bg-navy-700 rounded border">
                    <strong>Admin:</strong> admin / admin
                  </div>
                  <div className="p-2 bg-white dark:bg-navy-700 rounded border">
                    <strong>Doctor:</strong> doctor / doctor
                  </div>
                  <div className="p-2 bg-white dark:bg-navy-700 rounded border">
                    <strong>Nurse:</strong> nurse / nurse
                  </div>
                  <div className="p-2 bg-white dark:bg-navy-700 rounded border">
                    <strong>Receptionist:</strong> reception / reception
                  </div>
                  <div className="p-2 bg-white dark:bg-navy-700 rounded border">
                    <strong>Pharmacist:</strong> pharmacist / pharmacist
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;