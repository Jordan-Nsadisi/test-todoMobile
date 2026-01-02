import { useAuthStore } from '@/src/store';
import { Colors, Typography } from '@/src/utils/designSystem';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LandingScreen() {
   const { isAuthenticated, _hasHydrated, setHasHydrated } = useAuthStore();

   useEffect(() => {
      console.log('LandingScreen - hasHydrated:', _hasHydrated, 'isAuthenticated:', isAuthenticated);

      // Fallback d'hydratation plus rapide
      const timeout = setTimeout(() => {
         if (!_hasHydrated) {
            // console.log('force hydratation après timeout');
            setHasHydrated();
         }
      }, 1500);

      return () => clearTimeout(timeout);
   }, [_hasHydrated, setHasHydrated]);

   //ecran de chargement
   if (!_hasHydrated) {
      return (
         <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
         </View>
      );
   }

   // Redirection intelligente selon l'état d'auth
   if (isAuthenticated) {
      // console.log('user authentifier, redirection au dashbord');
      return <Redirect href="/(tabs)" />;
   }

   // console.log('user non authentifier, redirection au login');
   return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
      gap: 16,
   },
   loadingText: {
      fontSize: Typography.fontSize.base,
      color: Colors.textSecondary,
      fontWeight: Typography.fontWeight.medium,
   },
});