'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.replace('/sign-in');
    return null;
  }

  return <>{children}</>;
}
