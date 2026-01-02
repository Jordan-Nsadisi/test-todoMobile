import { useAuthStore } from '@/src/store';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

/**
 * Hook de redirection automatique - surveille les routes et redirige selon l'état d'authentification
 * hook pour la protection automatique des routes
 * redirige automatiquement selon l'état d'authentification
 */
export function useProtectedRoute() {
   const { isAuthenticated, _hasHydrated } = useAuthStore();
   const segments = useSegments();
   const router = useRouter();

   useEffect(() => {

      if (!_hasHydrated) return;

      const inAuthGroup = segments[0] === '(auth)';
      const inTabsGroup = segments[0] === '(tabs)';

      console.log('verification des routes protects:', {
         isAuthenticated,
         segments,
         inAuthGroup,
         inTabsGroup,
      });

      if (!isAuthenticated && inTabsGroup) {
         router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
         router.replace('/(tabs)');
      }
   }, [isAuthenticated, segments, router, _hasHydrated]);
}