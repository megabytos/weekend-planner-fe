import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import apiClient from '@/libs/api/api-client';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { add } from '@/libs/redux/slices/refresh-token-slice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from '../auth-context';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('react-hot-toast');
jest.mock('@/libs/api/api-client');
jest.mock('@/libs/redux/hooks/use-app-dispatch');
jest.mock('@/libs/redux/hooks/use-app-selector');
jest.mock('@/libs/redux/slices/refresh-token-slice', () => ({
  add: jest.fn(),
  selectRefreshToken: jest.fn(),
}));

describe('AuthContext', () => {
  let queryClient;
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();

    useRouter.mockReturnValue({
      push: mockPush,
    });

    useAppDispatch.mockReturnValue(mockDispatch);
    useAppSelector.mockReturnValue({ refreshToken: 'test-refresh-token' });

    // Mock API client
    apiClient.post = jest.fn();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  describe('AuthProvider', () => {
    it('provides auth context to children', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('logout');
    });

    it('fetches user data on mount with refresh token', async () => {
      const mockUserData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      apiClient.post.mockResolvedValueOnce({ data: mockUserData });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUserData);
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'test-refresh-token',
      });
    });

    it('returns null user when refresh token is invalid (401)', async () => {
      const error = new Error('Unauthorized');
      error.response = { status: 401 };
      apiClient.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('useAuth hook', () => {
    it('returns default context value when used outside AuthProvider', () => {
      // useAuth doesn't throw, it returns the default context value
      const { result } = renderHook(() => useAuth());

      expect(result.current).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.login).toEqual({});
      expect(result.current.register).toEqual({});
      expect(result.current.logout).toEqual({});
    });

    it('returns context value when used inside AuthProvider', async () => {
      apiClient.post.mockResolvedValueOnce({ data: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.login).toBeDefined();
        expect(result.current.register).toBeDefined();
        expect(result.current.logout).toBeDefined();
      });
    });
  });

  describe('login mutation', () => {
    it('successfully logs in user', async () => {
      const mockUserData = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        refreshToken: 'new-refresh-token',
      };

      apiClient.post.mockResolvedValueOnce({ data: null }); // Initial refresh call
      apiClient.post.mockResolvedValueOnce({ data: mockUserData }); // Login call

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      const loginPayload = { email: 'test@example.com', password: 'password123' };
      result.current.login.mutate(loginPayload);

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', loginPayload);
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(add('new-refresh-token'));
        expect(mockPush).toHaveBeenCalledWith('/user');
      });
    });

    it('shows error toast on login failure', async () => {
      const error = new Error('Invalid credentials');
      apiClient.post.mockResolvedValueOnce({ data: null }); // Initial refresh call
      apiClient.post.mockRejectedValueOnce(error); // Login call fails

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      result.current.login.mutate({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Login failed: Invalid credentials');
      });
    });

    it('shows generic error message when error has no message', async () => {
      const error = new Error();
      apiClient.post.mockResolvedValueOnce({ data: null });
      apiClient.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      result.current.login.mutate({
        email: 'test@example.com',
        password: 'password',
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Login failed.');
      });
    });
  });

  describe('register mutation', () => {
    it('successfully registers user', async () => {
      const mockUserData = {
        id: '1',
        email: 'newuser@example.com',
        name: 'New User',
        refreshToken: 'new-user-refresh-token',
      };

      apiClient.post.mockResolvedValueOnce({ data: null }); // Initial refresh call
      apiClient.post.mockResolvedValueOnce({ data: mockUserData }); // Register call

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      const registerPayload = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };
      result.current.register.mutate(registerPayload);

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerPayload, {
          withCredentials: true,
        });
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(add('new-user-refresh-token'));
        expect(mockPush).toHaveBeenCalledWith('/user');
      });
    });

    it('shows error toast on registration failure', async () => {
      const error = new Error('Email already exists');
      apiClient.post.mockResolvedValueOnce({ data: null }); // Initial refresh call
      apiClient.post.mockRejectedValueOnce(error); // Register call fails

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      result.current.register.mutate({
        email: 'existing@example.com',
        password: 'password123',
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Registration failed: Email already exists',
        );
      });
    });

    it('shows generic error message when registration error has no message', async () => {
      const error = new Error();
      apiClient.post.mockResolvedValueOnce({ data: null });
      apiClient.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      result.current.register.mutate({
        email: 'test@example.com',
        password: 'password',
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Registration failed.');
      });
    });
  });

  describe('logout mutation', () => {
    it('successfully logs out user', async () => {
      const mockUserData = { id: '1', email: 'test@example.com' };

      apiClient.post.mockResolvedValueOnce({ data: mockUserData }); // Initial refresh call
      apiClient.post.mockResolvedValueOnce({ data: null }); // Logout call

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toEqual(mockUserData));

      result.current.logout.mutate();

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith(
          '/auth/logout',
          { refreshToken: 'test-refresh-token' },
          { withCredentials: true },
        );
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });

    it('shows error toast on logout failure', async () => {
      const error = new Error('Logout failed on server');
      apiClient.post.mockResolvedValueOnce({ data: { id: '1' } }); // Initial refresh
      apiClient.post.mockRejectedValueOnce(error); // Logout fails

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeDefined());

      result.current.logout.mutate();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Logout failed: Logout failed on server');
      });
    });

    it('shows generic error message when logout error has no message', async () => {
      const error = new Error();
      apiClient.post.mockResolvedValueOnce({ data: { id: '1' } });
      apiClient.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeDefined());

      result.current.logout.mutate();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Logout failed.');
      });
    });

    it('invalidates auth query cache on successful logout', async () => {
      apiClient.post.mockResolvedValueOnce({ data: { id: '1' } });
      apiClient.post.mockResolvedValueOnce({ data: null });

      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeDefined());

      result.current.logout.mutate();

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
          queryKey: ['auth', 'me'],
        });
      });
    });
  });

  describe('integration scenarios', () => {
    it('handles complete user flow: login -> logout', async () => {
      const mockUserData = {
        id: '1',
        email: 'test@example.com',
        refreshToken: 'refresh-token',
      };

      // Initial state - no user
      apiClient.post.mockResolvedValueOnce({ data: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      // Login
      apiClient.post.mockResolvedValueOnce({ data: mockUserData });
      result.current.login.mutate({ email: 'test@example.com', password: 'pass' });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/user');
      });

      // Logout
      apiClient.post.mockResolvedValueOnce({ data: null });
      result.current.logout.mutate();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });
    });

    it('handles mutation loading states', async () => {
      apiClient.post.mockResolvedValueOnce({ data: null });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeNull());

      expect(result.current.login.isPending).toBe(false);
      expect(result.current.register.isPending).toBe(false);
      expect(result.current.logout.isPending).toBe(false);

      apiClient.post.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100)),
      );

      result.current.login.mutate({ email: 'test@example.com', password: 'pass' });

      await waitFor(() => {
        expect(result.current.login.isPending).toBe(true);
      });
    });
  });
});
