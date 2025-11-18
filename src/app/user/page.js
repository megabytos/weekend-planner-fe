'use client';

import { LogOut } from 'lucide-react';

import ButtonIcon from '@/components/ui/button-icon';
import { useAuth } from '@/context/auth-context';

export default function Event() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h1>User Page</h1>
      <ButtonIcon
        clickFunction={handleLogout}
        type="button"
        aria-label="Log Out"
        className="flex items-center gap-2"
      >
        <span>Log Out</span>
        <LogOut className="stroke-orange" />
      </ButtonIcon>
    </div>
  );
}
