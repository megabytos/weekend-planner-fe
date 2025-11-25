'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

import apiClient from '@/libs/api/api-client';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import {
  add,
  selectRefreshToken,
} from '@/libs/redux/slices/refresh-token-slice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext({
  user: null,
  login: {},
  register: {},
  logout: {},
});

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { refreshToken } = useAppSelector(selectRefreshToken);
  const dispatch = useAppDispatch();

  const { data: user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await apiClient.post('/auth/refresh', {
          refreshToken,
        });
        return response.data || null;
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['auth', 'me'],
    mutationFn: async (payload) => {
      const response = await apiClient.post('/auth/login', payload);
      return response.data;
    },

    onSuccess: (userData) => {
      dispatch(add(userData.refreshToken));
      queryClient.setQueryData(['auth', 'me'], userData);
      router.push('/user');
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error.message ? `Login failed: ${error.message}` : 'Login failed.',
      );
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['auth', 'me'],
    mutationFn: async (payload) => {
      const response = await apiClient.post('/auth/register', payload, {
        withCredentials: true,
      });
      return response.data;
    },

    onSuccess: (userData) => {
      dispatch(add(userData.refreshToken));
      queryClient.setQueryData(['auth', 'me'], userData);
      router.push('/user');
    },

    onError: (error) => {
      console.error(error);
      toast.error(
        error.message
          ? `Registration failed: ${error.message}`
          : 'Registration failed.',
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(
        '/auth/logout',
        {
          refreshToken,
        },
        { withCredentials: true },
      );
      return null;
    },

    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/');
    },

    onError: (error) => {
      toast.error(
        error.message ? `Logout failed: ${error.message}` : 'Logout failed.',
      );
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginMutation,
        register: registerMutation,
        logout: logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
