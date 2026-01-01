import { authService } from '@/src/services/auth';
import { queryKeys } from '@/src/services/queryClient';
import { useAuthStore } from '@/src/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';


export const useLogin = () => {
   const { setAuth, setLoading } = useAuthStore();

   return useMutation({
      mutationFn: authService.login,
      onMutate: () => {
         setLoading(true);
      },
      onSuccess: (data) => {
         setAuth(data.user, data.access_token);
         Toast.show({
            type: 'success',
            text1: 'Connexion réussie',
            text2: `Bienvenue ${data.user.firstName} !`,
         });
      },
      onError: (error: any) => {
         setLoading(false);
         Toast.show({
            type: 'error',
            text1: 'Erreur de connexion',
            text2: error.message,
         });
      },
   });
};


export const useRegister = () => {
   const { setAuth, setLoading } = useAuthStore();

   return useMutation({
      mutationFn: authService.register,
      onMutate: () => {
         setLoading(true);
      },
      onSuccess: (data) => {
         setAuth(data.user, data.access_token);
         Toast.show({
            type: 'success',
            text1: 'Compte créé',
            text2: `Bienvenue ${data.user.firstName} !`,
         });
      },
      onError: (error: any) => {
         setLoading(false);
         Toast.show({
            type: 'error',
            text1: 'Erreur d\'inscription',
            text2: error.message,
         });
      },
   });
};


export const useLogout = () => {
   const { clearAuth } = useAuthStore();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: authService.logout,
      onSuccess: () => {
         clearAuth();
         queryClient.clear(); //efface le cache de react query
         Toast.show({
            type: 'info',
            text1: 'Déconnexion',
            text2: 'À bientôt !',
         });
      },
      onError: () => {
         clearAuth();
         queryClient.clear();
      },
   });
};


// export const useCurrentUser = () => {
//    const { isAuthenticated, token } = useAuthStore();

//    return useQuery({
//       queryKey: queryKeys.auth.user,
//       queryFn: authService.getCurrentUser,
//       enabled: isAuthenticated && !!token,
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       retry: false, // Don't retry on 401
//    });
// };