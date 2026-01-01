
export const API_ENDPOINTS = {
   auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      getUser: '/auth/user',
   },
   tasks: {
      create: '/tasks',
      getByUser: '/tasks/user/',
      update: '/tasks/',
      delete: '/tasks/',
   },
} as const;