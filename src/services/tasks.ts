import type { Task, TaskFormData, TaskStatus } from '@/src/types';
import { API_ENDPOINTS } from '../utils/endpoint';
import { apiClient } from './api';

// Transformer les données du backend (snake_case) en camelCase
function transformTask(backendTask: any): Task {
   return {
      id: backendTask.id,
      title: backendTask.title,
      description: backendTask.description,
      status: backendTask.status,
      userId: backendTask.user_id,
      createdAt: backendTask.created_at,
      updatedAt: backendTask.updated_at,
   };
}

export const taskService = {

   async getTasks(userId: number): Promise<Task[]> {
      const response = await apiClient.get<{ tasks: any[] }>(`${API_ENDPOINTS.tasks.getByUser}${userId}`);
      return response.data.tasks.map(transformTask);
   },


   async createTask(taskData: TaskFormData): Promise<Task> {
      const response = await apiClient.post<any>(API_ENDPOINTS.tasks.create, taskData);
      return transformTask(response.data);
   },


   async updateTask(id: number, taskData: Partial<TaskFormData>): Promise<Task> {
      const response = await apiClient.put<any>(`${API_ENDPOINTS.tasks.update}${id}`, taskData);
      return transformTask(response.data);
   },


   async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
      const response = await apiClient.put<any>(`${API_ENDPOINTS.tasks.update}${id}`, { status });
      return transformTask(response.data);
   },

   async deleteTask(id: number): Promise<void> {
      await apiClient.delete(`${API_ENDPOINTS.tasks.delete}${id}`);
   },
};