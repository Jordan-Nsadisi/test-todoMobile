import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Button, Input } from '@/src/components/ui';
import { useLogin } from '@/src/hooks';
import type { LoginFormData } from '@/src/types';
import { Colors, Spacing, Typography } from '@/src/utils/designSystem';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   StyleSheet,
   View,
} from 'react-native';

export default function LoginScreen() {
   const loginMutation = useLogin();

   const {
      control,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm<LoginFormData>({
      mode: 'onChange',
      defaultValues: {
         email: '',
         password: '',
      },
   });

   const onSubmit = (data: LoginFormData) => {
      loginMutation.mutate(data);
   };

   return (
      <ThemedView style={styles.container}>
         <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         >
            <ScrollView
               contentContainerStyle={styles.scrollContent}
               keyboardShouldPersistTaps="handled"
               showsVerticalScrollIndicator={false}
            >
               {/* Header */}
               <View style={styles.header}>
                  <ThemedText type="title" style={styles.title}>
                     Connexion
                  </ThemedText>
                  <ThemedText style={styles.subtitle}>
                     Connectez-vous pour accéder à vos tâches
                  </ThemedText>
               </View>

               {/* Form */}
               <View style={styles.form}>
                  <Controller
                     control={control}
                     name="email"
                     rules={{
                        required: 'L\'email est requis',
                        pattern: {
                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                           message: 'Email invalide',
                        },
                     }}
                     render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                           label="Email"
                           placeholder="votre@email.com"
                           value={value}
                           onChangeText={onChange}
                           onBlur={onBlur}
                           error={errors.email?.message}
                           keyboardType="email-address"
                           autoCapitalize="none"
                           autoComplete="email"
                           required
                        />
                     )}
                  />

                  <Controller
                     control={control}
                     name="password"
                     rules={{
                        required: 'Le mot de passe est requis',
                        minLength: {
                           value: 6,
                           message: 'Minimum 6 caractères',
                        },
                     }}
                     render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                           label="Mot de passe"
                           placeholder="••••••••"
                           value={value}
                           onChangeText={onChange}
                           onBlur={onBlur}
                           error={errors.password?.message}
                           secureTextEntry
                           showPasswordToggle
                           autoComplete="password"
                           required
                        />
                     )}
                  />

                  <Button
                     onPress={handleSubmit(onSubmit)}
                     disabled={!isValid || loginMutation.isPending}
                     loading={loginMutation.isPending}
                     fullWidth
                     style={styles.loginButton}
                  >
                     Se connecter
                  </Button>
               </View>

               {/* Footer */}
               <View style={styles.footer}>
                  <ThemedText style={styles.footerText}>
                     Pas encore de compte ?{' '}
                     <Link href="/(auth)/register" style={styles.link}>
                        S'inscrire
                     </Link>
                  </ThemedText>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </ThemedView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.background,
   },

   keyboardView: {
      flex: 1,
   },

   scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing['4xl'],
   },

   header: {
      alignItems: 'center',
      marginBottom: Spacing['4xl'],
      gap: Spacing.xl,
   },

   title: {
      fontSize: Typography.fontSize['3xl'],
      fontWeight: Typography.fontWeight.bold,
      color: Colors.text,
      marginBottom: Spacing.sm,
   },

   subtitle: {
      fontSize: Typography.fontSize.base,
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: Typography.lineHeight.relaxed,
   },

   form: {
      marginBottom: Spacing['3xl'],
   },

   loginButton: {
      marginTop: Spacing.lg,
   },

   footer: {
      alignItems: 'center',
   },

   footerText: {
      fontSize: Typography.fontSize.sm,
      color: Colors.textSecondary,
   },

   link: {
      color: Colors.primary,
      fontWeight: Typography.fontWeight.medium,
   },
});