import type { User } from '@/src/types';
import { create } from 'zustand';

export interface AuthState {
   // State
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   _hasHydrated: boolean;

   // Actions
   setUser: (user: User | null) => void;
   setToken: (token: string) => void;
   setAuth: (user: User, token: string) => void;
   clearAuth: () => void;
   setLoading: (loading: boolean) => void;
   setHasHydrated: () => void;
}

// Version temporaire sans persistance pour tester
export const useAuthStore = create<AuthState>()((set, get) => ({
   // Initial state - toujours hydraté pour test
   user: null,
   token: null,
   isAuthenticated: false,
   isLoading: false,
   _hasHydrated: true, // TOUJOURS TRUE pour test sans AsyncStorage

   // Actions
   setUser: (user: User | null) => {
      set({
         user,
         isAuthenticated: !!user,
      });
   },

   setToken: (token: string) => {
      set({
         token,
         isAuthenticated: !!token,
      });
   },

   setAuth: (user: User, token: string) => {
      set({
         user,
         token,
         isAuthenticated: true,
         isLoading: false,
      });
   },

   clearAuth: () => {
      set({
         user: null,
         token: null,
         isAuthenticated: false,
         isLoading: false,
      });
   },

   setLoading: (loading: boolean) => {
      set({ isLoading: loading });
   },

   setHasHydrated: () => {
      set({ _hasHydrated: true });
   },
}));