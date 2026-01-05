import { ConfirmModal } from '@/src/components/ConfirmModal';
import { Badge, Card } from '@/src/components/ui';
import { useDeleteTask, useUpdateTaskStatus } from '@/src/hooks';
import type { Task, TaskStatus } from '@/src/types';
import { BorderRadius, Colors, Spacing, Typography } from '@/src/utils/designSystem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native';

interface TaskCardProps {
   task: Task;
   onEdit: (task: Task) => void;
   onPress?: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onPress }: TaskCardProps) {
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const updateStatusMutation = useUpdateTaskStatus();
   const deleteTaskMutation = useDeleteTask();

   const statusConfig = {
      PENDING: {
         label: 'En attente',
         variant: 'warning' as const,
         color: Colors.pending
      },
      COMPLETED: {
         label: 'Terminée',
         variant: 'success' as const,
         color: Colors.completed
      },
      CANCELED: {
         label: 'Annulée',
         variant: 'error' as const,
         color: Colors.canceled
      },
   };

   const handleStatusChange = (newStatus: TaskStatus) => {
      updateStatusMutation.mutate({ id: task.id, status: newStatus });
   };

   const handleDeleteClick = () => {
      setShowDeleteConfirm(true);
   };

   const handleConfirmDelete = () => {
      deleteTaskMutation.mutate(task.id);
   };

   const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return 'Date non disponible';

      try {
         const date = new Date(dateString);

         //vérifier si la date est valide
         if (isNaN(date.getTime())) {
            return 'Date invalide';
         }

         return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
         }).format(date);
      } catch (error) {
         console.error('Error formatting date:', error, dateString);
         return 'Date invalide';
      }
   };

   return (
      <Card
         pressable={!!onPress}
         onPress={onPress ? () => onPress(task) : undefined}
         style={styles.card}
         padding="lg"
         margin="sm"
      >
         {/* header avec titre et staus */}
         <View style={styles.header}>
            <Text style={styles.title} numberOfLines={3}>
               {task.title}
            </Text>
            <Badge variant={statusConfig[task.status].variant} size="sm">
               {statusConfig[task.status].label}
            </Badge>
         </View>

         {/* description */}
         {task.description && (
            <Text style={styles.description} numberOfLines={4}>
               {task.description}
            </Text>
         )}

         {/* dates */}
         <View style={styles.dates}>
            <Text style={styles.dateText}>
               Créé le {formatDate(task.createdAt)}
            </Text>
            {task.updatedAt !== task.createdAt && (
               <Text style={styles.dateText}>
                  Modifié le {formatDate(task.updatedAt)}
               </Text>
            )}
         </View>

         {/* actions */}
         <View style={styles.actions}>
            <View style={styles.statusActions}>
               {task.status !== 'COMPLETED' && (
                  <TouchableOpacity
                     style={[styles.actionButton, styles.completeButton]}
                     onPress={() => handleStatusChange('COMPLETED')}
                     disabled={updateStatusMutation.isPending}
                  >
                     <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  </TouchableOpacity>
               )}

               {task.status === 'PENDING' && (
                  <TouchableOpacity
                     style={[styles.actionButton, styles.cancelButton]}
                     onPress={() => handleStatusChange('CANCELED')}
                     disabled={updateStatusMutation.isPending}
                  >
                     <Ionicons name="close-circle" size={20} color={Colors.error} />
                  </TouchableOpacity>
               )}

               {task.status !== 'PENDING' && (
                  <TouchableOpacity
                     style={[styles.actionButton, styles.pendingButton]}
                     onPress={() => handleStatusChange('PENDING')}
                     disabled={updateStatusMutation.isPending}
                  >
                     <Ionicons name="reload-circle" size={20} color={Colors.warning} />
                  </TouchableOpacity>
               )}
            </View>

            <View style={styles.editActions}>
               <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => onEdit(task)}
               >
                  <Text style={styles.editButtonText}>Modifier</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDeleteClick}
                  disabled={deleteTaskMutation.isPending}
               >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
               </TouchableOpacity>
            </View>
         </View>

         {/*confirmation Modal */}
         <ConfirmModal
            isVisible={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleConfirmDelete}
            title="Supprimer la tâche"
            message={`Êtes-vous sûr de vouloir supprimer "${task.title}" ?`}
            confirmText="Supprimer"
            cancelText="Annuler"
            confirmVariant="danger"
            isLoading={deleteTaskMutation.isPending}
         />
      </Card>
   );
}

const styles = StyleSheet.create({
   card: {
      backgroundColor: Colors.background,
   },

   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
   },

   title: {
      flex: 1,
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semibold,
      color: Colors.text,
      marginRight: Spacing.sm,
      lineHeight: 24,
   },

   description: {
      fontSize: Typography.fontSize.base,
      color: Colors.textSecondary,
      lineHeight: 22,
      marginBottom: Spacing.md,
   },

   dates: {
      marginBottom: Spacing.lg,
   },

   dateText: {
      fontSize: Typography.fontSize.xs,
      color: Colors.textMuted,
      marginBottom: Spacing.xs / 2,
   },

   actions: {
      gap: Spacing.md,
   },

   statusActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
   },

   editActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
   },

   actionButton: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      minWidth: 40,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
   },

   completeButton: {
      backgroundColor: Colors.successLight,
   },

   completeButtonText: {
      color: Colors.success,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
   },

   cancelButton: {
      backgroundColor: Colors.errorLight,
   },

   cancelButtonText: {
      color: Colors.error,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
   },

   pendingButton: {
      backgroundColor: Colors.warningLight,
   },

   pendingButtonText: {
      color: Colors.warning,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
   },

   editButton: {
      backgroundColor: Colors.infoLight,
      flex: 1,
   },

   editButtonText: {
      color: Colors.info,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
   },

   deleteButton: {
      backgroundColor: Colors.errorLight,
      flex: 1,
   },

   deleteButtonText: {
      color: Colors.error,
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
   },
});