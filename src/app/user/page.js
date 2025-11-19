'use client';

import { LogOut } from 'lucide-react';

import Container from '@/components/layout/container';
import Section from '@/components/layout/section';
import Button from '@/components/ui/buttons/button';
import { useAuth } from '@/context/auth-context';

export default function UserPage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Section>
      <Container className="py-4 md:py-5 lg:py-8">
        <h1 className="text-center text-3xl font-bold">User Profile</h1>
        <Button
          onClick={handleLogout}
          type="button"
          aria-label="Log Out"
          className="flex items-center gap-2"
        >
          <span>Log Out</span>
          <LogOut className="stroke-orange" />
        </Button>
      </Container>
    </Section>
  );
}
