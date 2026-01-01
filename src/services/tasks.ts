import type { Task, TaskFormData, TaskStatus } from '@/src/types';
import { apiClient } from './api';
import { API_ENDPOINTS } from '../utils/endpoint';

// Task API service functions
export const taskService = {
   /**
    * Get all tasks for current user
    */
   async getTasks(): Promise<Task[]> {
      const response = await apiClient.get<{ tasks: Task[] }>(API_ENDPOINTS.tasks.getAll);
      return response.data.tasks;
   },

   /**
    * Create new task
    */
   async createTask(taskData: TaskFormData): Promise<Task> {
      const response = await apiClient.post<Task>(API_ENDPOINTS.tasks.create, taskData);
      return response.data;
   },

   /**
    * Update existing task
    */
   async updateTask(id: number, taskData: Partial<TaskFormData>): Promise<Task> {
      const response = await apiClient.put<Task>(`${API_ENDPOINTS.tasks.update}${id}`, taskData);
      return response.data;
   },

   /**
    * Update task status only
    */
   async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
      const response = await apiClient.put<Task>(`${API_ENDPOINTS.tasks.update}${id}`, { status });
      return response.data;
   },

   /**
    * Delete task
    */
   async deleteTask(id: number): Promise<void> {
      await apiClient.delete(`${API_ENDPOINTS.tasks.delete}${id}`);
   },

   /**
    * Get single task by ID (if needed)
    */
   async getTask(id: number): Promise<Task> {
      const response = await apiClient.get<Task>(`${API_ENDPOINTS.tasks.getAll}/${id}`);
      return response.data;
   },
};