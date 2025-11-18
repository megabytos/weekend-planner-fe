'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [testUser, setTestUser] = useState(null);
  const router = useRouter();

  // ---------------------------------------------------------
  // 1) Поточний користувач
  // ---------------------------------------------------------

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/me', { withCredentials: true });
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
    mutationFn: async (payload) => {
      try {
        const response = await axios.post('/api/login', payload, {
          withCredentials: true,
        });
        return response.data.user;
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        throw new Error(message);
      }
    },

    onSuccess: (userData) => {
      // оновлюємо кеш
      queryClient.setQueryData(['auth', 'me'], userData);
    },
    onError: () => {
      setTestUser(true);
      router.push('/user');
    },
  });

  // ---------------------------------------------------------
  // 3) Реєстрація
  // ---------------------------------------------------------

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await axios.post('/api/register', payload, {
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
      await axios.post('/api/logout', {}, { withCredentials: true });
      return null;
    },

    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: () => {
      setTestUser(null);
      router.push('/');
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: testUser,
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
