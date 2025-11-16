import ButtonMain from '@/components/ui/button-main';
import InputBase from '@/components/ui/input/input-base';
import InputPassword from '@/components/ui/input/input-password';

export default function SignInPage() {
  return (
    <>
      <h1>Sign In</h1>
      <form>
        <InputBase label="Email" />
        <InputPassword label="Password" />
        <ButtonMain className="mx-auto max-w-[384px]">Sign In</ButtonMain>
      </form>
    </>
  );
}
