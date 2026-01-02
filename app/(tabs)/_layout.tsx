import { Tabs, Redirect } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Colors } from '@/src/utils/designSystem';
import { useAuthStore } from '@/src/store';
import { useProtectedRoute } from '@/src/hooks';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  //auto protection des routes
  useProtectedRoute();

  if (_hasHydrated && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false, //masquer les en-têtes pour les onglets
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.borderLight,
        },
      }}>
      <Tabs.Screen //différents écrans
        name="index"
        options={{
          title: 'Mes Tâches',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checklist" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Cache l'ancien onglet explore
        }}
      />
    </Tabs>
  );
}