import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Button } from '@/src/components/ui';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { useLogout } from '@/src/hooks';
import { useAuthStore } from '@/src/store';
import { BorderRadius, Colors, Spacing, Typography } from '@/src/utils/designSystem';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
   const { user, clearAuth } = useAuthStore();
   const logoutMutation = useLogout();

   const handleLogout = () => {
      Alert.alert(
         'Déconnexion',
         'Êtes-vous sûr de vouloir vous déconnecter ?',
         [
            { text: 'Annuler', style: 'cancel' },
            {
               text: 'Déconnecter',
               style: 'destructive',
               onPress: () => {
                  logoutMutation.mutate();
               },
            },
         ]
      );
   };

   const ProfileCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
      <View style={styles.card}>
         <View style={styles.cardContent}>
            <IconSymbol name={icon} size={24} color={Colors.primary} />
            <View style={styles.cardText}>
               <Text style={styles.cardTitle}>{title}</Text>
               <Text style={styles.cardValue}>{value}</Text>
            </View>
         </View>
      </View>
   );

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <ThemedView style={styles.header}>
               <ThemedText type="title">Mon Profil</ThemedText>
               <Text style={styles.subtitle}>Gérez vos informations personnelles</Text>
            </ThemedView>

            {/* User Info Cards */}
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Informations</Text>

               <ProfileCard
                  title="Nom d'utilisateur"
                  value={user?.firstName || 'Non défini'}
                  icon="person.fill"
               />

               <ProfileCard
                  title="Email"
                  value={user?.email || 'Non défini'}
                  icon="envelope.fill"
               />

               <ProfileCard
                  title="Membre depuis"
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                  }) : 'Non disponible'}
                  icon="calendar"
               />
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Application</Text>

               <View style={styles.card}>
                  <TouchableOpacity style={styles.cardContent}>
                     <IconSymbol name="info.circle" size={24} color={Colors.info} />
                     <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>À propos</Text>
                        <Text style={styles.cardSubtitle}>Version 1.0.0</Text>
                     </View>
                     <IconSymbol name="chevron.right" size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
               </View>

               <View style={styles.card}>
                  <TouchableOpacity style={styles.cardContent}>
                     <IconSymbol name="questionmark.circle" size={24} color={Colors.warning} />
                     <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Aide & Support</Text>
                        <Text style={styles.cardSubtitle}>Besoin d'aide ?</Text>
                     </View>
                     <IconSymbol name="chevron.right" size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Actions</Text>

               <Button
                  variant="outline"
                  onPress={handleLogout}
                  disabled={logoutMutation.isPending}
                  loading={logoutMutation.isPending}
                  style={styles.logoutButton}
               >
                  <View style={styles.logoutContent}>
                     <IconSymbol name="arrow.right.square" size={20} color={Colors.error} />
                     <Text style={styles.logoutText}>Se déconnecter</Text>
                  </View>
               </Button>
            </View>

            {/* info app */}
            <View style={styles.footer}>
               <Text style={styles.footerText}>TodoApp Mobile</Text>
               <Text style={styles.footerText}>© 2026 - Tous droits réservés</Text>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.background,
   },

   scrollContent: {
      paddingBottom: Spacing.xl,
   },

   header: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderLight,
   },

   subtitle: {
      fontSize: Typography.fontSize.base,
      color: Colors.textSecondary,
      marginTop: Spacing.sm,
   },

   section: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.lg,
   },

   sectionTitle: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semibold,
      color: Colors.text,
      marginBottom: Spacing.md,
   },

   card: {
      backgroundColor: Colors.background,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: Spacing.md,
      overflow: 'hidden',
   },

   cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
   },

   cardText: {
      flex: 1,
      marginLeft: Spacing.md,
   },

   cardTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.medium,
      color: Colors.text,
   },

   cardValue: {
      fontSize: Typography.fontSize.sm,
      color: Colors.textSecondary,
      marginTop: Spacing.xs,
   },

   cardSubtitle: {
      fontSize: Typography.fontSize.sm,
      color: Colors.textMuted,
      marginTop: Spacing.xs,
   },

   logoutButton: {
      borderColor: Colors.errorLight,
      backgroundColor: Colors.errorLight,
   },

   logoutContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
   },

   logoutText: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.medium,
      color: Colors.error,
   },

   footer: {
      alignItems: 'center',
      marginTop: Spacing.xl,
      paddingHorizontal: Spacing.lg,
      gap: Spacing.xs,
   },

   footerText: {
      fontSize: Typography.fontSize.xs,
      color: Colors.textMuted,
      textAlign: 'center',
   },
});