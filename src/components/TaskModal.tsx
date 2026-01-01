import { Button, Input, Modal } from '@/src/components/ui';
import { useCreateTask, useUpdateTask } from '@/src/hooks';
import type { Task, TaskFormData } from '@/src/types';
import { Colors, Spacing, Typography } from '@/src/utils/designSystem';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
   KeyboardAvoidingView,
   Platform,
   StyleSheet,
   Text,
   View,
} from 'react-native';

interface TaskModalProps {
   isVisible: boolean;
   onClose: () => void;
   task?: Task | null; // null = create mode, Task = edit mode
}

export function TaskModal({ isVisible, onClose, task }: TaskModalProps) {
   const isEditMode = !!task;
   const createTaskMutation = useCreateTask();
   const updateTaskMutation = useUpdateTask();

   const {
      control,
      handleSubmit,
      reset,
      watch,
      formState: { errors, isValid, isDirty },
   } = useForm<TaskFormData>({
      mode: 'onChange',
      defaultValues: {
         title: '',
         description: '',
      },
   });

   const titleValue = watch('title');
   const titleLength = titleValue?.length || 0;
   const maxTitleLength = 25;

   // Reset form when modal opens/closes or task changes
   useEffect(() => {
      if (isVisible) {
         if (task) {
            reset({
               title: task.title,
               description: task.description,
            });
         } else {
            reset({
               title: '',
               description: '',
            });
         }
      }
   }, [isVisible, task, reset]);

   const onSubmit = async (data: TaskFormData) => {
      try {
         if (isEditMode && task) {
            await updateTaskMutation.mutateAsync({
               id: task.id,
               data: {
                  title: data.title,
                  description: data.description,
               }
            });
         } else {
            await createTaskMutation.mutateAsync(data);
         }
         onClose();
      } catch (error) {
         // Error handling is done in the hooks with toasts
         console.error('Task mutation error:', error);
      }
   };

   const handleClose = () => {
      if (isDirty) {
         // TODO: Add confirmation dialog for unsaved changes
      }
      onClose();
   };

   const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

   return (
      <Modal
         isVisible={isVisible}
         onClose={handleClose}
         title={isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche'}
         maxHeight={Platform.OS === 'ios' ? 600 : 500}
      >
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
         >
            {/* Title Input with Counter */}
            <Controller
               control={control}
               name="title"
               rules={{
                  required: 'Le titre est requis',
                  maxLength: {
                     value: maxTitleLength,
                     message: `Maximum ${maxTitleLength} caractères`,
                  },
                  minLength: {
                     value: 3,
                     message: 'Minimum 3 caractères',
                  },
               }}
               render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                     <Input
                        label="Titre"
                        placeholder="Que devez-vous faire ?"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.title?.message}
                        required
                        maxLength={maxTitleLength}
                     />
                     <View style={styles.counterContainer}>
                        <Text style={[
                           styles.counter,
                           titleLength > maxTitleLength * 0.8 && styles.counterWarning,
                           titleLength >= maxTitleLength && styles.counterError,
                        ]}>
                           {titleLength}/{maxTitleLength}
                        </Text>
                     </View>
                  </View>
               )}
            />

            {/* Description Input */}
            <Controller
               control={control}
               name="description"
               rules={{
                  maxLength: {
                     value: 500,
                     message: 'Maximum 500 caractères',
                  },
               }}
               render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                     label="Description"
                     placeholder="Ajoutez une description (optionnel)"
                     value={value}
                     onChangeText={onChange}
                     onBlur={onBlur}
                     error={errors.description?.message}
                     multiline
                     numberOfLines={4}
                     style={styles.textArea}
                     hint="Décrivez votre tâche en détail"
                  />
               )}
            />

            {/* Edit Mode Info */}
            {isEditMode && task && (
               <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Statut actuel :</Text>
                  <Text style={[
                     styles.infoValue,
                     task.status === 'COMPLETED' && styles.statusCompleted,
                     task.status === 'CANCELED' && styles.statusCanceled,
                  ]}>
                     {task.status === 'PENDING' && 'En attente'}
                     {task.status === 'COMPLETED' && 'Terminée'}
                     {task.status === 'CANCELED' && 'Annulée'}
                  </Text>
               </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
               <Button
                  variant="outline"
                  onPress={handleClose}
                  disabled={isLoading}
                  style={styles.button}
               >
                  Annuler
               </Button>

               <Button
                  variant="primary"
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                  style={styles.button}
               >
                  {isEditMode ? 'Sauvegarder' : 'Créer'}
               </Button>
            </View>
         </KeyboardAvoidingView>
      </Modal>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingVertical: Spacing.md,
   },

   inputContainer: {
      marginBottom: Spacing.lg,
   },

   counterContainer: {
      alignItems: 'flex-end',
      marginTop: -Spacing.sm,
   },

   counter: {
      fontSize: Typography.fontSize.xs,
      color: Colors.textMuted,
   },

   counterWarning: {
      color: Colors.warning,
   },

   counterError: {
      color: Colors.error,
   },

   textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
   },

   infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      backgroundColor: Colors.backgroundSecondary,
      borderRadius: 8,
      marginBottom: Spacing.lg,
   },

   infoLabel: {
      fontSize: Typography.fontSize.sm,
      color: Colors.textSecondary,
      marginRight: Spacing.sm,
   },

   infoValue: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      color: Colors.text,
   },

   statusCompleted: {
      color: Colors.success,
   },

   statusCanceled: {
      color: Colors.error,
   },

   actions: {
      flexDirection: 'row',
      gap: Spacing.md,
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: Colors.borderLight,
   },

   button: {
      flex: 1,
   },
});