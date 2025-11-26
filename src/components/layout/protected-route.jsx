'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';

export function ProtectedRoute({ isPrivate = false, children }) {
  const router = useRouter();
  const { user } = useAuth();

  if (isPrivate && !user) {
    router.replace('/sign-in');
    return null;
  }

  if (!isPrivate && user) {
    router.replace('/user');
    return null;
  }

  return <>{children}</>;
}
