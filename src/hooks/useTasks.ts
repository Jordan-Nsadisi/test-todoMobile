import { queryKeys } from '@/src/services/queryClient';
import { taskService } from '@/src/services/tasks';
import type { TaskFormData, TaskStatus } from '@/src/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';


export const useCreateTask = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: taskService.createTask,
      onSuccess: (newTask) => {
         //invalide la query pour refetch
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

export const useUpdateTaskStatus = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
         taskService.updateTaskStatus(id, status),
      onMutate: async ({ id, status }) => {
         //annule les refetch en cours
         await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

         //les values précédentes
         const previousTasks = queryClient.getQueryData(queryKeys.tasks.all);

         //mise à jour optimiste
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
         //rollback
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


export const useDeleteTask = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: taskService.deleteTask,
      onMutate: async (taskId) => {

         await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

         //les values précédentes
         const previousTasks = queryClient.getQueryData(queryKeys.tasks.all);

         //mise à jour optimiste
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
         //rollback
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


export const useTasksUser = (userId: number) => {
   return useQuery({
      queryKey: queryKeys.tasks.detail(userId),
      queryFn: () => taskService.getTasks(userId),
      enabled: !!userId, //pour éviter l'appel si userId est undefined
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
};