'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import Container from '@/components/layout/container';
import ButtonMain from '@/components/ui/buttons/button-main';
import InputBase from '@/components/ui/input/input-base';
import InputPassword from '@/components/ui/input/input-password';
import { useAuth } from '@/context/auth-context';

export default function SignUpPage() {
  const { register } = useAuth();

  const handleSignUp = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    register.mutateAsync({ email, password });
  };

  return (
    <Container className="pt-12 pb-16 md:py-20">
      <h1 className="text-[22px] text-center">Sign Up</h1>
      <form
        onSubmit={handleSignUp}
        className="mt-6 flex flex-col gap-4 max-w-[384px] mx-auto"
      >
        <InputBase label="Email" name="email" />
        <InputPassword label="Password" name="password" />
        <Link
          href="/sign-in"
          className="flex gap-1 justify-end items-center text-sm text-blue text-right hover:opacity-80"
        >
          <span>Already have an account?</span>
          <ArrowRight size={16} />
        </Link>
        <ButtonMain
          isLoading={register.isPending}
          className="mx-auto max-w-[384px]"
        >
          Sign Up
        </ButtonMain>
      </form>
    </Container>
  );
}
