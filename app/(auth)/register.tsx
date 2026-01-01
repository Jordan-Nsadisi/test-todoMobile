import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Button, Input } from '@/src/components/ui';
import { useRegister } from '@/src/hooks';
import type { RegisterFormData } from '@/src/types';
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

export default function RegisterScreen() {
   const registerMutation = useRegister();

   const {
      control,
      handleSubmit,
      watch,
      formState: { errors, isValid },
   } = useForm<RegisterFormData>({
      mode: 'onChange',
      defaultValues: {
         firstName: '',
         lastName: '',
         email: '',
         password: '',
         confirmPassword: '',
      },
   });

   const password = watch('password');

   const onSubmit = (data: RegisterFormData) => {
      registerMutation.mutate(data);
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
                     Créer un compte
                  </ThemedText>
                  <ThemedText style={styles.subtitle}>
                     Rejoignez-nous pour organiser vos tâches
                  </ThemedText>
               </View>

               {/* Form */}
               <View style={styles.form}>
                  <View style={styles.nameRow}>
                     <Controller
                        control={control}
                        name="firstName"
                        rules={{
                           required: 'Le prénom est requis',
                           minLength: {
                              value: 2,
                              message: 'Minimum 2 caractères',
                           },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                           <View style={styles.nameInput}>
                              <Input
                                 label="Prénom"
                                 placeholder="John"
                                 value={value}
                                 onChangeText={onChange}
                                 onBlur={onBlur}
                                 error={errors.firstName?.message}
                                 autoComplete="given-name"
                                 required
                              />
                           </View>
                        )}
                     />

                     <Controller
                        control={control}
                        name="lastName"
                        rules={{
                           required: 'Le nom est requis',
                           minLength: {
                              value: 2,
                              message: 'Minimum 2 caractères',
                           },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                           <View style={styles.nameInput}>
                              <Input
                                 label="Nom"
                                 placeholder="Doe"
                                 value={value}
                                 onChangeText={onChange}
                                 onBlur={onBlur}
                                 error={errors.lastName?.message}
                                 autoComplete="family-name"
                                 required
                              />
                           </View>
                        )}
                     />
                  </View>

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
                           value: 8,
                           message: 'Minimum 8 caractères',
                        },
                        pattern: {
                           value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                           message: 'Doit contenir minuscule, majuscule et chiffre',
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
                           autoComplete="new-password"
                           hint="8 caractères min, avec majuscule, minuscule et chiffre"
                           required
                        />
                     )}
                  />

                  <Controller
                     control={control}
                     name="confirmPassword"
                     rules={{
                        required: 'Confirmez votre mot de passe',
                        validate: (value) =>
                           value === password || 'Les mots de passe ne correspondent pas',
                     }}
                     render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                           label="Confirmer le mot de passe"
                           placeholder="••••••••"
                           value={value}
                           onChangeText={onChange}
                           onBlur={onBlur}
                           error={errors.confirmPassword?.message}
                           secureTextEntry
                           showPasswordToggle
                           autoComplete="new-password"
                           required
                        />
                     )}
                  />

                  <Button
                     onPress={handleSubmit(onSubmit)}
                     disabled={!isValid || registerMutation.isPending}
                     loading={registerMutation.isPending}
                     fullWidth
                     style={styles.registerButton}
                  >
                     Créer mon compte
                  </Button>
               </View>

               {/* Footer */}
               <View style={styles.footer}>
                  <ThemedText style={styles.footerText}>
                     Déjà un compte ?{' '}
                     <Link href="/(auth)/login" style={styles.link}>
                        Se connecter
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
      marginBottom: Spacing['3xl'],
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
      marginBottom: Spacing['2xl'],
   },

   nameRow: {
      flexDirection: 'row',
      gap: Spacing.md,
   },

   nameInput: {
      flex: 1,
   },

   registerButton: {
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