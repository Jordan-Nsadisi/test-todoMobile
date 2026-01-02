import { useAuthStore } from '@/src/store';
import { Colors } from '@/src/utils/designSystem';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface AuthGuardProps {
   children: React.ReactNode;
   fallback?: React.ReactNode;
}

/**
 * Composant de protection par affichage conditionnel - cache/affiche le contenu selon l'authentification
 * composant de protection d'authentification
 * affiche le contenu uniquement si l'utilisateur est authentifié
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
   const { isAuthenticated, _hasHydrated } = useAuthStore();

   //ecran de chargement pendant l'hydratation
   if (!_hasHydrated) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
         </View>
      );
   }

   //contenu protégé ou fallback
   if (!isAuthenticated) {
      return fallback ? <>{fallback}</> : null;
   }

   return <>{children}</>;
}

const styles = StyleSheet.create({
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.background,
   },
});