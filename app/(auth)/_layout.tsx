import { useProtectedRoute } from '@/src/hooks';
import { Stack } from 'expo-router';

export default function AuthLayout() {
   //auto protection des routes
   useProtectedRoute();

   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="login" />
         <Stack.Screen name="register" />
      </Stack>
   );
}