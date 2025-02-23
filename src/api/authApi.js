import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://task-manager-backend-nest-js-1.onrender.com/user/' }), 
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'signin', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'signup', 
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
