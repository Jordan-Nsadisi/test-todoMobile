import type {
   AuthResponse,
   LoginFormData,
   RegisterFormData,
   User
} from '@/src/types';
import { API_ENDPOINTS } from '../utils/endpoint';
import { apiClient } from './api';


export const authService = {

   async login(credentials: LoginFormData): Promise<AuthResponse> {
      const response = await apiClient.post<AuthResponse>(
         API_ENDPOINTS.auth.login,
         credentials
      );
      return response.data;
   },

   async register(userData: RegisterFormData): Promise<AuthResponse> {
      const { confirmPassword, ...otherData } = userData;
      const registerData = {
         ...otherData,
         password_confirmation: confirmPassword,
      };

      const response = await apiClient.post<AuthResponse>(
         API_ENDPOINTS.auth.register,
         registerData
      );
      return response.data;
   },

   async logout(): Promise<void> {
      await apiClient.post(API_ENDPOINTS.auth.logout);
   },

   async getCurrentUser(): Promise<User> {
      const response = await apiClient.get<User>(API_ENDPOINTS.auth.getUser);
      return response.data;
   },

   //pour rafraichir le token au besoin de l'authentification
   async refreshToken(): Promise<AuthResponse> {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      return response.data;
   },
};