import { router } from 'expo-router';

//utilitaires de navigation

export const NavigationHelper = {

   toLogin: () => {
      router.replace('/(auth)/login');
   },

   toRegister: () => {
      router.push('/(auth)/register');
   },


   toDashboard: () => {
      router.replace('/(tabs)');
   },

   /**
    * Navigue vers l'écran de profil
    */
   toProfile: () => {
      router.push('/(tabs)/profile');
   },

   /**
    * Ouvre la modal de création de tâche
    */
   toTaskModal: () => {
      router.push('/modal');
   },

   /**
    * Ferme la modal et retourne à l'écran précédent
    */
   goBack: () => {
      if (router.canGoBack()) {
         router.back();
      } else {
         router.replace('/(tabs)');
      }
   },

   /**
    * Déconnexion avec redirection vers login
    */
   logout: () => {
      router.replace('/(auth)/login');
   },

   /**
    * Vérifie si on peut revenir en arrière
    */
   canGoBack: () => {
      return router.canGoBack();
   },
};

/**
 * Types des routes de l'application
 */
export type AppRoutes = {
   '/(auth)/login': undefined;
   '/(auth)/register': undefined;
   '/(tabs)': undefined;
   '/(tabs)/profile': undefined;
   '/modal': { taskId?: string };
};

/**
 * Constantes des routes
 */
export const ROUTES = {
   // Auth routes
   LOGIN: '/(auth)/login' as const,
   REGISTER: '/(auth)/register' as const,

   // Protected routes
   DASHBOARD: '/(tabs)' as const,
   PROFILE: '/(tabs)/profile' as const,

   // Modal routes
   TASK_MODAL: '/modal' as const,
} as const;