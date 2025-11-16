'use client';

import ButtonMain from '@/components/ui/button-main';
import InputBase from '@/components/ui/input/input-base';
import InputPassword from '@/components/ui/input/input-password';

export default function SignInPage() {
  const handleSignIn = () => {
    // Handle sign-in logic here
  };

  return (
    <>
      <h1 className="text-[22px] text-center">Sign In</h1>
      <form className="mt-6 flex flex-col gap-4 max-w-[384px] mx-auto">
        <InputBase label="Email" />
        <InputPassword label="Password" />
        <ButtonMain onClick={handleSignIn} className="mx-auto max-w-[384px]">
          Sign In
        </ButtonMain>
      </form>
    </>
  );
}
