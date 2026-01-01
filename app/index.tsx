import { useAuthStore } from '@/src/store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LandingScreen() {
   const { isAuthenticated, _hasHydrated, setHasHydrated } = useAuthStore();

   useEffect(() => {
      console.log('LandingScreen - hasHydrated:', _hasHydrated, 'isAuthenticated:', isAuthenticated);

      // Fallback: forcer l'hydratation après 3 secondes si elle n'a pas eu lieu
      const timeout = setTimeout(() => {
         if (!_hasHydrated) {
            console.log('Forcing hydration after timeout');
            setHasHydrated();
         }
      }, 3000);

      return () => clearTimeout(timeout);
   }, [_hasHydrated, setHasHydrated, isAuthenticated]);

   // Show loading while hydrating from AsyncStorage
   if (!_hasHydrated) {
      return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3B82F6" />
         </View>
      );
   }

   // Redirect based on auth status
   if (isAuthenticated) {
      return <Redirect href="/(tabs)/dashboard" />;
   }

   return <Redirect href="/(auth)/login" />;
}