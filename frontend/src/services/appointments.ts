import api from './api';
import { Appointment } from '@/types';



export const appointmentService = {
  getAll: () => api.get<Appointment[]>('/appointments'),
  getById: (id: number) => api.get<Appointment>(`/appointments/${id}`),
  getByDoctor: (doctorId: number) => api.get<Appointment[]>(`/appointments/doctor/${doctorId}`),
  getByPatient: (patientId: number) => api.get<Appointment[]>(`/appointments/patient/${patientId}`),
  create: (appointment: Omit<Appointment, 'id'>) => api.post<Appointment>('/appointments', appointment),
  update: (id: number, appointment: Partial<Appointment>) => api.put<Appointment>(`/appointments/${id}`, appointment),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};