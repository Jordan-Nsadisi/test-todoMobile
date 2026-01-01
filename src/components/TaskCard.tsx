import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Card, Badge } from '@/src/components/ui';
import { Colors, Spacing, Typography, BorderRadius } from '@/src/utils/designSystem';
import { useUpdateTaskStatus, useDeleteTask } from '@/src/hooks';
import type { Task, TaskStatus } from '@/src/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onPress?: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onPress }: TaskCardProps) {
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

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la tâche',
      `Êtes-vous sûr de vouloir supprimer "${task.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteTaskMutation.mutate(task.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card
      pressable={!!onPress}
      onPress={onPress ? () => onPress(task) : undefined}
      style={styles.card}
      padding="lg"
      margin="sm"
    >
      {/* Header with title and status */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        <Badge variant={statusConfig[task.status].variant} size="sm">
          {statusConfig[task.status].label}
        </Badge>
      </View>

      {/* Description */}
      {task.description && (
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(task.description)}
        </Text>
      )}

      {/* Dates */}
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

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.statusActions}>
          {task.status !== 'COMPLETED' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusChange('COMPLETED')}
              disabled={updateStatusMutation.isPending}
            >
              <Text style={styles.completeButtonText}>✓ Terminer</Text>
            </TouchableOpacity>
          )}
          
          {task.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleStatusChange('CANCELED')}
              disabled={updateStatusMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>✕ Annuler</Text>
            </TouchableOpacity>
          )}
          
          {task.status !== 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.pendingButton]}
              onPress={() => handleStatusChange('PENDING')}
              disabled={updateStatusMutation.isPending}
            >
              <Text style={styles.pendingButtonText}>↻ En attente</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.editActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(task)}
          >
            <Text style={styles.editButtonText}>✎ Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={deleteTaskMutation.isPending}
          >
            <Text style={styles.deleteButtonText}>🗑 Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    lineHeight: Typography.lineHeight.tight,
  },

  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal,
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 80,
    alignItems: 'center',
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