import type { Task, TaskFormData, TaskStatus } from '@/src/types';
import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/endpoint';

// Task API service functions
export const taskService = {

   async getTasks(userId: number): Promise<Task[]> {
      const response = await apiClient.get<{ tasks: Task[] }>(`${API_ENDPOINTS.tasks.getByUser}${userId}`);
      return response.data.tasks;
   },


   async createTask(taskData: TaskFormData): Promise<Task> {
      const response = await apiClient.post<Task>(API_ENDPOINTS.tasks.create, taskData);
      return response.data;
   },


   async updateTask(id: number, taskData: Partial<TaskFormData>): Promise<Task> {
      const response = await apiClient.put<Task>(`${API_ENDPOINTS.tasks.update}${id}`, taskData);
      return response.data;
   },


   async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
      const response = await apiClient.put<Task>(`${API_ENDPOINTS.tasks.update}${id}`, { status });
      return response.data;
   },

   async deleteTask(id: number): Promise<void> {
      await apiClient.delete(`${API_ENDPOINTS.tasks.delete}${id}`);
   },
};