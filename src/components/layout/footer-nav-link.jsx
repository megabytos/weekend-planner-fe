import Link from 'next/link';

import cn from '@/utils/class-names';

export default function FooterNavLink({ href, text }) {
  return (
    <Link
      href={href}
      className={cn(
        'block py-2 text-sm lg:text-base text-blue-light hover:text-orange-light',
      )}
    >
      {text}
    </Link>
  );
}
