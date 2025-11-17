'use client';

import { createContext, useContext } from 'react';

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

  // ---------------------------------------------------------
  // 1) Поточний користувач
  // ---------------------------------------------------------

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await fetch('/api/me', { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    },
  });

  // ---------------------------------------------------------
  // 2) Логін
  // ---------------------------------------------------------

  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Login failed');
      }
      return (await res.json()).user;
    },

    onSuccess: (userData) => {
      // оновлюємо кеш
      queryClient.setQueryData(['auth', 'me'], userData);
    },
  });

  // ---------------------------------------------------------
  // 3) Реєстрація
  // ---------------------------------------------------------

  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Register failed');
      }
      return (await res.json()).user;
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
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      return null;
    },

    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries(['auth', 'me']);
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
