'use client';

import { useRouter } from 'next/navigation';

import Container from '@/components/layout/container';
import Section from '@/components/layout/section';
import ButtonMain from '@/components/ui/buttons/button-main';
import Icon from '@/components/ui/icon';

export default function NotFoundPage() {
  const router = useRouter();
  const goHome = () => {
    router.replace('/');
  };
  return (
    <Section>
      <Container className="py-4 md:py-10 lg:py-25">
        <div className="flex flex-col items-center gap-4 justify-center">
          <div className="relative flex items-center justify-center">
            <Icon
              className="w-[250] h-[200] md:w-[375] md:h-[290]"
              width="250"
              height="200"
              ariaLabel="not-found"
              name="not-found"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
              <h1 className="font-medium text-[36px] leading-11 text-center md:text-[45px] md:leading-13">
                404
              </h1>
            </div>
          </div>
          <h2 className="font-regular text-[22px] leading-7 text-center">
            We didn't find the right place
          </h2>
          <h3 className="font-light text-[14px] leading-5 text-center ">
            Return to the home page or try searching for events
          </h3>

          <ButtonMain
            className="w-[335px] md:w-[354px] lg:w-[384px]"
            onClick={goHome}
          >
            Return to home page
          </ButtonMain>
        </div>
      </Container>
    </Section>
  );
}
