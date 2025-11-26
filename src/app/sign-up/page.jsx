'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Container from '@/components/layout/container';
import { ProtectedRoute } from '@/components/layout/protected-route';
import ButtonMain from '@/components/ui/buttons/button-main';
import InputBase from '@/components/ui/input/input-base';
import InputPassword from '@/components/ui/input/input-password';
import { useAuth } from '@/context/auth-context';
import { validateEmail, validatePassword } from '@/utils/inputs-validation';

export default function SignUpPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailValidation = (value) => {
    const { isValid, error } = validateEmail(value);
    setEmailError(error);
    return isValid;
  };

  const handlePasswordValidation = (value) => {
    const { isValid, error } = validatePassword(value);
    setPasswordError(error);
    return isValid;
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    register.mutateAsync({ email, password });
  };

  return (
    <ProtectedRoute>
      <Container className="pt-12 pb-16 md:py-20">
        <h1 className="text-[22px] text-center">Sign Up</h1>
        <form
          onSubmit={handleSignUp}
          className="mt-6 flex flex-col gap-4 max-w-[384px] mx-auto"
        >
          <InputBase
            inputType="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => handleEmailValidation(e.target.value)}
            error={emailError}
          />
          <InputPassword
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => handlePasswordValidation(e.target.value)}
            error={passwordError}
          />
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
            isDisabled={emailError || passwordError || register.isPending}
          >
            Sign Up
          </ButtonMain>
        </form>
      </Container>
    </ProtectedRoute>
  );
}
