import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { taskService } from '@/src/services/tasks';
import { queryKeys } from '@/src/services/queryClient';
import type { TaskFormData, TaskStatus } from '@/src/types';

/**
 * Hook for fetching all tasks
 */
export const useTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasks.all,
    queryFn: taskService.getTasks,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for creating a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      
      Toast.show({
        type: 'success',
        text1: 'Tâche créée',
        text2: `"${newTask.title}" a été ajoutée`,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Erreur de création',
        text2: error.message || 'Impossible de créer la tâche',
      });
    },
  });
};

/**
 * Hook for updating a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TaskFormData> }) =>
      taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      // Update the task in cache
      queryClient.setQueryData(queryKeys.tasks.all, (oldTasks: any[] = []) => 
        oldTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      
      Toast.show({
        type: 'success',
        text1: 'Tâche modifiée',
        text2: `"${updatedTask.title}" a été mise à jour`,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Erreur de modification',
        text2: error.message || 'Impossible de modifier la tâche',
      });
    },
  });
};

/**
 * Hook for updating task status only
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      taskService.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      
      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(queryKeys.tasks.all);
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.tasks.all, (oldTasks: any[] = []) =>
        oldTasks.map(task => task.id === id ? { ...task, status } : task)
      );
      
      return { previousTasks };
    },
    onSuccess: (updatedTask) => {
      const statusLabels = {
        PENDING: 'En attente',
        COMPLETED: 'Terminée',
        CANCELED: 'Annulée'
      };
      
      Toast.show({
        type: 'success',
        text1: 'Statut mis à jour',
        text2: `"${updatedTask.title}" → ${statusLabels[updatedTask.status]}`,
      });
    },
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousTasks);
      }
      
      Toast.show({
        type: 'error',
        text1: 'Erreur de statut',
        text2: error.message || 'Impossible de modifier le statut',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};

/**
 * Hook for deleting a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.deleteTask,
    onMutate: async (taskId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      
      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(queryKeys.tasks.all);
      
      // Optimistically remove task
      queryClient.setQueryData(queryKeys.tasks.all, (oldTasks: any[] = []) =>
        oldTasks.filter(task => task.id !== taskId)
      );
      
      return { previousTasks };
    },
    onSuccess: (_, deletedTaskId) => {
      Toast.show({
        type: 'success',
        text1: 'Tâche supprimée',
        text2: 'La tâche a été supprimée avec succès',
      });
    },
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousTasks);
      }
      
      Toast.show({
        type: 'error',
        text1: 'Erreur de suppression',
        text2: error.message || 'Impossible de supprimer la tâche',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};

/**
 * Hook for fetching a single task by ID (if needed)
 */
export const useTask = (id: number) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};