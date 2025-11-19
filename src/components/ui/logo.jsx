import Link from 'next/link';

import cn from '@/utils/class-names';

import Icon from './icon';

export default function Logo({ color = 'yellow', className = '' }) {
  return (
    <Link href="/" className={className}>
      <Icon
        className={cn({
          'fill-yellow': color === 'yellow',
          'fill-orange': color === 'orange',
        })}
        name="logo-icon"
        width="200"
        height="40"
        ariaLabel="Logo"
      />
    </Link>
  );
}
