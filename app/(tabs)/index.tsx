import { TaskCard, TaskModal } from '@/src/components';
import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { Button } from '@/src/components/ui';
import { useTasks } from '@/src/hooks';
import type { Task } from '@/src/types';
import { BorderRadius, Colors, Spacing, Typography } from '@/src/utils/designSystem';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELED';

export default function DashboardScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const { data: tasks = [], isLoading, error, refetch } = useTasks();

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    if (filter === 'ALL') return tasks;
    return tasks.filter(task => task.status === filter);
  }, [tasks, filter]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'PENDING').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const canceled = tasks.filter(t => t.status === 'CANCELED').length;

    return { total, pending, completed, canceled };
  }, [tasks]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const renderFilterButton = (filterType: FilterType, label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.filterButtonTextActive,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Chargement...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Erreur de chargement</Text>
          <Text style={styles.emptyStateText}>
            Impossible de charger vos tâches
          </Text>
          <Button variant="outline" onPress={() => refetch()}>
            Réessayer
          </Button>
        </View>
      );
    }

    const isFiltered = filter !== 'ALL';
    const hasNoTasks = tasks.length === 0;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>
          {isFiltered && !hasNoTasks
            ? 'Aucune tâche trouvée'
            : 'Aucune tâche pour le moment'
          }
        </Text>
        <Text style={styles.emptyStateText}>
          {isFiltered && !hasNoTasks
            ? `Aucune tâche ${filter.toLowerCase()} trouvée.`
            : 'Créez votre première tâche pour commencer !'
          }
        </Text>
        {hasNoTasks && (
          <Button variant="primary" onPress={handleCreateTask}>
            Créer ma première tâche
          </Button>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Mes Tâches</ThemedText>

        {/* Statistics */}
        {stats.total > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {stats.total} tâche{stats.total > 1 ? 's' : ''} •
              {stats.pending} en attente •
              {stats.completed} terminée{stats.completed > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </ThemedView>

      {/* Filters */}
      {stats.total > 0 && (
        <View style={styles.filtersContainer}>
          {renderFilterButton('ALL', 'Toutes', stats.total)}
          {renderFilterButton('PENDING', 'En attente', stats.pending)}
          {renderFilterButton('COMPLETED', 'Terminées', stats.completed)}
          {renderFilterButton('CANCELED', 'Annulées', stats.canceled)}
        </View>
      )}

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onEdit={handleEditTask}
          />
        )}
        contentContainerStyle={[
          styles.listContainer,
          filteredTasks.length === 0 && styles.listContainerEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateTask}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Task Modal */}
      <TaskModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },

  statsContainer: {
    marginTop: Spacing.sm,
  },

  statsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },

  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },

  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },

  filterButtonTextActive: {
    color: Colors.background,
  },

  listContainer: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: 100, // Space for FAB
  },

  listContainerEmpty: {
    flex: 1,
    justifyContent: 'center',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },

  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },

  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal,
  },

  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  fabIcon: {
    fontSize: 24,
    color: Colors.background,
    fontWeight: Typography.fontWeight.bold,
  },
});

