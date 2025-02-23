import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://task-manager-backend-nest-js-1.onrender.com/' }), // Keeping the original base URL
  endpoints: (builder) => ({
    getAllTasks: builder.query({
      query: () => 'tasks',
    }),
    getTasksByCategory: builder.query({
      query: (categoryId) => `tasks?category=${categoryId}`,
    }),
    getCompletedTasks: builder.query({
      query: () => 'tasks/completed-tasks', 
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: 'tasks/create',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: task,
      }),
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `tasks/${id}`,
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: task,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { 
  useGetAllTasksQuery, 
  useGetTasksByCategoryQuery, 
  useGetCompletedTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation 
} = tasksApi;
