'use client';

import { LogOut } from 'lucide-react';

import Button from '@/components/ui/buttons/button';
import { useAuth } from '@/context/auth-context';

export default function UserPage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>User Page</h1>
      <Button
        onClick={handleLogout}
        type="button"
        aria-label="Log Out"
        className="flex items-center gap-2"
      >
        <span>Log Out</span>
        <LogOut className="stroke-orange" />
      </Button>
    </div>
  );
}
