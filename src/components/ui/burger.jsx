'use client';

import Link from 'next/link';

import { nanoid } from '@reduxjs/toolkit';

export default function Burger({
  items = [
    'Registration',
    'Add an event',
    'Ideas generation',
    'Favorites',
    'About us',
  ],
}) {
  return (
    <div>
      <ul>
        <li className="flex items-center gap-2 px-6 py-2.5 text-blue">City</li>
        <li className="flex items-center gap-2 px-6 py-2.5 text-blue">
          Categories
        </li>
        {items.map((item) => (
          <li
            className="flex items-center gap-2 px-6 py-2.5 text-blue"
            key={nanoid()}
          >
            <Link href="#">{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
