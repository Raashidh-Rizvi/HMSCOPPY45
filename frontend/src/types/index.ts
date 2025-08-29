export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'ADMINISTRATOR' | 'PHARMACIST';
  name: string;
  email: string;
  phone?: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  registrationDate: string;
}

export interface Appointment {
  id: number;
  patient: Patient;
  doctor: User;
  appointmentDateTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface PatientRecord {
  id: number;
  patient: Patient;
  doctor: User;
  diagnosis: string;
  treatmentPlan: string;
  recordDate: string;
}

export interface MedicationPrescription {
  id: number;
  patient: Patient;
  doctor: User;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

export interface VitalSignsLog {
  id: number;
  nurse: User;
  patient: Patient;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  logDateTime: string;
}

export interface InventoryItem {
  id: number;
  itemName: string;
  quantityAvailable: number;
  reorderLevel: number;
  lastRestockDate: string;
}

export interface RestockOrder {
  id: number;
  inventoryItem: InventoryItem;
  quantityOrdered: number;
  orderDate: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface Billing {
  id: number;
  patient: Patient;
  amount: number;
  billingDate: string;
  status: 'PAID' | 'UNPAID';
}

export interface HospitalMetric {
  id: number;
  metricName: string;
  value: number;
  lastUpdated: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: User['role'];
  name: string;
  email: string;
  token: string;
}