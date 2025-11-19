'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import Container from '@/components/layout/container';
import ButtonMain from '@/components/ui/buttons/button-main';
import InputBase from '@/components/ui/input/input-base';
import InputPassword from '@/components/ui/input/input-password';

export default function SignUpPage() {
  const handleSignUp = () => {
    // Handle sign-up logic here
  };

  return (
    <Container className="pt-12 pb-16 md:py-20">
      <h1 className="text-[22px] text-center">Sign Up</h1>
      <form className="mt-6 flex flex-col gap-4 max-w-[384px] mx-auto">
        <InputBase label="Email" />
        <InputPassword label="Password" />
        <Link
          href="/sign-in"
          className="flex gap-1 justify-end items-center text-sm text-blue text-right hover:opacity-80"
        >
          <span>Already have an account?</span>
          <ArrowRight size={16} />
        </Link>
        <ButtonMain onClick={handleSignUp} className="mx-auto max-w-[384px]">
          Sign Up
        </ButtonMain>
      </form>
    </Container>
  );
}
