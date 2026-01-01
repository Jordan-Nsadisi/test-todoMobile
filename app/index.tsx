import { useAuthStore } from '@/src/store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function LandingScreen() {
   const { isAuthenticated, _hasHydrated } = useAuthStore();

   useEffect(() => {
      // Any initialization logic can be added here
   }, []);

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