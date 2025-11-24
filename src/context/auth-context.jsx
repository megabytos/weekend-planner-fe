'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';

import apiClient from '@/libs/api/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: async (payload) => {},
  register: async (payload) => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ---------------------------------------------------------
  // 1) Поточний користувач
  // ---------------------------------------------------------

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/auth/refresh');
        return response.data.user || null;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });

  // ---------------------------------------------------------
  // 2) Логін
  // ---------------------------------------------------------

  const loginMutation = useMutation({
    mutationKey: ['auth', 'me'],
    mutationFn: async (payload) => {
      try {
        const response = await apiClient.post('/auth/login', payload);
        return response.data.user;
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        throw new Error(message);
      }
    },

    onSuccess: (userData) => {
      queryClient.setQueryData(['auth', 'me'], userData);
      router.push('/user');
    },
    onError: () => {
      // Add toast notification about error
    },
  });

  // ---------------------------------------------------------
  // 3) Реєстрація
  // ---------------------------------------------------------

  const registerMutation = useMutation({
    mutationKey: ['auth', 'me'],
    mutationFn: async (payload) => {
      try {
        const response = await apiClient.post('/auth/register', payload, {
          withCredentials: true,
        });
        return response.data.user;
      } catch (error) {
        const message = error.response?.data?.message || 'Register failed';
        throw new Error(message);
      }
    },

    onSuccess: (userData) => {
      queryClient.setQueryData(['auth', 'me'], userData);
    },
  });

  // ---------------------------------------------------------
  // 4) Логаут
  // ---------------------------------------------------------

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
      return null;
    },

    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: () => {
      // Add toast notification about error
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
