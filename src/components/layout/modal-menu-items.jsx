'use client';

import Link from 'next/link';

import { headerNavLinks } from './data';

export default function ModalMenuItems({ onClose }) {
  return (
    <nav>
      <ul className="flex-col w-[157px]">
        {headerNavLinks.map(({ href, text }) => (
          <li
            className="font-medium text-[14px] leading-5 flex items-center gap-2 px-6 py-2.5 text-blue border border-blue-light rounded-[10px] hover:border-blue transition"
            key={href}
          >
            <Link href={href} onClick={onClose}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
