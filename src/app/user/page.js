'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Container from '@/components/layout/container';
import Section from '@/components/layout/section';
import Button from '@/components/ui/buttons/button';
import { useAuth } from '@/context/auth-context';

export default function UserPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    router.push('/');
  }

  return (
    <Section>
      <Container className="py-12 md:py-5 lg:py-8">
        <h1 className="text-center text-3xl font-bold">User Profile</h1>
        <div className=" mt-12 md:flex md:justify-between md:items-center">
          <div className="flex gap-6 items-center">
            <div>
              <Image
                src={'/svg/avatar-placeholder.svg'}
                alt={'User Avatar'}
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm">Email:</span>
              <span className="text-lg font-bold"> user@example.com</span>
            </div>
          </div>

          <Link
            href="/user/edit"
            className="flex justify-center items-center mt-6 text-right underline hover:opacity-80 md:mt-0"
          >
            Favorites
          </Link>
        </div>

        <div className="flex justify-between items-center mt-12 md:mt-20">
          <Link
            href="/sign-up"
            className="flex gap-1 justify-center items-center text-blue text-right underline hover:opacity-80"
          >
            <span>Change password</span>
          </Link>
          <Button
            onClick={handleLogout}
            type="button"
            aria-label="Log Out"
            className="flex items-center gap-2 text-orange hover:opacity-80"
          >
            <span>Log Out</span>
            <LogOut />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
