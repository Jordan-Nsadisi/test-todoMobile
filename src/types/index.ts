// TypeScript types exports

// Auth types (to be implemented)
export interface User {
   id: number;
   firstName: string;
   lastName: string;
   email: string;
   createdAt: string;
   updatedAt: string;
}

// Task types (to be implemented)
export type TaskStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

export interface Task {
   id: number;
   title: string;
   description: string;
   status: TaskStatus;
   userId: number;
   createdAt: string;
   updatedAt: string;
}

// API Response types (to be implemented)
export interface AuthResponse {
   access_token: string;
   user: User;
}

export interface TasksResponse {
   tasks: Task[];
}

// Form types (to be implemented)
export interface LoginFormData {
   email: string;
   password: string;
}

export interface RegisterFormData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   confirmPassword: string;
}

export interface TaskFormData {
   title: string;
   description: string;
}