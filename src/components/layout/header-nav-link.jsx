import Link from 'next/link';
import { usePathname } from 'next/navigation';

import cn from '@/utils/class-names';

export default function HeaderNavLink({ href, text }) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      href={href}
      className={cn(
        'block p-2 text-sm lg:text-lg text-blue-light font-bold hover:text-orange-light',
        {
          'text-orange-light underline': isActive,
        },
      )}
    >
      {text}
    </Link>
  );
}
