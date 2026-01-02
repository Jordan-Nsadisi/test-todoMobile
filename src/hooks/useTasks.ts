import { queryKeys } from '@/src/services/queryClient';
import { taskService } from '@/src/services/tasks';
import { useAuthStore } from '@/src/store';
import type { TaskFormData, TaskStatus } from '@/src/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const useTasks = () => {
   const { user } = useAuthStore();

   return useQuery({
      queryKey: queryKeys.tasks.detail(user?.id || 0),
      queryFn: () => taskService.getTasks(user?.id || 0),
      enabled: !!user?.id, //ne lance la requête que si on a un user ID
      staleTime: 5 * 60 * 1000,
   });
};

export const useCreateTask = () => {
   const queryClient = useQueryClient();
   const { user } = useAuthStore();

   return useMutation({
      mutationFn: taskService.createTask,
      onSuccess: (newTask) => {
         //invalide la query de l'utilisateur pour refetch
         queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(user?.id || 0) });

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
   const { user } = useAuthStore();

   return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<TaskFormData> }) =>
         taskService.updateTask(id, data),
      onSuccess: (updatedTask) => {
         //met à jour les taches en cache
         const userTasksKey = queryKeys.tasks.detail(user?.id || 0);
         queryClient.setQueryData(userTasksKey, (oldTasks: any[] = []) =>
            oldTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
         );

         //si besoin, invalider pour forcer un refetch
         queryClient.invalidateQueries({ queryKey: userTasksKey });

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
   const { user } = useAuthStore();

   // 
   const userTasksKey = queryKeys.tasks.detail(user?.id || 0);

   return useMutation({
      mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
         taskService.updateTaskStatus(id, status),
      onMutate: async ({ id, status }) => {
         //annule les refetch en cours
         await queryClient.cancelQueries({ queryKey: userTasksKey });

         //values précédentes
         const previousTasks = queryClient.getQueryData(userTasksKey);

         //mise à jour optimiste
         queryClient.setQueryData(userTasksKey, (oldTasks: any[] = []) =>
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
            queryClient.setQueryData(userTasksKey, context.previousTasks);
         }

         Toast.show({
            type: 'error',
            text1: 'Erreur de statut',
            text2: error.message || 'Impossible de modifier le statut',
         });
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: userTasksKey });
      },
   });
};


export const useDeleteTask = () => {
   const queryClient = useQueryClient();
   const { user } = useAuthStore();

   const userTasksKey = queryKeys.tasks.detail(user?.id || 0);

   return useMutation({
      mutationFn: (taskId: number) => {
         console.log('tentative de suppression de la tâche ID:', taskId);
         return taskService.deleteTask(taskId);
      },
      onMutate: async (taskId) => {
         console.log('suppression optimiste de la tâche:', taskId);
         await queryClient.cancelQueries({ queryKey: userTasksKey });

         //values précédentes
         const previousTasks = queryClient.getQueryData(userTasksKey);

         //mise à jour optimiste
         queryClient.setQueryData(userTasksKey, (oldTasks: any[] = []) =>
            oldTasks.filter(task => task.id !== taskId)
         );

         return { previousTasks };
      },
      onSuccess: (_, deletedTaskId) => {
         console.log('tâche supprimée avec succès:', deletedTaskId);
         Toast.show({
            type: 'success',
            text1: 'Tâche supprimée',
            text2: 'La tâche a été supprimée avec succès',
         });
      },
      onError: (error: any, variables, context) => {
         console.error('erreur de suppression:', error);
         //rollback
         if (context?.previousTasks) {
            queryClient.setQueryData(userTasksKey, context.previousTasks);
         }

         Toast.show({
            type: 'error',
            text1: 'Erreur de suppression',
            text2: error.message || 'Impossible de supprimer la tâche',
         });
      },
      onSettled: () => {
         console.log('Invalidation du cache');
         queryClient.invalidateQueries({ queryKey: userTasksKey });
      },
   });
};


export const useTasksUser = (userId: number) => {
   return useQuery({
      queryKey: queryKeys.tasks.detail(userId),
      queryFn: () => taskService.getTasks(userId),
      enabled: !!userId, //évite l'appel si userId est undefined
      staleTime: 5 * 60 * 1000,
   });
};