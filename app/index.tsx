import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// TODO: Import auth store when implemented
// import { useAuthStore } from '@/store';

export default function LandingScreen() {
   // TODO: Add auth state management
   // const { isAuthenticated, _hasHydrated } = useAuthStore();

   // Temporary - will be replaced with real auth logic
   const isAuthenticated = false;
   const _hasHydrated = true;

   useEffect(() => {
      // TODO: Add any initialization logic here
   }, []);

   // Show loading while hydrating
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