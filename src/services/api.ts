import { useAuthStore } from '@/src/store';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API configuration
const API_BASE_URL = 'http://localhost:8000/api'; // TODO: Move to env config

//ajout de l'instance axios
export const apiClient: AxiosInstance = axios.create({
   baseURL: API_BASE_URL,
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
   },
});

//ajout des intercepteurs pour gérer l'authentification et les erreurs
apiClient.interceptors.request.use(
   (config: AxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token && config.headers) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

//intercepteur de réponse pour gérer les erreurs globales
apiClient.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      //401 non autorisé - token invalide ou expiré
      if (error.response?.status === 401) {
         useAuthStore.getState().clearAuth();
      }

      // Format error for better handling
      const formattedError = {
         message: error.response?.data?.message || error.message || 'Une erreur est survenue',
         status: error.response?.status,
         data: error.response?.data,
      };

      return Promise.reject(formattedError);
   }
);