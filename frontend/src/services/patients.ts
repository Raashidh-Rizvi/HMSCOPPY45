import api from './api';
import { Patient } from '@/types';

export const patientService = {
  getAll: () => api.get<Patient[]>('/patients'),
  getById: (id: number) => api.get<Patient>(`/patients/${id}`),
  create: (patient: Omit<Patient, 'id'>) => api.post<Patient>('/patients', patient),
  update: (id: number, patient: Partial<Patient>) => api.put<Patient>(`/patients/${id}`, patient),
  delete: (id: number) => api.delete(`/patients/${id}`),
};