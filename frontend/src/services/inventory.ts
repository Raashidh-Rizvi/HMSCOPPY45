import api from './api';
import { InventoryItem, RestockOrder } from '@/types';

export const inventoryService = {
  getAll: () => api.get<InventoryItem[]>('/inventory'),
  getById: (id: number) => api.get<InventoryItem>(`/inventory/${id}`),
  create: (item: Omit<InventoryItem, 'id'>) => api.post<InventoryItem>('/inventory', item),
  update: (id: number, item: Partial<InventoryItem>) => api.put<InventoryItem>(`/inventory/${id}`, item),
  delete: (id: number) => api.delete(`/inventory/${id}`),
};

export const restockService = {
  getAll: () => api.get<RestockOrder[]>('/restock-orders'),
  getById: (id: number) => api.get<RestockOrder>(`/restock-orders/${id}`),
  getByStatus: (status: string) => api.get<RestockOrder[]>(`/restock-orders/status/${status}`),
  create: (order: Omit<RestockOrder, 'id'>) => api.post<RestockOrder>('/restock-orders', order),
  update: (id: number, order: Partial<RestockOrder>) => api.put<RestockOrder>(`/restock-orders/${id}`, order),
  delete: (id: number) => api.delete(`/restock-orders/${id}`),
};