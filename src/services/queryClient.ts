import { QueryClient } from '@tanstack/react-query';

// Configuration React Query
export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 5 * 60 * 1000,
         gcTime: 10 * 60 * 1000,
         retry: (failureCount, error) => {
            if (error && typeof error === 'object' && 'status' in error) {
               const status = (error as any).status;
               if (status >= 400 && status < 500) {
                  return false;
               }
            }
            
            return failureCount < 2; //pour les autres erreurs, retry 2 fois
         },

         refetchOnWindowFocus: false,

         refetchOnReconnect: true,
      },
      mutations: {
         //retry sur erreur réseau uniquement
         retry: (failureCount, error) => {
            if (error && typeof error === 'object' && 'status' in error) {
               const status = (error as any).status;
               // Ne jamais retry les erreurs client
               if (status >= 400) {
                  return false;
               }
            }
            return failureCount < 1;
         },
      },
   },
});

// auery keys pour organisation
export const queryKeys = {
   auth: {
      user: ['auth', 'user'] as const,
   },
   tasks: {
      all: ['tasks'] as const,
      byUser: (userId: number) => ['tasks', 'user', userId] as const,
      detail: (id: number) => ['tasks', id] as const,
   },
} as const;