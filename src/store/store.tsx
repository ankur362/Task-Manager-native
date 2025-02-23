import { configureStore } from '@reduxjs/toolkit';
import { tasksApi } from '../api/tasksApi';
import { authApi } from '../api/authApi';
import tasksReducer from './tasksSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware, authApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;

export default store;
